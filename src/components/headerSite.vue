<template>
  <header class="pt-3 pb-2">
    <a
      href="#"
      class="red"
    />
    <a
      href="#"
      class="amber"
    />
    <a
      href="#"
      class="green"
    />
    <div class="logo-bg ms-2 p-1">
      <svg
        id="Capa_1"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 206.185 206.185"
        xml:space="preserve"
        class="logo"
      >
        <path
          d="M168.395,92.03c-3.313,0-6.574,0.492-9.687,1.44V51.833c0-4.142-3.357-7.5-7.5-7.5h-38.232
          c1.241-3.513,1.888-7.253,1.888-11.104C114.864,14.906,99.958,0,81.635,0S48.405,14.906,48.405,33.229
          c0,3.851,0.646,7.592,1.888,11.104H12.061c-4.143,0-7.5,3.358-7.5,7.5v49.721c0,2.515,1.261,4.863,3.357,6.252
          c2.097,1.389,4.75,1.636,7.066,0.654c2.243-0.95,4.631-1.431,7.097-1.431c10.052,0,18.23,8.178,18.23,18.229
          c0,10.051-8.178,18.229-18.23,18.229c-2.466,0-4.853-0.481-7.097-1.431c-2.316-0.982-4.97-0.735-7.066,0.654
          c-2.097,1.389-3.357,3.737-3.357,6.252v49.721c0,4.142,3.357,7.5,7.5,7.5h45.687c0.007,0.001,0.015,0,0.02,0
          c4.143,0,7.5-3.358,7.5-7.5c0-1.152-0.259-2.243-0.724-3.219c-0.756-2.032-1.139-4.163-1.139-6.341
          c0-10.052,8.178-18.229,18.229-18.229s18.229,8.178,18.229,18.229c0,2.332-0.439,4.609-1.305,6.77
          c-0.926,2.311-0.645,4.931,0.75,6.993c1.396,2.062,3.723,3.297,6.212,3.297h45.687c4.143,0,7.5-3.358,7.5-7.5v-41.636
          c3.112,0.948,6.373,1.44,9.687,1.44c18.322,0,33.229-14.906,33.229-33.229S186.718,92.03,168.395,92.03z"
        /></svg>
    </div>
    <div class="url">
      <div class="input-group mb-3">
        <input
          id="basic-search"
          ref="basicSearch"
          v-model="searchField"
          type="text"
          class="form-control searchMobile"
          placeholder="Поиск..."
          aria-label="Username"
          aria-describedby="basic-addon1"
        >
        <span
          id="basic-search-span"
          class="input-group-text searchMobile-span card"
          @click="goSearch"
        >
          <i
            class="fa fa-search"
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'HeaderSite',
  props: {},
  data () {
    return {
      searchField: '',
      trueSearch: ['portfolio', 'blog', 'follow']
    }
  },
  computed: {
    prefixHref () {
      return this.$route.path.split('/')[1]
    }
  },
  watch: {
    prefixHref (val) {
      if (this.trueSearch.includes(val)) {
        this.$refs.basicSearch.disabled = false
        this.$refs.basicSearch.placeholder = 'Поиск...'
      } else {
        this.$refs.basicSearch.disabled = true
        this.$refs.basicSearch.placeholder = 'Поиск...✖'
      }
    }
  },
  methods: {
    ...mapActions({
      clearPosts: 'postsStore/clearPosts'
    }),
    goSearch (e) {
      const prefix = this.$route.path.split('/')[1]
      if (this.trueSearch.includes(prefix)) {
        this.$router.push('?search=' + this.searchField)
      } else {
        this.$refs.basicSearch.value = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
header{
  .logo-bg{
    transition: all 300ms;
    border: 1px solid #3e4144;
    &:hover{
      box-shadow: 0 0px 4px #323232 inset;
    }
  }
  .logo{
    fill: whitesmoke;
    width: 40px;
  }
}
.searchMobile, .form-control:disabled, .form-control[readonly]{
  box-shadow: none;
  border-color: transparent;
  background-color: rgba(2,1,1,.3);
  height: 30px;
  color: #d5d5d5;
  &:focus{
    border: 1px solid #e67e22;
  }
}
.searchMobile-span{
  background-color: #687074;
  border: 1px solid #6e6e6e;
  transition: all 300ms;
  &:hover {
    // background-color: #4f585e;
    // border: 1px solid #4f585e;
    cursor: pointer;
  }
}
</style>
