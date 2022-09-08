<template>
  <div class="p-3">
    <div
      class="d-flex justify-content-between"
      style="margin-left: -12px;margin-right: -12px;"
    >
      <Toolbar class="mb-3 w-100 p-1  border-round-sm">
        <template #start>
          <div class="d-flex flex-column">
            <Calendar
              id="range-calendar-event"
              v-model="dataes"
              selection-mode="range"
              :show-icon="true"
              :manual-input="false"
              class="dates-events"
              date-format="dd/mm/yy"
              style="width:180px"
            />
            <Dropdown
              v-if="userstore"
              v-model="selectedUser"
              :options="followers"
              option-label="full_name"
              placeholder="Подписки"
              :loading="loadUsers"
              :show-clear="true"
              class="rounded-0 mt-2"
              :filter="true"
              @change="changeUser"
            />
          </div>
          <div class="d-flex">
            <Button
              class="p-button-outlined p-button-secondary rounded-0 btn-filter-date ms-2"
              icon="pi pi-filter"
              @click="loadForDate"
            />
            <Button
              v-if="userstore"
              class="p-button-outlined p-button-secondary rounded-0 btn-filter-date ms-2"
              icon="pi pi-plus"
              @click="addEvents"
            />
          </div>
        </template>
        <template #end>
          <Button
            class="p-button-outlined p-button-secondary rounded-0 btn-filter-date ms-2"
            icon="pi pi-refresh"
            @click="loadDateReset"
          />
        </template>
      </Toolbar>
    </div>
    <ul class="timeline">
      <li
        v-for="(event, index) in events"
        :key="index"
      >
        <div class="timeline-time">
          <span class="date">{{ get_date(event) }}</span>
          <span class="time">{{ get_time(event) }}</span>
        </div>
        <div class="timeline-icon">
          <a href="javascript:;">&nbsp;</a>
        </div>
        <div class="timeline-body card">
          <div class="timeline-header">
            <span class="userimage"><router-link :to="'/card/user/'+event.username"><img
              :src="event.photo_author"
              alt=""
            ></router-link></span>
            <span class="username"><router-link :to="'/card/user/'+event.username">{{ event.get_author }}</router-link> <small /></span>
            <span class="pull-right text-muted">
              <span class="me-3 "><i
                class="fa fa-eye me-1"
                aria-hidden="true"
              />{{ event.view.view }}</span>
              <span
                v-for="tag in event.mytags"
                :key="tag.id"
                class="badge bg-secondary fw-normal"
                style="background-color: #797e81;margin-left: 2px;"
              >
                <router-link
                  class="text-reset"
                  :to="'/events?tags='+tag.slug + '&user=' + event.username"
                >
                  {{ tag.name }}</router-link></span>
            </span>
          </div>
          <div
            v-if="event.viewer?.is_my_event"
            class="d-flex justify-content-between"
          >
            <span
              class="cursor-pointer"
              @click="thisEditEvent(event, index)"
            ><i
              class="fa fa-pencil me-1"
              aria-hidden="true"
            />Редактировать</span>
            <span
              class="cursor-pointer"
              @click="delEvent(event)"
            ><i
              class="fa fa-trash"
              aria-hidden="true"
            />Удалить</span>
          </div>
          <div class="timeline-content">
            <p>
              <v-md-preview
                :text="event.content"
                @copy-code-success="handleCopyCodeSuccess"
              />
            </p>
            <div
              :id="event.id"
              v-view-intersection="initView"
              :myview="event.view.my_view"
              :view="event.view.view"
            />
          </div>
          <div class="timeline-footer pb-1 d-flex justify-content-between">
            <div class="d-flex align-items-center">
              <router-link
                v-if="event.project"
                :to="'/portfolio/post/'+event.project"
                class="m-r-15 text-inverse-lighter"
              >
                <i class="fa fa-share fa-fw fa-lg m-r-3" /> Проект
              </router-link>
              <router-link
                v-if="event.blog"
                :to="'/blog/post/'+event.blog"
                class="m-r-15 text-inverse-lighter"
              >
                <i class="fa fa-share fa-fw fa-lg m-r-3" /> Записи
              </router-link>
            </div>
            <div
              class="d-flex align-items-center cursor-pointer"
              @click="showComment(event)"
            >
              <i class="fa fa-comments-o fa-fw fa-lg m-r-3" /> 
              <span class="border-none border-dotted border-bottom-1 comment-event-mobile">Комментарии</span> 
              <Badge
                v-if="getCountComment(event.comments_timeline)"
                class="surface-700"
                :value="getCountComment(event.comments_timeline)"
              />
            </div>
            <div class="stats-right d-flex">
              <heartPostVue
                :checked="event.my_like?.me_like ? true : false"
                style="font-size: 1.8em;"
                @click="changeLike(event, 'timeline')"
              />
              <AvatarGroup
                v-if="event.my_like.likes"
                style="cursor:pointer;"
                @click="showUserLikes(event.my_like.users, $event)"
              >
                <Avatar
                  v-for="user in getSymLinkLike(event.my_like.users)"
                  :key="user"
                  :image="user.photo"
                  shape="circle"
                />
                <Avatar
                  :label="'+'+event.my_like.likes"
                  shape="circle"
                  style="background-color:#4f585e; color: #ffffff"
                />
              </AvatarGroup>
            </div>
          </div>
          <EventCommentVue
            v-if="event.show_comment"
            :event="event"
            :comments="event.comments_timeline"
            @replay-comment="replayComment"
          />
          <transition name="replay-timeline-comment">
            <div
              v-if="replayCommentData"
              class="d-flex p-1 flex-column w-100"
            >
              <div class="d-flex justify-content-between">
                <span class="font-semibold">{{ replayCommentData.user.full_name }}</span>
                <i
                  class="fa fa-times text-lg cursor-pointer"
                  aria-hidden="true"
                  @click="resetReplayComment"
                />
              </div>
              <div class="pl-7 pt-1 pb-1">
                {{ replayCommentData.body }}
              </div>
            </div>
          </transition>
          <EventFormVue
            v-if="event.show_comment"
            v-model="message"
            :event="event"
            @sen-mess-event="senMessEvent"
          />
        </div>
      </li>
    </ul>
    <Toast
      position="center"
      group="tl"
    />

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
                label="Да"
                @click="YesMethod(slotProps.message)"
              />
            </div>
            <div class="col-6">
              <Button
                class="p-button-secondary"
                label="Нет"
                @click="onReject"
              />
            </div>
          </div>
        </div>
      </template>
    </Toast>
    <div
      v-intersection="afterFetch"
      class="PortfolioList-btn"
    />
    <spinnerMe v-show="isLoad" />
    <div
      v-if="isNextPage"
      class="d-flex justify-content-center p-6"
    >
      <btnCustomVue
        style="height: 44px;"
        class="btn-me-registr mt-3"
        :my-class="'say'"
        :msg-btn="'Загрузить'"
        @click="afterFetch"
      >
        <i
          class="fa fa-arrow-down"
          aria-hidden="true"
        />
      </btnCustomVue>
    </div>
    <ScrollTop />
    <addEventVue
      :is-edit-event="isEditEvent"
      :show-modal="addModalEvent"
      :myevent="editEvent"
      :edit-index="editIndex"
      @update:showModal="closeModalEvent"
    />
    <showUsersLikeVue
      :users="allUsers"
      :evnt="evnt"
      :visible="visibleslotUsers"
      @update:visible="e => { visibleslotUsers=false }"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import EventCommentVue from '@/components/UI/EventComment.vue'
