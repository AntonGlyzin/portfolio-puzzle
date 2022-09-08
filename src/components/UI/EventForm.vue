<template>
  <div
    v-if="userstore"
    class="timeline-comment-box d-flex send-comment"
  >
    <div class="user col-2 p-1">
      <img
        :src="userstore.photo"
        class="rounded-circle mt-1"
      >
    </div>
    <div class="input col-10 ms-2">
      <form
        action=""
        class=""
      >
        <div class="d-flex send-comment-event">
          <Textarea
            :id="'form-event-'+event.id"
            :style="{'border-radius':0, 'background':'#f5f5f5'}"
            :auto-resize="true"
            cols="30"
            placeholder="Написать комментарий..."
            @input="e => { $emit('update:modelValue', e.target.value) }"
          />
          <Button
            icon="pi pi-send"
            class="pe-3 ps-3 me-2"
            @click="$emit('senMessEvent', event)"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'EventForm',
  components: {
  },
  props: {
    modelValue: {
        type: String,
        default: ''
    },
    event: {
        type: Object,
        default: null
    }
  },
  emits: ['senMessEvent', 'update:modelValue'],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      userstore: state => state.user
    })
  }
}
</script>
<style scoped>

</style>
