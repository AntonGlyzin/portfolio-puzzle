<template>
  <div class="PortfolioList pt-6">
    <transition-group name="itemPort">
    <itemPort v-for="post in posts" :key="post.id" :post="post" />
    </transition-group>
    <spinnerMe v-show="isLoad"/>
    <div class="PortfolioList-btn" v-intersection="clickLoad"></div>
    <div class="d-flex justify-content-center p-6" v-if="isNextPage">
    <btnCustomVue style="height: 44px;" class="btn-me-registr mt-3" :myClass="'say'" :msgBtn="'Загрузить'" @click="clickLoad"  >
                   <i class="fa fa-arrow-down" aria-hidden="true"></i>
     </btnCustomVue>
    </div>
    <ScrollTop />
  </div>
</template>

<script>
import itemPort from '@/components/UI/itemPort.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'PortfolioList',
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
  data () {
    return {
      isLoad: false,
      backFromArticle: false
    }
  },
  props: {
    tags: {
      type: String,
      default: ''
    },
    search: {
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    user: {
      type: String,
      default: ''
    },
    taguser: {
      type: String,
      default: ''
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
      clickBtn: state => state.postsStore.clickBtn
    }),
    getNamePage () {
      const prefix = this.$route.href.split('/')[1]
      const pref = (prefix === 'portfolio') ? 'Мое портфолио' : (prefix === 'blog') ? 'Мой блог' : 'Портфолио'
      return pref
    }
  },
  methods: {
    ...mapActions({
      clearPosts: 'postsStore/clearPosts'
    }),
    getPages (route) {
      this.$store.commit('setPrefixMenu', route.prefix)
      if (!route.prefix) return false
      if (!this.isNextPage) return false
      const params = {
        page: this.currentPage
      }
      this.$store.commit('postsStore/setPage', this.currentPage + 1)
      if (route?.tags) params.tags = route.tags
      if (route?.user) params.user = route.user
      if (route?.search) {
        params.search = route.search
        params.title = ''
      }
      const linkAPI = this.$store.state.hostmeapi
      this.isLoad = true
      this.$http.get(linkAPI + `/${route.prefix}`, { params })
        .then(res => {
          this.posts.push(...res.data.results)
          if (!res.data.next) this.$store.commit('postsStore/setisNextPage', false)
        }).catch(res => {
          if (res?.response?.status === 404) {
            this.$store.commit('postsStore/setisNextPage', false)
          }
        }).then(() => {
          this.isLoad = false
        })
    },
    clickLoad () {
      const tags = this.$route.params.tags ||
                  this.$route.params.taguser
      const prefix = this.$route.href.split('/')[1]
      const search = this.$route.params.search
      const user = this.$route.params.user
      const route = {
        tags: tags,
        prefix: prefix,
        search: search,
        user: user
      }
      this.getPages(route)
    },
    loadPageFromHref () {
      if (this.lastHref === this.$route.href) return false
      this.clearPosts()
      setTimeout(() => {
        if (this.isLoad) return false
        this.clickLoad()
      }, 500)
    },
    clearIf () {
      if (this.lastHref === this.$route.href) return false
      this.clearPosts()
    }
  },
  mounted () {
    this.clearIf()
    this.$store.commit('postsStore/setlastHref', this.$route.href)
  },
  watch: {
    tags (val) {
      if (val) this.loadPageFromHref()
      this.$store.commit('postsStore/setlastHref', this.$route.href)
    },
    search (val) {
      if (val) this.loadPageFromHref()
    },
    taguser (val) {
      if (val) this.loadPageFromHref()
      this.$store.commit('postsStore/setlastHref', this.$route.href)
    }
  },
  unmounted () {
    document.getElementById('basic-search').value = ''
  }
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