import EventFormVue from '@/components/UI/EventForm.vue'
export default {
  name: 'EventsViewMy',
  metaInfo () {
    return {
      title: 'Лента событий'
      // meta: [
      //   {
      //     name: 'description',
      //     content: this.post.description
      //   },
      //   {
      //     name: 'Keywords',
      //     content: this.post.key_words
      //   }
      // ]
    }
  },
  components: {
    EventCommentVue,
    EventFormVue
  },
  props: {
    userevent: {
      type: String,
      default: ''
    },
    tags: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      addModalEvent: false,
      isEditEvent: false,
      editEvent: null,
      user: null,
      allUsers: null,
      message: '',
      target: null,
      dataes: [],
      hearted: false,
      visibleslotUsers: false,
      evnt: null,
      editIndex: null,
      commentView: [],
      loadUsers: false,
      followers: null,
      selectedUser: null,
      replayCommentData: null,
      subscribeEventComment: []
    }
  },
  computed: {
    ...mapState({
      events: state => state.eventStore.events,
      isLoad: state => state.eventStore.isLoad,
      isNextPage: state => state.eventStore.isNextPage,
      lastHref: state => state.eventStore.lastHref,
      hostapi: state => state.hostmeapi,
      userstore: state => state.user,
      socketData: state => state.socketData
    }),
    getHref () {
      return this.$route.href
    }
  },
   watch: {
    getHref (val, oldVal) {
      this.$store.commit('eventStore/setlastHref', oldVal)
      if (this.$route.meta.view === 'events') {
        this.clearPage()
        this.afterFetch()
      }
    },
    userstore (val) {
      if (val) {
        this.getFollowers()
      }
    },
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'SENDED_EVENT':
            if (this.userstore.user.id === obj.from_user) return false
            switch (obj.event) {
              case 'ADD_LIKE_TIMELINE':
                this.changeLakeFromSocket(obj.data, 'LIKE')
                break
              case 'DEL_LIKE_TIMELINE':
                this.changeLakeFromSocket(obj.data, 'LIKE')
                break
              // case 'NEW_COMMENT_TIMELINE':
                // this.changeLakeFromSocket(obj.data, 'COMMENT')
                // break
              case 'DEL_COMMENT_TIMELINE':
                this.changeLakeFromSocket(obj.data, 'COMMENT')
                break
            }
            break
          case 'get_comment_event_post':
            this.changeLakeFromSocket(obj.data, 'COMMENT')
            break
          case 'notify_observer':
            switch (obj.type_notify) {
                case 'NEW_COMMENT':
                  setTimeout(() => {
                    this.getCommentFromSocket(obj)
                  }, 300)
                  break
                case 'NEW_COMMENT_TIMELINE':
                  setTimeout(() => {
                    this.getCommentFromSocket(obj)
                  }, 300)
                  break
              }
            break
          case 'get_comment_from_notify':
            if (!obj.data) return
            setTimeout(() => {
              this.addCommentTimelineFromSocket(obj.data)
            }, 300)
            break
        }
      },
      deep: true
    }
  },
  mounted () {
    this.clearPage()
    if (this.userstore) {
      this.getFollowers()
      const numEvent = this.$route.query?.event
      if (numEvent) {
        this.subscribeEventComment.push(numEvent)
        this.$store.commit('setSendSocket',
        {
          action: 'subscribe_on_event_comment',
          request_id: 'user_'+this.userstore.user.username,
          event: numEvent
        })
      }
    }
    this.getUser()
  },
  unmounted() {
    this.subscribeOffEventComment()
  },
  methods: {
    ...mapActions({
      fetchEvents: 'eventStore/fetchEvents',
      clearPage: 'eventStore/clearPage'
    }),
    addCommentTimelineFromSocket (data) {
      if (!this.subscribeEventComment.includes(data.time_line)) return
      for (const [inx, ev] of this.events.entries()) {
        if (ev.id == data.time_line) {
            ev.comments_timeline = data.comments_timeline
        }
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
    getCommentFromSocket (data) {
      // if (!this.subscribeEventComment.length) return
      this.$store.commit('setSendSocket',
        {
          action: 'get_comment_from_notify',
          request_id: 'user_'+this.userstore.user.username,
          object_id: data.object_id
        }
      )
    },
    subscribeOffEventComment () {
      if (!this.subscribeEventComment.length) return
      this.$store.commit('setSendSocket',
      {
        action: 'subscribe_off_event_comment',
        request_id: 'user_'+this.userstore.user.username,
        event: this.subscribeEventComment
      })
    },
    getCountComment (comments, sum=0) {
      for (const comment of comments) {
        if (comment.response.length) {
          sum += this.getCountComment(comment.response)
        }
        sum += 1
      }
      return sum
    },
    showComment (event) {
      event.show_comment = !event.show_comment
      if (!this.userstore) return
      if (event.show_comment) {
        if (this.subscribeEventComment.includes(event.id)) return
        this.subscribeEventComment.push(event.id)
        this.$store.commit('setSendSocket',
        {
          action: 'subscribe_on_event_comment',
          request_id: 'user_'+this.userstore.user.username,
          event: event.id,
          type_notify: 'NEW_COMMENT_TIMELINE'
        })
      } else {
        if (this.subscribeEventComment.includes(event.id)) {
          this.subscribeEventComment.pop(event.id)
          this.$store.commit('setSendSocket',
          {
            action: 'subscribe_off_event_comment',
            request_id: 'user_'+this.userstore.user.username,
            event: event.id
          })
        }
      }
      
    },
    initView (entries) {
      if (entries[0].target.getAttribute('myview') === 'true') return false
      if (entries[0].isIntersecting) {
        this.commentView[entries[0].target.id] = setTimeout(() => {
          const data = {
            object_id: entries[0].target.id,
            type: 'timeline'
          }
          this.$http.post(this.hostapi + '/comment/view/set', data)
            .then(res => {
              for (const [inx, event] of this.events.entries()) {
                if (event.id === Number(entries[0].target.id)) {
                  event.view.view += 1
                  event.view.my_view = true
                  this.events.splice(inx, 1, event)
                }
              }
            })
        }, 1000)
      } else if (this.commentView) {
        clearTimeout(this.commentView[entries[0].target.id])
      }
    },
    replayComment (comment) {
      this.replayCommentData = comment.comment
      const nameForm = 'form-event-'+comment.event.id
      this.target = document.getElementById(nameForm)
      document.getElementById(nameForm).value = comment.comment.user.full_name + ', '
    },
    resetReplayComment () {
      this.replayCommentData = null
      this.message = ''
      this.target.value = ''
    },
    changeLakeFromSocket (data, content) {
      for (const [inx, ev] of this.events.entries()) {
        if (ev.id == data.id) {
          if (content == 'LIKE') {
            ev.my_like = data.my_like
          } else if (content == 'COMMENT') {
            ev.comments_timeline = data.comments_timeline
          }
          // this.events.splice(inx, 1, data)
        }
      }
    },
    thisDeleteEvent (e) {
      this.$store.commit('setIsLoad', true)
      this.$http.delete(this.hostapi + `/events/user/delete/${e.id}`)
        .then(() => {
          const arrEvent = this.events.filter(item => { return item.id !== e.id })
          this.$store.commit('eventStore/setEvents', arrEvent)
        }).catch(res => {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Произошла ошибка в процессе удаления',
            life: 3000,
            group: 'tl'
          })
        }).then(() => { this.$store.commit('setIsLoad', false) })
    },
    thisEditEvent (e, i) {
      this.editEvent = e
      this.editIndex = i
      this.isEditEvent = true
      this.addModalEvent = true
    },
    closeModalEvent () {
      this.editEvent = null
      this.isEditEvent = false
      this.addModalEvent = false
    },
    addEvents () {
      this.addModalEvent = true
    },
    showUserLikes (users, event) {
      if (!this.userstore) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Для этого нужно зарегистрироваться',
          life: 3000,
          group: 'tl'
        })
        return
      }
      this.allUsers = users
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
      if (!event.viewer) return false
      const data = {
        object_id: event.id,
        type: type
      }
      let action = ''
      const username = this.userstore.user.username
      if (event.my_like.me_like) action = '/comment/like/delete'
      else action = '/comment/like/set'
      this.$http.post(this.hostapi + action, data)
        .then(res => {
          for (const [inx, ev] of this.events.entries()) {
            if (ev.id === event.id) {
              if (res.status === 201) {
                ev.my_like = res.data.my_like
                if (ev.username == username) return
                this.$store.commit('setSendSocket',
                {
                  action: 'notify_msg_online',
                  request_id: 'user_'+username,
                  type_notify: 'ADD_LIKE_TIMELINE',
                  object_id: event.id
                })
              } else if (res.status === 204) {
                ev.my_like.users = ev.my_like.users.filter(item => { return username !== item.username })
                if (ev.username == username) return
                this.$store.commit('setSendSocket',
                {
                  action: 'notify_msg_online',
                  request_id: 'user_'+username,
                  type_notify: 'DEL_LIKE_TIMELINE',
                  object_id: event.id
                })
              }
            }
          }
        })
      event.my_like.me_like = !event.my_like.me_like
      if (event.my_like.me_like) event.my_like.likes += 1
      if (!event.my_like.me_like) event.my_like.likes -= 1
    },
    getFollowers () {
      const follow = this.$store.state.usersStore.myFollower
      if (follow) {
        this.followers = follow
        return
      }
      this.loadUsers = true
      this.$http.get(this.$store.state.hostmeapi + '/detail/user/follower')
        .then(res => {
          this.followers = res.data[0].follower
          this.$store.commit('usersStore/setMyFollower', res.data[0].follower)
        }).catch(res => {}).then(() => { this.loadUsers = false })
    },
    changeUser () {
      if (!this.selectedUser) {
        const params = this.getHrefParams(['tags', 'date_after', 'date_before'])
        const paramsStr = this.convertStrHrefParams(params)
        this.selectedUser = null
        this.$router.push(paramsStr)
      }
    },
    loadDateReset () {
      this.dataes = []
      const params = this.getHrefParams(['user'])
      const paramsStr = this.convertStrHrefParams(params)
      this.dataes = []
      this.$router.push(paramsStr)
    },
    loadForDate () {
      this.changeDate()
    },
    onReject () {
      this.$toast.removeGroup('bc')
    },
    YesMethod (e) {
      if (e?.idComm) {
        this.$http.get(this.$store.state.hostmeapi + `/comment/delete/${e.idComm}`)
          .then(res => {
            this.delComment(e.idComm, e.event.comments_timeline)
            this.$store.commit('setSendSocket',
              {
                action: 'notify_msg_online',
                request_id: 'user_'+this.userstore.user.username,
                type_notify: 'DEL_COMMENT_TIMELINE',
                object_id: e.idComm,
                time_line: e.event.id
              }
            )
          })
      } else if (e?.idEvent) {
        this.thisDeleteEvent(e.event)
      }
      this.$toast.removeGroup('bc')
    },
    delEvent (event) {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить это событие?',
        group: 'bc',
        event: event,
        idEvent: event.id
      })
    },
    addComment (parentId, data, comments = []) {
      for (const [index, comment] of comments.entries()) {
        if (comment.id == parentId) {
          comment.response.push(data)
          return true
        } else if (comment.response.length) {
          this.addComment(parentId, data, comment.response)
        }
      }
      return false
    },
    delComment (idComm, comments = []) {
      for (const [index, comment] of comments.entries()) {
        if (comment.id == idComm) {
          if (comment.response.length) {
            for(const item of comment.response) {
              comments.push(item)
            }
            comments.splice(index, 1)
          } else {
            comments.splice(index, 1)
          }
          return true
        } else if (comment.response.length) {
          this.delComment(idComm, comment.response)
        }
      }
      return false
    },
    senMessEvent (event) {
      if (!this.message) return false
      const nameForm = 'form-event-'+event.id
      this.target = document.getElementById(nameForm)
      const data = {
        time_line: event.id,
        body: this.message.trim()
      }
      if (this.replayCommentData) {
        data.response = this.replayCommentData.id
      }
      this.$http({
        method: 'post',
        url: this.$store.state.hostmeapi + '/comment/create',
        data: data
      }).then(res => {
        if (this.replayCommentData) {
          this.addComment(this.replayCommentData.id, res.data, event.comments_timeline)
        } else {
          event.comments_timeline.push(res.data)
        }
        this.$store.commit('setSendSocket',
          {
            action: 'notify_msg_online',
            request_id: 'user_'+this.userstore.user.username,
            type_notify: 'NEW_COMMENT_TIMELINE',
            object_id: res.data.id,
            time_line: event.id
          }
        )
      }).catch(res => {
        if (res.response?.status == 404 && this.replayCommentData) {
          this.$toast.add({ severity: 'error', summary: 'Уведомление', detail: 'Комментарий был удален', life: 3000, group: 'tl' })
          this.delComment(this.replayCommentData.id, event.comments_timeline)
        } else {
          this.$toast.add({ severity: 'error', summary: 'Уведомление', detail: 'Ошибка при отправление', life: 3000, group: 'tl' })
        }
      }).then(() => {
        this.target.value = ''
        this.message = ''
        this.replayCommentData = null
      })
    },
    get_time (event) {
      return event.get_date.match(/[0-9]+:[0-9]+/)[0]
    },
    get_date (event) {
      const dateMas = event.get_date.split(' ')
      dateMas.pop()
      return dateMas.join(' ')
    },
    getHrefParams (field) {
      const query = this.$route.query
      const data = {}
      for (const key in query) {
        if (field.includes(key)) data[key] = query[key]
      }
      return data
    },
    convertStrHrefParams (data) {
      let params = []
      for (const key in data) {
        params.push(key + '=' + data[key])
      }
      params = '?' + params.join('&')
      return params
    },
    clearFieldDate () {
      this.dataes = []
      setTimeout(() => {
        const params = this.getHrefParams(['tags', 'user'])
        const paramsStr = this.convertStrHrefParams(params)
        this.$router.push(paramsStr)
      }, 500)
    },
    changeDate () {
      const params = this.getHrefParams(['tags', 'user'])
      if (this.selectedUser) params.user = this.selectedUser.username
      for (const [inx, date] of this.dataes.entries()) {
        if (date) {
          if (inx === 0) params.date_after = this.dataes[0].toLocaleDateString().split('.').reverse().join('-')
          if (inx === 1) params.date_before = this.dataes[1].toLocaleDateString().split('.').reverse().join('-')
        }
      }
      const paramsStr = this.convertStrHrefParams(params)
      this.$router.push(paramsStr)
    },
    afterFetch () {
      const query = this.$route.query
      const data = {}
      for (const key in query) {
        data[key] = query[key]
      }
      const path = this.$route.path
      this.fetchEvents({ path: path, params: data })
    },
    getUser () {
      this.user = this.$store.state.user
    }
  }
}
</script>

