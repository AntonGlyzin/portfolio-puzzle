<template>
    <EventsViewVue :userevent="userevent" />
</template>
<script>
import EventsViewVue from '@/views/EventsView.vue'
export default {
  name: 'wrap-event-user',
  props: {
    userevent: {
      type: String,
      default: ''
    }
  },
  components: {
    EventsViewVue
  }
}
</script>
<style scoped>

</style>
