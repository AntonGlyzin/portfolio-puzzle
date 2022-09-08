<template>
  <Dialog
    header="Редактор событий"
    :visible="showModal"
    :style="{width: '90vw'}"
    :modal="true"
    @update:visible="$emit('update:showModal', false)"
  >
    <ProgressBar
      v-if="isLoadData"
      class=" absolute w-11 z-5 rounded-0 border-orange-500"
      mode="indeterminate"
      style="height: .5em"
    />
    <div class="row w-100 mt-4">
      <div
        v-if="!isEditEvent"
        class="field col-12"
      >
        <span class="p-float-label">
          <Dropdown
            v-model="selectedProject"
            class="w-100"
            :options="listProject"
            option-label="title"
            :loading="isLoad"
            :show-clear="true"
          />
          <label>Проект</label>
        </span>
      </div>

      <div class="field col-12">
        <span class="p-float-label">
          <Dropdown
            v-model="selectedBlog"
            class="w-100"
            :options="listBlog"
            option-label="title"
            :loading="isLoad"
            :show-clear="true"
          />
          <label>Блог</label>
        </span>
      </div>
      <div class="field col-12">
        <span class="p-float-label">
          <MultiSelect
            v-model="selectedTags"
            class="w-100"
            :filter="true"
            :options="filtrSkills"
            option-label="name"
          />
          <label>Выберите теги </label>
        </span>
        <div class="mt-1">
          <Chip
            v-for="tag in selectedTags"
            :key="tag.id"
            :label="tag.name"
          />
        </div>
      </div>
      <div class="field col-12">
        <v-md-editor
          v-model="editorText"
          height="300px"
          left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | emoji"
        />
      </div>
    </div>
    <template #footer>
      <Button
        label="Закрыть"
        icon="pi pi-times"
        class="p-button-text border-noround"
        @click="$emit('update:showModal', false)"
      />
      <Button
        label="Сохранить"
        icon="pi pi-check"
        class="border-noround"
        @click="saveEvent"
      />
    </template>
  </Dialog>
</template>
<script>
export default {
  name: 'AddEvent',
  props: {
    isEditEvent: {
      type: Boolean,
      default: false
    },
    showModal: {
      type: Boolean,
      default: false
    },
    myevent: {
      type: Object,
      default: null
    },
    editIndex: {
      type: Number,
      default: null
    }
  },
  emits: ['update:showModal'],
  data () {
    return {
      searchSlugBlog: null,
      searchSlug: null,
      editorText: '',
      selectedTags: null,
      myskils: null,
      selectedBlog: null,
      listBlog: null,
      selectedProject: null,
      listProject: null,
      addModalEvent: false,
      user: null,
      isLoad: false,
      hostapi: null,
      isLoadData: false
    }
  },
  computed: {
    filtrSkills () {
      const skilsProject = this.selectedProject?.skils
      const skilsBlog = this.selectedBlog?.skils
      let tagsEvent = []
      if (this.selectedTags) tagsEvent = [...this.selectedTags]
      if (skilsBlog) tagsEvent = [...skilsBlog, ...tagsEvent]
      if (skilsProject) tagsEvent = [...skilsProject, ...tagsEvent]
      const listUnicSlug = []
      return tagsEvent.reduce((newarr, item, i, arr) => {
        if (!listUnicSlug.includes(item.slug)) {
          listUnicSlug.push(item.slug)
          return [...newarr, item]
        } else return newarr
      }, [])
    }
  },
  watch: {
    showModal (val) {
      if (!val) {
        this.clearForm()
        return false
      }
      this.user = this.$store.state.user
      this.myskils = this.user.myskils
      if (this.isEditEvent) {
        this.editorText = this.myevent.content
        this.searchSlugBlog = this.myevent.blog
        this.selectedTags = this.myevent.mytags
        this.searchSlug = this.myevent.project
      } else this.editorText = ''
      this.getPosts()
    }
  },
  mounted () {
    this.hostapi = this.$store.state.hostmeapi
  },
  methods: {
    clearForm () {
      this.editorText = ''
      this.selectedTags = null
      this.selectedBlog = null
      this.selectedProject = null
    },
    updateData () {
      if (!this.editorText) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Заполните содержимое',
          life: 3000,
          group: 'tl'
        })
        return
      }
      const data = {
        skils: this.selectedTags.map(item => item.id),
        content: this.editorText
      }
      if (this.selectedBlog) data.blog = this.selectedBlog.id
      this.isLoadData = true
      this.$http.put(this.hostapi + `/events/user/update/${this.myevent.id}`, data)
        .then(res => {
          const tmp = this.$store.state.eventStore.events
          const tmpItem = this.myevent
          tmpItem.content = this.editorText
          tmpItem.blog = this.selectedBlog.slug
          tmpItem.mytags = this.selectedTags
          this.clearForm()
          this.$emit('update:showModal', false)
          this.$set(tmp, this.editIndex, tmpItem)
        }).catch(res => {}).then(() => { this.isLoadData = false })
    },
    addData () {
      if (!this.editorText) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Заполните содержимое',
          life: 3000,
          group: 'tl'
        })
        return
      }
      if (!this.selectedBlog && !this.selectedProject) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Выберите проект или блог',
          life: 3000,
          group: 'tl'
        })
        return
      }
      if (!this.selectedTags) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Выберите теги',
          life: 3000,
          group: 'tl'
        })
        return
      }
      const data = {
        skils: this.selectedTags.map(item => item.id),
        content: this.editorText
      }
      if (this.selectedProject) data.project = this.selectedProject.id
      if (this.selectedBlog) data.blog = this.selectedBlog.id
      let msg = null
      let flag = null
      this.isLoadData = true
      this.$http.post(this.hostapi + '/events/user/addevent', data)
        .then(res => {
          this.clearForm()
          const arrEvent = this.$store.state.eventStore.events
          arrEvent.unshift(res.data)
          this.$store.commit('eventStore/setEvents', arrEvent)
          this.$emit('update:showModal', false)
        })
        .catch(res => {
          msg = 'Ошибка отправления'
          flag = 'error'
          this.$toast.add({
            severity: flag,
            summary: 'Уведомление',
            detail: msg,
            life: 3000,
            group: 'tl'
          })
        })
        .then(() => {
          this.isLoadData = false
        })
    },
    saveEvent () {
      if (this.isEditEvent) {
        this.updateData()
      } else {
        this.addData()
      }
    },
    sortedPosts () {
      this.listProject = this.posts.filter(item => { return item.type_content === 1 })
      this.listBlog = this.posts.filter(item => { return item.type_content === 2 })
    },
    getPosts () {
      this.posts = this.$store.state.usersStore.myposts
      if (this.posts) {
        this.sortedPosts()
        if (this.isEditEvent) this.setProject()
        return false
      }
      this.isLoad = true
      this.$http.get(this.hostapi + '/detail/user/posts')
        .then(res => {
          this.posts = res.data
          this.$store.commit('usersStore/setPosts', res.data)
          this.sortedPosts()
          if (this.isEditEvent) this.setProject()
        }).catch(res => {
        }).then(() => {
          this.isLoad = false
        })
    },
    setProject () {
      this.selectedProject = this.listProject.find(item => {
        if (item.slug === this.searchSlug) {
          return item
        } else return null
      })
      this.selectedBlog = this.listBlog.find(item => {
        if (item.slug === this.searchSlugBlog) {
          return item
        } else return null
      })
    }
  }
}
</script>
<style lang="scss" >

</style>