<style lang="scss" >
.replay-timeline-comment-enter-active,
.replay-timeline-comment-leave-active {
  transition: all 0.3s ease;
}

.replay-timeline-comment-enter-from,
.replay-timeline-comment-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
.send-comment-event{
  .v-md-editor {
    display: flex;
    flex-direction: row !important;
  }
}
.del-comment-trash{
  color: #454a4c;
    height: 21px;
    cursor: pointer;
  &:hover{
    color: #dc3545;
  }
}
.heart-post{
    background-color: transparent;
    color: #e67e22;
    box-shadow: none !important;
    border: none;
    height: 2rem !important;
    width: 2rem !important;
    .p-button-icon{
      font-size: 1.7em;
    }
    &:hover{
      background: none;
      border: none;
    }
    .p-ripple.purple .p-ink {
      background: rgba(256,39,176,.3);
    }
}
.stats-right{
  .p-button:enabled:hover{
    background: #ebebeb;
    &:hover{
      color: #e67e22;
    }
  }
}
.btn-filter-date{
    &:hover{
        background-color: #60676a !important;
        color: white !important;
        border-color: #60676a !important;
    }
}
.dates-events{
  #range-calendar-event{
    background-color: #f5f5f5;
  }
    input{
        border-radius: 0;
            border: 1px solid #64748b;
    }
    .p-inputtext:enabled:focus {
    outline: 0 none;
    outline-offset: 0;
    box-shadow: 0 0 0 0.2rem #fee6c7;
    border-color: #e67e22;
    }
    .p-inputtext:enabled:hover {
    border-color: #e67e22 !important;
    }
    .p-button {
    background: #60676a !important;
    border: 1px solid #60676a !important;
    border-radius: 0;
    &:enabled:hover{
        border-color: #e67e22 !important;
        background: #e67e22 !important;
    }
    &:enabled:active {
    background: #e67e22 !important;
    border-color: #e67e22 !important;
    }
    }
}
.send-comment{
    margin-top: 0 !important;
    background-color: #ebebeb !important;
    border-top: 1px dotted #3432;
}
.del-comment{
    width: 50px;
    height: 50px;
    border-radius: 50% !important;
}
.send-comment{
        .p-inputtext:enabled:hover {
        border-color: #e67e22;
    }
    .form-control:focus {
        border-color: #e67e22;
        box-shadow: 0 0 0 0.25rem rgb(253 135 13 / 25%);
    }
    .p-button:focus{
        box-shadow: none;
    }
    .p-button:enabled:hover {
        background: #dbdbdb;
        color: #4f585e;
        border-color: #ced4da;
    }
    .p-button {
        color: #485056;
        background: #ebebeb;
        border: 1px solid #ced4da;
            border-radius: 0;
    }
    .p-button:enabled:active {
        background: #4a5258;
        color: #ffffff;
        border-color: #454d53;
    }
}

