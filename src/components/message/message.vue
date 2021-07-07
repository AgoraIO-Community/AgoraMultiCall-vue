<template>
  <div
    v-show="visible"
    class="message"
    :class="{
      'message-error': type === 'error',
      'message-success': type === 'success',
      'message-warning': type === 'warning',
      fix: fix
    }"
    :style="positionStyle"
  >
    {{ info }}
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {
      type: "normal",
      info: "",
      fix: true,
      verticalOffset: 20,
      visible: false
    };
  },
  computed: {
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`
      };
    }
  }
};
</script>

<style scoped lang="stylus">
.fix{
  position: fixed;
}
.message{
  position: absolute;
  left 50%
  transform translateX(-50%)
  padding 10px 20px
  background-color: #eeeeee;
  color black
  z-index 100000000
  border-radius 8px
  line-height 30px
  text-align center
}
.message-error{
  background-color lightpink
  color red
}
.message-success{
  background-color lightgreen
  color green
}
.message-warning{
  background-color lightgoldenrodyellow
  color orange
}
</style>
