<template>
  <div class="itemsPort">
    <ProgressBar
      v-if="isLoad"
      class="sticky-top rounded-0 border-orange-500"
      mode="indeterminate"
      style="height: .5em;z-index: 1050; position: sticky !important;"
    />
    <div class="blog-item">
      <div class="meta">
        <div class="photo-item">
          <ul class="details flex-wrap">
            <li class="author tags align-self-center">
              <router-link
                class="link-tags "
                :to="'/card/user/'+post.get_username"
              >
                {{ post.get_author }}
              </router-link>
            </li>
            <li class="date align-self-center">
              {{ post.get_date }}
            </li>
            <li class="tags align-self-center" />
            <li class="raiting ms-3 align-self-center">
              <Rating
                v-model="raiting.raiting"
                :cancel="false"
                @change="setRaiting(post.id)"
              />
              <small>Оценили {{ raiting.users }} раз</small>
            </li>
            <li class="ms-3 align-self-center">
              <i
                class="fa fa-eye fs-5 me-1"
                aria-hidden="true"
              />
              {{ post.count_viewers }}
            </li>
            <li class="ms-3 align-self-center">
              <i
                class="fa fa-comments fs-5 me-1"
                aria-hidden="true"
              />
              <!-- {{ post.count_comments }} -->
              {{ refreshCountComment(post.comments) }}
            </li>
          </ul>
          <Image
            :src="post.link"
            preview
          />
        </div>
        <div />
      </div>
      <div
        id="post-description"
        class="description"
      >
        <h1 class="m-4">
          {{ post.title }}
        </h1>
        <div class="flex flex-wrap border-dotted-bottom p-3">
          <span 
            v-for="item in post.skils"
            :key="item.id"
            class="m-1 surface-700 p-1"
          >
            <router-link
              class="no-underline border-0 border-dotted border-bottom-1 text-200"
              :to="'/'+prefix+'?tags='+item.slug"
            >
              {{ item.name }}
            </router-link>
          </span>
        </div>
        <v-md-preview
          :text="post.content"
          @copy-code-success="handleCopyCodeSuccess"
        />
        <div class="description-detail-listwork pl-5 pr-5">
          <Accordion v-if="post.type_content == 1">
            <AccordionTab>
              <template #header>
                <i class="fa fa-edit" />
                <span class="pr-2">Статьи по проекту</span> - <span class="pl-2">{{ post.list_posts?.count_posts }} шт</span>
              </template>
              <ul>
                <li
                  v-for="blog in post.list_posts?.posts"
                  :key="blog.blog__id"
                >
                  <router-link :to="'/blog/post/'+blog.blog__slug">
                    {{ blog.blog__title }}
                  </router-link>
                </li>
              </ul>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    </div>
    <div
      v-if="!post.comment_push"
      class="ms-4"
    >
      {{ commentPush }}
    </div>
    <div
      v-if="forInsertComm"
      class="replay-comment-post d-flex border-1 border-300 justify-content-between p-3"
      style="max-width: 566px;"
    >
      <div class="d-flex flex-column">
        <div>
          <p class="font-medium text-lg">
            {{ forInsertComm.user.full_name }}
          </p>
        </div>
        <v-md-preview
          class="w-100 pt-1 pb-1 "
          :text="forInsertComm.body"
          @copy-code-success="handleCopyCodeSuccess"
        />
      </div>
      <div>
        <i
          class="fa fa-close transition-colors transition-duration-300 hover:text-orange-600 cursor-pointer text-xl"
          aria-hidden="true"
          @click="closeReplayComment"
        />
      </div>
    </div>
    <form
      v-if="post.comment_push"
      class="form-bags"
      action=""
      method="post"
      @submit.prevent
    >
      <div class="form-bags-name-tel">
        <div
          v-if="!post.viewer"
          class="input-group mb-3"
        >
          <span
            id="inputGroup-sizing-default"
            class="input-group-text"
          ><i
            class="fa fa-user-circle-o"
            aria-hidden="true"
          /></span>
          <input
            v-model="nameComment"
            :class="isInvalidStyleName ? invalidStyleCaptch : ''"
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default validationServerUsernameFeedback"
            placeholder="Имя"
            @focus="getCaptchaFocus"
          >
          <div
            id="validationServerUsernameFeedback"
            class="invalid-feedback"
          >
            Пожалуйста, напишите другое имя пользователя. Ваше уже существует на этой странице.
          </div>
        </div>
        <div class="form-floating">
          <v-md-editor
            v-model="bodyComment"
            height="300px"
            left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | emoji"
          />
        </div>
        <transition name="fade">
          <div
            v-show="isCaptch"
            v-if="!post.viewer"
            class="input-group mb-3 captcha"
          >
            <span class="input-group-text"><img
              :src="getHostCaptcha+imgCaptch"
              style="margin: 0;"
              alt="captcha"
              class="captcha"
            ></span>
            <input
              v-model="captchInput"
              type="text"
              class="form-control"
              :class="isInvalidStyleCaptch ? invalidStyleCaptch : ''"
              aria-label="Sizing example input"
              name="captcha_1"
              autocapitalize="off"
              autocomplete="off"
              aria-describedby="inputGroup-sizing-default validationServerCaptchFeedback"
              placeholder=""
              autocorrect="off"
              spellcheck="false"
            >
            <input
              id="id_captcha_0"
              type="hidden"
              name="captcha_0"
              :value="keyCaptch"
              required=""
            >
            <div
              id="validationServerCaptchFeedback"
              class="invalid-feedback"
            >
              Пожалуйста, введите еще раз.
            </div>
          </div>
        </transition>
      </div>
      <btnCustomVue
        :my-class="'say'"
        :msg-btn="'Отправить'"
        style="height: 47px;"
        @click="sendComment()"
      >
        <i
          class="fa fa-paper-plane"
          aria-hidden="true"
        />
      </btnCustomVue>
    </form>
    <CustomCommentVue
      :get-response="true"
      :comments="post.comments"
      @responseComm="responseComment"
    />

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
    <Dialog
      v-model:visible="visibleImg"
      :modal="true"
      :dismissable-mask="true"
      class="modalImgPost"
      @click="visibleImg = false"
    >
      <img
        :src="clickImg.src.value"
        :alt="clickImg.alt.value"
        class="img-thumbnail cursor-pointer"
        @click="visibleImg = false"
      >
    </Dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getCaptchAndCSRF } from '../components/captchService'
