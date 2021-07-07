<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "CloseButton",
  components:{
    ArButton
  } ,
  methods:{
    handleClick(e){
      this.$emit("click", e)
    }
  }
};
</script>

<style scoped lang="stylus">
.button{
  background-image: url("../../assets/guaduan.svg");
  &:hover{
    &:before{
      content: "Leave Meeting";
     }
   }
}
</style>
