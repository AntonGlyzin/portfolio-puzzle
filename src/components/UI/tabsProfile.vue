<template>
  <div
    class="card p-3"
    style="width:100%; border: none;"
  >
    <h5>Профиль пользователя</h5>
    <TabView
      ref="tabview4"
      class="tabview-custom"
      :active-index="indexMenu"
      @update:active-index="v => { $store.commit('usersStore/setIndexMenu', v) }"
    >
      <TabPanel>
        <template #header>
          <i class="pi pi-user-edit" />
          <span class="ms-1 my-text-tabs">Редактор</span>
        </template>
        <userProfileVue />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="fa fa-commenting-o" />
          <span class="ms-1 my-text-tabs">Сообщения</span>
          <Badge
            v-if="notifyMsg"
            :value="notifyMsg"
          />
        </template>
        <messageViewVue />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i class="pi pi-comments" />
          <span class="ms-1 my-text-tabs">Комментарии</span>
          <Badge
            v-if="notifyComment"
            :value="notifyComment"
          />
        </template>
        <div class="pl-4">
          <CustomCommentVue
            :item-comm-style="'max-width:100%'"
            :get-response="true"
            :comments="comments"
            @responseComm="responseComment"
          />
        </div>
        
        <div
          v-intersection="onLoadNext"
          class="PortfolioList-btn"
        />
        <spinnerMe v-show="isLoadComment" />
        <btnCustomVue
          v-if="isNextComment"
          style="height: 44px;
          margin: 0 auto;"
          class="btn-me-registr mt-5"
          :my-class="'say'"
          :msg-btn="'Загрузить'"
          @click="onLoadNext"
        >
          <i
            class="fa fa-arrow-down"
            aria-hidden="true"
          />
        </btnCustomVue>
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="fa fa-pencil-square-o"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Статьи</span>
        </template>
        <tableArticle />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="pi pi-images"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Картинки</span>
        </template>
        <imgModule />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="fa fa-address-card-o"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Резюме</span>
        </template>
        <resumCardVue />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="fa fa-users"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Подписки</span>
        </template>
        <listFollowerVue />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="fa fa-bell-o"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Уведомления</span>
          <Badge
            v-if="notifyOther"
            :value="notifyOther"
          />
        </template>
        <NotifyList />
      </TabPanel>
      <TabPanel>
        <template #header>
          <i
            class="pi pi-sign-out"
            aria-hidden="true"
          />
          <span class="ms-1 my-text-tabs">Выход</span>
        </template>
        <exitViewVue />
      </TabPanel>
    </TabView>

    <Dialog
      header="Отправить сообщение?"
      :visible="modalMessage"
      :style="{width: '50vw'}"
      :modal="true"
      class="border-noround"
      @update:visible="e => {modalMessage = e}"
    >
      <small
        v-if="(v$.bodyComment.$invalid && submitted) || v$.bodyComment.$pending.$response"
        class="p-error"
      >{{ v$.bodyComment.required.$message = 'Это обязательное поле' }}</small>
      <Textarea
        v-model="bodyComment"
        class="border-noround"
        :class="{'p-invalid':v$.bodyComment.$invalid && submitted}"
        rows="5"
        cols="30"
        :style="{width: '100%'}"
        :auto-resize="true"
      />
      <template #footer>
        <Button
          label="Нет"
          icon="pi pi-times"
          class="p-button-text"
          :style="{color: '#4e4e4e'}"
          @click="() => {modalMessage = false}"
        />
        <Button
          label="Да"
          icon="pi pi-check"
          autofocus
          :style="{background: '#4f585e'}"
          @click="sendResponse"
        />
      </template>
    </Dialog>

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
    <ScrollTop />
  </div>
</template>

