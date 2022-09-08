<template>
  <div class="all-comment">
    <div
      class="items-comment"
      :style="itemCommStyle"
    >
      <transition-group name="animcommentlist">
        <div
          v-for="comment in comments"
          :key="comment?.id"
          class="media"
        >
          <div
            v-if="comment"
            class="container-comment"
          >
            <a :name="comment.id" />
            <i
              v-if="!comment?.user?.photo"
              class="fa fa-user ava ms-3"
              aria-hidden="true"
            />
            <router-link
              v-if="comment.user"
              :to="'/card/user/'+comment.user.username"
            >
              <img
                class="rounded-circle img-thumbnail"
                :src="comment?.user?.photo"
                alt=""
                style="max-height: 109px;"
              >
            </router-link>
            <div class="media-body ms-3">
              <h4 class="media-heading">
                <p v-if="!comment?.user?.full_name">
                  {{ comment?.name }}
                </p>
                <p v-else>
                  <router-link
                    v-if="comment.user"
                    :to="'/card/user/'+comment.user.username"
                    class="text-reset"
                  >
                    {{ comment?.user?.full_name }}
                  </router-link>
                </p>
                <p
                  v-if="comment.user"
                  class="calendar"
                >
                  <i
                    v-if="comment.project_id"
                    class="fa fa-eye me-1"
                    aria-hidden="true"
                  /><span
                    v-if="comment.project_id"
                    class="me-4"
                  >{{ comment.view.view }}</span>
                  <i class="fa fa-calendar" /> {{ comment?.get_date }}
                </p>
              </h4>
              <div
                v-if="comment.user"
                :id="comment.id"
                v-view-intersection="initView"
                :myview="comment.view.my_view"
                :view="comment.view.view"
              />
              <p class="pt-2">
                <v-md-preview
                  :text="comment?.body"
                  @copy-code-success="handleCopyCodeSuccess"
                />
              </p>
              <div
                class="d-flex  action-comment"
                :class="comment.project_id ? 'justify-content-between' : 'justify-content-end'"
              >
                <div
                  v-if="comment.user && comment.project_id"
                  class="stats-right d-flex align-items-end"
                >
                  <heartPostVue
                    :checked="comment.my_like?.me_like ? true : false"
                    style="font-size: 1.9em;"
                    @click="changeLike(comment, 'comment')"
                  />
                  <AvatarGroup
                    v-if="comment.my_like.likes"
                    style="cursor:pointer;"
                    @click="showUserLikes(comment.my_like.users, $event)"
                  >
                    <Avatar
                      v-for="user in getSymLinkLike(comment.my_like.users)"
                      :key="user"
                      :image="user.photo"
                      shape="circle"
                    />
                    <Avatar
                      :label="'+'+comment.my_like.likes"
                      shape="circle"
                      style="background-color:#4f585e; color: #ffffff"
                    />
                  </AvatarGroup>
                </div>
                <btnCustomVue
                  v-if="comment.user && !comment?.is_me_comment && windowWidth>=600"
                  :my-class="'say'"
                  :msg-btn="'Ответить'"
                  @click="responseComment(comment)"
                >
                  <i
                    class="fa fa-commenting-o"
                    aria-hidden="true"
                  />
                </btnCustomVue>
                <Button
                  v-if="comment.user && !comment?.is_me_comment && windowWidth<600"
                  icon="pi pi-send"
                  class="p-button-rounded p-button-secondary"
                  @click="responseComment(comment)"
                />

                <btnCustomVue
                  v-if="comment.user && comment?.is_me_comment && $store.state.user && windowWidth>=600"
                  :my-class="'del'"
                  :msg-btn="'Удалить'"
                  @click="delComment(comment, [].concat(inxComm, comment.id))"
                >
                  <i
                    class="fa fa-trash"
                    aria-hidden="true"
                  />
                </btnCustomVue>
                <Button
                  v-if="comment.user && comment?.is_me_comment && $store.state.user && windowWidth<600"
                  icon="pi pi-times"
                  class="p-button-rounded p-button-danger"
                  @click="delComment(comment, [].concat(inxComm, comment.id))"
                />
              </div>
              <div
                v-if="comment?.project"
                class="timeline-footer"
              >
                <router-link
                  v-if="comment.project"
                  :to="linkGo(comment.project.slug)+'#'+comment.id"
                  class="m-r-15 text-inverse-lighter"
                >
                  <i class="fa fa-share fa-fw fa-lg m-r-3" /> {{ comment.project.title }}
                </router-link>
              </div>
              <div
                v-if="comment?.time_line"
                class="timeline-footer"
              >
                <router-link
                  :to="'/events?'+comment.time_line"
                  class="m-r-15 text-inverse-lighter"
                >
                  <i class="fa fa-share fa-fw fa-lg m-r-3" /> На событие
                </router-link>
              </div>
            </div>
          </div>
          <CustomComment
            v-if="getResponse && comment?.response.length"
            :get-response="getResponse"
            :comments="comment?.response"
            :inx-comm="[].concat(inxComm, comment.id)"
            @responseComm="comment => { $emit('responseComm', comment) }"
          />
        </div>
      </transition-group>
    </div>
    <showUsersLikeVue
      :users="allUsersLiks"
      :evnt="evnt"
      :visible="visibleslotUsers"
      @update:visible="e => { visibleslotUsers=false }"
    />
  </div>
