<template>
  <div />
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'InitStart',
  components: {},
  props: {},
  data () {
    return {
      socket: null
    }
  },
  computed: {
    ...mapState({
      socketData: state => state.socketData,
      sendSocket: state => state.sendSocket,
      notifyMsg: state => state.usersStore.notifyMsg,
      notifyOther: state => state.usersStore.notifyOther,
      notifyComment: state => state.usersStore.notifyComment,
      user: state => state.user
    })
  },
  watch: {
    sendSocket: {
      handler (obj) {
        if (obj.action) {
          this.socket.send(JSON.stringify(obj))
        }
      },
      deep: true
    },
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'created_message':
            this.addNotifyMsg(obj.data)
            break
          case 'notify_observer':
            this.addNotifyOther(obj)
            break
          case 'get_notify_list':
            const newMass = obj.data.filter(item => { return !item.is_view })
            this.$store.commit('usersStore/setNotifyOther', newMass.length)
          break
          case 'get_notify_comment_count':
            this.$store.commit('usersStore/setNotifyComment', obj.data.not_read_comment)
          break
        }
      },
      deep: true
    }
  },
  mounted () {
    const csrftoken = this.$cookies.get('csrftoken')
    if (csrftoken) {
      this.$http.defaults.headers.common['X-CSRFToken'] = csrftoken
    } else {
      const host = this.$store.state.hostme
      this.$http.get(host + '/api/getprotect/').then(res => {
        this.$cookies.set('csrftoken', res.data.token, { expires: 365 })
        this.$http.defaults.headers.common['X-CSRFToken'] = res.data.token
      })
    }
    this.$http.defaults.headers.post['Content-Type'] = 'application/json'
    this.hostapi = this.$store.state.hostmeapi
    const usertoken = this.$cookies.get('usertoken')
    if (usertoken) {
      this.$http.defaults.headers.Authorization = `Bearer ${usertoken}`
      this.$store.commit('setIsLoad', true)
      this.$http.get(`${this.hostapi}/detail/user`)
        .then(res => {
          this.$store.commit('setUser', res.data)
          this.setConnection()
        }).catch(res => {
          if (res?.response?.status === 401) {
            this.$cookies.remove('usertoken')
            window.location.reload()
          }
          if (res?.response?.status === 403) {
            this.$cookies.remove('usertoken')
            window.location.reload()
          }
        }).then(() => { this.$store.commit('setIsLoad', false) })
    }
  },
  methods: {
    setConnection () {
      const options = { debug: true,  }
      const token = this.$cookies.get('usertoken')
      this.socket = new this.$ReconnectingWebSocket(this.$store.state.hostws + `/chat/sync/?token=${token}`, null, options)
      // this.socket = new this.$ReconnectingWebSocket(this.$store.state.hostws + '/chat/sync/', null)
      this.socket.onmessage = message => {
        const data = JSON.parse(message.data)
        if (data.error === 401) {
          this.socket.close()
          return
        }
        if (data.request_id) {
          this.$store.commit('usersStore/setNotifyOther', data.data.not_read_notify)
          this.$store.commit('usersStore/setNotifyMsg', data.data.not_read_msg)
          this.$store.commit('usersStore/setRequestID', data.request_id)
          this.$store.commit('usersStore/setNotifyComment', data.data.not_read_comment)
          this.$store.commit('setSocketData', { data: data.request_id, action: 'connect' })
        }
        if (data.action) {
          this.$store.commit('setSocketData', data)
        }
      }
    },
    addNotifyMsg (data) {
      if (this.user.user.id != data.user.id) {
        this.$store.commit('usersStore/setNotifyMsg', this.notifyMsg + 1)
      }
    },
    addNotifyOther (data) {
      switch (data.type_notify) {
        case 'SET_RAITING':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_list',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'NEW_COMMENT':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_comment_count',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'DEL_COMMENT':
          if (!this.notifyComment) break
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_comment_count',
              request_id: 'user_'+this.user.user.username
            }
          )
          // this.$store.commit('usersStore/setNotifyComment', this.notifyComment - 1)
          break
        case 'ADD_LIKE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_list',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'DEL_LIKE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_list',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'ADD_LIKE_TIMELINE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_list',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'DEL_LIKE_TIMELINE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_list',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'NEW_COMMENT_TIMELINE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_comment_count',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
        case 'DEL_COMMENT_TIMELINE':
          this.$store.commit('setSendSocket',
            {
              action: 'get_notify_comment_count',
              request_id: 'user_'+this.user.user.username
            }
          )
          break
      }
    }
  },
}
</script>
<style lang="scss">
.p-toast .p-toast-message{
  border-radius: 1px !important;
}

</style>