import CustomCommentVue from '@/components/UI/CustomComment.vue'
export default {
  name: 'BagsDetail',
  metaInfo () {
    return {
      title: this.post.title,
      meta: [
        {
          name: 'description',
          content: this.post.description
        },
        {
          name: 'Keywords',
          content: this.post.key_words
        }
      ]
    }
  },
  components: {
    CustomCommentVue
  },
  props: {
    slug: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      forInsertComm: null,
      isLoad: false,
      post: {},
      funcLoad: null,
      clickImg: '',
      visibleImg: false,
      commentPush: '',
      responseID: 0,
      idComment: 0,
      link: '',
      nameComment: '',
      bodyComment: '',
      keyCaptch: '',
      imgCaptch: '',
      captchInput: '',
      isCaptch: false,
      invalidStyleCaptch: 'is-invalid',
      isInvalidStyleCaptch: false,
      isInvalidStyleName: false,
      isInvalidStylebody: false,
      isSuccess: false,
      isError: false,
      idCommentDel: 0,
      raiting: {},
      recive_comment_ids: [],
      funcLoadUser: null
    }
  },
  computed: {
    ...mapState({
      hostme: state => state.hostme,
      hostapi: state => state.hostmeapi,
      user: state => state.user,
      socketData: state => state.socketData,
      requestID: state => state.usersStore.requestID
    }),
    getHostCaptcha () {
      return this.hostme
    },
    getHref () {
      return this.$route.href
    },
  },
  watch: {
    getHref (val) {
      if (!val) return
      if (this.$route.meta.view === 'PortfolioDetail') {
        this.getPage(this.$route.path)
      }
    },
    socketData: {
      handler (obj) {
        switch (obj.action) {
          case 'SENDED_EVENT':
            if (this.user.user.id === obj.from_user) return false
            switch (obj.event) {
              case 'NEW_COMMENT':
                this.addNewComment(obj.data)
                break
              case 'DEL_COMMENT':
                this.delCommentSocket(obj.data)
                break
              case 'SET_RAITING':
                this.changeRaitingSocket(obj.data)
                break
            }
          break
        }
      },
      deep: true
    }
  },
  mounted () {
    this.getPage(this.$route.path)
    this.funcLoad = setInterval(() => {
          if (!this.post.title) return
          let post = document.getElementById('post-description')
          let imgs = post.getElementsByTagName('img')
          for (let i=0; i<imgs.length; i++) {
            imgs[i].onclick = (e) => {
              this.clickImg = e.target.attributes
              this.visibleImg = true
            }
          }
          clearInterval(this.funcLoad)
    }, 1000)
    this.funcLoadUser = setInterval(() => {
          if (!this.post.id || !this.requestID) return
          this.subscribe_on_post()
          clearInterval(this.funcLoadUser)
    }, 1000)
    setTimeout(() => {
      clearInterval(this.funcLoadUser)
    }, 10000)
  },
  updated () {},
  unmounted () {
    if (this.user) {
      this.subscribe_off_post()
    }
  },
  methods: {
    ...mapActions({
      fetchPosts: 'postsStore/fetchPosts'
    }),
    changeRaitingSocket (data) {
      if (this.post.id !== data.project.id) return false
      this.raiting = data.raiting
    },
    subscribe_on_post () {
        this.$store.commit('setSendSocket',
        {
          action: 'subscribe_on_post',
          request_id: 'user_'+this.user.user.username,
          project: this.post.id
        }
      )
    },
    subscribe_off_post () {
        this.$store.commit('setSendSocket',
        {
          action: 'subscribe_off_post',
          request_id: 'user_'+this.user.user.username,
          project: this.post.id
        }
      )
    },
    refreshCountComment (comms, count=0) {
      if (!comms) return count
      for (const [inx, comm] of comms.entries()) {
        if (comm.response.length) {
          count += this.refreshCountComment(comm.response, count)
        }
        count += 1
      }
      return count
    },
    delCommentSocket (data) {
      if (this.post.id !== data.project) return false
      this.delCommentCyrcle(data.id, this.post.comments)
    },
    delCommentCyrcle (id, comms) {
      for (const [pos, item] of comms.entries()) {
        if (item.id === id) {
          if (item.response.length) {
            comms.splice(pos, 1, ...item.response)
            return true
          }
          comms.splice(pos, 1)
          return true
        } else if (item.response.length) {
          const dl = this.delCommentCyrcle(id, item.response)
          if (dl) return true
        }
      }
      return false
    },
    closeReplayComment () {
      this.bodyComment = ''
      this.responseID = 0
      this.forInsertComm = null
    },
    addNewComment (data) {
      if(data.project.id !== this.post.id) return false
      if (this.recive_comment_ids.includes(data.id)) return false
      this.recive_comment_ids.push(data.id)
      let dataClone = Object.assign({}, data)
      dataClone.project = null
      if (dataClone.parent) {
        this.addNewCommentCyrcle(dataClone, this.post.comments)
      } else {
        this.post.comments.unshift(dataClone)
      }
    },
    addNewCommentCyrcle (data, comms = []) {
      for (const [inx, comm] of comms.entries()) {
        if (comm.id === data.parent.id) {
          comm.response.push(data)
        } else if (comm.response.length) {
          this.addNewCommentCyrcle(data, comm.response)
        }
      }
      return true
    },
    closeModal () {
      this.visibleImg = false
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
    setRaiting (idPost) {
      if (!this.user) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Для сохранения оценок нужна регистрация',
          life: 4000,
          group: 'tl'
        })
        return
      }
      const data = {
        project: idPost,
        raiting: this.raiting.raiting
      }
      this.$http.post(this.hostapi + '/post/raiting/set', data)
        .then(res => {
          if (this.user) {
            const username = this.user.user.username
              this.$store.commit('setSendSocket',
                {
                  action: 'notify_msg_online',
                  request_id: 'user_'+username,
                  type_notify: 'SET_RAITING',
                  object_id: this.post.id,
                  project: this.post.id
                }
              )
          }
          if (res.data.plus) this.raiting.users += 1
          this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Ваша оценка учтенна',
            life: 3000,
            group: 'tl'
          })
        }).catch().then(() => {})
    },
    onReject () {
      this.$toast.removeGroup('bc')
    },
    getPage (link = '') {
      this.isLoad = true
      this.$http.get(this.hostapi + `${link}`)
        .then(res => {
          this.post = res.data
          this.raiting = res.data.raiting
          this.commentPush = 'Комментирование отключенно для статьи'
          this.nextComment()
        }).catch(res => {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Ошибка загрузки',
            life: 3000,
            group: 'tl'
          })
        }).then(() => {
          this.isLoad = false
        })
    },
    delMessage (id, comms, listId, inx = 0) {
      for (const [pos, item] of comms.entries()) {
        if (item.id === id && listId.slice(-1)[0] === id) {
          if (item.response.length) {
            comms.splice(pos, 1, ...item.response)
            return true
          }
          comms.splice(pos, 1)
          return true
        } else if (item.id === listId[inx]) {
          const dl = this.delMessage(id, item.response, listId, inx += 1)
          if (dl) return true
        }
      }
      return false
    },
    YesMethod (e) {
      this.$toast.removeGroup('bc')
      if (e.flag === 'delmessage') {
        this.$store.commit('setIsLoad', true)
        this.$http.get(this.$store.state.hostmeapi + `/comment/delete/${e.comment}`)
          .then(res => {
            const username = this.user.user.username
              this.$store.commit('setSendSocket',
                {
                  action: 'notify_msg_online',
                  request_id: 'user_'+username,
                  type_notify: 'DEL_COMMENT',
                  object_id: e.comment,
                  project: this.post.id,
                  parent_id: e.parent_id ? e.parent_id.id : null
                }
            )
            this.delMessage(e.comment, this.post.comments, e.listId)
          }).catch(res => {})
          .then(() => {
            this.$store.commit('setIsLoad', false)
          })
      }
    },
    responseComment (comment) {
      this.forInsertComm = comment
      this.responseID = comment.id
      this.bodyComment = `${comment.name}, `
      this.$el.querySelector('textarea').focus()
    },
    sendComment () {
      const data = {
        project: this.post.id,
        name: this.nameComment,
        body: this.bodyComment,
        captcha_0: this.keyCaptch,
        captcha_1: this.captchInput,
        response: this.responseID
      }
      if (!this.user) {
        if (!this.nameComment) {
          this.isInvalidStyleName = true
          setTimeout(() => {
            this.isInvalidStyleName = false
          }, 5000)
          return
        }
      } else {
        delete data.name
        delete data.captcha_0
        delete data.captcha_1
      }
      if (!this.bodyComment) {
        this.isInvalidStylebody = true
        setTimeout(() => {
          this.isInvalidStylebody = false
        }, 5000)
        return
      }
      this.$store.commit('setIsLoad', true)
      this.$http({
        method: 'post',
        url: this.hostme + '/api/bag/comment/create',
        data: data
      }).then(res => {
        if (this.user) {
          const username = this.user.user.username
            this.$store.commit('setSendSocket',
              {
                action: 'notify_msg_online',
                request_id: 'user_'+username,
                type_notify: 'NEW_COMMENT',
                object_id: res.data.id,
                project: this.post.id
              }
          )
        }
        if (this.user && this.forInsertComm) {
          this.forInsertComm.response.push(res.data)
        } else if (this.user) {
          this.post.comments.unshift(res.data)
        }
        this.nameComment = ''
        this.bodyComment = ''
        this.captchInput = ''
        this.responseID = 0
        this.forInsertComm = null
        this.$toast.add({
          severity: 'success',
          summary: 'Уведомление',
          detail: 'Сообщение успешно отправленно!',
          life: 3000,
          group: 'tl'
        })
      }).catch(res => {
        if (res.response?.status === 409) {
          this.isInvalidStyleCaptch = true
          this.captchInput = ''
          this.getCaptcha()
          setTimeout(() => {
            this.isInvalidStyleCaptch = false
          }, 5000)
        } else if (res.response?.status === 400) {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Ошибка при отправке комментария',
            life: 3000,
            group: 'tl'
          })
        } else if (res.response?.status === 423) {
          this.isInvalidStyleName = true
          setTimeout(() => {
            this.isInvalidStyleName = false
          }, 9000)
        } else if (res.response?.status === 403) {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Комментарии отключены для этой статьи',
            life: 4000,
            group: 'tl'
          })
        }
      }).then(() => { this.$store.commit('setIsLoad', false) })
    },
    getCaptcha () {
      const host = this.hostme + '/api'
      if (!this.user) {
        getCaptchAndCSRF(host, this)
      }
    },
    getCaptchaFocus () {
      if (this.keyCaptch) return
      this.getCaptcha()
    },
    nextComment () {
      if (this.$route.hash) {
        const a = document.createElement('a')
        a.setAttribute('href', this.$route.hash)
        setTimeout(() => {
          a.click()
        }, 500)
      }
    }
  }
}
</script>