<script>
import userProfileVue from './userProfile.vue'
import CustomCommentVue from './CustomComment.vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import tableArticle from '@/components/UI/tableArticle'
import { mapState } from 'vuex'
// import bucketImagesVue from './bucketImages.vue'
import resumCardVue from './resumCard.vue'
import listFollowerVue from './listFollower.vue'
import exitViewVue from './exitView.vue'
import messageViewVue from './messageView.vue'
import imgModule from '@/components/UI/imgModul.vue'
import NotifyList from '@/components/UI/notifyList.vue'
export default {
  name: 'TabsProfile',
  components: {
    userProfileVue,
    CustomCommentVue,
    tableArticle,
    // bucketImagesVue,
    resumCardVue,
    listFollowerVue,
    exitViewVue,
    messageViewVue,
    imgModule,
    NotifyList
  },
  setup: () => ({ v$: useVuelidate() }),
  data () {
    return {
      // picIndex: 0,
      comments: [],
      responseID: 0,
      bodyComment: '',
      projectId: 0,
      timeLine: 0,
      modalMessage: false,
      submitted: false,
      isNextComment: true,
      commentPage: 1,
      isLoadComment: false,
      responseComm: null,
      idsInsertComment: []
    }
  },
  validations () {
    return {
      bodyComment: {
        required
      }
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi,
      user: state => state.user,
      myImages: state => state.usersStore.myImages,
      indexMenu: state => state.usersStore.indexMenu,
      notifyMsg: state => state.usersStore.notifyMsg,
      notifyComment: state => state.usersStore.notifyComment,
      notifyOther: state => state.usersStore.notifyOther,
      socketData: state => state.socketData
    })
  },
  watch: {
    indexMenu (val) {
      this.comments = []
      this.commentPage = 1
      this.isNextComment = true
    },
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'notify_observer':
            this.addNotifyOther(obj)
            break
          case 'get_comment_from_notify':
            for (const comm of obj.data) {
              if (!this.idsInsertComment.includes(comm.id)) {
                this.idsInsertComment.push(comm.id)
                this.comments.unshift(comm)
              }
            }
            break
        }
      },
      deep: true
    }
  },
  mounted () {},
  methods: {
    addNotifyOther (obj) {
      switch (obj.type_notify) {
        case 'NEW_COMMENT':
          setTimeout(() => {
            this.getCommentFromNotify()
          }, 300)
          break
        case 'NEW_COMMENT_TIMELINE':
          setTimeout(() => {
            this.getCommentFromNotify()
          }, 300)
          break
        case 'DEL_COMMENT_TIMELINE':
          this.delMessage(obj.object_id, this.comments)
          break
        case 'DEL_COMMENT':
          this.delMessage(obj.object_id, this.comments)
          break
      }
    },
    getCommentFromNotify () {
      this.$store.commit('setSendSocket',
        {
          action: 'get_comment_from_notify',
          request_id: 'user_'+this.user.user.username
        }
      )
    },
    onReject () {
      this.$toast.removeGroup('bc')
    },
    YesMethod (e) {
      if (e.flag === 'delmessage') {
        this.$http.get(this.$store.state.hostmeapi + `/comment/delete/${e.comment}`)
          .then(res => {
            this.delMessage(e.comment, this.comments, e.listId)
          })
          if (e.project) {
          this.$store.commit('setSendSocket',
            {
              action: 'notify_msg_online',
              request_id: 'user_'+this.user.user.username,
              type_notify: 'DEL_COMMENT',
              object_id: e.comment,
              project: e.project,
              parent_id: e.parent_id ? e.parent_id.id : null
            }
          )
        } else if (e.time_line) {
          this.$store.commit('setSendSocket',
            {
              action: 'notify_msg_online',
              request_id: 'user_'+this.user.user.username,
              type_notify: 'DEL_COMMENT_TIMELINE',
              object_id: e.comment,
              time_line: e.time_line,
              parent_id: e.parent_id ? e.parent_id.id : null
            }
          )
        }
      } else if (e.flag === 'delpic') {
        this.delMyPic(e)
      }
      this.$toast.removeGroup('bc')
    },
    delMyPic (e) {
      const params = {
        img: e.pic
      }
      this.$http.delete(this.hostapi + '/detail/user/pics/delete', { params })
        .then(res => {
          this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Картинка удаленна',
            life: 3000,
            group: 'tl'
          })
          if (res.data.photo && res.data.photo_user) {
            const photo = res.data.photo
            const photo_user = res.data.photo_user
            this.$store.commit('changeUserPhoto', { photo: photo, photo_user: photo_user })
          }
          const newArrPic = this.myImages.filter(item => { return item.itemImageSrc !== e.pic })
          this.$store.commit('usersStore/setMyImages', newArrPic)
        }).catch(res => {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Ошибка при удаление',
            life: 3000,
            group: 'tl'
          })
        })
    },
    responseComment (comm) {
      this.responseID = comm.id
      this.bodyComment = `${comm.name}, `
      if (comm.project) {
        this.projectId = comm.project.id
      }
      if (comm.timeline_id) {
        this.timeLine = comm.timeline_id
      }
      this.responseComm = comm
      this.modalMessage = true
    },
    delMessage (id, comms = [], listId, inx = 0) {
      for (const [inx, comm] of comms.entries()) {
        if (comm.id === id) {
          if (comm.response.length) {
            comms.splice(inx, 1, ...comm.response)
          } else {
            comms.splice(inx, 1)
          }
        } else if (comm.response.length) {
          this.delMessage(id, comm.response)
        }
      }
      return false
    },
    sendResponse () {
      const data = {
        body: this.bodyComment,
        response: this.responseID
      }
      if (this.projectId) {
        data.project = this.projectId
      }
      if (this.timeLine) {
        data.time_line = this.timeLine
      }
      this.submitted = true
      if (this.v$.bodyComment.$invalid) return false
      this.$store.commit('setIsLoad', true)
      this.modalMessage = false
      this.$http({
        method: 'post',
        url: this.hostapi + '/comment/create',
        data: data
      }).then(res => {
        this.responseComm.response.push(res.data)
        if (res.data.project_id) {
          this.$store.commit('setSendSocket',
            {
              action: 'notify_msg_online',
              request_id: 'user_'+this.user.user.username,
              type_notify: 'NEW_COMMENT',
              object_id: res.data.id
            }
          )
        } else {
          this.$store.commit('setSendSocket',
            {
              action: 'notify_msg_online',
              request_id: 'user_'+this.user.user.username,
              type_notify: 'NEW_COMMENT_TIMELINE',
              object_id: res.data.id
            }
          )
        }
        
      }).catch(res => {
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: 'Ошибка при отправление',
          life: 3000,
          group: 'tl'
        })
      }).then(() => { this.$store.commit('setIsLoad', false) })
    },
    onLoadNext () {
      if (this.isNextComment) {
        this.getMeComment()
      }
    },
    getMeComment () {
      if (!this.isNextComment) return false
      const params = {
        page: this.commentPage
      }
      this.isLoadComment = true
      this.$http.get(`${this.hostapi}/detail/user/comments`, { params })
        .then(res => {
          this.comments = [...this.comments, ...res.data.results]
          this.commentPage += 1
          if (!res.data.next) this.isNextComment = false
        }).catch(res => {
          let errMsg = 'Ошибка при загрузки'
          if (res.response?.status === 404) {
            errMsg = 'Страница не найдена.'
            this.isNextComment = false
          }
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: errMsg,
            life: 3000,
            group: 'tl'
          })
        }).then(() => {
          this.isLoadComment = false
        })
    }
  }
}
</script>

