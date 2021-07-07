<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "OnCallButton",
  components:{
    ArButton
  },
  methods:{
    handleClick(e){
      this.$emit("click", e)
    }
  }
};
</script>

<style scoped lang="stylus">
.button{
  background-image: url("../../assets/jieting.svg");
  &:hover{
    &:before{
      content: "Join Meeting";
     }
   }
}
</style>
