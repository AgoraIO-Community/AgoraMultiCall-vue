<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "MpButton",
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
  &.mp-normal{
    background-image: url("../../assets/microphone.svg");
  }
  &.mp-mute{
    background-image: url("../../assets/microphone_mute.svg");
  }
  &:hover{
    &:before{
      content: "Switch Microphone";
     }
   }
}
</style>