.container{
    padding-top: 33px;
    .btn-primary{
        background-color: #e67e22;
        border-color: #e67e22;
        border-radius: 0;
    }
}
.timeline {
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: relative;
    .username {
      a{
        text-decoration: none;
      }
      border-bottom: 1px dotted;
    }
    .github-markdown-body {
      padding: 0;
    }
}

.timeline:before {
    content: '';
    position: absolute;
    top: 5px;
    bottom: 5px;
    width: 5px;
    background: #4a5258;
    left: 20%;
    margin-left: -2.5px
}

.timeline>li {
    position: relative;
    min-height: 50px;
    padding: 20px 0
}

.timeline .timeline-time {
    position: absolute;
    left: -7px;
    width: 18%;
    text-align: right;
    top: 30px
}

.timeline .timeline-time .date,
.timeline .timeline-time .time {
    display: block;
    font-weight: 600
}

.timeline .timeline-time .date {
    line-height: 16px;
    font-size: 12px
}

.timeline .timeline-time .time {
    line-height: 24px;
    font-size: 20px;
    color: #242a30
}

.timeline .timeline-icon {
    left: 15%;
    position: absolute;
    width: 10%;
    text-align: center;
    top: 40px
}

.timeline .timeline-icon a {
    text-decoration: none;
    width: 20px;
    height: 20px;
    display: inline-block;
    border-radius: 20px;
    background: #d9e0e7;
    line-height: 10px;
    color: #fff;
    font-size: 14px;
    border: 5px solid #474f53;
    transition: border-color .2s linear
}

