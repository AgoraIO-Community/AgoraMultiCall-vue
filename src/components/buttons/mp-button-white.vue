<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "MpButtonWhite",
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
  background-color: transparent;
  border 1px solid #fff;
  background-size: 50%;
  &.mp-normal{
    background-image: url("../../assets/microphone_white.svg");
    &:hover{
      background-color: #ccc;
    }
  }
  &.mp-mute{
    background-image: url("../../assets/microphone_mute_white.svg");
    border none
    background-color: red;
    &:hover{
      background-color: #bf0000;
    }
  }
  &:hover{
    box-shadow none
    &:before{
      content: "Switch Microphone";
     }
   }
}
</style>
