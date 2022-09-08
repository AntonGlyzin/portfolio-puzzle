<template>
  <footer class="d-flex justify-content-center align-items-center">
    <small class="text-white"><i
                                class="fa fa-copyright"
                                aria-hidden="true"
                              />
      <router-link
        :to="'/card/user/toshaglyzin'"
        class="text-reset no-underline"
      > Антон Глызин</router-link>
    </small>
  </footer>
</template>

<script>
export default {
  name: 'FooterSite',
  props: {}
}
</script>

<style scoped lang="scss">
</style>