<style  lang='scss'>
.replay-comment-post{
  margin: 0 auto;
}
.modalImgPost{
  border-radius: 3px !important;
  width: 100% !important;
  height: 100% !important;
  .p-dialog-header-icons{

  }
  img{
    max-height: 100%;
  }
  .p-dialog-content {
    overflow-y: hidden;
    display: flex;
    justify-content: space-around;
  }
  .p-dialog-header{
    background: rgba(0, 0, 0, .0) !important;
    display: none;
  }
  .p-dialog-content{
    background: rgba(0, 0, 0, .0) !important;
  }
  .p-dialog-footer{
    background: rgba(47 53 56) !important;
    display: none;
  }
}
#post-description{
  img{
    max-height: 400px;
    cursor: pointer;
  }
}
.description-detail-listwork {
  .p-accordion-header-link{
    border-radius: 3px !important;
  }
  .p-accordion-content{
    border-bottom-right-radius: 3px !important;
    border-bottom-left-radius: 3px !important;
  }
  .p-accordion .p-accordion-header:not(.p-disabled) .p-accordion-header-link:focus{
    box-shadow: none !important;
  }
  ul>li{
    padding-top: 4px;
    padding-bottom: 4px;
    a{
      text-decoration: none;
      border-bottom: 1px dotted;
    }
  }
}
.p-progressbar .p-progressbar-value {
    background: #e67e22 !important;
}
.v-md-editor{
    box-shadow: none;
    border: 1px solid #ced4da;
  }
