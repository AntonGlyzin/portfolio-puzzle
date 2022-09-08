<template>
  <div class="bucket-images gallery-admin-pic">
    <div v-intersection="loadPics" />
    <Galleria
      :value="myImages"
      :num-visible="5"
      :show-item-navigators="true"
      :circular="true"
      :active-index="activeIndex"
      :show-thumbnails="showThumbnails"
      :responsive-options="responsiveOptions"
      @update:activeIndex="i => activeIndex = i"
    >
      <template #header>
        <div class="custom-galleria-footer justify-content-between">
          <Button
            class="ms-3"
            icon="pi pi-trash"
            @click="confirmDeletePic(myImages[activeIndex].itemImageSrc)"
          />
          <Button
            class="ms-3"
            icon="pi pi-refresh"
            @click="fetchPic"
          />
          <Button
            v-if="myImages[activeIndex].is_ava"
            class="ms-3"
            icon="pi pi-id-card"
            label="На аву"
            @click="setPicAva(myImages[activeIndex])"
          />
          <Button
            class="me-3"
            icon="pi pi-download"
            @click="downloadImage(myImages[activeIndex].itemImageSrc)"
          />
        </div>
      </template>
      <template #item="slotProps">
        <img
          :src="hostpics + '/' +slotProps.item.itemImageSrc"
          :alt="slotProps.item.title"
          style="width:100%;"
        >
      </template>
      <template #thumbnail="slotProps">
        <img
          :src="hostpics + '/' +slotProps.item.thumbnailImageSrc"
          :alt="slotProps.item.title"
          style="height: 70px"
        >
      </template>
      <template #footer>
        <div class="d-flex custom-galleria-footer pt-2">
          <div class="field-checkbox ms-2">
            <Checkbox
              id="ava"
              v-model="checkAva"
              name="ava"
              :binary="true"
            />
            <label for="ava">Аватарки</label>
          </div>
          <div class="field-checkbox ms-2">
            <Checkbox
              id="pic"
              v-model="checkPic"
              name="pic"
              :binary="true"
            />
            <label for="pic">Из постов</label>
          </div>
        </div>
        <div class="custom-galleria-footer overflow-hidden flex-wrap">
          <Button
            icon="pi pi-list"
            @click="showThumbnails = !showThumbnails"
          />
          <span
            v-if="myImages"
            class="title-container d-flex flex-wrap"
          >
            <span>{{ activeIndex + 1 }}/{{ myImages.length }}</span>
            <span class="title ">{{ myImages[activeIndex].title }}</span>
          </span>
        </div>
      </template>
    </Galleria>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Galleria from 'primevue/galleria'
export default {
  name: 'BucketImages',
  components: {
    Galleria
  },
  props: {
    Index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeIndex: 0,
      checkAva: true,
      checkPic: true,
      showThumbnails: true,
      responsiveOptions: [
        {
          breakpoint: '1024px',
          numVisible: 5
        },
        {
          breakpoint: '768px',
          numVisible: 3
        },
        {
          breakpoint: '560px',
          numVisible: 1
        }
      ]
    }
  },
  computed: {
    ...mapState({
      myImagesS: state => state.usersStore.myImages,
      hostpics: state => state.hostpics,
      hostapi: state => state.hostmeapi,
      user: state => state.user
    }),
    myImages () {
      let newArr = [{ itemImageSrc: '', thumbnailImageSrc: '', title: '', is_ava: false }]
      if (this.myImagesS) {
        if (this.checkAva) {
          newArr = this.myImagesS.filter(item => { return item.is_ava })
        }
        if (this.checkPic) {
          newArr = [...newArr, ...this.myImagesS.filter(item => { return !item.is_ava })]
        }
      }
      return newArr
    }
  },
  watch: {
    Index (val) {
      if (val) {
        this.activeIndex = val
      }
    },
    myImages (val) {
      if (val) {
        this.activeIndex = 0
      }
    }
  },
  methods: {
    setPicAva (item) {
      this.$http.put(this.hostapi + '/detail/user/pics/setava', item)
        .then(res => {
          this.user.photo = res.data.photo
          this.user.photo_user = res.data.photo_user
          this.$store.commit('setUser', this.user)
          this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Ваша аватарка изменилась',
            life: 3000,
            group: 'tl'
          })
        })
    },
    confirmDeletePic (pic) {
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить эту картинку?',
        group: 'bc',
        flag: 'delpic',
        pic: pic,
        activeIndex: this.activeIndex
      })
    },
    downloadImage (link) {
      const params = {
        img: link
      }
      this.$http.get(this.hostapi + '/detail/user/pics/download', { params })
        .then(res => {
          const value = window.atob(res.data)
          const byteNumbers = []
          for (const item of value) {
            byteNumbers.push(item.charCodeAt(0))
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blobPic = new Blob([byteArray], { type: 'image/png' })
          const linkpic = document.createElement('a')
          linkpic.href = URL.createObjectURL(blobPic)
          const len = link.split('/').length
          linkpic.download = link.split('/')[len - 1]
          linkpic.click()
          URL.revokeObjectURL(linkpic.href)
        })
    },
    loadPics () {
      if (this.myImagesS) return false
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/pics/list')
        .then(res => {
          this.$store.commit('usersStore/setMyImages', res.data)
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    fetchPic() {
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/pics/list')
        .then(res => {
          this.$store.commit('usersStore/setMyImages', res.data)
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>
<style lang="scss">
.gallery-admin-pic{
    max-width: 668px;
    margin: 0 auto;
}
</style>
<style lang="scss" scoped>
    .fullscreen {
        display: flex;
        flex-direction: column;

        .p-galleria-content {
            flex-grow: 1;
            justify-content: center;
        }
    }

    .p-galleria-content {
        position: relative;
    }

    .p-galleria-thumbnail-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }

    .p-galleria-thumbnail-items-container {
        width: 100%;
    }

    .custom-galleria-footer {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, .9);
        color: #ffffff;

        > button {
            background-color: transparent;
            color: #ffffff;
            border: 0 none;
            border-radius: 0;
            margin: .2rem 0;

            &.fullscreen-button {
                margin-left: auto;
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
    }

    .title-container {
        > span {
            font-size: .9rem;
            padding-left: .829rem;

            &.title {
                font-weight: bold;
            }
        }
    }

</style>
