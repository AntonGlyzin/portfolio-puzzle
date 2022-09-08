<template>
  <div class="registry">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="display: none;"
    >
      <symbol
        id="check-circle-fill"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
      </symbol>
      <symbol
        id="info-fill"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
      </symbol>
      <symbol
        id="exclamation-triangle-fill"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </symbol>
    </svg>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <div class="card-group mb-0 entry">
            <div class="card p-4">
              <div class="card-body">
                <h1>Войти</h1>
                <p class="text-muted">
                  Вход на страницу
                </p>
                <div
                  v-if="errMsg"
                  class="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <svg
                    class="bi flex-shrink-0 me-2"
                    width="24"
                    height="24"
                    role="img"
                    aria-label="Danger:"
                  ><use xlink:href="#exclamation-triangle-fill" /></svg>
                  <div>
                    {{ errMsgDetail }}
                  </div>
                </div>
                <Message
                  v-if="msgShowFlg"
                  :key="'info'"
                  :severity="'info'"
                >
                  Сменить пароль возможно в <a
                    href="https://t.me/GenieByGlyzinBot"
                    class="text-reset"
                  >телеграм боте Жасмин - @GenieByGlyzinBot</a><br> В меню <code>Мое портфолио</code>.
                </Message>
                <form>
                  <div class="input-group mb-3">
                    <span class="input-group-addon"><i class="fa fa-user" /></span>
                    <input
                      v-model="username"
                      autocomplete
                      name="username"
                      type="text"
                      class="form-control"
                      :class="errMsgName ? 'is-invalid' : ''"
                      placeholder="Username"
                      required
                    >
                    <div class="invalid-feedback">
                      Пожалуйста, введите свой username.
                    </div>
                  </div>
                  <div class="input-group mb-4 flex-nowrap ">
                    <span class="input-group-addon">
                      <i class="fa fa-lock" /></span>
                    <Password
                      v-model="password"
                      autocomplete
                      name="password"
                      class="pass-entry"
                      toggle-mask
                      placeholder="Password"
                      :feedback="false"
                      :class="errMsgPass ? 'p-invalid' : ''"
                      @keypress.enter="goEntry"
                    />
                    <InlineMessage
                      v-if="errMsgPass"
                      style="height:38px"
                    >
                      введите свой пароль
                    </InlineMessage>
                  </div>
                </form>
                <div class="d-flex flex-column align-items-end">
                  <btnCustomVue
                    :my-class="'say mb-3'"
                    :msg-btn="'Войти'"
                    style="height: 45px;"
                    @click="goEntry"
                  >
                    <i
                      class="fa fa-sign-in"
                      aria-hidden="true"
                    />
                  </btnCustomVue>
                  <div class="col-6 text-right">
                    <button
                      type="button"
                      class="btn btn-link px-0"
                      @click="memberPass"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card text-white bg-registr py-5 d-md-down-none">
              <div class="card-body text-center">
                <div class="justify-content-center">
                  <h2>Регистрация</h2>
                  <p>Зачем нужна регистрация?</p>
                  <ul class="justify-content-start svoisvt list-none">
                    <li>
                      <i
                        class="fa fa-briefcase"
                        aria-hidden="true"
                      /> Чтобы создать свое портфолио.
                    </li>
                    <li>
                      <i
                        class="fa fa-book"
                        aria-hidden="true"
                      /> Ввести личный блог.
                    </li>
                    <li>
                      <i
                        class="fa fa-bar-chart"
                        aria-hidden="true"
                      /> Создавать свои события в ленте.
                    </li>
                    <li>
                      <i
                        class="fa fa-id-card-o"
                        aria-hidden="true"
                      /> На основе пунктов выше выстроить личную карту для работадателя.
                    </li>
                    <li>
                      <i
                        class="fa fa-heartbeat"
                        aria-hidden="true"
                      /> Свободно лайкать и комментировать других пользователей.
                    </li>
                    <li>
                      <i
                        class="fa fa-hourglass-end"
                        aria-hidden="true"
                      /> Не тратить время на ввод каптчи.
                    </li>
                    <li>
                      <i
                        class="fa fa-user-circle-o"
                        aria-hidden="true"
                      /> Подписываться на интересные для вас проекты, статьи и события.
                    </li>
                    <li>
                      <i
                        class="fa fa-comments-o"
                        aria-hidden="true"
                      /> Обсуждать проекты в чате.
                    </li>
                    <!-- <li>
                      <i
                        class="fa fa-line-chart"
                        aria-hidden="true"
                      /> Чтобы комментарий выводился выше анонимных.
                    </li> -->
                  </ul>
                  <buttonPortfVue
                    class="btn-me-registr mt-3 shadow-sm"
                    @click="goTo"
                  >
                    <i
                      class="fa fa-user-circle"
                      aria-hidden="true"
                    />
                    Регистрация
                  </buttonPortfVue>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import buttonPortfVue from './buttonPortf.vue'
