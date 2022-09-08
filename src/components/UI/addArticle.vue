<template>
  <div class="row add-article justify-content-center">
    <ProgressBar
      v-if="isLoad"
      class="absolute w-11 z-5 rounded-0 border-orange-500"
      mode="indeterminate"
      style="height: .5em"
    />
    <div class="col-md-10 mb-3">
      <router-link
        v-if="linkPost"
        class="text-reset"
        :to="getUrl(linkPost)"
      >
        <i class="fa fa-share fa-fw fa-lg m-r-3" />{{ getUrl(linkPost) }}
      </router-link>
    </div>
    <div class="col-md-10">
      <span class="p-float-label">
        <InputText
          v-model="titleArticle"
          type="text"
          class="w-100 h-50 border-round-sm"
          :class="!titleArticle ? invalid : ''"
        />
        <label>Заголовок статьи</label>
      </span>
    </div>
    <div class="mt-4 col-md-10">
      <span class="p-float-label">
        <MultiSelect
          v-model="selectedTags"
          class="w-100 border-round-sm"
          :class="!selectedTags ? invalid : ''"
          :filter="true"
          :options="tags"
          option-label="name"
          placeholder=""
        />
        <label>Выберите теги к статье</label>
      </span>
      <div class="mt-1">
        <Chip
          v-for="tag in selectedTags"
          :key="tag.id"
          :label="tag.name"
        />
      </div>
    </div>
    <div
      v-if="!isEdit"
      class="mt-4 col-md-10"
    >
      <span class="p-float-label">
        <Dropdown
          v-model="myType"
          :class="!myType ? invalid : ''"
          class="w-100 border-round-sm"
          :options="typeCont"
          option-label="name"
        />
        <label>Тип контента</label>
      </span>
    </div>
    <div class="mt-4 col-md-10">
      <input
        ref="image"
        type="file"
        class="form-control border-round-sm"
        @change="myUploader"
      >
    </div>
    <div class="mt-4 col-md-10">
      <v-md-editor
        v-model="fullText"
        height="400px"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | emoji | save"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
        @save="saveTextPost"
      />
    </div>
    <div class="mt-4 col-md-10">
      <Checkbox
        id="binary-comment_push"
        v-model="comment_push"
        :binary="true"
        class="me-1 "
      />
      <label for="binary-comment_push"> Комментарование Вкл/Выкл</label>
    </div>
    <div class="mt-4 col-md-10">
      <Checkbox
        id="binary-is_published"
        v-model="is_published"
        :binary="true"
        class="me-1 "
      />
      <label for="binary-is_published">Статус публикации</label>
    </div>
    <div class="mt-4 col-md-10 row">
      <div class="col-md-4">
        <span>Оценили {{ raiting.users }} раз</span>
      </div>
      <div class="col-md-4">
        <span>Рейтинг публикации</span>
        <Rating
          v-model="raiting.raiting"
          :cancel="false"
          :readonly="true"
        />
      </div>
    </div>
    <div class="mt-4 col-md-10">
      <span class="p-float-label">
        <InputText
          v-model="keywords"
          type="text"
          class="w-100  border-round-sm"
        />
        <label for="inputtext">Keywords</label>
      </span>
    </div>
    <div class="mt-4 col-md-10">
      <span class="p-float-label">
        <Textarea
          v-model="description"
          :auto-resize="true"
          class="w-100  border-round-sm"
        />
        <label>Description</label>
      </span>
    </div>
    <div
      v-if="isChild"
      class="mt-4 col-md-10 d-flex justify-content-end"
    >
      <btnCustomVue
        style="height: 44px;"
        class="btn-me-registr mt-3"
        :my-class="'say'"
        :msg-btn="'Сохранить'"
        @click="createPost"
      >
        <i
          class="fa fa-floppy-o"
          aria-hidden="true"
        />
      </btnCustomVue>
    </div>
    <Toast
      position="center"
      group="addArt"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AddArticle',
  components: {},
  props: {
    isChild: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    post: {
      type: Object,
      default: undefined
    },
    submit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:submit', 'update:post'],
  data () {
    return {
      keywords: '',
      description: '',
      comment_push: '',
      is_published: '',
      fullText: '',
      myType: '',
      typeCont: [],
      titleArticle: '',
      // tags: [],
      selectedTags: '',
      image: '',
      Msg: '',
      msgFlag: '',
      isLoad: false,
      linkPost: '',
      invalid: '',
      raiting: {}
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi,
      tags: state => state.user.myskils
    })
  },
  watch: {
    submit (val) {
      if (val) {
        if (this.isEdit) this.updatePost()
        if (!this.isEdit) this.createPost()
        this.$emit('update:submit', false)
      }
    }
  },
  mounted () {
    if (this.post && this.isEdit) {
      this.keywords = this.post.key_words
      this.description = this.post.description
      this.fullText = this.post.content
      this.selectedTags = this.post.skils
      this.titleArticle = this.post.title
      this.comment_push = this.post.comment_push
      this.is_published = this.post.is_published
      this.raiting = this.post.raiting
    }
    this.getTypeContent()
  },
  methods: {
    saveTextPost (text, html) {
      let txtSkill = ''
      for (const skil of this.selectedTags) {
        txtSkill += skil.name + ' '
      }
      text = this.titleArticle + '\n\n' + txtSkill + '\n\n' + text
      const blobPic = new Blob([text], { type: 'text/plain' })
      const linkpic = document.createElement('a')
      linkpic.href = URL.createObjectURL(blobPic)
      linkpic.download = ''
      linkpic.click()
      URL.revokeObjectURL(linkpic.href)
      linkpic.remove()
    },
    handleUploadImage(event, insertImage, files) {
      if (Math.ceil(files[0].size / 1024) > 1024) {
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: 'Изображение не должно превышать 1 Мб',
          life: 3000,
          group: 'addArt'
        })
        return
      }
      const headers = {
          'Content-Type': 'multipart/form-data'
      }
      const formData = new FormData()
      formData.append('file', files[0])
      this.isLoad = true
      this.$http.post(`${this.hostapi}/detail/post/image/set`,
        formData,
        { headers }
      ).then(res => {
        insertImage({
          url: res.data.photo_link,
          desc: files[0].name,
          // width: 'auto',
          // height: 'auto',
        })
      }).catch(res => {
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: 'Изображение не загрузилось',
          life: 3000,
          group: 'addArt'
        })
      }).then(() => { this.isLoad = false })
    },
    updatePost () {
      const formData = new FormData()
      this.selectedTags.forEach(item => {
        formData.append('skils', item.id)
      })
      formData.append('id', this.post.id)
      formData.append('title', this.titleArticle)
      formData.append('photo', this.image)
      formData.append('content', this.fullText)
      formData.append('comment_push', this.comment_push)
      formData.append('is_published', this.is_published)
      formData.append('key_words', this.keywords)
      formData.append('description', this.description)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.isLoad = true
      this.$http.post(this.hostapi + '/detail/user/post/update', formData, config)
        .then(res => {
          this.$emit('update:post', res.data)
          this.Msg = 'Пост успешно изменен'
          this.msgFlag = 'success'
          this.$http.get(this.hostapi + '/detail/user/pics/list')
            .then(res => {
              this.$store.commit('usersStore/setMyImages', res.data)
            })
        }).catch(res => {
          this.Msg = 'Что-то случилось...'
          this.msgFlag = 'error'
          if (res.response?.data?.error) {
            this.Msg = res.response?.data?.error
          }
          this.alertValid()
        }).then(() => {
          this.isLoad = false
          this.$toast.add({ severity: this.msgFlag, summary: 'Уведомление', detail: this.Msg, life: 3000, group: 'addArt' })
        })
    },
    createPost () {
      if (!this.selectedTags ||
          !this.titleArticle ||
         !this.myType) {
        this.alertValid()
        return false
      }

      const formData = new FormData()
      this.selectedTags.forEach(item => {
        formData.append('skils', item.id)
      })
      formData.append('title', this.titleArticle)
      formData.append('slug', 'none')
      formData.append('photo', this.image)
      formData.append('type_content', this.myType.code)
      formData.append('content', this.fullText)
      formData.append('comment_push', this.comment_push)
      formData.append('is_published', this.is_published)
      formData.append('key_words', this.keywords)
      formData.append('description', this.description)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.isLoad = true
      this.$http.post(this.hostapi + '/detail/user/post/create', formData, config)
        .then(res => {
          this.$emit('update:post', res.data)
          this.Msg = 'Пост успешно опубликован!'
          this.msgFlag = 'success'
          this.keywords = ''
          this.description = ''
          this.fullText = ''
          this.myType = []
          this.titleArticle = ''
          this.selectedTags = []
          this.titleArticle = ''
          this.$refs.image.value = null
          this.linkPost = res.data.get_absolute_url
          this.$http.get(this.hostapi + '/detail/user/pics/list')
            .then(res => {
              this.$store.commit('usersStore/setMyImages', res.data)
            })
        }).catch(res => {
          this.Msg = 'Что-то случилось...'
          this.msgFlag = 'error'
          if (res.response?.data?.error) {
            this.Msg = res.response?.data?.error
          }
          this.alertValid()
        }).then(() => {
          this.isLoad = false
          this.$toast.add({ severity: this.msgFlag, summary: 'Уведомление', detail: this.Msg, life: 3000, group: 'addArt' })
        })
    },
    alertValid () {
      this.invalid = 'p-invalid'
      setTimeout(() => { this.invalid = '' }, 4000)
    },
    myUploader (event) {
      const type = this.$refs.image.files[0]?.type.split('/')[0]
      if (type === 'image') {
        if (Math.ceil(this.$refs.image.files[0].size / 1024) <= 1024) {
          this.image = this.$refs.image.files[0]
        } else {
          this.Msg = 'Изображение не должно превышать 1 Мб'
          this.$refs.image.value = null
          this.$toast.add({ severity: 'error', summary: 'Уведомление', detail: this.Msg, life: 3000, group: 'addArt' })
        }
      }
    },
    getTypeContent () {
      this.$http.get(this.hostapi + '/detail/user/typecontent')
        .then(res => {
          this.typeCont = res.data
        })
    },
    getUrl (url) {
      return url.replace('/api/bag', '')
    }
  }
}
</script>

<style lang="scss" >

.add-article{
  span {
      margin: 0;
    }
  .p-multiselect:not(.p-disabled):hover{
    border-color: #e67e22;
  }
  .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover{
          border-color: #e67e22;
  }
  .p-multiselect {
    background-color: whitesmoke;
  }
  .FileUpload-addarticle{
    .p-button{
      background: #4f585e;
      border-color: #4f585e;
    }
    .p-fileupload-choose:not(.p-disabled):hover{
      background: #565d62;
      color: #ffffff;
      border: 1px solid #e67e22;
    }
  }
  textarea{
    background-color: whitesmoke;
  }
  .p-dropdown:not(.p-disabled):hover {
    border-color: #e67e22;
  }
  .p-dropdown:not(.p-disabled).p-focus{
    border-color: #e67e22;
    box-shadow: 0 0 0 0.2rem #fee0c7;
  }
  .p-dropdown{
    background: #f5f5f5;
  }
}
</style>
