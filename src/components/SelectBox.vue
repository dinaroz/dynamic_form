<template>
  <div class="md-layout-item">
    <md-field>
      <md-select placeholder="Select" v-model="item['val']">
        <md-option v-for="item in options" :value="item.type" :key="item.type" >{{item.display}}</md-option>
      </md-select>
      <span class="md-error" v-if="showErr">hhjh{{item.msgErr}}</span>
    </md-field>
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "SelectBox",
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
  watch:{
    change: function (val) {
      if(this.item.err){
        this.showErr = true
      }
    }
  },
  props: {
    options: {
      type : Array,
      required : true
    },
    item:{
      type: Object
    }
  }
}
</script>

<style scoped>
.md-error{
  color: red;
}
</style>