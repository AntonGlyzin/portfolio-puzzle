import axios from 'axios'

export const eventStore = {
  state: () => ({
    events: [],
    count: 0,
    page: 1,
    isLoad: true,
    lastHref: '',
    isNextPage: true
  }),
  mutations: {
    setEvents (state, events) { state.events = events },
    setIsLoad (state, bool) { state.isLoad = bool },
    setlastHref (state, lastHref) { state.lastHref = lastHref },
    setPage (state, page) { state.page = page },
    setisNextPage (state, page) { state.isNextPage = page }
  },
  actions: {
    clearPage ({ state, commit }) {
      commit('setisNextPage', true)
      commit('setPage', 1)
      commit('setEvents', [])
    },
    fetchEvents ({ state, commit }, payload) {
      payload.params.page = state.page
      if (!state.isNextPage) return false
      commit('setisNextPage', false)
      commit('setPage', state.page + 1)
      commit('setIsLoad', true)
      axios.get(this.state.hostmeapi + payload.path, { params: payload.params })
        .then(res => {
          const data = [...state.events, ...res.data.results]
          commit('setEvents', data)
          if (res.data.next) commit('setisNextPage', true)
        }).catch(res => {}).then(res => {
          commit('setIsLoad', false)
        })
    }
  },
  namespaced: true
}
