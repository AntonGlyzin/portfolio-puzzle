<template>
    <EventsViewVue :tags="tags" />
</template>
<script>
import EventsViewVue from '@/views/EventsView.vue'
export default {
  name: 'wrap-event-user-tags',
  props: {
    tags: {
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