import Cookies from 'js-cookie'
export default {
  name: 'RegistryView',
  components: {
    buttonPortfVue
  },
  emits: ['goNext'],
  data () {
    return {
      username: '',
      password: '',
      msgShowFlg: false,
      errMsgName: false,
      errMsgPass: false,
      errMsg: false,
      errMsgDetail: ''
    }
  },
  methods: {
    memberPass () {
      this.msgShow = ''
      this.msgShowFlg = true
    },
    goTo () {
      const EntryPoint = {
        registry: true,
        profile: false,
        entry: false
      }
      this.$emit('goNext', EntryPoint)
    },
    goEntry () {
      if (this.username.trim() === '') {
        this.errMsgName = true
        setTimeout(() => {
          this.errMsgName = false
        }, 5000)
        return false
      }
      if (this.password.trim() === '') {
        this.errMsgPass = true
        setTimeout(() => {
          this.errMsgPass = false
        }, 5000)
        return false
      }
      const host = this.$store.state.hostme
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const params = new URLSearchParams()
      params.append('username', this.username.trim())
      params.append('password', this.password.trim())
      this.$store.commit('setIsLoad', true)
      this.$http.post(`${host}/api/token/`, params, config).then(res => {
        Cookies.set('usertoken', res.data.access, { expires: 15 })
        Cookies.set('username', this.username.trim(), { expires: 15 })
        this.$cookies.remove('keyword')
        this.$store.commit('setUserName', this.username.trim())
        this.$store.commit('setUserToken', res.data.access)
        this.username = ''
        this.password = ''
        window.location.reload()
      }).catch(res => {
        this.errMsgDetail = res.response.data.detail
        if (!this.errMsgDetail) this.errMsgDetail = 'Ошибка авторизации'
        this.errMsg = true
        setTimeout(() => {
          this.errMsg = false
        }, 7000)
        return false
      }).then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>

<style  lang="scss">
.pass-entry{
  height: 38px;
  width: 100%;
  input {
    border-radius: 0;
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>

 .svoisvt{
      text-align: start;
    }
.btn-me-registr{
    width: 100%;
}
.container {
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;
    width: 100%;
    .btn-link{
        color: #4f585e;
        &:hover{
            color: #e67e22;
        }
        &:focus{
            box-shadow: 0 0 0 0.25rem rgb(230 126 34 / 28%);
        }
    }
    .form-control{
        &:focus{
            box-shadow: 0 0 0 0.25rem rgb(230 126 34 / 28%);
        }
    }
}
.input-group-addon{
    padding: 5px;
    background-color: #4f585e;
    border: 1px solid #a1abb1;
    i{
        color: #f9f9f9;
    }
}

.card-columns .card {
    margin-bottom: 0.75rem;
}
.text-muted {
    color: #9faecb !important;
}

p {
    margin-top: 0;
    margin-bottom: 1rem;
}
.mb-3 {
    margin-bottom: 1rem !important;
}

.input-group {
    position: relative;
    display: flex;
    width: 100%;
}
.justify-content-center{
    width: 100%;
}
.bg-registr{
    background-color: #4f585e !important;
}
.btn-primary{
    border-radius: 0;
    background-color: #e67e22;
    border-color: #e67e22;
    &:focus{
        box-shadow: 0 0 0 0.25rem rgb(230 126 34 / 28%);
    }
}
@media screen and (max-width:850px){
  .entry{
    display: flex;
    flex-direction: column;
    &:last-child{
      margin-top: 5px !important;
    }
  }
}
</style>
