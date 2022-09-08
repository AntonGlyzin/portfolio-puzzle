<template>
  <div class="top_chrome">
    <div class="browser">
      <initStartVue />
      <headerSite />
      <ProgressBar
        v-if="$store.state.isLoad"
        class="sticky-top rounded-0 border-orange-500"
        mode="indeterminate"
        style="height: .5em;z-index: 1050; position: sticky !important;"
      />
      <navBar class="sticky-top" />
      <SpeedDial
        v-if="$store.state.user"
        :model="getMenuMobile"
        direction="right"
        class="myspeeddial"
        :radius="125"
        type="semi-circle"
        :rotate-animation="false"
        show-icon="fa fa-puzzle-piece"
      />
      <mainSite />
    </div>
    <footerSite />
  </div>
</template>

<script>
import headerSite from '@/components/headerSite'
import navBar from '@/components/navBar'
import mainSite from '@/components/mainSite'
import footerSite from '@/components/footerSite'
import initStartVue from './views/initStart.vue'
export default {
  name: 'MyApp',
  components: {
    initStartVue,
    headerSite,
    navBar,
    mainSite,
    footerSite
  },
  data () {
    return {}
  },
  computed: {
    getMenuMobile () {
      let listmenu = []
      const listIcon = ['pi pi-user-edit',
                        'fa fa-commenting-o',
                        'pi pi-comments',
                        'fa fa-pencil-square-o',
                        'pi pi-images',
                        'fa fa-address-card-o',
                        'fa fa-users',
                        'fa fa-bell-o',
                        'pi pi-sign-out']
      for (const [index, icon] of listIcon.entries()) {
        listmenu.push({
          icon: icon,
          command: () => {
            this.$router.push({ name: 'about-me' })
            this.$store.commit('usersStore/setIndexMenu', index)
          }
        })
      }               
      return listmenu
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.p-ripple .p-ink {
    background: rgba($color: #f79e50, $alpha: .3);
}
@media screen and (min-width: 540px) {
  .myspeeddial{
    // display: none !important;
  }
}
.myspeeddial{
  position: fixed !important;
  top: 411px;
  z-index: 5 !important;
  .fa-puzzle-piece{
    font-size: 2rem !important;
  }
  .p-speeddial-button.p-button.p-button-icon-only {
    width: 3.5rem;
    height: 3.5rem;
}
  button{
    box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
    &:focus{
      box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1), 0px 4px 5px -2px rgba(0, 0, 0, 0.12), 0px 10px 15px -5px rgba(0, 0, 0, 0.2);
    }
    // width: 5rem !important;
    // height: 5rem !important;
    
  }
  .p-button{
  border-radius: 1px !important;
  }
}
main{
  background-color: whitesmoke;
}
@media screen and (max-width:500px) {
  .timeline .timeline-body{
    padding: 20px 5px !important;
  }
  .timeline-header .userimage{
    width: 40px !important;
    height: 40px !important;
  }
  .timeline-comment-box .user{
    width: 40px !important;
    height: 40px !important;
  }
  .p-dialog .p-dialog-content{
    padding: 10px !important;
  }
  .p-dialog {
        width: 100vw !important;
        height: 100vh !important;
        max-width: 99% !important;
        max-height: 98% !important;
        min-width: 340px;
  }
  .timeline-comment-box{
    padding: 10px !important;
    margin-left: -7px !important;
    margin-right: -6px !important;
  }
  .blog-item {
    padding: 7px !important;
  }
  .itemsPort .form-bags{
    padding: 7px !important;
  }
  .items-comment{
    max-width: 98% !important;
  }
  .about{
    // padding: 7px !important;
  }
  .p-tabview .p-tabview-panels{
    padding: 7px !important;
  }
  .profile-edit{
    padding: 7px !important;
  }
  .card{
    padding: 2px !important;
  }
  .profile div{
    padding: 5px !important;
  }
  .items-comment .items-comment .media{
    margin-left: 0px !important;
  }
  .about .p-3 {
    padding: 5px !important;
  }
  .p-dialog .p-dialog-footer{
    padding: 7px !important;
  }
  .p-button{
        padding: 0.75rem 0.25rem !important;
  }
  .timeline .timeline-time{
    left: -17px !important;
  }
  .timeline:before{
    left: 16% !important;
  }
  .timeline-icon{
        left: 11% !important;
  }
  .timeline .timeline-body{
    margin-left: 23% !important;
  }
  .container-comment{
    padding: 20px 7px !important;
  }
}
</style>
