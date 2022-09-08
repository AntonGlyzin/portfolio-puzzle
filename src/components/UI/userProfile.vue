<template>
  <div class="profile">
    <div class="container rounded bg-white mt-5 mb-5">
      <div class="row ms-1">
        <div class="col-md-3 border-right m-1">
          <div class="d-flex flex-column align-items-center text-center">
            <Image
              class=" img-ava-profile mt-3"
              :src="user?.photo_user"
              width="250"
              preview
            />
          </div>
          <div
            class="mb-5  d-flex flex-column justify-content-center"
            style="max-width:400px; margin: 0 auto;"
          >
            <label
              for="formFile"
              class="form-label"
            >Загрузка аватарки</label>
            <input
              id="formFile"
              ref="image"
              class="form-control border-noround"
              type="file"
              @change="changeFile"
            >
            <button
              id="button-addon2"
              class="btn btn-outline-secondary mt-3 border-noround"
              type="button"
              @click="uploadFile"
            >
              Отправить
            </button>
          </div>
        </div>
        <div class="col-md-8 border-right">
          <div class="p-3 profile-edit">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">
                Редактор профиля
              </h4>
            </div>
            <form>
              <div class="row mt-3">
                <div class="col-md-12">
                  <label class="labels">Username</label>
                  <input
                    v-model="username"
                    type="text"
                    class="form-control border-noround"
                    disabled
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Имя</label>
                  <input
                    v-model="firstName"
                    type="text"
                    class="form-control border-noround"
                    placeholder="Ваше имя"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Фамилия</label>
                  <input
                    v-model="lastName"
                    type="text"
                    class="form-control border-noround"
                    placeholder="Ваша фамилия"
                  >
                </div>
                <div class="col-md-12 d-flex flex-column mt-2">
                  <label class="labels">Мои умения</label>
                  <div class="d-flex">
                    <input
                      v-model="skill"
                      type="text"
                      class="form-control border-noround"
                      placeholder="Если не нашли, то создайте"
                    >
                    <button
                      class="btn btn-outline-secondary border-noround"
                      type="button"
                      @click="addSkill"
                    >
                      Создать
                    </button>
                  </div>
                  <MultiSelect
                    v-model="myskils"
                    :class="'mt-1 border-noround'"
                    :style="{'background-color':'#f5f5f5', 'color':'#727272'}"
                    :filter="true"
                    :options="allSkills"
                    option-label="name"
                    placeholder="Выберите свои умения"
                  />
                  <div class="mt-1">
                    <Chip
                      v-for="myskill in myskils"
                      :key="myskill.id"
                      :label="myskill.name"
                    />
                  </div>
                </div>
                <div
                  v-for="link in links"
                  :key="link.id"
                  class="col-md-12"
                >
                  <label class="labels">Ссылка {{ link.name }}</label>
                  <input
                    v-model="link.link"
                    type="text"
                    class="form-control border-noround"
                    :placeholder="'Ссылка '+link.name"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Пароль</label>
                  <input
                    v-model="password1"
                    autocomplete
                    type="password"
                    class="form-control border-noround"
                    placeholder="Новый пароль"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Пароль</label>
                  <input
                    v-model="password2"
                    autocomplete
                    type="password"
                    class="form-control border-noround"
                    placeholder="Еще раз новый пароль"
                  >
                </div>
              </div>
            </form>
            <div class="mt-4 d-flex justify-content-end">
              <btnCustomVue
                style="height: 44px;"
                class="btn-me-registr mt-3"
                :my-class="'say'"
                :msg-btn="'Сохранить'"
                @click="updateData"
              >
                <i
                  class="fa fa-floppy-o"
                  aria-hidden="true"
                />
              </btnCustomVue>
            </div>
            <!-- <Toast position="center" group="tl" /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'AboutProfile',
  components: {},
  data () {
    return {
      id: 0,
      // img: '',
      username: '',
      firstName: '',
      lastName: '',
      password1: '',
      password2: '',
      Msg: '',
      flag: '',
      image: undefined,
      hostapi: '',
      isLoad: false,
      links: [],
      myskils: [],
      // allskils: [],
      skill: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      allSkills: state => state.usersStore.allskills
    })
  },
  mounted () {
    this.hostapi = this.$store.state.hostmeapi
    if (this.user) {
      this.id = this.user.id
      this.username = this.user.user.username
      this.firstName = this.user.user.first_name
      this.lastName = this.user.user.last_name
      // this.img = this.user.photo_user
      this.links = this.user.links
      this.myskils = this.user.myskils
      this.get_skills()
    }
  },
  methods: {
    addSkill () {
      if (!this.skill) {
        this.$toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: 'Заполните поле',
          life: 3000,
          group: 'tl'
        })
        return false
      }
      this.$store.commit('setIsLoad', true)
      this.$http.post(this.hostapi + '/detail/user/addskill', { skill: this.skill })
        .then(res => {
          const tmp = [...this.allSkills]
          tmp.push(res.data)
          this.$store.commit('usersStore/setAllSkills', tmp)
          this.flag = 'success'
          this.Msg = 'Ваше умение добавленно в список'
        }).catch(res => {
          this.flag = 'error'
          if (res.response?.data?.error) {
            this.Msg = res.response?.data?.error
          } else {
            this.Msg = 'Что-то пошло не так...'
          }
        }).then(() => {
          this.skill = ''
          this.$store.commit('setIsLoad', false)
          this.$toast.add({
            severity: this.flag,
            summary: 'Уведомление',
            detail: this.Msg,
            life: 3000,
            group: 'tl'
          })
        })
    },
    updateData () {
      const skillSend = []
      this.myskils.forEach(item => {
        skillSend.push(item.id)
      })
      const profile = {
        user: {
          first_name: this.firstName,
          last_name: this.lastName
        },
        links: JSON.stringify(this.links),
        myskils: skillSend
      }
      if (this.password1.trim() === this.password2.trim()) {
        if (this.password1.trim() && this.password2.trim()) {
          profile.user.password = this.password1.trim()
        }
      } else {
        this.Msg = 'Пароли не совпадают'
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: this.Msg,
          life: 3000,
          group: 'tl'
        })
        return
      }
      this.$store.commit('setIsLoad', true)
      this.$http.put(`${this.hostapi}/update/user`, profile)
        .then(res => {
          this.id = res.data.id
          this.username = res.data.user.username
          this.firstName = res.data.user.first_name
          this.lastName = res.data.user.last_name
          // this.img = res.data.photo_user
          this.links = res.data.links
          this.myskils = res.data.myskils
          this.$store.commit('setUser', res.data)
          this.password1 = ''
          this.password2 = ''
          this.Msg = 'Данные успешно сохраненны!'
          this.flag = 'success'
        })
        .catch(res => {
          this.Msg = 'Что-то пошло не так...'
          this.flag = 'error'
        })
        .then(() => {
          this.$store.commit('setIsLoad', false)
          this.$toast.add({
            severity: this.flag,
            summary: 'Уведомление',
            detail: this.Msg,
            life: 3000,
            group: 'tl'
          })
        })
    },
    uploadFile () {
      if (this.image === undefined) {
        this.$toast.add({
          severity: 'error',
          summary: 'Уведомление',
          detail: 'Вы не выбрали картинку',
          life: 3000,
          group: 'tl'
        })
        return false
      }
      const formData = new FormData()
      formData.append('file', this.image)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$store.commit('setIsLoad', true)
      this.$http.post(`${this.hostapi}/update/userphoto`,
        formData,
        config
      ).then(res => {
        // this.img = res.data.user.photo_user
        this.$store.commit('setUser', res.data.user)
        this.errMsg = ''
        this.flagSucc = true
        this.flag = 'success'
        this.Msg = 'Данные успешно сохраненны!'
      })
        .catch(res => {
          this.flag = 'error'
          if (res.response?.data?.detail) {
            this.Msg = res.response?.data?.detail
          } else {
            this.Msg = 'Ошибка при выгрузки картинки'
          }
        }).then(() => {
          this.$store.commit('setIsLoad', false)
          this.image = undefined
          this.$refs.image.value = null
          this.$toast.add({
            severity: this.flag,
            summary: 'Уведомление',
            detail: this.Msg,
            life: 3000,
            group: 'tl'
          })
        })
    },
    changeFile () {
      const type = this.$refs.image.files[0]?.type.split('/')[0]
      if (type === 'image') {
        if (Math.ceil(this.$refs.image.files[0].size / 1024) <= 1024) {
          this.image = this.$refs.image.files[0]
        } else {
          this.Msg = 'Изображение не должно превышать 1 Мб'
          this.$refs.image.value = null
          this.$toast.add({
            severity: 'error',
            summary: 'Уведомление',
            detail: this.Msg,
            life: 3000,
            group: 'tl'
          })
        } 
      }
    },
    get_skills () {
      const skills = this.$store.state.usersStore.allskills
      if (skills) {
        return
      }
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.$store.state.hostmeapi + '/detail/user/allskills')
        .then(res => {
          this.$store.commit('usersStore/setAllSkills', res.data)
        }).catch().then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>

<style lang="scss" >
.img-ava-profile{
  img{
    border-radius: 50% !important;
    padding: 0.25rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    max-width: 100%;
  }
}
.p-progressbar .p-progressbar-value {
    background: #e67e22 !important;
}
.profile{
 .container {
      background-color: whitesmoke !important;
  }
  .p-multiselect:not(.p-disabled):hover {
    border-color: #e67e22;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.form-control:focus {
    box-shadow: none;
    border-color: #e67e22;
}

.profile-button {
    background: #e67e22;
    box-shadow: none;
    border: none
}

.profile-button:hover {
    background: #f18525;
}

.profile-button:focus {
    background: #e67e22;
    box-shadow: none
}

.profile-button:active {
    background: #e67e22;
    box-shadow: none
}

.back:hover {
    color: #e67e22;
    cursor: pointer
}

.labels {
    font-size: 11px
}

.add-experience:hover {
    background: #e67e22;
    color: #fff;
    cursor: pointer;
    border: solid 1px #e67e22;
}
}
</style>
