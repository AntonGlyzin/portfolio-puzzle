<template>
  <div class="registry">
    <div class="container rounded bg-white mt-5 mb-5 card">
      <transition name="fade">
        <AlertMsgVue
          :err-flag="errFlag"
          :flag-msg="flagMsg"
          :my-msg="alertMsg"
          @closeFlag="(flag) => {flagMsg = flag}"
        />
      </transition>
      <div class="row d-flex justify-content-center">
        <div class="col-md-8 border-right">
          <div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="text-right">
                Регистрация
              </h4>
            </div>
            <form>
              <div class="row mt-2">
                <div class="col-md-12">
                  <label class="labels">Username</label> <label class="labels">*НЕЛЬЗЯ*МЕНЯТЬ*</label>
                  <input
                    v-model="username"
                    type="text"
                    class="form-control border-noround"
                    placeholder="Username"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Имя</label>
                  <input
                    v-model="first_name"
                    type="text"
                    class="form-control border-noround"
                    placeholder="Ваше имя"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Фамилия</label>
                  <input
                    v-model="last_name"
                    type="text"
                    class="form-control border-noround"
                    placeholder="Ваша фамилия"
                  >
                </div>
                <div class="col-md-12">
                  <label class="labels">Пароль</label>
                  <Password
                    v-model="password1"
                    autocomplete
                    class="pass-entry"
                    toggle-mask
                    placeholder="Password"
                  />
                </div>
                <div class="col-md-12">
                  <label class="labels">Пароль</label>
                  <Password
                    v-model="password2"
                    autocomplete
                    class="pass-entry"
                    toggle-mask
                    placeholder="Password"
                    :feedback="false"
                  />
                </div>
                <div class="col-md-12 input-group mt-3 captcha">
                  <span class="input-group-text"><img
                    :src="$store.state.hostme+''+imgCaptch"
                    style="margin: 0;"
                    alt="captcha"
                    class="captcha"
                  ></span>
                  <input
                    v-model="captchInput"
                    type="text"
                    class="form-control"
                    aria-label="Sizing example input"
                    name="captcha_1"
                    autocapitalize="off"
                    autocomplete="off"
                    placeholder=""
                    autocorrect="off"
                    spellcheck="false"
                  >
                  <input
                    id="id_captcha_0"
                    type="hidden"
                    name="captcha_0"
                    :value="keyCaptch"
                    required=""
                  >
                </div>
              </div>
            </form>
            <div class="mt-4 text-end d-flex justify-content-between">
              <btnCustomVue
                style="height: 47px;"
                class="btn-me-registr ms-1"
                :my-class="'say'"
                :msg-btn="'Назад'"
                @click="goTo"
              >
                <i
                  class="fa fa-arrow-left"
                  aria-hidden="true"
                />
              </btnCustomVue>
              <btnCustomVue
                style="height: 47px;width: 159px;"
                class="btn-me-registr ms-1"
                :my-class="'say'"
                :msg-btn="'Начать'"
                @click="goToRegistry"
              >
                <i
                  class="fa fa-address-card"
                  aria-hidden="true"
                />
              </btnCustomVue>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AlertMsgVue from './AlertMsg.vue'
import { getCaptchAndCSRF } from '@/components/captchService'
import Cookies from 'js-cookie'
export default {
  name: 'RegistryUser',
  components: {
    AlertMsgVue
  },
  emits: ['goNext'],
  data () {
    return {
      username: '',
      first_name: '',
      last_name: '',
      password1: '',
      password2: '',
      alertMsg: '',
      flagMsg: false,
      errFlag: false,
      hostapi: '',
      keyCaptch: '',
      captchInput: '',
      imgCaptch: ''
    }
  },
  mounted () {
    this.hostapi = this.$store.state.hostmeapi
    const keyword = this.$cookies.get('keyword')
    if (keyword) {
      this.alertMsg = keyword
      this.errFlag = false
      this.flagMsg = true
    } else {
      getCaptchAndCSRF(this.$store.state.hostme + '/api', this)
    }
  },
  methods: {
    showMsg (alertMsg = '', errFlag = true) {
      this.alertMsg = alertMsg
      this.errFlag = errFlag
      this.flagMsg = true
      setTimeout(() => {
        this.flagMsg = false
      }, 6000)
    },
    goToRegistry () {
      const user = {}
      if (this.password1.trim() && this.password2.trim()) {
        if (this.password1.trim() === this.password2.trim()) {
          user.password = this.password1.trim()
        } else {
          this.showMsg('Пароли не совпадают', true)
          return false
        }
      } else {
        this.showMsg('Пароль должен быть заполнен', true)
        return false
      }
      if (!this.first_name.trim() || !this.last_name.trim()) {
        this.showMsg('Поле *Имя* и *Фамилия* обязательны к заполнению', true)
        return false
      }
      user.first_name = this.first_name
      user.last_name = this.last_name
      if (!this.username.trim()) {
        this.showMsg('Поле *Username* обязателен к заполнению', true)
        return false
      }
      if (!this.captchInput.trim()) {
        this.showMsg('Обязательно заполните каптчу', true)
        return false
      }
      user.username = this.username.trim()
      user.captcha_0 = this.keyCaptch
      user.captcha_1 = this.captchInput.trim()
      user.last_username = Cookies.get('username')

      this.$store.commit('setIsLoad', true)
      this.$http.post(`${this.hostapi}/registration/user`, user)
        .then(res => {
          Cookies.set('username', user.username, { expires: 365 })
          this.$cookies.set('keyword', res.data.keyword, { expires: 365 })
          this.first_name = ''
          this.last_name = ''
          this.username = ''
          this.password1 = ''
          this.password2 = ''
          this.captchInput = ''
          this.alertMsg = res.data.keyword
          this.errFlag = false
          this.flagMsg = true
        }).catch(res => {
          if (res.response.data.detail) {
            this.showMsg(res.response.data.detail, true)
          } else if (res.response.data.username) {
            this.showMsg('Такой username уже существует', true)
          } else if (res.response.data.captcha) {
            this.showMsg(res.response.data.captcha, true)
            getCaptchAndCSRF(this.$store.state.hostme + '/api', this)
          } else {
            this.showMsg('Ошибка регистрации. Попробуйте попозже.', true)
          }
        }).then(() => {
          this.$store.commit('setIsLoad', false)
        })
    },
    goTo () {
      const EntryPoint = {
        registry: false,
        profile: false,
        entry: true
      }
      this.$emit('goNext', EntryPoint)
    }
  }
}
</script>

<style lang="scss" >
.registry{

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
@media screen and (max-width:520px){
  .registry{
    button:hover .icon{
          transform: translateX(0) !important;
    }
  button{
      .icon{
            transform: translateX(84px) !important;
      }
    }
  }
}
</style>
