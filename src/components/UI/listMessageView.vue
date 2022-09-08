<template>
  <div class="list-message d-flex flex-column p-2 pl-4">
    <transition-group name="animmessagelist">
      <div
        v-for="item in $attrs.modelValue"
        :key="item.id"
        v-ripple
        class="list-message-item d-flex transition-all
                    transition-duration-200 hover:surface-200 p-2
                    cursor-pointer border-black-alpha-10 border-bottom-1 p-ripple"
        @click="GoToChat(item)"
      >
        <div class="list-message-item-image relative">
          <Avatar
            :image="getUser(item.users).photo"
            class="mr-2 img-thumbnail"
            size="xlarge"
            shape="circle"
          />
          <Badge
            v-if="item.user_online?.is_state"
            severity="success"
            class="m-0 absolute"
          />
        </div>
        <div class="list-message-item-text d-flex flex-column">
          <div class="list-message-item-text-name d-flex flex-column">
            <span class="font-medium">{{ getUser(item.users).full_name }}</span>
            <span class="text-xs text-color-secondary pl-2">
              {{ getTextDate(item.user_online) }}</span>
          </div>
          <div
            v-if="isMyMessage(item)"
            style="max-width: 200px;"
            class="list-message-item-text-body d-block text-truncate p-2 "
            :class="isViewMess(item.last_message)"
          >
            <span>Вы: {{ item.last_message.text }}</span>
          </div>
          <div
            v-if="!isMyMessage(item)"
            style="max-width: 200px;"
            class="list-message-item-text-body d-block text-truncate p-2"
          >
            <span>{{ item.last_message.text }}</span>
            <Badge
              v-if="isNotRead(item)"
              value=""
            />
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
export default {
  name: 'ListMsg',
  components: {
  },
  props: {
    requestid: {
      type: String,
      default: ''
    },
    indexMenu: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:indexMenu'],
  data () {
    return {
      username: this.$cookies.get('username')
    }
  },
  computed: {},
  methods: {
    getTextDate (user_online) {
      if (!user_online) return ''
      const date = user_online.last_visit.date + ' ' + user_online.last_visit.time
      if (!user_online.is_state) return 'Был(а) ' + date
      if (user_online.is_state) return 'Сейчас на сайте'
    },
    GoToChat (item) {
      this.$store.commit('setIsLoad', true)
      this.$store.commit('setSendSocket',
          {
            request_id: this.requestid,
            action: 'get_room_message',
            name_room: item.name,
            get: true
          }
      )
      this.$emit('update:indexMenu', 1)
    },
    isNotRead (item) {
      if (item.last_message.user.username == '') return false
      if (item.users.length > 1) {
        if (item.last_message.is_view) return false
        else return true
      }
      return false
    },
    isViewMess (lastMessage) {
      if (lastMessage.user.username == '') return ''
      if (!lastMessage.is_view) return 'surface-300'
      else return ''
    },
    getUser (listUser) {
      if (listUser.length === 1) return listUser[0]
      if (listUser.length === 2) {
        const newList = listUser.filter(item => item.username !== this.username)
        return newList[0]
      }
    },
    isMyMessage (msg) {
      if (msg.last_message.user.username == '') return false
      if (msg.users.length === 2) {
        if (msg.last_message.user.username === this.username) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style lang="scss">
.animmessagelist-enter-active,
.animmessagelist-leave-active {
  transition: all 500ms ease;
}

.animmessagelist-leave-to{
  opacity: 0;
  transform: translateX(30px);
}
.animmessagelist-enter-from{
  opacity: 0;
  transform: translateX(30px);
}
.list-message-item-image{
  .p-badge.p-badge-success{
    left: 46px;
    top: 44px;
    min-width: 13px !important;
    height: 13px;
  }
}
</style>
