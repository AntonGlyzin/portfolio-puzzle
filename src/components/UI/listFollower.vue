<template>
  <div class="mt-3 d-flex flex-column p-0 my-follower pl-3">
    <div v-intersection="getFollowers" />
    <transition-group name="animfollowlist">
      <div
        v-for="follower in followers"
        :key="follower.id"
        class="p-card p-3 mt-3 overflow-hidden"
      >
        <div class="d-flex align-items-center">
          <div class="image">
            <router-link :to="'/card/user/'+follower.username">
              <img
                :src="follower.photo"
                class="rounded"
              >
            </router-link>
          </div>
          <div class="ml-3 d-flex flex-column w-100 ">
            <h5 class="mb-0 mt-0">
              <router-link
                :to="'/card/user/'+follower.username"
                class="text-reset no-underline"
                style="border-bottom: 1px dotted;"
              >
                {{ follower.full_name }}
              </router-link>
            </h5>
            <div class="p-2 mt-2 d-flex font-medium">
              <div class="d-flex flex-column">
                <span class="font-medium">Проектов</span>
                <span class="number1">{{ follower.count_project }}</span>
              </div>
              <div class="d-flex flex-column">
                <span class="">Статей</span>
                <span class="number2">{{ follower.count_posts }}</span>
              </div>

              <div class="d-flex flex-column">
                <span class="font-medium">Подписчиков</span>
                <span class="number3">{{ follower.count_followers }}</span>
              </div>
            </div>
            <div class=" mt-2 d-flex justify-content-around my-follower-btns">
              <!-- <Button icon="pi pi-comments"
                            class="p-button-secondary p-button-outlined p-1"
                            label="Диалог"/> -->
              <Button
                icon="pi pi-user-minus"
                class="p-button-secondary p-button p-1 "
                label="Отписаться"
                @click="deleteFllower(follower)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    <Toast
      position="center"
      group="listFollow"
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ListFollower',
  components: {
  },
  props: {},
  data () {
    return {
      followers: [],
      isLoadData: false,
      hostapi: '',
      delFollower: null
    }
  },
  computed: {
    ...mapState({
      hostws: state => state.hostws,
      user: state => state.user,
      tabMenu: state => state.usersStore.indexMenu
    })
  },
  watch: {
    tabMenu (val) {
      this.isLoadData = false
    }
  },
  mounted () {
    this.hostapi = this.$store.state.hostmeapi
  },
  methods: {
    deleteFllower (user) {
      this.delFollower = user
      this.$toast.add({
        severity: 'warn',
        summary: 'Предупреждение',
        detail: 'Вы уверены, что хотите отписаться?',
        group: 'listFollow'
      })
    },
    onReject () {
      this.$toast.removeGroup('listFollow')
    },
    YesMethod (e) {
      this.$store.commit('setIsLoad', true)
      const data = {
        follower: [this.delFollower.id]
      }
      this.$http.put(this.hostapi + '/detail/user/follower', data)
        .then(res => {
          this.followers = this.followers.filter(item => { return item.id !== this.delFollower.id })
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
      this.$toast.removeGroup('listFollow')
    },
    getFollowers () {
      if (this.isLoadData) return
      // const follow = this.$store.state.usersStore.myFollower
      // if (follow) {
      //   this.followers = follow
      //   return
      // }
      this.fetchFollowers()
    },
    fetchFollowers () {
      this.$store.commit('setIsLoad', true)
      this.$http.get(this.hostapi + '/detail/user/follower')
        .then(res => {
          this.isLoadData = true
          this.followers = res.data[0].follower
          this.$store.commit('usersStore/setMyFollower', res.data[0].follower)
        }).catch(res => {}).then(() => { this.$store.commit('setIsLoad', false) })
    }
  }
}
</script>
<style lang="scss">
.animfollowlist-enter-active,
.animfollowlist-leave-active {
  transition: all 500ms ease;
}

.animfollowlist-leave-to{
  opacity: 0;
  transform: translateX(30px);
}
.animfollowlist-enter-from{
  opacity: 0;
}
.my-follower{
  .p-card{
    border-radius: 2px;
  }

}
.my-follower .image img{
      max-width: 150px ;
}
@media screen and (max-width: 643px) {
    .my-follower .image img {
      max-width: 110px ;
    }
}
@media screen and (max-width: 560px) {
    .my-follower .image img {
      max-width: 100px ;
    }
}
@media screen and (max-width: 543px) {
    .my-follower .image img {
      max-width: 100px ;
    }
    .my-follower-btns{
        flex-direction: column;
        width: 80%;
        button:last-child{
            margin-top: 15px;
        }
    }
}
</style>