.timeline .timeline-body {
    margin-left: 26%;
    // margin-right: 17%;
    background: #ebebeb;
    position: relative;
    padding: 20px 25px;
    border-radius: 6px
}

.timeline .timeline-body:before {
    content: '';
    display: block;
    position: absolute;
    border: 10px solid transparent;
    border-right-color: #60676a;
    left: -20px;
    top: 20px
}

.timeline .timeline-body>div+div {
    margin-top: 15px
}

.timeline .timeline-body>div+div:last-child {
    margin-bottom: -20px;
    padding-bottom: 20px;
    border-radius: 0 0 6px 6px
}

.timeline-header {
    padding-bottom: 28px;
    border-bottom: 1px solid #e2e7eb;
    line-height: 30px
}

.timeline-header .userimage {
    float: left;
    width: 50px;
    height: 50px;
    border-radius: 40px;
    overflow: hidden;
    margin: -2px 10px -2px 0
}

.timeline-header .username {
    font-size: 16px;
    font-weight: 600
}

.timeline-header .username,
.timeline-header .username a {
    color: #2d353c
}

.timeline img {
    max-width: 100%;
    display: block
}

.timeline-content {
    letter-spacing: .25px;
    line-height: 18px;
    font-size: 13px
}

.timeline-content:after,
.timeline-content:before {
    content: '';
    display: table;
    clear: both
}

