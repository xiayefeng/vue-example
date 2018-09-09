<template>
  <div class="wrap-input">
    <input class="search-input" ref="input" type="text" v-model.trim="inputV" :placeholder="placeholder" :maxlength="len" @input="updateValue($event.target.value)" @keyup="search" @focus="inputFocus">
    <i v-show="inputV.length" @click.stop="clearInput" class="el-icon-circle-close clear-btn"></i>
    <span class="search-box" @click.stop="search">
      <i class="el-icon-search"></i>
    </span>
  </div>
</template>

<script>
let delay = Promise.resolve()
let timer = null

export default {
  data () {
    return {
      inputV: this.value
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入查询内容'
    },
    len: {
      type: Number,
      default: 12
    }
  },
  methods: {
    inputFocus (e) {
      e.target.select()
    },
    search (e) {
      timer && clearTimeout(timer)
      // console.log(e.which)
      if (e.which === 13 || e.which === 32) {
        this.$emit('search-data', {val: this.inputV})
        return
      }
      timer = setTimeout(() => {
        delay = delay.then(() => {
          this.$emit('search-data', {val: this.inputV})
        })
        timer = null
      }, 300)
    },
    clearInput () {
      this.inputV = ''
      this.$emit('input', '')
      this.$emit('clear-list')
      setTimeout(() => {
        this.$refs.input.focus()
      }, 50)
    },
    updateValue (value) {
      // this.inputV = value
      this.$refs.input.value = value
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>

.wrap-input {
  display: inline-block;
  @extend %left;
  @extend %rel;

  .search-input {
    height: 38px;
    line-height: 38px;
    width: 100%;
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    box-sizing: border-box;
    @include radius(4px);
  }
  .clear-btn {
    @extend %abs;
    right: 35px;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ccc;
    cursor: pointer;
  }
  .search-box {
    display: inline-block;
    width: 38px;
    height: 38px;
    cursor: pointer;
    font-size: 18px;
    line-height: 38px;
    text-align: center;
    border-left: 1px solid #dcdfe6;
    @extend %abs;
    right: -20px;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ccc;

    &:hover {
      color: $yx-color2;
    }
  }
}
</style>
