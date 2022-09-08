<template>
  <div class="bucket-images-grid">
    <div v-intersection="loadPics" />
    <DataView
      :value="filterImages"
      :layout="layout"
      :paginator="true"
      :rows="9"
    >
      <template #header>
        <div class="grid grid-nogutter">
          <div
            class="col-6"
            style="text-align: left"
          >
            <Dropdown
              v-model="sortKey"
              :options="sortOptions"
              option-label="label"
              :show-clear="true"
              class="border-round-xs"
            />
          </div>
          <div
            class="col-6"
            style="text-align: right"
          >
            <Button
              icon="pi pi-refresh"
              class="p-button-outlined p-button-secondary"
              @click="refreshPic"
            />
          </div>
        </div>
      </template>
      <template #grid="slotProps">
        <div class="">
          <div class="overflow-hidden m-2 card">
            <div class="w-14rem h-14rem">
              <SplitButton
                :model="getMenuImg(slotProps.data)"
                class="p-button-outlined p-button-secondary w-100"
              />
              <Image
                :src="hostpics + '/' + slotProps.data.itemImageSrc"
                :alt="slotProps.data.title"
                class="myimg-grig"
                preview
              />
              <div class="" />
            </div>
            <div class="btn-action-img" />
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ImgModule',
  components: {
  },
  props: {},
  data() {
    return {
        sortOptions: [
            {label: 'Аватарки', value: 'ava'},
            {label: 'Портфолио', value: 'port'},
        ],
        selectedImg: null,
        sortKey: null,
        layout: 'grid',
        fetchPic: true
    }
  },
  computed: {
    ...mapState({
      myImages: state => state.usersStore.myImages,
      hostpics: state => state.hostpics,
      hostapi: state => state.hostmeapi,
      user: state => state.user
    }),
    filterImages () {
        if (!this.myImages) return []
        let newArr = []
        if (this.sortKey?.value == 'ava') {
          newArr = this.myImages.filter(item => { return item.is_ava })
        } else if (this.sortKey?.value == 'port') {
          newArr = this.myImages.filter(item => { return !item.is_ava })
        } else {
            newArr = this.myImages
        }
        return newArr
    }
  },
  methods: {
    getMenuImg (img) {
        let menu = [
                {
                    label: 'Скачать',
                    icon: 'pi pi-download',
                    command: () => {
                        this.dowloadImg(img)
                    }
                },
                {
                    label: 'Копировать ссылку',
                    icon: 'pi pi-copy',
                    command: () => {
                        this.copyLinkPic(img)
                    }
                },
                {
                    label: 'Удалить',
                    icon: 'pi pi-trash',
                    command: () => {
                        this.delImg(img)
                    }
                }
        ]
        if (img.is_ava) {
            menu.unshift(
                {
                    label: 'На аватарку',
                    icon: 'pi pi-id-card',
                    command: () => {
                        this.setImgAva(img)
                    }
                }
            )
        }
        return menu
    },
    delImg (img) {
        this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите удалить эту картинку?',
        group: 'bc',
        flag: 'delpic',
        pic: img.itemImageSrc
      })
    },
    dowloadImg (img) {
        let link = img.itemImageSrc
        const params = {
        img: link
      }
      this.$store.commit('setIsLoad', true)
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
        }).catch((res) => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    setImgAva (img) {
        this.$store.commit('setIsLoad', true)
        this.$http.put(this.hostapi + '/detail/user/pics/setava', img)
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
        }).catch((res) => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    loadPics () {
      if (this.myImages && !this.fetchPic) return false
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/pics/list')
        .then(res => {
            this.fetchPic = false
          this.$store.commit('usersStore/setMyImages', res.data)
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    refreshPic () {
        this.fetchPic = true
        this.loadPics()
    },
    copyLinkPic (img) {
      const link = this.hostpics + '/' + img.itemImageSrc
      let textArea = document.createElement("textarea")
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Ссылка скопирована',
            life: 3000,
            group: 'tl'
          })
      } catch (err) {
        this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Не удалось скопировать ссылку',
            life: 3000,
            group: 'tl'
          })
      }
      document.body.removeChild(textArea)
    }
  },
}
</script>
<style lang="scss">
.p-tieredmenu{
        border-radius: 3px !important;
    }
.bucket-images-grid{
    .p-button.p-button-secondary:enabled:focus{
        box-shadow: none;
    }
    .grid{
        justify-content: space-evenly;
    }
    .myimg-grig{
        margin: 0;
            width: 14rem !important;
            height: 14rem !important;
        img{
            max-width: 20rem !important;
            max-height: 20rem !important;
        }
    }
}
</style>
