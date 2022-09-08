<template>
  <!-- <div class="modal fade" id="portModalDel" tabindex="-1" aria-labelledby="portModalDel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Удалить комментарий?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-footer d-flex justify-content-between">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Нет</button>
        <button @click="delMeComment" type="button" class="btn btn-danger">Да</button>
      </div>
    </div>
  </div>
</div> -->
  <Toast
    position="center"
    group="bc"
  >
    <template #message="slotProps">
      <div class="flex flex-column">
        <div class="text-center">
          <i
            class="pi pi-exclamation-triangle"
            style="font-size: 3rem"
          />
          <h4>{{ slotProps.message.summary }}</h4>
          <p>{{ slotProps.message.detail }}</p>
        </div>
        <div class="grid p-fluid">
          <div class="col-6">
            <Button
              class="p-button-success"
              label="Yes"
              @click="delMeComment"
            />
          </div>
          <div class="col-6">
            <Button
              class="p-button-secondary"
              label="No"
              @click="onReject"
            />
          </div>
        </div>
      </div>
    </template>
  </Toast>
</template>

<script>
import Toast from 'primevue/toast'
import Button from 'primevue/button'
export default {
  name: 'CustomDialogDel',
  components: {
    Toast,
    Button
  },
  props: {},
  methods: {
    delMeComment () {
      this.$emit('choicesMeDel', true)
      // document.getElementById('portModalDel').click()
    },
    onReject () {
      this.$toast.removeGroup('bc')
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
    border-radius: 0;
}
button {
    min-width: 10rem;
    margin-right: .5rem;
}

@media screen and (max-width: 960px) {
    button {
        width: 100%;
        margin-bottom: .5rem;
    }
}
</style>
