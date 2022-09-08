<template>
  <TabView
    class="tabview-custom-message"
    :active-index="indexMenu"
  >
    <TabPanel>
      <template #header>
        <i class="pi pi-users" />
        <span class="ms-1">Список</span>
      </template>
      <div
        v-intersection="getListRoom"
      />
      <listMessageViewVue
        v-model="sortedRooms"
        v-model:index-menu="indexMenu"
        :requestid="requestId"
      />
      <spinnerMe v-if="isNowLoad" />
    </TabPanel>
    <TabPanel>
      <template #header>
        <i class="pi pi-user" />
        <span class="ms-1">Чат</span>
      </template>
      <ChatMessageVue
        v-model="room"
        v-model:index-menu="indexMenu"
        :requestid="requestId"
      />
    </TabPanel>
    <TabPanel>
      <Toast
        position="center"
        group="group-messages"
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
    </TabPanel>
  </TabView>
</template>
<script>
import listMessageViewVue from './listMessageView.vue'
import ChatMessageVue from './chatMessageView.vue'
import { mapState } from 'vuex'
export default {
  name: 'MyMsgView',
  components: {
    listMessageViewVue,
    ChatMessageVue
  },
  props: {},
  data () {
    return {
      isLoadChats: false,
      indexMenu: 0,
      rooms: [],
      room: null,
      isNowLoad: false,
      existData: false
    }
  },
  computed: {
    ...mapState({
      hostws: state => state.hostws,
      user: state => state.user,
      socketData: state => state.socketData,
      notifyMsg: state => state.usersStore.notifyMsg,
      tabMenu: state => state.usersStore.indexMenu
    }),
    requestId () {
      return `user-${this.user.user.id}`
    },
    sortedRooms () {
      if (!this.rooms) return 
      const newArr = this.rooms.slice(0).sort((item1, item2) => {
        return (item1.last_message.id < item2.last_message.id) ? 1 : -1
      })
      return newArr
    }
  },
  watch: {
    tabMenu (val) {
      this.existData = false
    },
    socketData: {
      handler (obj) {
          switch (obj.action) {
          case 'get_list_room':
            this.rooms = obj.data
            this.isNowLoad = false
            break
          case 'get_room_message':
            this.$store.commit('setIsLoad', false)
            this.room = obj.data
            break
          case 'created_message':
            this.newMessage(obj.data)
            break
          case 'deleted_message':
            this.$store.commit('setIsLoad', false)
            this.clearDeletedMsg(obj.data)
            break
          case 'user_state':
            this.changeStateUser(obj.data)
            break
          case 'viewed_msg':
            this.setViewMsg(obj.viewed_msg)
            break
          case 'delete_all_messages':
            this.$store.commit('setIsLoad', false)
            this.deleteAllMessagesChat(obj.data)
            break
          case 'delete_one_message':
            this.deleteOneMessage(obj.data.msg_id,
                                obj.data.room_id)
            break
          case 'edited_message':
            this.editedMessage(obj.data.msg_id,
                                obj.data.room_id,
                                obj.data.text)
            break
          case 'leave_from_room':
            this.notifyLeaveFromRoom(obj.data.room_id)
            break
        }
      },
      deep: true
    },
    indexMenu (val) {
      if (val == 0) {
        this.room = null
      }
    },
    'room.id': function(id) {
      if (!id) return false
      this.rooms.forEach((room, index, array) => {
        if (room.id === id) {
          if (room.last_message.user.username !== this.user.user.username) {
            room.last_message.is_view = true
          }
        }
      })
    },
    rooms: {
      handler (rooms) {
        if (!rooms.length) return
        let countNotify = 0
        rooms.forEach((room, index, array) => {
          if (room.last_message.user.username && this.user.user.id !== room.last_message.user.id) {
              if (!room.last_message.is_view) countNotify += 1
          }
        })
        this.$store.commit('usersStore/setNotifyMsg', countNotify)
      },
      deep: true
    }
  },
  mounted () {
  },
  unmounted () {
  },
  methods: {
    notifyLeaveFromRoom (room_id) {
      this.$store.commit('setSendSocket',
          {
            action: 'get_list_room',
            request_id: this.requestId
          }
      )
      if (!this.room) return false
      if (this.room.id !== room_id) return false
      this.$store.commit('setSendSocket',
          {
            request_id: this.requestId,
            action: 'get_room_message',
            name_room: this.room.name
          }
      )
    },
    editedMessage (msg_id, room_id, text) {
      this.$store.commit('setSendSocket',
          {
            action: 'get_list_room',
            request_id: this.requestId
          }
      )
      if (!this.room) return false
      if (this.room.id !== room_id) return false
      this.room.messages.reduceRight((_, item, index, arr) => {
        if (item.id === msg_id) {
          item.text = text
        }
      }, null)
    },
    deleteAllMessagesChat (data) {
      if (this.room) {
        if (this.room.id !== data.room_id) return false
        this.room.messages = this.room.messages.filter(item => { return item.user.id != data.user_id })
      }
      this.$store.commit('setSendSocket',
          {
            action: 'get_list_room',
            request_id: this.requestId
          }
      )
    },
    setViewMsg (viewedMsg) {
      if (!this.rooms.length) return
      this.rooms.forEach((room, index, array) => {
        if (room.id === viewedMsg.id_room) {
          if (room.last_message.id === viewedMsg.id_msg) {
            room.last_message.is_view = true
          }
        }
      })
      if (!this.room) return
      this.room.messages.reduceRight((_, message) => {
        if (message.id === viewedMsg.id_msg) {
          message.is_view = true
          return
        }
      }, null)
    },
    changeStateUser (user_state) {
      if (!this.rooms.length) return
      this.rooms.forEach((room, index, array) => {
        if (room.user_online) {
          if (user_state.user === room.user_online.user) {
            room.user_online = user_state
          }
        }
      })
      if (this.room?.user_online) {
        if (this.room.user_online.user ===  user_state.user) {
          this.room.user_online = user_state
        }
      }
    },
    onReject () {
      this.$toast.removeGroup('group-messages')
    },
    YesMethod (e) {
      this.$toast.removeGroup('group-messages')
      switch (e.flag) {
        case 'delete-all-message':
          this.$store.commit('setIsLoad', true)
          this.deleteAllMessages()
          setTimeout(() => {
            this.getListRoom()
          }, 500)
          break
        case 'leave-delete-group':
          this.indexMenu = 0
          this.leaveChatAndDelMsg()
          this.removeChatFromList()
          break
        case 'leave-group-message':
          this.indexMenu = 0
          this.leaveChat()
          this.removeChatFromList()
          break
        case 'delete-message':
          this.sendDeleteOneMessage(e.idMsg, e.nameRoom)
          break
      }
    },
    deleteOneMessage (msg_id, room_id) {
      this.$store.commit('setSendSocket',
          {
            action: 'get_list_room',
            request_id: this.requestId
          }
      )
      if (!this.room) return false
      if (this.room.id !== room_id) return false
      this.room.messages = this.room.messages.filter(item => item.id !== msg_id)
    },
    sendDeleteOneMessage (idMsg, nameRoom) {
      this.$store.commit('setSendSocket',
          {
            action: 'delete_one_message',
            msg_id: idMsg,
            room_name: nameRoom,
            request_id: this.requestId,
          }
      )
    },
    deleteAllMessages () {
      this.$store.commit('setSendSocket',
          {
            action: 'delete_messages',
            request_id: this.requestId,
            name_room: this.room.name
          }
      )
    },
    leaveChat () {
      this.$store.commit('setSendSocket',
          {
            action: 'leave_from_room',
            request_id: this.requestId,
            name_room: this.room.name
          }
      )
    },
    removeChatFromList () {
      this.rooms.forEach((room, index, array) => {
        if (room.id === this.room.id) {
          this.rooms.splice(index, 1)
        }
      })
      this.room = null
    },
    leaveChatAndDelMsg () {
      this.$store.commit('setSendSocket',
          {
            action: 'leave_from_room',
            request_id: this.requestId,
            is_delete_msg: true,
            name_room: this.room.name
          }
      )
    },
    newMessage(data) {
      let insert = 0
      this.rooms.forEach((room, index, array) => {
        if (room.id === data.room.id) {
          if (room.last_message.id !== data.id) {
            insert += 1
            room.last_message = data
          }
        }
      })
      if (!insert) {
        this.getListRoom()
      }
      if (!this.room) return false
      if (this.room.id !== data.room.id) return false
      if (!this.room.messages.length) {
        this.room.messages.push(data)
        return
      }
      if (data.id !== this.room.messages.slice(-1)[0].id) {
        this.room.messages.push(data)
      }
    },
    getListRoom () {
      if (this.existData) return
      this.isNowLoad = true
      this.existData = true
      this.$store.commit('setSendSocket',
          {
            action: 'get_list_room',
            request_id: this.requestId
          }
      )
    },
    clearDeletedMsg (data) {
      if (!this.room) return false
      if (this.room.id !== data.room.id) return false
      this.room.messages.forEach((message, index, array) => {
        if (data.id === message.id) this.room.messages.splice(index, 1)
      })
    }
  }
}
</script>
<style lang="scss">
.tabview-custom-message{
  .p-tabview-nav{
    display: none;
  }
}
</style>
