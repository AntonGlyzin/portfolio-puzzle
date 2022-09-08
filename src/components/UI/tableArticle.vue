<template>
  <div class="table-article">
    <div class="">
      <Toolbar class="mb-4 border-round-xs">
        <template #start>
          <btnCustomVue
            style="height: 44px;"
            class="btn-me-registr mr-2"
            :my-class="'say'"
            :msg-btn="'Добавить'"
            @click="addArticle"
          >
            <i
              class="fa fa-plus"
              aria-hidden="true"
            />
          </btnCustomVue>
        </template>
        <template #end>
          <Button
            class="p-button-outlined p-button-secondary rounded-0 btn-filter-date ms-2"
            icon="pi pi-refresh"
            @click="fetchPosts"
          />
        </template>
      </Toolbar>
      <div v-intersection="getPosts" />
      <DataTable
        :value="posts"
        :paginator="true"
        :rows="5"
        responsive-layout="scroll"
        paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        :rows-per-page-options="[5,10,20,50]"
        :global-filter-fields="['title', ]"
        filter-display="row"
        :loading="isLoad"
        :filters="filters"
        :selection="selectedPosts"
        class="surface-100"
      >
        <template #header>
          <div class="flex justify-content-end">
            <span class="p-input-icon-left p-float-label">
              <i class="pi pi-search" />
              <InputText
                v-model="filters.title.value"
                class="border-round-xs"
              />
              <label class="font-normal">Заголовок статьи</label>
            </span>
          </div>
        </template>
        <template #empty>
          Ничего не найдено.
        </template>
        <Column
          header="Дата"
          :sortable="true"
          filter-field="date_created"
          data-type="date"
        >
          <template #body="{data}">
            <span>{{ slashDate(data.date_created) }}</span>
          </template>
        </Column>
        <Column
          field="title"
          header="Заголовок"
          :sortable="true"
        >
          <template #body="{data}">
            <a
              class="text-orange-600 cursor-pointer"
              blank="true"
              @click="editPost(data)"
            >{{ data.title }}</a>
            <i
              class="fa fa-pencil ms-1 text-orange-600"
              aria-hidden="true"
            />
          </template>
        </Column>
        <Column field="title">
          <template #body="{data}">
            <router-link
              class="text-orange-600"
              blank="true"
              :to="linkPage(data.get_absolute_url)"
            >
              <i
                class="fa fa-share fs-4"
                aria-hidden="true"
              />
            </router-link>
          </template>
        </Column>
        <Column header="Image">
          <template #body="slotProps">
            <Image
              :src="slotProps.data.link"
              alt="Image"
              width="70"
              preview
            />
          </template>
        </Column>
        <Column
          field="type_content"
          header="Тип контента"
          :sortable="true"
          data-type="boolean"
        >
          <template #body="slotProps">
            <span>{{ getTypeCont(slotProps.data.type_content) }}</span>
          </template>
        </Column>
        <Column
          field="is_published"
          header="Статус"
          :sortable="true"
          data-type="boolean"
        >
          <template #body="slotProps">
            <Checkbox
              ref="checkStatus"
              v-model="slotProps.data.is_published"
              :binary="true"
              @click="changePublick(slotProps.data)"
            />
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-success addArcticleBtn border-circle"
              @click="editPost(slotProps.data)"
            />
          </template>
        </Column>
        <Column :exportable="false">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger border-circle"
              @click="confirmDeletePost(slotProps.data)"
            />
          </template>
        </Column>
        <template #footer>
          Всего постов {{ posts ? posts.length : 0 }}
        </template>
      </DataTable>
      <Dialog
        header="Header"
        :style="{'max-width': '95%'}"
        :visible="isEditPost"
        :modal="true"
        class="p-fluid"
        @update:visible="e => {isEditPost = e}"
      >
        <template #header>
          <h3>Редактор постов</h3>
        </template>
        <addArticleVue
          :is-edit="isEdit"
          :post="post"
          :submit="submitEdit"
          @update:post="savePost"
          @update:submit="e => submitEdit = e"
        />

        <template #footer>
          <div class="d-flex justify-content-between">
            <Button
              v-if="isEdit"
              label="Удалить"
              icon="pi pi-trash"
              class="p-button-text text-red-600"
              @click="confirmDeletePost(editPostforDel)"
            />
            <div class="d-flex justify-content-between">
              <Button
                label="Закрыть"
                icon="pi pi-times"
                class="p-button-text"
                @click="isEditPost=false"
              />
              <Button
                label="Сохранить"
                icon="pi pi-check"
                class="p-button-text"
                @click="submitEdit=true"
              />
            </div>
          </div>
        </template>
      </Dialog>
      <Toast
        position="center"
        group="ta"
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FilterMatchMode } from 'primevue/api'
import addArticleVue from './addArticle.vue'
export default {
  name: 'TableArticle',
  components: {
    addArticleVue
  },
  data () {
    return {
      posts: [],
      post: {},
      isLoad: false,
      filters: {
        title: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date_created: { value: null, matchMode: FilterMatchMode.DATE_IS }
      },
      selectedPosts: [],
      isEditPost: false,
      submitEdit: false,
      msgFlag: '',
      Msg: '',
      isEdit: true,
      editPostforDel: null
    }
  },
  computed: {
    ...mapState({
      hostapi: state => state.hostmeapi
    })
  },
  methods: {
    slashDate (val) {
      return val.split('-').reverse().join('/')
    },
    addArticle () {
      this.isEditPost = true
      this.isEdit = false
    },
    getTypeCont (item) {
      const word = (item === 1) ? 'Портфолио' : ((item === 2) ? 'Блог' : '')
      return word
    },
    savePost (post) {
      if (this.isEdit) {
        for (let i = 0; i < this.posts.length; i++) {
          if (this.posts[i].id === post.id) {
            this.posts[i] = post
          }
        }
      } else {
        this.posts.push(post)
      }
      this.$store.commit('usersStore/setPosts', this.posts)
    },
    onReject () {
      this.$toast.removeGroup('ta')
    },
    YesMethod (e) {
      this.$toast.removeGroup('ta')
      this.isEditPost = false
      const data = {
        id: e.idPost
      }
      this.isLoad = true
      this.$http.post(this.hostapi + '/detail/user/post/delete', data)
        .then(res => {
          this.posts = this.posts.filter(item => { return item.id !== e.idPost })
        }).catch(res => {})
        .then(() => {
          this.isLoad = false
        })
    },
    getPosts () {
      if (this.posts.length) return false
      const posts = this.$store.state.usersStore.myposts
      if (posts) {
        this.posts = posts
        return false
      }
      this.fetchPosts()
    },
    fetchPosts () {
      this.isLoad = true
      this.$http.get(this.hostapi + '/detail/user/posts')
        .then(res => {
          this.posts = res.data
          this.$store.commit('usersStore/setPosts', res.data)
        }).catch(res => {
        }).then(() => {
          this.isLoad = false
        })
    },
    changePublick (post) {
      const data = {
        id: post.id,
        is_published: !post.is_published
      }
      this.isLoad = true
      this.$http.post(this.hostapi + '/detail/user/post/update', data)
        .then(res => {
          this.Msg = 'Статус публикации изменен'
          this.msgFlag = 'success'
        }).catch(res => {
          this.Msg = 'Что-то случилось...'
          this.msgFlag = 'error'
        }).then(() => {
          this.isLoad = false
          this.$toast.add({ severity: this.msgFlag, summary: 'Уведомление', detail: this.Msg, life: 3000, group: 'tl' })
        })
    },
    editPost (post) {
      this.editPostforDel = post
      this.isLoad = true
      this.$http(this.hostapi + `/detail/user/post/content/${post.id}`)
        .then(res => {
          this.post = post
          this.post.content = res.data
          this.isEditPost = true
          this.isEdit = true
        }).catch().then(() => { this.isLoad = false })
      // this.post = post
      // this.isEditPost = true
      // this.isEdit = true
    },
    confirmDeletePost (post) {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить этот пост?',
        group: 'ta',
        idPost: post.id,
        isEditPost: this.isEditPost
      })
    },
    linkPage (url) {
      return url.replace('/api/bag', '')
    }
    // initFilter () {
    //   this.filters = {
    //     title: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //     date_created: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] }
    //   }
    // }
  }
}
</script>

<style lang="scss" >
.addArcticleBtn{
    background: #485055 !important;
    border: 1px solid #495257 !important;
    &:enabled:focus{
          box-shadow: 0 0 0 0.2rem #f7e2bb;
    }
    &:enabled:hover{
      background: #43484c !important;
      border: 1px solid #777777 !important;
    }
}
.table-article{
  .p-dropdown{
        border-radius: 2px;
  }
    .product-image {
    width: 80px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .p-checkbox .p-checkbox-box.p-highlight {
      border-color: #e67e22;
      background: #e67e22;
    }
    .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover{
      border-color: #d97424;
      background: #d97424;
    }
    .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover{
      border-color:#e67e22;
    }
}
.p-button-icon-only .p-button-label {
        margin: 0 ;
    }
     .p-image-preview{
      max-height: 84vh;
    }
</style>