.itemsPort{
  .github-markdown-body{
    font-size: 1.1em;
  }
  .v-md-editor{
    box-shadow: none;
    border: 1px solid #ced4da;
  }
}
@media screen and (max-width:520px) {
      .all-comment{
        img {
          max-height: 60px !important;
        }
        .media .ava{
          font-size: 3.1em !important;
        }
      }
      .itemsPort{
        }
        .action-comment{
          button:hover .icon{
            transform: translateX(-20px);
          }
          button{
            width: 97px;
            span{
              font-size: .7em;
            }
            .icon{
              transform: translateX(62px);
              font-size: 15px;
                  width: 31px;
            }
            .text{
                  transform: translateX(10px);
            }
          }
        }
}
.itemsPort{
    .p-image-preview-container{
      width: 100% ;
      height: 100% ;
    }
  .raiting{
    .p-rating .p-rating-icon{
          color: #e7e7e7;
    }
    .p-rating:not(.p-disabled):not(.p-readonly) .p-rating-icon:hover{
      color: #e67e22;
    }
    .p-rating .p-rating-icon.pi-star-fill{
      color: #e7e7e7;
    }
    .p-rating .p-rating-icon:focus{
      box-shadow: none;
    }
  }
  .mobilebtn{
    // display: none;
  }
  // .fade-enter-active{
  //   transition: opacity 2s;
  // }
 .fade-enter-active,
.fade-leave-active {
  transition: all .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  // opacity: 0;
  transform: scaleY(0);
  margin: 0;
}
.captcha{
  overflow: hidden;
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
  .items-comment{
    padding: 0;
    // max-width: 90%;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .media {
    display: flex;
    flex-direction: column;
    .items-comment{
        background-color: #ebebeb;
    }
    .container{
      display: flex;
      border-top:1px dashed #DDDDDD;
    padding:20px 0;
    margin:0;
    }
    .media-body{
      width: 100%;
    }
    .ava{
      font-size: 5.1em;
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
        // color:#AAAAAA;
        // font-size:12px;
        padding-right: 10px;
        // font-weight:600;
      }
  }
}
.blog-item {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 52px;
    box-shadow: 0 3px 7px -1px rgb(0 0 0 / 10%);
    margin-bottom: 1.6%;
    background: #fff;
    line-height: 1.4;
    font-family: sans-serif;
    border-radius: 5px;
    overflow: hidden;
    max-width: 756px;
    padding: 36px;

    .photo-item{
      height: 300px;
      overflow: hidden;
      position: relative;
      &:hover .details{
        padding-top: 21px;
      }
      .details{
        z-index: 3;
        justify-content: space-evenly;
        li{
          margin-top: 5px;
        }
      }
       img{
            width: 100% ;
            margin: 0 auto;
      }
      // .p-image-preview-indicator{
      //  top: -26%;
      // }
    }
}
.p-image-preview{
        max-height: 85vh !important;
}
.blog-item .details {
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    font-size: 0.9rem;
    list-style-type: none;
    display: flex;
     position: absolute;
     color: #e7e7e7;
     width: 100%;
     transition: padding 300ms;
    &>li{
      margin-right: 14px;
      & li{
        margin-right: 4px;
      }
    }
    & li ul{
      display: flex;
      list-style-type: none;
    }

    .author:before {
      font-family: FontAwesome;
      margin-right: 5px;
      content: "\f007";
    }

    .date:before {
      font-family: FontAwesome;
      margin-right: 5px;
      content: "\f133";
    }

    .tags {
      .link-tags{
        color: #e7e7e7;
        text-decoration: dotted underline;
        &:hover{
          color: #e67e22;
          // border-bottom: 1px dotted #e67e22;
        }
      }
      ul{
        padding-left: 0;
      }
      ul:before {
        font-family: FontAwesome;
        content: "\f02b";
        margin-right: 10px;
      }
      li {
        margin-right: 2px;
        &:first-child {
          margin-left: -4px;
        }
      }
    }
}
</style>
