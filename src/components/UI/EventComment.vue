<template>
  <div v-if="comments">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="timeline-comment-box d-flex mt-2 flex-column "
      style="border-top:1px dashed #DDDDDD"
    >
      <div>
        <span class="username">
          <router-link
            class="fw-bolder text-reset"
            :to="'/card/user/'+comment.user?.username"
          >{{ comment.user?.full_name }}</router-link>
        </span>
        <small class="text-muted pl-3">{{ comment.get_date }}</small>
      </div>
      <div class="d-flex flex-nowrap">
        <div class="user col-2 p-1">
          <router-link :to="'/card/user/'+comment.user?.username">
            <img
              :src="comment.user?.photo"
              class="rounded-circle mt-1"
            >
          </router-link>
        </div>
        <div class="d-flex flex-nowrap justify-content-between w-100">
          <p class="ms-2 pt-3 w-75">
            {{ comment.body }}
          </p>
          <div
            v-if="comment.user && !comment.view.my_view"
            :id="comment.id"
            v-view-intersection="initView"
            :myview="comment.view.my_view"
            :view="comment.view.view"
          />
          <i
            v-if="comment.is_me_comment"
            class="fa fa-trash-o del-comment-trash text-3xl"
            aria-hidden="true"
            @click="delComment(comment.id, event)"
          />
        </div>
      </div>
      <div
        v-if="!comment.is_me_comment"
      >
        <small
          class="pl-8 cursor-pointer"
          @click="replayComment({ comment: comment, event: event})"
        ><i
          class="fa fa-comments-o"
          aria-hidden="true"
        /> Ответить</small>
      </div>
      <EventComment
        v-if="comment.response"
        :event="event"
        :comments="comment.response"
        @replay-comment="replayComment"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'EventComment',
  components: {
  },
  props: {
    comments: {
        type: Array,
        default: null
    },
    event: {
        type: Object,
        default: null
    }
  },
  emits: ['replayComment'],
  data() {
    return {
      commentView: []
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi,
      user: state => state.user
    })
  },
  methods: {
    setView (target_id) {
      for (const comm of this.comments) {
        if (comm.id === Number(target_id)) {
          comm.view.view += 1
          comm.view.my_view = true
            setTimeout(() => {
              this.$store.commit('setSendSocket',
                {
                  action: 'get_notify_comment_count',
                  request_id: 'user_'+this.user.user.username
                }
              )
            }, 500)
        }
      }
    },
    initView (entries) {
      if (entries[0].target.getAttribute('myview') === 'true') return false
      if (entries[0].isIntersecting) {
        this.commentView[entries[0].target.id] = setTimeout(() => {
          const data = {
            object_id: entries[0].target.id,
            type: 'comment'
          }
          this.$http.post(this.hostapi + '/comment/view/set', data)
            .then(res => {
              this.setView(entries[0].target.id)
            }).catch(() => {
              this.setView(entries[0].target.id)
            })
        }, 500)
      } else if (this.commentView) {
        clearTimeout(this.commentView[entries[0].target.id])
      }
    },
    delComment (id, event) {
        this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить этот комментарий?',
        group: 'bc',
        idComm: id,
        event: event
      })
    },
    replayComment (comment) {
        this.$emit('replayComment', comment)
    }
  },
}
</script>
<style lang="scss">
.timeline-comment-box{
    .timeline-comment-box{
        margin: 0;
        padding: 0;
        padding-top: 5px;
    }
}
</style>
