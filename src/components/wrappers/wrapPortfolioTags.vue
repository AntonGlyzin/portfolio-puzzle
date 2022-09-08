<template>
    <PortfolioListVue :tags="tags" />
</template>
<script>
import PortfolioListVue from '@/views/PortfolioList.vue'
export default {
  name: 'wrap-portfolio-tags',
  props: {
    tags: {
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
