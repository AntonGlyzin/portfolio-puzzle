<template>
      <PortfolioListVue :user="user" :taguser="taguser"/>
</template>
<script>
import PortfolioListVue from '@/views/PortfolioList.vue'
export default {
  name: 'wrap-tags-user-blog',
  props: {
    user: {
      type: String,
      default: ''
    },
    taguser: {
      type: String,
      default: ''
    }
  },
  components: {
    PortfolioListVue
  }
}
</script>
<style scoped>

</style>
