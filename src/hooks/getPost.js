import axios from 'axios'
import { ref, onUpdated } from 'vue'

export function getPosts (link, page = 1, countPost = 3) {
  const posts = ref([])
  // const posts = []
  // const isLoad = false
  // const link = ref(linkVar)
  // const countPage = ref(1)
  // const countPost = ref(10)
  const isLoad = ref(false)
  // axios.get(link, {
  //   params: {
  //     _limit: countPost,
  //     _page: page
  //   }
  // }).then(res => {
  //   posts.value = res.data
  // }).catch(res => {
  //   console.log('Ошибка при загрузки данных!')
  // }).then((res) => {
  //   isLoad.value = true
  // })

  // onUpdated(() => {
  //   fetching()
  // })

  onUpdated(() => {
    axios.get(link, {
      params: {
        _limit: countPost,
        _page: page
      }
    }).then(res => {
      posts.value = res.data
    }).catch(res => {
      console.log('Ошибка при загрузки данных!')
    }).then((res) => {
      isLoad.value = true
    })
  })

  return {
    posts, isLoad
  }
}
