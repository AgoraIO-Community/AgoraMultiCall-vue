<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "VideoButton",
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
  &.video-normal{
    background-image: url("../../assets/video.svg");
  }
  &.video-mute{
    background-image: url("../../assets/video_mute.svg");
  }
  &:hover{
    &:before{
      content: "Switch Camera";
     }
   }
}
</style>