</template>

<script>
import heartPostVue from '@/components/UI/heartPost.vue'
import { mapState } from 'vuex'
import showUsersLikeVue from '@/components/UI/showUsersLike.vue'
export default {
  name: 'CustomComments',
  components: {
    heartPostVue,
    showUsersLikeVue
  },
  props: {
    comments: {
      type: Array,
      default: () => []
    },
    getResponse: {
      type: Boolean,
      default: false
    },
    itemCommStyle: {
      type: String,
      default: ''
    },
    inxComm: {
      type: Array,
      default: () => []
    }
  },
  emits: ['responseComm', 'update:comments'],
  data () {
    return {
      allUsersLiks: null,
      evnt: null,
      visibleslotUsers: false,
      windowWidth: window.innerWidth,
      commentView: {}
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi,
      notifyComment: state => state.usersStore.notifyComment,
      socketData: state => state.socketData,
      user: state => state.user
    }),
    username () {
      const username = this.$store.state.user?.user.username
      return username
    },
    get_win_width () {
      return window.innerWidth
    }
  },
  watch: {
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'SENDED_EVENT':
            if (this.user.user.id === obj.from_user) return false
            switch (obj.event) {
              case 'DEL_LIKE':
                this.addNewLikes(obj.data)
                break
              case 'ADD_LIKE':
                this.addNewLikes(obj.data)
                break
            }
          break
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResizeBtnComm)
    })
  },
  unmounted () {
    window.removeEventListener('resize', this.onResizeBtnComm)
  },
  methods: {
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
              for (const comm of this.comments) {
                if (comm.id === Number(entries[0].target.id)) {
                  comm.view.view += 1
                  comm.view.my_view = true
                  if (this.notifyComment && (comm.is_me_project || comm.time_line || comm.parent)) {
                    this.$store.commit('setSendSocket',
                      {
                        action: 'get_notify_comment_count',
                        request_id: 'user_'+this.user.user.username
                      }
                    )
                  }
                }
              }
            })
        }, 500)
      } else if (this.commentView) {
        clearTimeout(this.commentView[entries[0].target.id])
      }
    },
    handleCopyCodeSuccess(code) {
      this.$toast.add({
          severity: 'success',
          summary: 'Уведомление',
          detail: 'Скопирован в буфер обмена',
          life: 3000,
          group: 'tl'
        })
    },
    addNewLikes (data) {
      if (!this.comments.length) return false
      for (const [index, comm] of this.comments.entries()) {
        if (comm.id === data.id) {
          comm.view = data.view
          comm.my_like = data.my_like
        }
      }
    },
    showUserLikes (users, event) {
      if (!this.username) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Только для зарегистрированных',
          life: 3000,
          group: 'tl'
        })
        return
      }
      this.allUsersLiks = users
      this.evnt = event
      this.visibleslotUsers = true
    },
    getSymLinkLike (users) {
      const newUsers = null
      if (users?.length > 2) {
        newUsers.push(users.pop())
        newUsers.push(users.pop())
        return newUsers
      }
      return users
    },
    changeLike (event, type) {
      if (!this.$store.state.user) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Нужна регистрация',
          life: 4000,
          group: 'tl'
        })
        return false
      }
      const data = {
        object_id: event.id,
        type: type
      }
      let action = ''
      if (event.my_like.me_like) action = '/comment/like/delete'
      else action = '/comment/like/set'
      this.$http.post(this.hostapi + action, data)
        .then(res => {
          for (const comm of this.comments) {
            if (comm.id === event.id) {
              if (res.status === 201) {
                comm.my_like = res.data.my_like
                this.$store.commit('setSendSocket',
                {
                  action: 'notify_msg_online',
                  request_id: 'user_'+this.username,
                  type_notify: 'ADD_LIKE',
                  object_id: event.id,
                  project: comm.project_id
                }
              )
              } else if (res.status === 204) {
                comm.my_like.users = comm.my_like.users.filter(item => { return item.username !== this.username })
                this.$store.commit('setSendSocket',
                  {
                    action: 'notify_msg_online',
                    request_id: 'user_'+this.username,
                    type_notify: 'DEL_LIKE',
                    object_id: event.id,
                    project: comm.project_id
                  }
                )
              }
            }
          }
        })
      event.my_like.me_like = !event.my_like.me_like
      if (event.my_like.me_like) event.my_like.likes += 1
      if (!event.my_like.me_like) event.my_like.likes -= 1
    },
    responseComment (comment) {
      this.$emit('responseComm', comment)
    },
    linkGo (link) {
      return link.replace('/api/bag', '')
    },
    delComment (comment, list) {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить этот комментарий?',
        group: 'bc',
        flag: 'delmessage',
        comment: comment.id,
        listId: list,
        project: comment.project_id,
        time_line: comment.timeline_id,
        parent_id: comment.parent
      })
    },
    onResizeBtnComm () {
      this.windowWidth = window.innerWidth
    }
  }
}
</script>

