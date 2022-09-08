export const usersStore = {
  state: () => ({
    myposts: null,
    allskills: null,
    myImages: null,
    myResume: null,
    myFollower: null,
    indexMenu: 0,
    notifyMsg: 0,
    notifyOther: 0,
    notifyComment: 0,
    requestID: null
  }),
  mutations: {
    setAllSkills (state, allskills) { state.allskills = allskills },
    setPosts (state, myposts) { state.myposts = myposts },
    setMyImages (state, myImages) { state.myImages = myImages },
    setMyResume (state, myResume) { state.myResume = myResume },
    setMyFollower (state, myFollower) { state.myFollower = myFollower },
    setIndexMenu (state, indexMenu) { state.indexMenu = indexMenu },
    setNotifyMsg (state, notifyMsg) { state.notifyMsg = notifyMsg },
    setNotifyComment (state, notifyComment) { state.notifyComment = notifyComment },
    setRequestID (state, requestID) { state.requestID = requestID },
    setNotifyOther (state, notifyOther) { state.notifyOther = notifyOther }
  },
  actions: {},
  namespaced: true
}
