<template>
  <div class="notify-list p-3 pl-7">
    <spinnerMe v-show="isLoadData" />
    <div v-intersection="clickLoadNotify" />
    <div
      v-if="isListNotify"
      v-view-intersection="initView"
    />
    <div
      v-for="(notify, index) in getListNotify"
      :key="index"
      class="d-flex border-bottom-1 pt-2 pb-2 border-300"
    >
      <div>
        <i
          v-if="['ADD_LIKE', 'ADD_LIKE_TIMELINE'].includes(notify.content_object.type_notify)"
          class="fa fa-heart text-6xl pr-3"
          aria-hidden="true"
          style="color:#575d63;"
        />
        <i
          v-if="notify.content_object.type_notify == 'SET_RAITING'"
          class="fa fa-edit text-6xl pr-3"
          aria-hidden="true"
          style="color:#575d63;"
        />
      </div>
      <div class="d-flex flex-column">
        <div>
          <AvatarGroup
            v-if="['ADD_LIKE', 'ADD_LIKE_TIMELINE'].includes(notify.content_object.type_notify)"
            class="mb-3"
            style="cursor:pointer;"
            @click="showUserLikes(notify.content_object.mylike.users, $event)"
          >
            <Avatar
              :image="notify.src_user.photo"
              size="large"
              shape="circle"
            />
            <Avatar
              :label="'+'+notify.content_object.mylike.likes"
              shape="circle"
              size="large"
              style="background-color:#4f585e; color: #ffffff"
            />
          </AvatarGroup>
          <div v-if="notify.content_object.type_notify == 'SET_RAITING'">
            <Rating
              v-model="notify.content_object.raiting.raiting"
              :cancel="false"
            />
            <small>Оценили {{ notify.content_object.raiting.users }} раз</small>
          </div>
        </div>
        <div class="notify-list-links pt-2">
          <router-link 
            v-if="notify.content_object.type_notify == 'ADD_LIKE'"
            class="m-r-15 text-inverse-lighter no-underline text-lg"
            :to="parseLink(notify.content_object.project.project_url)+'#'+notify.content_object.id_comment"
          >
            <i class="fa fa-share fa-fw fa-lg m-r-3" />Комментарий к {{ notify.content_object.project.project_title }}
          </router-link>
          <router-link 
            v-if="notify.content_object.type_notify == 'ADD_LIKE_TIMELINE'"
            class="m-r-15 text-inverse-lighter no-underline text-lg"
            :to="'/events?'+notify.content_object.time_line"
          >
            <i class="fa fa-share fa-fw fa-lg m-r-3" />На событие
          </router-link>
          <router-link
            v-if="notify.content_object.type_notify == 'SET_RAITING'"
            class="m-r-15 text-inverse-lighter no-underline text-lg"
            :to="parseLink(notify.content_object.project.project_url)"
          >
            <i class="fa fa-share fa-fw fa-lg m-r-3" /> {{ notify.content_object.project.project_title }}
          </router-link>
        </div>
      </div>
      <div class="pl-3">
        <small>{{ notify.created.date }} {{ notify.created.time }}</small>
      </div>
    </div>
    <showUsersLikeVue
      v-model:visible="visibleslotUsers"
      :users="allUsersLiks"
      :evnt="evnt"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import showUsersLikeVue from '@/components/UI/showUsersLike.vue'
export default {
  name: 'NotifyList',
  components: {
    showUsersLikeVue
  },
  props: {},
  data() {
    return {
        existData: false,
        isLoadData: false,
        listNotify: null,
        allUsersLiks: null,
        evnt: null,
        visibleslotUsers: false,
        funcIsView: null
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi,
      socketData: state => state.socketData,
      user: state => state.user,
      indexMenu: state => state.usersStore.indexMenu
    }),
    getListNotify () {
      if (!this.listNotify) return
      return this.listNotify.filter(item => { return item.content_object })
    },
    isListNotify () {
      if (!this.listNotify) return
      let ini = false
      this.listNotify.forEach(item => {
        if (item.content_object && !item.is_view) {
          ini = true
        }
      })
      return ini
    },
  },
  watch: {
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'get_notify_list':
            this.isLoadData = false
            this.listNotify = [...obj.data]
          break
          // case 'notify_observer':
          //   this.loadNotify()
          // break
        }
      },
      deep: true
    },
    indexMenu (val) {
      this.existData = false
    }
  },
  methods: {
    initView (entries) {
      if (entries[0].isIntersecting) {
        this.funcIsView = setTimeout(() => {
          this.$store.commit('setSendSocket',
                {
                  action: 'set_view_notify',
                  request_id: 'user_'+this.user.user.username
                }
          )
          this.$store.commit('usersStore/setNotifyOther', 0)
          clearTimeout(this.funcIsView)
        }, 500)
      } else if (this.funcIsView) {
        clearTimeout(this.funcIsView)
      }
    },
    showUserLikes (users, event) {
      this.allUsersLiks = users
      this.evnt = event
      this.visibleslotUsers = true
    },
    getListUsersLike (users) {
      let list = []
      for (const [index, user] of users.entries()) {
        if (index === 2) return list
        list.push(user)
      }
      return list
    },
    parseLink (link) {
      return link.replace('/api/bag', '')
    },
    clickLoadNotify () {
        if (this.existData) return
        this.loadNotify()
    },
    loadNotify () {
        this.isLoadData = true
        this.existData = true
        this.$store.commit('setSendSocket',
        {
          action: 'get_notify_list',
          request_id: 'user_'+this.user.user.username,
        }
      )
    }
  },
}
</script>
<style lang="scss">
.notify-list{
    .notify-list-links a:not(.btn) {
    color: #575d63
    }

    .notify-list-links a:not(.btn):focus,
    .notify-list-links a:not(.btn):hover {
        color: #2d353c
    }
}
</style>