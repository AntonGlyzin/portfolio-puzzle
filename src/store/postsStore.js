// import axios from 'axios'
export const postsStore = {
  state: () => ({
    posts: [],
    isLoad: false, // нужна для спинера
    currentPage: 1,
    limitPage: 1,
    isNextPage: true, // нужна для дозагрузки
    lastHref: '', //  для возврата от частного к общему
    search: '',
    prefix: '',
    backDetail: false
    // clickBtn: {}
  }),
  mutations: {
    setPosts (state, posts) { state.posts = posts },
    setPost (state, post) { state.post = post },
    setIsLoad (state, isLoad) { state.isLoad = isLoad },
    setPage (state, page) { state.currentPage = page },
    setisNextPage (state, page) { state.isNextPage = page },
    setlastHref (state, href) { state.lastHref = href },
    setSearch (state, word) { state.search = word },
    setPrefix (state, prefix) { state.prefix = prefix },
    setBackDetail (state, post) { state.backDetail = post }
    // setclickBtn (state, clickBtn) { state.clickBtn = clickBtn }
  },
  actions: {
    clearPosts ({ state, commit }) {
      commit('setisNextPage', true)
      commit('setPosts', [])
      commit('setSearch', '')
      commit('setPage', 1)
      commit('setlastHref', '')
    }
  },
  namespaced: true
}
