<template>
<div>
  <div v-for="(item,index) in data" :key="item.title +index">
    <div v-if="item.str">
      <label class="header">{{item.title}}</label>
      <component v-bind="item" :item="item"></component>
    </div>
    <div v-if="!item.str" >
      <div class="header sub-header">{{index}}</div>
      <dynamic-field :data="item"  style="margin-left: 55px" :parent="index"></dynamic-field>
    </div>
  </div>
</div>
</template>

<script>
import SelectBox from "@/components/SelectBox";
import DefaultInput from "@/components/DefaultInput";
export default {
  name: "DynamicField",
  props : {
    data : Object,
    parent : String
  },
  components: {
    SelectBox,DefaultInput
  },
  methods:{

  }
}
</script>

<style scoped>
.header{
  font-weight: bold;
  text-align: left;
}
.sub-header{
  color: mediumseagreen;
  margin-bottom:25px;
}
</style>