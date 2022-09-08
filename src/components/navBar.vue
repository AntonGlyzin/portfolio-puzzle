<template>
  <nav class="pt-3">
    <ul class="mcd-menu d-flex justify-content-center mt-2">
      <li>
        <router-link
          :to="{name:'about-me'}"
          :class="prefix=='aboutme' ? 'active' : ''"
        >
          <i
            v-if="notifyMsg || notifyComment || notifyOther"
            v-badge="notifyMsg + notifyComment + notifyOther"
            class="fa fa-sign-in"
          />
          <i
            v-else
            class="fa fa-sign-in"
          />
          <strong>Войти</strong>
          <small>Моя комната</small>
        </router-link>
      </li>
      <li>
        <a :class="prefix=='portfolio' || followPostfix == 'followportfolio' ? 'active' : ''">
          <i class="fa fa-briefcase" />
          <strong>Портфолио</strong>
          <small>Все проекты</small>
        </a>
        <ul>
          <li v-if="user">
            <router-link :to="'/portfolio?user=' + username">
              <span
                class="fa fa-tasks me-2"
                aria-hidden="true"
              />Мои проекты
            </router-link>
          </li>
          <li v-if="user">
            <router-link :to="'/follow/posts/portfolio'">
              <span
                class="fa fa-address-book-o me-2"
                aria-hidden="true"
              />Мои подписки
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'portfolio-main' }">
              <span
                class="fa fa-users me-2"
                aria-hidden="true"
              />Все проекты
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <a :class="prefix == 'blog' || followPostfix == 'followblog' ? 'active' : ''">
          <i class="fa fa-edit" />
          <strong>Записи</strong>
          <small>Блог и идеи</small>
        </a>
        <ul>
          <li v-if="user">
            <router-link :to="'/blog?user='+username">
              <span
                class="fa fa-user me-2"
                aria-hidden="true"
              />Мои статьи
            </router-link>
          </li>
          <li v-if="user">
            <router-link :to="'/follow/posts/blog'">
              <span
                class="fa fa-address-book-o me-2"
                aria-hidden="true"
              />Мои подписки
            </router-link>
          </li>
          <li>
            <router-link :to="{name: 'blog-main' }">
              <span
                class="fa fa-users me-2"
                aria-hidden="true"
              />Все статьи
            </router-link>
          </li>
        </ul>
      </li>
      <li v-if="user">
        <router-link
          :to="'/card/user/'+username"
          :class="prefix=='card' ? 'active' : ''"
        >
          <i class="fa fa-address-card" />
          <strong>Анкета</strong>
          <small>Пользователь</small>
        </router-link>
      </li>
      <li v-if="user">
        <a :class="prefix=='events' ? 'active' : ''">
          <i class="fa fa-calendar" />
          <strong>События</strong>
          <small>Я здесь</small>
        </a>
        <ul>
          <li v-if="user">
            <router-link :to="'/events?user='+username">
              <span
                class="fa fa-clock-o me-2"
                aria-hidden="true"
              />Моя хронология
            </router-link>
          </li>
          <li v-if="user">
            <router-link :to="'/follow/posts/events'">
              <span
                class="fa fa-address-book-o me-2"
                aria-hidden="true"
              />Мои подписки
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
    <Toast
      position="center"
      group="ext"
    >
      <template #message="slotProps">
        <div class="flex flex-column">
          <div class="text-center">
            <i
              class="pi pi-exclamation-triangle"
              style="font-size: 3rem"
            />
            <h4>{{ slotProps.message.summary }}</h4>
            <p>{{ slotProps.message.detail }}</p>
          </div>
          <div class="grid p-fluid">
            <div class="col-6">
              <Button
                class="p-button-success"
                label="Да"
                @click="YesMethod(slotProps.message)"
              />
            </div>
            <div class="col-6">
              <Button
                class="p-button-secondary"
                label="Нет"
                @click="onReject"
              />
            </div>
          </div>
        </div>
      </template>
    </Toast>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'NavSite',
  props: {},
  data () {
    return {
      link: '/getmenu',
      menu: [],
      searchField: '',
      style: 'active',
      flagexit: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      notifyMsg: state => state.usersStore.notifyMsg,
      notifyComment: state => state.usersStore.notifyComment,
      notifyOther: state => state.usersStore.notifyOther
    }),
    username () {
      return this.user?.user.username
    },
    prefix () {
      return this.$route.path.split('/')[1]
    },
    followPostfix () {
      return this.$route.path.split('/').slice(1)[0] + this.$route.path.split('/').slice(-1)[0]
    }
  },
  mounted () {},
  methods: {
    onReject () {
      this.$toast.removeGroup('ext')
    },
    YesMethod (e) {
      this.$cookies.remove('usertoken')
      this.$toast.removeGroup('ext')
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
