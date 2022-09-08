import axios from 'axios'

export const picsStore = {
  state: () => ({
    backPics: [],
    frontPics: [],
    countPics: 0,
    limitPic: 2,
    pagePic: 1,
    isLoad: false, // нужна для спинера
    // isNextPage: true, // нужна для дозагрузки
    lastHref: '' //  для возврата от частного к общему
    // prefix: ''
  }),
  mutations: {
    setbackPics (state, pics) { state.backPics = pics },
    setIsLoad (state, bool) { state.isLoad = bool },
    setfrontPics (state, pics) { state.frontPics = pics },
    setCountPics (state, pics) { state.countPics = pics },
    setPagePic (state, pics) { state.countPics = pics }
  },
  actions: {
    fetchPics ({ state, commit }, payload) {
      commit('setIsLoad', false)
      axios.get(this.state.hostmeapi + `/${this.state.prefix}`)
        .then(res => {
          commit('setbackPics', res.data)
          let pics = []
          if (payload.catpic) {
            pics = state.backPics.filter(item => item.type_content === payload.catpic)
            commit('setfrontPics', pics)
          } else {
            commit('setfrontPics', res.data)
          }
        }).catch(res => {
          console.log('Ошибка при загрузки данных!')
        }).then(res => {
          commit('setIsLoad', true)
        })
    }
  },
  namespaced: true
}
