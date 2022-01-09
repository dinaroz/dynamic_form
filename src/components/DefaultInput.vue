<template>
  <div>
    <span class="md-error" v-if="showErr">{{item.msgErr}}</span>
    <md-field>
      <md-input :type="type" @input="validate" v-model="item['val']" :class="[{'md-invalid' : item.err}]"/>
    </md-field>
  </div>

</template>

<script>
import {mapState} from "vuex";

export default {
  name: "DefaultInput",
    data(){
        return {
          showErr: false
        }
    },
  computed:{
    ...mapState("M_DynamicForm", {
      change: (state) => state.change,
    })
  },
  props:{
    type:{
      type: String,
      default: 'text'
    },
    parent: {
      type  :String
    },
    item:{
      type: Object
    }
  },
  watch:{
    change: function (val) {
      if(this.item.err){
        this.showErr = true
      }
    }
  },
  methods:{
    validate(val){
      this.showErr = false
      if( (this.item.type).toLowerCase() !== typeof val && this.item.type.toLowerCase() !== 'date') {
        this.item.err = true;
        this.item.msgErr = "type is not ok";
        this.showErr = true;
      }
    },
  },

}
</script>

<style scoped>
.md-error{
  color: red;
}
</style>