<template>
  <div class="about">
    <SignupBag
      v-if="EntryPoint.entry"
      @goNext="goNextLay"
    />
    <RegistryBag
      v-if="EntryPoint.registry"
      @goNext="goNextLay"
    />
    <tabsProfileVue
      v-if="EntryPoint.profile"
      @goNext="goNextLay"
    />
  </div>
</template>
<script>
import SignupBag from '@/components/UI/SignupBag.vue'
import RegistryBag from '@/components/UI/registryUser.vue'
import tabsProfileVue from '@/components/UI/tabsProfile.vue'
// import axios from 'axios'
import { mapState } from 'vuex'
export default {
  name: 'AboutView',
  metaInfo () {
    return {
      title: 'Моя комната'
      // meta: [
      //   {
      //     name: 'description',
      //     content: this.post.description
      //   },
      //   {
      //     name: 'Keywords',
      //     content: this.post.key_words
      //   }
      // ]
    }
  },
  components: {
    SignupBag,
    RegistryBag,
    tabsProfileVue
  },
  data () {
    return {
      EntryPoint: {
        registry: false,
        profile: false,
        entry: true
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  watch: {
    user (val) {
      if (val) {
        this.EntryPoint.profile = true
        this.EntryPoint.registry = false
        this.EntryPoint.entry = false
      }
    }
  },
  mounted () {
    // this.$store.commit('setIsLoad', false)
    const prefix = this.$route.href.split('/')[1]
    this.$store.commit('setPrefixMenu', prefix)
    if (this.user) {
      this.EntryPoint.profile = true
      this.EntryPoint.registry = false
      this.EntryPoint.entry = false
    }
  },
  methods: {
    goNextLay (layer) {
      this.EntryPoint = layer
    }
  }
}
</script>

<style lang="scss" scoped>
.about{
  // padding-top: 30px;
}

</style>
