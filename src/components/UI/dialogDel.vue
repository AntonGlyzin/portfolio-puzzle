<template>
  <div
    id="portModalDel"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="portModalDel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            Удалить комментарий?
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Нет
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="delMeComment"
          >
            Да
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getMyToken } from '@/components/service'
import Cookies from 'js-cookie'
export default {
  name: 'PortfDialogDel',
  props: {
    idComment: {
      type: Number,
      default: 0
    },
    slug: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      hostmeapi: state => state.hostmeapi
    })
  },
  methods: {
    ...mapActions({
      fetchPosts: 'postsStore/fetchPosts'
    }),
    delMeComment () {
      document.getElementById('portModalDel').click()
      const usertoken = Cookies.get('usertoken')
      const headers = {}
      if (usertoken) {
        headers.Authorization = `Bearer ${usertoken}`
      }
      this.$http.get(this.hostmeapi + `/comment/delete/${this.idComment}`, {
        headers: headers
        // {
        //   'X-CSRFToken': getMyToken(),
        //   Authorization: `Bearer ${usertoken}`
        // }
      }).then(res => {
        const csrftoken = getMyToken()
        this.fetchPosts({ prefix: this.prefix + `/${this.slug}`, csrftoken: csrftoken, config: {} })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
    border-radius: 0;
}
</style>
