<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "VideoButtonWhite",
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
  border: 1px solid #fff;
  background-size: 50%;

  &.video-normal{
    background-image: url("../../assets/video_white.svg");
    &:hover{
      background-color: #ccc;
    }
  }
  &.video-mute{
    background-image: url("../../assets/video_mute_white.svg");
    border none;
    background-color: red
    &:hover{
      background-color: #bf0000
    }
  }
  &:hover{
    box-shadow none;
    &:before{
      content: "Switch Camera";
     }
   }
}
</style>
