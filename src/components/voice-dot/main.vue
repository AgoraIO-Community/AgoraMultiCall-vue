<template>
  <div class="voice-dot-wrapper">
    <div class="voice-dot" :class="{ mute: mute }">
      <span :style="computedStyleObj_side"></span>
      <span :style="computedStyleObj_middle"></span>
      <span :style="computedStyleObj_side"></span>
    </div>
  </div>
</template>
<script>
const MAIN_HEIGHT = 5; // px
const MAX_HEIGHT_MIDDLE_MULTIPLE = 3; // multiple
const MAX_HEIGHT_SIDE_MULTIPLE = 2; // multiple

const MAX_HEIGHT_SIDE = (MAIN_HEIGHT + 1) * MAX_HEIGHT_SIDE_MULTIPLE;
const MAX_HEIGHT_MIDDLE = (MAIN_HEIGHT + 1) * MAX_HEIGHT_MIDDLE_MULTIPLE;

const MAX_LEVEL = 1;
const MIN_LEVEL = 0;
const SPACE = MAX_LEVEL - MIN_LEVEL;
const SEPARATE = MIN_LEVEL + SPACE / 3;

export default {
  name: "VoiceTip",
  props: {
    level: {
      type: Number,
      default: 0,
      validator(v) {
        return v >= MIN_LEVEL && v <= MAX_LEVEL;
      }
    },
    mute: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      styleObj_side: {
        height: MAIN_HEIGHT
      },
      styleObj_middle: {
        height: MAIN_HEIGHT
      }
    };
  },
  computed: {
    computedStyleObj_side() {
      return { height: this.styleObj_side.height + "px" };
    },
    computedStyleObj_middle() {
      return { height: this.styleObj_middle.height + "px" };
    }
  },
  watch: {
    level: {
      immediate: true,
      handler(newV) {
        let newH_side = MAIN_HEIGHT;
        let newH_middle = MAIN_HEIGHT;

        if (newV) {
          let parsedV = Math.round(newV * 100) / 100;
          newH_side =
            MAIN_HEIGHT +
            (parsedV < SEPARATE ? 4 : 1.5) *
              MAIN_HEIGHT *
              (parsedV / SPACE) *
              MAX_HEIGHT_SIDE_MULTIPLE;
          newH_middle =
            MAIN_HEIGHT +
            (parsedV < SEPARATE ? 9 : 2) *
              MAIN_HEIGHT *
              (parsedV / SPACE) *
              MAX_HEIGHT_MIDDLE_MULTIPLE;
          if (newH_middle > MAX_HEIGHT_MIDDLE) {
            newH_middle = MAX_HEIGHT_MIDDLE;
          }
          if (newH_side > MAX_HEIGHT_SIDE) {
            newH_side = MAX_HEIGHT_SIDE;
          }
        }
        this.styleObj_side.height = Math.round(newH_side * 10) / 10;
        this.styleObj_middle.height = Math.round(newH_middle * 10) / 10;
      }
    }
  }
};
</script>
<style lang="stylus">
$main_height=4px
$main_width=4*$main_height
$radius=0.5*$main_height

$icon_width=1.5*$main_width

.voice-dot-wrapper{
  display inline-block
  margin 2px
  padding 4px
  z-index 1
}
.voice-dot{
  display flex
  flex-direction row
  justify-content space-between
  align-items center
  background-color: transparent;
  width $main_width
  height $main_height
  &.mute{
    position relative
    span{
      display none
    }
    &:after{
      z-index 1
      position: absolute
      left 50%
      top 50%
      transform translate(-50%,-50%)
      display block
      content ""
      width $icon_width
      height $icon_width
      background center / contain  no-repeat url("../../assets/microphone_mute.svg")
    }
  }
  span{
    margin: 0;
    padding 0;
    border-width 0
    box-sizing border-box
    width $main_height
    height $main_height
    border-radius $radius
    background-color: #099dfd;
    transition height ease-in 0.001s
  }
}
</style>
