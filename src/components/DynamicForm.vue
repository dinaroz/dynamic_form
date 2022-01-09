<template>
  <div>
    <md-toolbar :class="toolbarClass" class="md-primary">
      <h3 class="md-title"> Step {{ step }}</h3>
    </md-toolbar>
    <div class="wrapper">
      <md-button class="md-primary select-schema-btn" @click="getSchema" v-if="step === 1">
        <md-progress-spinner v-if="load" :md-diameter="30" md-mode="indeterminate"></md-progress-spinner>
          <p v-if="!load">{{ btnMsg }}</p>
        </md-button>
      <span class="md-error" v-if="error && step === 1">{{ errorMsg }}</span>
      <div class="md-layout-item" v-if="schemaList.length > 0">
      </div>
      <div class="select-wrapper" v-if="schemaList.length > 0">
        <md-field :class="getValidationClass('schemaType')" class="select-type">
          <md-select v-model="schemaType" name="schemaType" id="schemaType" placeholder="select Schema Type">
            <md-option v-for="item in schemaList" :value="item.type" :key="item.type">{{ item.display }}</md-option>
          </md-select>
          <span class="md-error">This field is required</span>
        </md-field>
        <md-button class="md-primary select-schema-type-btn" @click="selectSchema">Submit</md-button>
      </div>
      <span class="md-error" v-if="error && step === 2">{{ errorMsg }}</span>
      <div class="select-wrapper form" v-if="step===3">
          <h3 style="color: cornflowerblue;text-align: center"> {{this.selectedSchema}} FORM </h3>
        <div>
          <dynamic-field class="field-wrapper" :data="formFields" v-model="formFields" ></dynamic-field>
          <md-button class="md-primary select-schema-type-btn" @click="submitForm">Submit form</md-button>
        </div>
    </div>
      <div v-if="step === 4">
        <md-content class="md-primary">Form successfully submitted</md-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { validationMixin } from 'vuelidate';
import SelectBox from "@/components/SelectBox";
import DefaultInput from "@/components/DefaultInput";
import {
  required,
  email,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'
import DynamicField from "@/components/DynamicField";

export default {
  name: "DynamicForm",
  mixins: [validationMixin],
  components: {
    DynamicField,
    SelectBox,DefaultInput
  },
  mounted() {
    this.btnMsg = 'Please click to get all schemas'
  },
  data(){
    return {
      toolbarClass : '',
      step : 1,
      error :false,
      errorMsg : '',
      schemaType : '',
      load:false,
      btnMsg: '',
      formFields : {},
      selectedSchema: ''
    }
  },
  computed:{
    ...mapState("M_DynamicForm", {
      urlList : (state) => state.urlList,
      schemaList : (state) => state.schemaList,
      schema : (state) => state.schema,
      change: (state) => state.change
    }),
  },
  methods:{

    ...mapActions("M_DynamicForm", ["getSchemasList" ,"stateChange" ,"statePostForm"]),
    getValidationClass (fieldName) {
      const field = this.$v[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    throwError: function () {
      this.error = true;
      this.errorMsg = 'Some thing went wrong please try again'
    },
    async selectSchema() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        let res = await this.$store.dispatch("M_DynamicForm/getSchema", {
          url: this.urlList.getSchemaByType+this.schemaType,
        })
        if(!res.status){
          this.throwError();
          return false
        }
        this.step = 3;
        this.toolbarClass = 'step3';
        this.selectedSchema = this.schemaType
        this.formFields = this.parseSchema(this.schema)
      }
    },
    validationBeforeSubmit(objSchema , breakFunc = false){
      for (const key in objSchema) {
        if (objSchema[key]['str']) {
          if(objSchema[key]['err'] && breakFunc){
            return false
          }
          if(objSchema[key]['val'] === '' && objSchema[key]['required'] === true){
            objSchema[key]['err']=true;
            objSchema[key]['msgErr']='This field is require';
          }
        } else {
          this.validationBeforeSubmit(objSchema[key])
        }
      }
      return objSchema
    },
    submitForm(){
      this.formFields = this.validationBeforeSubmit(this.formFields);
      this.stateChange(!this.change)
      let valid = true;
      valid = this.validationBeforeSubmit(this.formFields ,true);
      // if(valid){
        const cloneVal = Object.assign({}, this.formFields);
        this.step = 4
        let val = this.getVal(cloneVal)
        this.statePostForm(val)
       // }
    },

    getVal(objSchema){
      for (const key in objSchema) {
        if (objSchema[key]['str']) {
          objSchema[key] = objSchema[key].val
        } else {
          this.getVal(objSchema[key])
        }
      }
      return objSchema
    },
    parseSchema(objSchema){
      for (const key in objSchema) {
        if (typeof objSchema[key] === 'string') {
          let fieldObj = JSON.parse(objSchema[key])
              objSchema[key] = this.generateField(fieldObj, key)
        } else {
          this.parseSchema(objSchema[key])
        }
      }
      return objSchema
    },

    getOptions(opt){
      let optionArr = [];
      opt.map(item => {
        let option = {
          type : item,
          display  :item
        }
        optionArr.push(option)
      })
      return optionArr
    },

    generateField(fieldObj , fieldKey){
      return  {
        title : fieldKey,
        is : this.getHtmlTag(fieldObj.type),
        type : fieldObj.type,
        options : fieldObj.type === 'Enum' ? this.getOptions(fieldObj.enumValues): [],
        required : fieldObj.require,
        str : true,
        val:''
      }
    },
    getHtmlTag(type){
      switch (type.toLowerCase()){
        case 'enum':
          return 'select-box'
        case 'string' :
        case 'number':
        case 'date':
          return 'default-input'
         case 'boolean':
           return 'toggle'
      }
    },
    async getSchema() {
      this.resetError()
      this.load = true;
      let res = await this.$store.dispatch("M_DynamicForm/getSchemasList", {
        url: this.urlList.getSchemasList,
      })
      if(!res.status){
        this.throwError();
        return false
      }
      this.step = 2;
      this.toolbarClass = 'step2'
      this.load = false;
    },
    resetError(){
      this.error = false;
      this.errorMsg = ''
    }
  },
  validations: {
    schemaType: {
        required
      },
  },
}
</script>

<style scoped>
.md-toolbar + .md-toolbar {
  margin-top: 16px;
}
.select-schema-btn{
  width: 500px;
  height: 50px;
  background: black;
}
.select-schema-type-btn{
  width: 200px;
  height: 46px;
  background: black;
}
.wrapper{
  width: 100%;
  height: 60px;
  position: absolute;
  top:150px;
  left: 0;
  right: 0;
  margin: auto;
}
.select-wrapper{
  display: flex;
  width: 76%;
  margin: auto;
  flex-wrap: wrap;
}
.field-wrapper{
  padding-left: 25px;
  padding-right: 25px;

}
.form{
  display: block;
  padding: 15px;
  border: 1px solid gray;
  border-radius: 4px;
  margin-top: 15px;
  text-align: left;
}
.select-type{
  width: 77%;
}

.md-error{
  color: red;
}
.step2{
  background: #2c3e50 !important;
}
.step3{
  background: #42b983 !important;
}
.label{
  display: block;
  text-align: left;

}

@media screen and (max-width: 600px) {
    .select-wrapper {
      width: 100%;
  }

  .select-type{
    width: 100%;
  }
}

</style>