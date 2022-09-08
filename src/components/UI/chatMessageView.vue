<template>
  <div class="chat-message">
    <Panel :collapsed="true">
      <template #header>
        <div class="d-flex align-items-center">
          <Button
            icon="pi pi-angle-left"
            class="p-button-rounded p-button-secondary p-button-text"
            @click="backToListChat"
          />
          <div class="list-message-item-image-chat relative">
            <Avatar
              :image="getUser(modelValue)?.photo"
              class="mr-2 img-thumbnail"
              size="large"
              shape="circle"
            />
            <Badge
              v-if="modelValue?.user_online?.is_state"
              severity="success"
              class="m-0 absolute chat"
            />
          </div>
          <span class="font-medium text-black-alpha-60">{{ getUser(modelValue)?.full_name }}</span>
        </div>
      </template>
      <template #icons>
        <button
          class="p-panel-header-icon p-link mr-2"
          @click="toggle"
        >
          <span class="pi pi-list text-xl" />
        </button>
        <Menu
          ref="listMenu"
          :model="getMenu"
          :popup="true"
        />
      </template>
    </Panel>
    <ScrollPanel
      id="windowChats"
      ref="contentChats1"
      style="width: 100%; height:600px"
      class="bg-white"
    >
      <div
        id="contentChats"
        ref="contentChats"
      >
        <transition-group name="animcommentlist">
          <OneMessageChat
            v-for="message in getMessages"
            :key="message.id"
            :message="message"
            :requestid="requestid"
            :my-message="message.user.username == user.username"
            @edit-message="val => editMsg=val"
            @edit-flag="val => flagEdit=val"
            @is-replay="val => isReplay=val"
            @replay-msg="val => replayMsg=val"
          />
        </transition-group>
      </div>
    </ScrollPanel>
    <div
      v-if="isReplay"
      class="chat-message-replay border-1 border-300 border-bottom-0 max-h-7rem overflow-hidden"
    >
      <div class="chat-message-replay-head d-flex flex-wrap align-items-center">
        <div class="font-medium pr-3 text-700 ml-3">
          <i
            class="fa fa-reply rotate-180"
            aria-hidden="true"
          /> {{ replayMsg.user.full_name }}
        </div>
        <div class="mr-5 text-xs text-color-secondary">
          {{ replayMsg.created.date }} {{ replayMsg.created.time }}
        </div>
      </div>
      <div class="chat-message-replay-body d-flex justify-content-between">
        <v-md-preview
          class="w-20 pt-1 pb-1 text-truncate"
          :text="replayMsg.text"
        />
        <div class="pr-5">
          <i
            class="fa fa-close transition-colors transition-duration-300 hover:text-orange-600 cursor-pointer text-lg"
            aria-hidden="true"
            @click="isReplay = !isReplay"
          />
        </div>
      </div>
    </div>
    <div class="chat-message-editor">
      <v-md-editor
        v-model="fullText"
        height="200px"
        :left-toolbar="getToolbar"
        right-toolbar="preview"
      />
    </div>
    <div class="chat-message-submit p-2 d-flex justify-content-end pr-0">
      <Button
        :label="flagEdit ? 'Сохранить' : isReplay ? 'Ответить' : 'Отправить'"
        class="p-button-outlined p-ripple"
        :icon="flagEdit ? 'fa fa-floppy-o' : isReplay ? 'fa fa-reply rotate-180' : 'pi pi-send'"
        @click="sendMessage"
      />
    </div>
  </div>
