import { createStore } from 'vuex'
// import axios from 'axios'
import { postsStore } from '@/store/postsStore'
import { picsStore } from '@/store/picsStore'
import { eventStore } from '@/store/evetsStore'
import { usersStore } from '@/store/usersStore'

export default createStore({
  state: {
    hostme: 'http://localhost:8002',
    hostmeapi: 'http://localhost:8002/api/bag',
    hostws: 'ws://localhost:8002/ws/bags',
    // hostme: 'https://antonioglyzin.pythonanywhere.com',
    // hostmeapi: 'https://antonioglyzin.pythonanywhere.com/api/bag',
    
    // hostme: 'https://puzzle-chats.herokuapp.com',
    // hostmeapi: 'https://puzzle-chats.herokuapp.com/api/bag',
    // hostws: 'wss://puzzle-chats.herokuapp.com/ws/bags',
    hostpics: 'https://storage.googleapis.com/antonio-glyzin.appspot.com',
    socketData: null,
    sendSocket: null,
    prefix: '',
    user: null,
    isLoad: false
  },
  mutations: {
    setPrefixMenu (state, prefix) { state.prefix = prefix },
    setUser (state, user) { state.user = user },
    setSocketData (state, data) { state.socketData = data },
    setIsLoad (state, isLoad) { state.isLoad = isLoad },
    setSendSocket (state, sendSocket) { state.sendSocket = sendSocket },
    changeUserPhoto (state, photos) {
      state.user.photo = photos.photo
      state.user.photo_user = photos.photo_user
    }
  },
  modules: {
    postsStore: postsStore,
    picsStore: picsStore,
    eventStore: eventStore,
    usersStore: usersStore
  }
})