<style lang="scss" >
@media screen and (max-width: 540px) {
  .about {
    .p-tabview .p-tabview-nav{
      display: none;
    }
  }
}
@media screen and (max-width: 840px) {
  .about {
    .my-text-tabs{
      display: none;
    }
  }
}
.p-dialog .p-dialog-header{
    border-radius: 3px;
  }
  .p-dialog .p-dialog-footer{
    border-radius: 3px;
  }
.about{
  .card{
    // box-shadow: none;
    background-color: whitesmoke;
  }
  .p-tabview-panels, .p-tabview-nav-link, input:enabled{
     background-color: whitesmoke !important;
  }
  .p-tabview-panels{
    padding: 0;
  }
}
// @media screen and (max-width:570px) {
//   .about{
//     .p-tabview-nav{
//       display: flex;
//       flex-direction: column;
//     }
//   }
// }
.p-tabview .p-tabview-nav{
  flex-wrap: wrap;
  border: none;
  background-color: whitesmoke;
  & li{
    margin-bottom: 4px;
  }
}
.p-button{
  border-radius: 0;
  &:hover{
    border: 1px solid #e67e22;
  }
}
.p-inputtext:enabled:focus{
  box-shadow: 0 0 0 0.2rem #e9c9ae;
}
.p-button:focus{
  box-shadow: 0 0 0 0.2rem #e9c9ae;
}
.p-inputtext:enabled:hover {
    border-color: #e67e22;
}
.p-inputtext:enabled:focus{
   border-color: #e67e22;
}
.modal-sendmess{
  .p-button {
    margin: 0.3rem .5rem;
    min-width: 10rem;
}

p {
    margin: 0;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-dialog .p-button {
    min-width: 6rem;
}
}
.tabview-custom {
    i, span {
        vertical-align: middle;
    }

    span {
        margin: 0 .5rem;
    }
}

.p-tabview p {
    line-height: 1.5;
    margin: 0;
}
   .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
    border-color: #e67e22;
    color: #e67e22;
    &:focus{
        box-shadow: none;
    }
}
</style>
