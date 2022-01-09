<template>
  <md-switch class="md-primary">{{ title }}</md-switch>
</template>

<script>
export default {
  name: "Toggle",
  props : {
    title  :{
      type : String
    }
  }
}
</script>

<style scoped>

</style>