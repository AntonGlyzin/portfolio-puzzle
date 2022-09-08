<template>
  <div class=" p-ripple p-1 d-inline">
    <i
      v-ripple
      class="like-comment"
      :class="checked ? 'fa fa-heart' : 'fa fa-heart-o'"
      aria-hidden="true"
    />
  </div>
</template>
<script>
export default {
  name: 'HeartPost',
  components: {},
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  method: {}
}
</script>
<style lang="scss" scoped>
.like-comment{
  // font-size: 1.6em;
  color: #e67e22;
  transition: all 300ms;
  &:hover{
      cursor: pointer;
  }
}
</style>
