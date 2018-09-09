<template>
  <div class="yx-head">
    <div class="head-right">
      <slot name="right"></slot>
    </div>
    <h3 class="head-top">{{topTitle}}</h3>
    <div class="head-center">
      <slot name="center"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    topTitle: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.yx-head {
  @include clearfix;
  border-bottom: 1px solid #ccc;
  width: 100%;
  .head-top {
    height: 60px;
    width: 100%;
    line-height: 60px;
    padding-left: 10px;
    margin: 0;
    width: 180px;
    font-weight: normal;
    text-align: left;
    @extend %left;
  }
  .head-right {
    @extend %right;
    height: 60px;
    line-height: 60px;
    padding-right: 10px;
    width: 250px;
    text-align: right;
  }
  .head-center {
    height: 60px;
    line-height: 60px;
    margin-left: 190px;
    margin-right: 260px;
    text-align: center;
  }
}
</style>
