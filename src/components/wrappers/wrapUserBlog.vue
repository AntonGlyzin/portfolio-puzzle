<template>
      <PortfolioListVue :user="user"/>
</template>
<script>
import PortfolioListVue from '@/views/PortfolioList.vue'
export default {
  name: 'wrap-user-blog',
  props: {
    user: {
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
