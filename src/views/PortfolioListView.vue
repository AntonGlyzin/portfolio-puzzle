<template>
  <div class="PortfolioList pt-6">
    <Toolbar
      v-if="user"
      class="mb-3"
    >
      <template #start>
        <div class="d-flex justify-content-around flex-column">
          <Dropdown
            v-model="selectedTags"
            :options="alltags"
            option-label="name"
            placeholder="Фильтр по навыку"
            :loading="loadTags"
            :show-clear="true"
            class="rounded-0"
            :filter="true"
            @change="pushUrl"
          />
          <Dropdown
            v-model="selectedUser"
            :options="followers"
            option-label="full_name"
            placeholder="Подписки"
            :loading="loadUsers"
            :show-clear="true"
            class="rounded-0 mt-2"
            :filter="true"
            @change="pushUrl"
          />
        </div>
        <i class="pi pi-bars p-toolbar-separator mr-2" />
      </template>

      <template #end>
        <Button
          icon="pi pi-refresh"
          class="mr-2 p-button-secondary rounded-0"
          @click="refreshPage"
        />
      </template>
    </Toolbar>
    <transition-group name="itemPort">
      <itemPort
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </transition-group>
    <spinnerMe v-show="isLoad" />
    <div
      v-intersection="clickLoad"
      class="PortfolioList-btn"
    />
    <div
      v-if="isNextPage"
      class="d-flex justify-content-center p-6"
    >
      <btnCustomVue
        style="height: 44px;"
        class="btn-me-registr mt-3"
        :my-class="'say'"
        :msg-btn="'Загрузить'"
        @click="clickLoad"
      >
        <i
          class="fa fa-arrow-down"
          aria-hidden="true"
        />
      </btnCustomVue>
    </div>
    <ScrollTop />
  </div>
</template>

<script>
import itemPort from '@/components/UI/itemPort.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PortfolioListFollow',
  metaInfo () {
    return {
      title: this.getNamePage
      // meta: [
      //   {
      //     name: 'description',
      //     content: this.post.description
      //   },
      //   {
      //     name: 'Keywords',
      //     content: this.post.key_words
      //   }
      // ]
    }
  },
  components: {
    itemPort
  },
  props: {},
  data () {
    return {
      isLoad: false,
      alltags: null,
      followers: null,
      selectedTags: null,
      selectedUser: null,
      loadTags: false,
      loadUsers: false
    }
  },
  computed: {
    ...mapState({
      posts: state => state.postsStore.posts,
      currentPage: state => state.postsStore.currentPage,
      isNextPage: state => state.postsStore.isNextPage,
      lastHref: state => state.postsStore.lastHref,
      backDetail: state => state.postsStore.backDetail,
      searchStore: state => state.postsStore.search,
      hostmeapi: state => state.hostmeapi,
      user: state => state.user
    }),
    getNamePage () {
      let prefix = this.$route.href.split('/')[1]
      if (prefix === 'portfolio') prefix = 'Мое портфолио'
      if (prefix === 'blog') prefix = 'Мой блог'
      if (prefix === 'follow') prefix = 'Мои подписки'
      return prefix
    },
    getParams () {
      let params = []
      if (this.selectedTags) params.push('tags=' + this.selectedTags.slug)
      if (this.selectedUser) params.push('user=' + this.selectedUser.username)
      if (params) params = '?' + params.join('&')
      return params
    },
    getHref () {
      return this.$route.href
    }
  },
  watch: {
    getHref (val, oldVal) {
      this.$store.commit('postsStore/setlastHref', oldVal)
      if (this.$route.meta.view === 'PortfolioListView') {
        this.loadPageFromHref()
      }
    },
    user (val) {
      if (val) {
        this.get_skills()
        this.getFollowers()
      }
    }
  },
  mounted () {
    this.clear()
    if (this.user) {
      this.get_skills()
      this.getFollowers()
    }
  },
  unmounted () {
    document.getElementById('basic-search').value = ''
  },
  methods: {
    ...mapActions({
      clearPosts: 'postsStore/clearPosts'
    }),
    pushUrl () {
      this.$router.push(this.getParams)
    },
    refreshPage () {
      this.selectedUser = null
      this.selectedTags = null
      this.$router.push('')
      document.getElementById('basic-search').value = ''
    },
    getPages (url, params) {
      if (!this.isNextPage) return false
      this.$store.commit('postsStore/setisNextPage', false)
      this.$store.commit('postsStore/setPage', this.currentPage + 1)
      this.isLoad = true
      this.$http.get(url, { params })
        .then(res => {
          this.posts.push(...res.data.results)
          if (res.data.next) this.$store.commit('postsStore/setisNextPage', true)
        }).catch(res => {
          if (res?.response?.status === 404) {
            this.$store.commit('postsStore/setisNextPage', false)
          }
        }).then(() => { this.isLoad = false })
    },
    clickLoad () {
      const query = this.$route.query
      const data = {}
      for (const key in query) {
        data[key] = query[key]
      }
      data.page = this.currentPage
      this.getPages(this.hostmeapi + this.$route.path, data)
    },
    loadPageFromHref () {
      this.clear()
      this.clickLoad()
    },
    clear () {
      if (this.lastHref === this.$route.href) return false
      this.clearPosts()
    },
    get_skills () {
      const skills = this.$store.state.usersStore.allskills
      if (skills) {
        this.alltags = skills
        return
      }
      this.loadTags = true
      this.$http.get(this.$store.state.hostmeapi + '/detail/user/allskills')
        .then(res => {
          this.$store.commit('usersStore/setAllSkills', res.data)
          this.alltags = res.data
        }).catch().then(() => { this.loadTags = false })
    },
    getFollowers () {
      const follow = this.$store.state.usersStore.myFollower
      if (follow) {
        this.followers = follow
        return
      }
      this.loadUsers = true
      this.$http.get(this.$store.state.hostmeapi + '/detail/user/follower')
        .then(res => {
          this.followers = res.data[0].follower
          this.$store.commit('usersStore/setMyFollower', res.data[0].follower)
        }).catch(res => {}).then(() => { this.loadUsers = false })
    }
  },
  
}

</script>

<style lang="scss">
.PortfolioList-btn{
  display: flex;
}
.itemPort-item {
  display: inline-block;
  margin-right: 10px;
}

.itemPort-enter-active,
.itemPort-leave-active {
  transition: all 1s ease;
}

.itemPort-leave-to{
  opacity: 0;
  transform: translateY(-30px);
}
.itemPort-enter-from{
  opacity: 0;
  transform: translateY(30px);
}
</style>
