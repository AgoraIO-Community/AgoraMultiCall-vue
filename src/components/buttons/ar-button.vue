<template>
  <div class="button" @click="handleClick"></div>
</template>

<script>
export default {
  name: "ArButton",
  methods:{
    handleClick(e){
      this.$emit('click',e)
    }
  }
};
</script>
<style scoped lang="stylus">
.button {
  position relative
  margin 15px
  border 1px solid #999
  border-radius 50%
  background-color: #fff;
  width 55px
  height 55px
  background-size 70%
  background-position center
  box-sizing border-box
  background-repeat no-repeat
  &:hover{
    cursor pointer
    box-shadow  4px 4px 10px #999
  }
  &:hover{
    transform scale(1.05)
    &:before{
      display: block;
      position: absolute;
      top -80%;
      left -100%
      padding: 6px;
      background-color: rgba(30,30,30,0.8);
      color: white;
      text-align center;
      width 10em
      border-radius 6px
    }
  }
}
</style>