<style  lang="scss" >
.animcommentlist-enter-active,
.animcommentlist-leave-active {
  transition: all 500ms ease;
}

.animcommentlist-leave-to{
  opacity: 0;
  transform: translateX(30px);
}
.animcommentlist-enter-from{
  opacity: 0;
  transform: translateX(30px);
}
.action-comment{
  .p-avatar.p-avatar-image{
    background-color: #4f585e;
  }
}
.items-comment{
    padding: 0;
    max-width: 80%;
    box-sizing: border-box;
    margin: 0 auto;
    .github-markdown-body{
      padding: 0;
      img{
        max-height: 288px;
        padding: 0.25rem;
        background-color: #fff;
        border: 1px solid #dee2e6;
      }
    }
    .timeline-footer {
      background: #f5f5f5;
      border-top: none;
    }
    // padding-left: 35px;
  }
.items-comment .items-comment .media{
    background-color: #ebebeb !important;
    margin-left: 19px;
}
.items-comment .items-comment {
    max-width: 100%;
    .timeline-footer{
          background: #ebebeb
    }
}
.all-comment{
.timeline-footer {
    padding-top: 15px;
    & a {
        margin-right: 26px;
    }
}

.timeline-footer a:not(.btn) {
    color: #575d63
}

.timeline-footer a:not(.btn):focus,
.timeline-footer a:not(.btn):hover {
    color: #2d353c
}
 .input-group-text{
    background-color: #fff;
  }
  .captcha{
    margin-top: 20px;
  }
  .form-bags-name-tel{
    padding-bottom: 20px;
  }
  .form-bags {
    padding: 55px;
    max-width: 676px;
    box-sizing: border-box;
    margin: 0 auto;
    .form-control{
      &:focus{
        border: 1px solid #e67e22;
        box-shadow: none;
      }
    }
  }
}
  .media {
    display: flex;
    flex-direction: column;
    .container-comment{
      display: flex;
      border-top:1px dashed #DDDDDD;
    padding:20px 0;
    margin:0;
    }
    .media-body{
      width: 100%;
    }
    .ava{
      font-size: 5.0em;
      margin-right: 16px;
      color: #4f585e;
    }
    .pull-left {
      margin-right:20px;
      display: flex;
      list-style-type: none;
    }
    h4 {
      margin: 0 0 -6px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .calendar {
        font-size:.7em;
        padding-right: 20px;
            font-weight: 900;
      }
      p{
        font-size: .7em;
        font-weight: 900;
      }
    }
    p {
      margin-bottom:15px;
      text-align:justify;
    }
    .pull-left li {
        padding-right: 10px;
      }
  }
</style>
