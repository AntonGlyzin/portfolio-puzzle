<template>
  <div class="contain-resum-card d-flex flex-column">
    <Toolbar class="mb-4">
      <template #start>
        <btnCustomVue
          style="height: 44px;"
          class="btn-me-registr mr-2"
          :my-class="'say'"
          :msg-btn="'Скачать'"
          @click="getDocServer"
        >
          <i
            class="fa fa-download"
            aria-hidden="true"
          />
        </btnCustomVue>
      </template>
    </Toolbar>
    <div v-intersection="getMyResume" />
    <p>
      <small class="text-muted">Эта информация не отображектся в анкете пользователя, а нужна лишь для формирования резюме.</small>
    </p>
    <div class="field pt-3 ">
      <span class="p-float-label">
        <InputText
          v-model="resumUser.needWork"
          class="w-100 border-noround m-0"
          type="text"
        />
        <label>Желаемая должность</label>
      </span>
    </div>
    <div class="field pt-3 ">
      <span class="p-float-label">
        <InputText
          v-model="resumUser.myphone"
          class="w-100 border-noround m-0"
          type="text"
        />
        <label>Телефон</label>
      </span>
    </div>
    <div class="field pt-3 ">
      <span class="p-float-label ">
        <Calendar
          v-model="resumUser.birthday"
          class="w-100 m-0 birthday-user"
          date-format="dd.mm.yy"
          :show-icon="true"
        />
        <label>День рождение</label>
      </span>
    </div>
    <div class="field pt-3 ">
      <span class="p-float-label">
        <InputText
          v-model="resumUser.mycity"
          class="w-100 border-noround m-0"
          type="text"
        />
        <label>Город</label>
      </span>
    </div>
    <div class="field mt-3">
      <p><small class="text-muted">Опыт работы</small></p>
      <div class=" opyt-work border-400" />
      <div v-if="resumUser.userWorks">
        <div
          v-for="(userWorks, index) in resumUser.userWorks"
          :key="index"
        >
          <div class="field pt-4">
            <span class="p-float-label">
              <InputText
                v-model="userWorks.pred"
                class="w-100 border-noround m-0"
                type="text"
              />
              <label>Организация, город</label>
            </span>
          </div>
          <div class="field pt-2">
            <span class="p-float-label">
              <Calendar
                v-model="userWorks.years"
                class="w-100 m-0 birthday-user"
                :show-icon="true"
                selection-mode="range"
                date-format="dd.mm.yy"
              />
              <label>Год работы</label>
            </span>
          </div>
          <div class="field pt-3">
            <span class="p-float-label">
              <InputText
                v-model="userWorks.doljn"
                class="w-100 border-noround m-0"
                type="text"
              />
              <label>Должность</label>
            </span>
          </div>
          <div class="field pt-2">
            <span class="p-float-label">
              <Textarea
                v-model="userWorks.mywork"
                rows="5"
                class="w-100 border-noround surface-100"
                :auto-resize="true"
              />
              <label>Каждая обязаность с новой строки</label>
            </span>
          </div>
          <div class="d-flex ps-1 pe-1 justify-content-end">
            <span
              v-if="index === resumUser.userWorks.length-1"
              class="cursor-pointer"
              @click="addWorksFields(resumUser.userWorks, { pred: '', years: '', mywork: '' })"
            >
              <i
                class="fa fa-plus me-1"
                aria-hidden="true"
              />
              <small>Добавить еще</small>
            </span>
            <span
              v-if="index === resumUser.userWorks.length-1 && trashWorks.length"
              class="cursor-pointer"
              @click="refreshWorks(resumUser.userWorks, trashWorks)"
            >
              <i
                class="fa fa-refresh me-1"
                aria-hidden="true"
              />
              <small>Восстановить</small>
            </span>
            <span
              v-if="resumUser.userWorks.length>1"
              class="cursor-pointer"
              @click="delWorksFields(resumUser.userWorks, index, trashWorks)"
            >
              <i
                class="fa fa-trash me-1"
                aria-hidden="true"
              />
              <small>Удалить</small>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="field pt-3 ">
      <p><small class="text-muted">Образование</small></p>
      <div class=" opyt-work border-400" />
      <div
        v-for="(userStudy, index) in resumUser.userStudy"
        :key="index"
      >
        <div class="field pt-3">
          <span class="p-float-label">
            <InputText
              v-model="userStudy.pred"
              class="w-100 border-noround m-0"
              type="text"
            />
            <label>Учебное заведение, город</label>
          </span>
        </div>
        <div class="field pt-1">
          <span class="p-float-label">
            <Calendar
              v-model="userStudy.years"
              class="w-100 m-0 birthday-user"
              :show-icon="true"
              selection-mode="range"
              date-format="dd.mm.yy"
            />
            <label>Года учебы</label>
          </span>
        </div>
        <div class="field pt-3">
          <span class="p-float-label">
            <InputText
              v-model="userStudy.form"
              class="w-100 border-noround m-0"
              type="text"
            />
            <label>Форма обечения</label>
          </span>
        </div>
        <div class="field pt-3">
          <span class="p-float-label">
            <InputText
              v-model="userStudy.fac"
              class="w-100 border-noround m-0"
              type="text"
            />
            <label>Факультет</label>
          </span>
        </div>
        <div class="field pt-3">
          <span class="p-float-label">
            <InputText
              v-model="userStudy.spec"
              class="w-100 border-noround m-0"
              type="text"
            />
            <label>Специальность</label>
          </span>
        </div>
        <div class="d-flex ps-1 pe-1 justify-content-end">
          <span
            v-if="index === resumUser.userStudy.length-1"
            class="cursor-pointer"
            @click="addWorksFields(resumUser.userStudy, { pred: '', years: '', form: '', fac: '', spec: '' })"
          >
            <i
              class="fa fa-plus me-1"
              aria-hidden="true"
            />
            <small>Добавить еще</small>
          </span>
          <span
            v-if="index === resumUser.userStudy.length-1 && trashStudy.length"
            class="cursor-pointer"
            @click="refreshWorks(resumUser.userStudy, trashStudy)"
          >
            <i
              class="fa fa-refresh me-1"
              aria-hidden="true"
            />
            <small>Восстановить</small>
          </span>
          <span
            v-if="resumUser.userStudy.length>1"
            class="cursor-pointer"
            @click="delWorksFields(resumUser.userStudy, index, trashStudy)"
          >
            <i
              class="fa fa-trash me-1"
              aria-hidden="true"
            />
            <small>Удалить</small>
          </span>
        </div>
      </div>
      <div class="field pt-3 ">
        <p><small class="text-muted">Допольнительное образование</small></p>
        <div class=" opyt-work border-400" />
        <div
          v-for="(plusStudy, index) in resumUser.plusStudy"
          :key="index"
        >
          <div class="field pt-4">
            <span class="p-float-label">
              <InputText
                v-model="plusStudy.pred"
                class="w-100 border-noround m-0"
                type="text"
              />
              <label>Учебное заведение, город</label>
            </span>
          </div>
          <div class="field pt-1">
            <span class="p-float-label">
              <Calendar
                v-model="plusStudy.years"
                class="w-100 m-0 birthday-user"
                :show-icon="true"
                selection-mode="range"
                date-format="dd.mm.yy"
              />
              <label>Года учебы</label>
            </span>
          </div>
          <div class="field pt-3">
            <span class="p-float-label">
              <InputText
                v-model="plusStudy.name"
                class="w-100 border-noround m-0"
                type="text"
              />
              <label>Название курса</label>
            </span>
          </div>
          <div class="d-flex ps-1 pe-1 justify-content-end">
            <span
              v-if="index === resumUser.plusStudy.length-1"
              class="cursor-pointer"
              @click="addWorksFields(resumUser.plusStudy, { pred: '', years: '', name: '' })"
            >
              <i
                class="fa fa-plus me-1"
                aria-hidden="true"
              />
              <small>Добавить еще</small>
            </span>
            <span
              v-if="index === resumUser.plusStudy.length-1 && trashPlusStudy.length"
              class="cursor-pointer"
              @click="refreshWorks(resumUser.plusStudy, trashPlusStudy)"
            >
              <i
                class="fa fa-refresh me-1"
                aria-hidden="true"
              />
              <small>Восстановить</small>
            </span>
            <span
              v-if="resumUser.plusStudy.length>1"
              class="cursor-pointer"
              @click="delWorksFields(resumUser.plusStudy, index, trashPlusStudy)"
            >
              <i
                class="fa fa-trash me-1"
                aria-hidden="true"
              />
              <small>Удалить</small>
            </span>
          </div>
        </div>
        <div class="field pt-1">
          <p><small class="text-muted">Мое хобби</small></p>
          <div class=" opyt-work border-400" />
          <span class="p-float-label mt-4">
            <Textarea
              v-model="resumUser.myHobby"
              rows="5"
              class="w-100 border-noround surface-100"
              :auto-resize="true"
            />
            <label>Каждое хобби с новой строки</label>
          </span>
        </div>
        <div class="field pt-1">
          <p><small class="text-muted">Языки</small></p>
          <div class=" opyt-work border-400" />
          <span class="p-float-label mt-4">
            <Textarea
              v-model="resumUser.myLang"
              rows="5"
              class="w-100 border-noround surface-100"
              :auto-resize="true"
            />
            <label>Каждый язык с новой строки</label>
          </span>
        </div>
        <div class="field pt-1">
          <p><small class="text-muted">Обо мне</small></p>
          <div class=" opyt-work border-400" />
          <span class="p-float-label mt-4">
            <Textarea
              v-model="resumUser.aboutme"
              rows="5"
              class="w-100 border-noround surface-100"
              :auto-resize="true"
            />
            <label>Расскажите о себе</label>
          </span>
        </div>
        <div class="field pt-1">
          <p><small class="text-muted">Мои достижения</small></p>
          <div class=" opyt-work border-400" />
          <span class="p-float-label mt-4">
            <Textarea
              v-model="resumUser.iDostig"
              rows="5"
              class="w-100 border-noround surface-100"
              :auto-resize="true"
            />
            <label>Каждое достижение с новой строки</label>
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 d-flex justify-content-end pb-3">
      <btnCustomVue
        style="height: 44px;"
        class="btn-me-registr "
        :my-class="'say'"
        :msg-btn="'Сохранить'"
        @click="saveResume"
      >
        <i
          class="fa fa-floppy-o"
          aria-hidden="true"
        />
      </btnCustomVue>
    </div>
  </div>
