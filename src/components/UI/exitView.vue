<template>
  <div class="d-flex justify-content-center p-6">
    <btnCustomVue
      style="height: 44px;"
      class="btn-me-registr mt-3"
      :my-class="'say'"
      :msg-btn="'Выход'"
      @click="exit"
    >
      <i
        class="pi pi-sign-out"
        aria-hidden="true"
      />
    </btnCustomVue>
  </div>
</template>
<script>
export default {
  name: 'WrapExit',
  components: {
  },
  props: {},
  methods: {
    exit () {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите выйти из учетной записи?',
        group: 'ext',
        flag: 'exit'
      })
    }
  }
}
</script>
<style scoped>

</style>
