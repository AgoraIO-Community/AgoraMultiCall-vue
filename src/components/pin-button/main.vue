<template>
  <div
    class="agora-pin-button"
    :class="{ pined: pined, 'pin-button-could-hover': couldHover }"
    @click="handleClick"
  ></div>
</template>

<script>
export default {
  name: "PinButton",
  props: {
    pined: {
      type: Boolean,
      default: false
    },
    couldHover: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick(e) {
      this.$emit("click", e);
    }
  }
};
</script>

<style scoped lang="stylus">
.agora-pin-button{
  width: 30px
  height: 30px
  cursor: pointer;
  background-image: url("../../assets/pin_img.svg");
  background-repeat no-repeat
  background-size 70%;
  background-position center
  border-radius 50%
  &.pined{
    background-image: url("../../assets/pinoff.svg");
  }
}
.pin-button-could-hover{
  &.pined{
    &:hover{
      &:after{
        content: "Cancel Pin";
        width: 8em
      }
    }
  }
  &:hover{
    background-color: lightgray;
    &:after{
      position: absolute;
      top: -30px
      left: 50%
      transform translateX(-50%)
      display: block
      content: "Pin";
      background-color: rgba(30,30,30,0.8);
      color: white
      padding: 2px;
      border-radius 5px
      width 3em
      text-align center
      font-size 50%
    }
  }
}
</style>