</template>
<script>
import btnCustomVue from './btnCustom.vue'
export default {
  name: 'ResumCard',
  components: {
    btnCustomVue
  },
  props: {},
  data () {
    return {
      pageLoad: true,
      trashWorks: [],
      trashStudy: [],
      trashPlusStudy: [],
      hostapi: null,
      resumUser: {
        birthday: null,
        mycity: null,
        needWork: '',
        myphone: '',
        userWorks: [
          {
            pred: '',
            doljn: '',
            years: '',
            mywork: ''
          }
        ],
        userStudy: [
          {
            pred: '',
            years: '',
            form: '',
            fac: '',
            spec: ''
          }
        ],
        plusStudy: [
          {
            pred: '',
            years: '',
            name: ''
          }
        ],
        iDostig: '',
        myHobby: '',
        myLang: '',
        aboutme: ''
      }
    }
  },
  mounted () {
    this.hostapi = this.$store.state.hostmeapi
  },
  methods: {
    downloadFile (data) {
      const value = window.atob(data.file)
      const byteNumbers = []
      for (const item of value) {
        byteNumbers.push(item.charCodeAt(0))
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blobPic = new Blob([byteArray], { type: 'text/plain' })
      const linkpic = document.createElement('a')
      linkpic.href = URL.createObjectURL(blobPic)
      linkpic.download = `resume-${data.user}.docx`
      linkpic.click()
      URL.revokeObjectURL(linkpic.href)
    },
    getDocServer () {
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/getdoc')
        .then(res => {
          this.downloadFile(res.data)
        }).catch(res => {
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: 'Что-то пошло не так...',
            life: 3000,
            group: 'tl'
          })
        }).then(() => { this.$store.commit('setIsLoad', false) })
    },
    addWorksFields (obj, val) {
      obj.push(val)
    },
    delWorksFields (obj, index, trash) {
      const delArr = obj.splice(index, 1)
      trash.push({ index: index, el: delArr[0] })
    },
    refreshWorks (obj, trash) {
      const work = trash.pop()
      obj.splice(work.index, 0, work.el)
    },
    updateDate (obj) {
      for (const [i, item] of obj.entries()) {
        for (const [j, year] of item.years.entries()) {
          obj[i].years[j] = new Date(year)
        }
      }
    },
    saveResume () {
      this.$store.commit('setIsLoad', true)
      this.$http.put(this.hostapi + '/detail/user/resume/save', this.resumUser)
        .then(res => {
          this.$toast.add({
            severity: 'success',
            summary: 'Уведомление',
            detail: 'Резюме сохраненно',
            life: 3000,
            group: 'tl'
          })
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    },
    getMyResume () {
      if (!this.pageLoad) return false
      const myResume = this.$store.state.usersStore.myResume
      if (myResume) {
        this.resumUser = myResume
        return false
      }
      this.pageLoad = false
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/resume/get')
        .then(res => {
          this.resumUser = res.data
          if (this.resumUser.birthday) {
            this.resumUser.birthday = new Date(this.resumUser.birthday)
          }
          this.updateDate(this.resumUser.userWorks)
          this.updateDate(this.resumUser.userStudy)
          this.updateDate(this.resumUser.plusStudy)
          this.$store.commit('usersStore/setMyResume', res.data)
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>
<style lang="scss">
 .p-datepicker{
        z-index: 1600 !important;
    }
.contain-resum-card{
    .birthday-user{
        input{
            border-radius: 0;
        }
    }
    .opyt-work{
        border-top: 1px solid #322 ;
    }
}
</style>