</template>
<script>
import OneMessageChat from './oneMessageChat.vue'
import { ref } from "vue"
export default {
  name: 'ChatMsg',
  components: {
    OneMessageChat
  },
  props: {
    requestid: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Object,
      default: undefined
    },
    indexMenu: {
      type: Number,
      default: 0
    },
  },
  emits: ['update:indexMenu'],
  data () {
    return {
      user: this.$store.state.user.user,
      replayMsg: null,
      isReplay: false,
      flagEdit: false,
      editMsg: null,
      fullText: '',
      isExtdAction: false,
      menuMyAction: {
        label: 'Действия',
        items: [
          {
            label: 'Удалить все сообщения',
            icon: 'pi pi-trash',
            command: () => { this.deleteAllMessages() }
          }
        ]
      },
      menuAction: {
        label: 'Действия',
        items: [
          {
            label: 'Покинуть чат',
            icon: 'pi pi-sign-out',
            command: () => { this.leaveChat() }
          },
          {
            label: 'Удалить все сообщения',
            icon: 'pi pi-trash',
            command: () => { this.deleteAllMessages() }
          },
          {
            label: 'Удалить сообщения и покинуть чат',
            icon: 'fa fa-exclamation-circle',
            command: () => { this.leaveChatAndDelMsg() }
          }
        ]
      },
      listMenu: [
        {
          label: 'Настройки редактора',
          items: [
            {
              label: 'Базовый редактор',
              icon: 'pi pi-id-card',
              command: () => { this.isExtdAction = false }
            },
            {
              label: 'Расширенный редактор',
              icon: 'pi pi-id-card',
              command: () => { this.isExtdAction = true }
            }
          ]
        },
        {
          label: 'Перейти',
          items: [
            {
              label: 'Анкета пользователя',
              icon: 'pi pi-id-card',
              command: () => { this.$router.push('/card/user/' + this.getUser(this.modelValue)?.username) }
            }
          ]
        }
      ]
    }
  },
  computed: {
    getToolbar () {
      let myToolAction = ''
      if (this.isExtdAction) {
        myToolAction = 'h bold italic strikethrough quote | ul ol table hr | link image code | emoji'
      } else {
        myToolAction = 'emoji'
      }
      return myToolAction
    },
    getMessages () {
      let messages = []
      if (this.modelValue) {
        messages = this.modelValue.messages
      }
      return messages
    },
    getMenu () {
      if (!this.modelValue) return []
      let newlistMenu = []
      if (this.modelValue.name == `room-user-${this.user.id}`) {
        newlistMenu = this.listMenu.slice(0)
        newlistMenu.push(this.menuMyAction)
      } else { 
        newlistMenu = this.listMenu.slice(0)
        newlistMenu.push(this.menuAction)
      }
      return newlistMenu
    }
  },
  watch: {
    flagEdit (val) {
      this.fullText = ''
      if  (!val) return
      this.isReplay = false
      this.fullText = this.editMsg.text
    },
    isReplay (val) {
      if  (!val) return
      this.fullText = ''
      this.flagEdit = false
    }
  },
  mounted() {},
  updated () {
    let el = this.$refs.contentChats
    if (el.scrollHeight) {
      el.parentNode.scrollTop = el.scrollHeight
      setTimeout(() => {
        el.parentNode.scrollTop = el.scrollHeight
      }, 1000)
    }
  },
  methods: {
    deleteAllMessages () {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить все сообщения?',
        group: 'group-messages',
        flag: 'delete-all-message',
        nameRoom: this.modelValue.name
      })
    },
    leaveChat () {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите выйти из чата?',
        group: 'group-messages',
        flag: 'leave-group-message',
        nameRoom: this.modelValue.name
      })
    },
    leaveChatAndDelMsg () {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить все сообщения и выйти из чата?',
        group: 'group-messages',
        flag: 'leave-delete-group',
        nameRoom: this.modelValue.name
      })
    },
    sendMessage () {
      if (!this.fullText) return false
      if (this.flagEdit) {
        this.$store.commit('setSendSocket',
            {
              action: 'edit_my_message',
              request_id: this.requestid,
              room_name: this.editMsg.room.name,
              text: this.fullText,
              msg_id: this.editMsg.id
            }
        )
        this.flagEdit = false
        
      } else if (this.isReplay) {
        this.$store.commit('setSendSocket',
            {
              action: 'being_message',
              request_id: this.requestid,
              name_room: this.modelValue.name,
              text: this.fullText,
              parent: this.replayMsg.id
            }
        )
        this.isReplay = false
      } else {
        this.$store.commit('setSendSocket',
            {
              action: 'being_message',
              request_id: this.requestid,
              name_room: this.modelValue.name,
              text: this.fullText,
              to_username: this.getUser(this.modelValue).username
            }
        )
      }
      this.fullText = ''
    },
    backToListChat () {
      this.$emit('update:indexMenu', 0)
    },
    getUser (room) {
      let user = null
      if (!room) return false
      if (room.users.length === 1) {
        user = room.users[0]
      }
      if (room.users.length === 2) {
        const newList = room.users.filter(item => item.username !== this.user.username)
        user = newList[0]
      }
      return user
    },
    toggle (event) {
      this.$refs.listMenu.toggle(event)
    }
  }
}
</script>
<style lang="scss">
.p-menu.p-menu-overlay{
  z-index: 1030 !important;
}
.chat-message {
  .chat-message-replay-body{
    .github-markdown-body{
      padding-top: 5px;
      padding-bottom: 5px;
    }
    p{
      padding: 0;
      width: 15rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .v-md-editor__toolbar{
        border-top: 1px solid #ddd;
  }
  .p-scrollpanel-bar-y{
  }
  .p-panel-header{
    padding: .6rem;
    border-radius: 0;
  }
  .p-avatar{
    img{
      border: 1px solid #e67e22;
    }
  }
  .v-md-editor{
    box-shadow: none;
    border-radius: 0;
    border-top: 0;
    border-left: 1px solid var(--surface-300);
    border-right: 1px solid var(--surface-300);
    border-bottom: 1px solid var(--surface-300);
  }
    p {
        padding: .5rem;
        line-height: 1.5;
        margin: 0;
    }
        .p-scrollpanel-wrapper {
            border-right: 9px solid var(--surface-200);
            border-left: 1px solid var(--surface-300);
        }

        .p-scrollpanel-bar {
            // background-color: var(--surface-ground);
            border-radius: 0;
            opacity: 1;
            background-color: #dbd9d9;
        }
}
.list-message-item-image-chat{
  .chat{
    left: 32px;
    top: 34px;
    min-width: 13px !important;
    height: 13px;
  }
}
</style>
