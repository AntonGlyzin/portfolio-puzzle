<template>
  <div
    class="comment-cloud d-flex w-100 mt-2 mb-2 position-relative"
    :class="myMessage ? 'justify-content-end' : 'justify-content-start'"
  >
    <a
      :id="'msg'+message.id"
      :name="'msg'+message.id"
    />
    <div
      v-if="!myMessage"
      class="comment-cloud-img p-2"
    >
      <Avatar
        :image="message.user.photo"
        class="mr-2"
        size="large"
        shape="circle"
      />
    </div>
    <div
      class="comment-cloud-text surface-200 border-round-3xl"
    >
      <div
        v-if="!myMessage"
        class="comment-cloud-text-ugolleft"
      />
      <div
        v-if="!myMessage"
        class="comment-cloud-text-head d-flex justify-content-start p-2 align-items-md-baseline"
      >
        <div class="font-medium pr-3 text-700">
          {{ message.user.full_name }}
        </div>
        <div v-view-intersection="initView" />
        <div class="mr-5 text-xs text-color-secondary">
          {{ message.created.date }} {{ message.created.time }}
        </div>
      </div>
      <div
        v-if="myMessage"
        class="comment-cloud-text-head d-flex justify-content-end p-2 align-items-md-baseline pl-3"
      >
        <div class="mr-5 text-xs text-color-secondary">
          {{ message.created.date }} {{ message.created.time }}
        </div>
        <div class="font-medium pr-3 text-700">
          {{ message.user.full_name }}
        </div>
      </div>
      <SpeedDial
        v-if="myMessage"
        :model="menuMsg"
        direction="right"
        :transition-delay="80"
        show-icon="pi pi-bars"
        hide-icon="pi pi-times"
        button-class="p-button-outlined"
        class="ml-4"
      />
      <div
        v-if="message.parent"
        class="content-parent pl-3 surface-300 mt-6"
      >
        <div class="d-flex justify-content-start p-2 align-items-md-baseline">
          <div class="font-medium pr-3 text-700">
            <i
              class="fa fa-link transition-colors transition-duration-300 hover:text-orange-600 cursor-pointer rotate-180"
              aria-hidden="true"
              @click="goToMessage"
            />
            {{ message.parent.user.full_name }}
          </div>
          <div class="mr-5 text-xs text-color-secondary">
            {{ message.parent.created.date }} {{ message.parent.created.time }}
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <v-md-preview
            class="w-20 pt-1 pb-1 text-truncate"
            :text="message.parent.text"
          />
        </div>
      </div>
      <div
        class="pr-4 pl-4 d-flex  justify-content-between"
        :class="myMessage ? 'flex-row-reverse' : ''"
      >
        <v-md-preview
          :text="message.text"
        />
      </div>
      <div
        v-if="!myMessage"
        class="d-flex p-3 d-flex justify-content-start text-color-secondary"
      >
        <i
          class="fa fa-reply rotate-180 ml-3 transition-colors transition-duration-300 hover:text-orange-600 cursor-pointer"
          aria-hidden="true"
          @click="replayMessage"
        />
      </div>
      <div
        v-if="myMessage"
        class="d-flex p-3 d-flex justify-content-end"
      >
        <i
          v-if="message.is_view"
          class="fa fa-eye text-color-secondary"
          aria-hidden="true"
        />
      </div>
      <div
        v-if="myMessage"
        class="comment-cloud-text-ugolright"
      />
    </div>
    <div
      v-if="myMessage"
      class="comment-cloud-img p-2"
    >
      <Avatar
        :image="message.user.photo"
        class="mr-2"
        size="large"
        shape="circle"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'OneMessageChat',
  components: {
  },
  props: {
    posHeight: {
      type: Number,
      default: 0
    },
    message: {
      type: Object,
      default: undefined
    },
    myMessage: [Boolean],
    requestid: {
      type: String,
      default: ''
    }
  },
  emits: ['editMessage', 'editFlag', 'replayMsg', 'isReplay'],
  data () {
    return {
      user: this.$store.state.user.user,
      isViewMess: false,
      posTop: 0,
      menuMsg: [
        {
          label: 'Редактировать',
          icon: 'pi pi-pencil',
          command: () => {
              this.editMessage()
          }
        },
        {
          label: 'Ответить',
          icon: 'fa fa-reply rotate-180',
          command: () => {
              this.replayMessage()
          }
        },
        {
          label: 'Отмена',
          icon: 'pi pi-times',
          command: () => {
              this.cancelAction()
          }
        },
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          command: () => {
              this.deleteMessage()
          }
        }
      ]
    }
  },
  mounted() {
    this.posTop = this.$el.offsetTop
  },
  methods: {
    goToMessage () {
    },
    cancelAction () {
      this.$emit('editFlag', false)
      this.$emit('isReplay', false)
    },
    replayMessage () {
      this.$emit('replayMsg', this.message)
      this.$emit('isReplay', true)
    },
    editMessage () {
      this.$emit('editMessage', this.message)
      this.$emit('editFlag', true)
    },
    deleteMessage () {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить это сообщение?',
        group: 'group-messages',
        flag: 'delete-message',
        idMsg: this.message.id,
        nameRoom: this.message.room.name
      })
    },
    initView (entries) {
      if (this.message.is_view) return false
      if (this.isViewMess) return false
      if (entries[0].isIntersecting) {
        this.messageView = setTimeout(() => {
          this.isViewMess = true
          this.$store.commit('setSendSocket',
            {
              action: 'set_view_message',
              id_msg: this.message.id,
              request_id: this.requestid
            }
          )
        }, 100)
      } else if (this.messageView) {
        clearTimeout(this.messageView)
      }
    }
  },
}
</script>
<style lang="scss">
.comment-cloud-text-ugolleft{
  border: 20px solid transparent;
  border-right: 20px solid #eeeeee;
  position: absolute;
  left: 39px;
  top: 10px;
}
.comment-cloud-text{
  .p-button.p-button-outlined{
    border: none;
  }
  .p-button.p-button-outlined:enabled:hover {
    border: none;
  }
  .p-button:focus {
    box-shadow: none;
  }
}
.comment-cloud-text-ugolright{
  border: 20px solid transparent;
  border-left: 20px solid #eeeeee;
  position: absolute;
  top: 10px;
  right: 44px;
}
.comment-cloud{
  .github-markdown-body{
    padding: 0;
  }
  .p-speeddial-button.p-button.p-button-icon-only {
    width: 3rem;
    height: 3rem;
  }
  .p-button.p-button-outlined {
    color: #70777a;
  }
  .p-speeddial-action {
    background: #7a7a79;
  }
  .p-speeddial-action:hover{
    background: #485156;
  }
}
</style>