.timeline-title {
    margin-top: 0
}

.timeline-footer {
    background: #ebebeb;
    border-top: 1px solid #e2e7ec;
    padding-top: 15px;
    .p-avatar.p-avatar-image{
      background-color: #4f585e;
    }
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

.timeline-likes {
    color: #6d767f;
    font-weight: 600;
    font-size: 12px
}

.timeline-likes .stats-right {
    float: right
}

.timeline-likes .stats-total {
    display: inline-block;
    line-height: 20px
}

.timeline-likes .stats-icon {
    float: left;
    margin-right: 5px;
    font-size: 9px
}

.timeline-likes .stats-icon+.stats-icon {
    margin-left: -2px
}

.timeline-likes .stats-text {
    line-height: 20px
}

.timeline-likes .stats-text+.stats-text {
    margin-left: 15px
}

.timeline-comment-box {
    background: #f2f3f4;
    margin-left: -25px;
    margin-right: -25px;
    padding: 5px 25px
}

.timeline-comment-box .user {
    float: left;
    // width: 34px;
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 30px
}
// .timeline-comment-box .input {
//     float: left;
//     // width: 34px;
//     width: 60px;
//     height: 60px;
// }

.timeline-comment-box .user img {
    max-width: 100%;
    max-height: 100%
}

.timeline-comment-box .user+.input {
    margin-left: 44px
}

.lead {
    margin-bottom: 20px;
    font-size: 21px;
    font-weight: 300;
    line-height: 1.4;
}

.text-danger, .text-red {
    color: #ff5b57!important;
}
.card {
    box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid rgba(0,0,0,.125);
    border-radius: .25rem;
}
@media screen and (max-width: 700px) {
    .comment-event-mobile{
      display: none;
    }
}
</style>
