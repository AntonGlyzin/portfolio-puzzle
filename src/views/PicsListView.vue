<template>
     <div class="gallery" id="gallery">
        <div class="gallery-item" v-for="img in getPics" :key="img.id">
            <div class="content"  ><img :src="img.link" @click="showPic" alt=""></div>
        </div>
        <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="pagePic==1 ? 'disabled' : ''">
            <a class="page-link" @click="changePage('-')" >-</a>
          </li>
          <li class="page-item" v-for="page in getPageCount" :key="page" :class="pagePic==page ? 'active' : ''">
            <a class="page-link" @click="pagePic = page">{{page}}</a></li>
          <li class="page-item" :class="pagePic==getPageCount ? 'disabled' : ''">
            <a class="page-link" @click="changePage('+')" >+</a>
          </li>
        </ul>
      </nav>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'pics-list',
  props: {
    catpic: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      pagePic: 1
    }
  },
  components: {},
  computed: {
    ...mapState({
      backPics: state => state.picsStore.backPics,
      pic: state => state.picsStore.frontPics,
      limitPic: state => state.picsStore.limitPic
    }),
    getPageCount () {
      return Math.ceil(this.pic.length / this.limitPic)
    },
    getPics () {
      const offsetStart = (this.pagePic - 1) * this.limitPic
      const offsetEnd = offsetStart + this.limitPic
      const pics = []
      if (offsetStart < this.pic.length) {
        for (let i = offsetStart; i < offsetEnd; i++) {
          if (this.pic.length !== i) pics.push(this.pic[i])
        }
      }
      return pics
    }
  },
  methods: {
    ...mapActions({
      fetchPics: 'picsStore/fetchPics'
    }),
    changePage (sym = '') {
      if ((sym === '+') && (this.pagePic < this.getPageCount)) this.pagePic += 1
      if ((sym === '-') && (this.pagePic > 1)) this.pagePic -= 1
    },
    showPic (item) {
      item.path[1].classList.toggle('full')
    }
  },
  mounted () {
    this.$store.commit('setPrefixMenu', 'pics')
    if (this.$route.params.catpic !== 'all') {
      this.fetchPics({ catpic: this.$route.params.catpic })
    } else {
      this.fetchPics({ catpic: undefined })
    }
  },
  watch: {
    catpic (val) {
      if (val && (val !== 'all')) {
        const pics = this.backPics.filter(item => item.type_content === val)
        this.$store.commit('picsStore/setfrontPics', pics)
      } else if (val === 'all') {
        this.$store.commit('picsStore/setfrontPics', this.backPics)
      }
    }
    // pics (val) {
    //   console.log(val + '------')
    //   if (val === 'pics') {
    //     this.$store.commit('picsStore/setfrontPics', this.backPics)
    //   }
    // }
  }

}
</script>

<style scoped lang="scss">
.full {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: rgba(0,0,0,0.75) !important;
  display: flex;
  align-items: center;
  &:hover{
    cursor: default;
  }
}

.full img {
  left: 50%;
  transform: translate3d(0, 0, 0);
  animation: zoomin 1s ease;
  max-width: 88%;
  max-height: 88%;
  margin: auto;
  &:hover{
    cursor: pointer;
  }
}
.byebye {
  opacity: 0;
}
.byebye:hover {
  transform: scale(0.2) !important;
}
.gallery {
  padding: 25px;
    padding-top: 61px;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    &-item{
      .href{
        text-decoration: none;
        color: #303030;
        &:hover, &:active{
          color: #000000;
        }
      }
    }
    nav{
      padding-top: 33px;
      width: 100%;
      z-index: 0;
      a{
        cursor: pointer;
      }
      .page-item.active .page-link {
          z-index: 0;
          color: #fff;
          background-color: #e67e22;
          border-color: #e67e22;
      }
      .page-link {
        color: #4f585e;
      }
    }
}
.gallery img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 4px #333;
  transition: all 200ms ease;
}
.gallery img:hover {
  box-shadow: 0 0 32px #333;
  transform: scale(1.025);
}
.gallery .content {
  padding: 4px;
}
.gallery .gallery-item {
  transition: all 0.5s ease;
  cursor: pointer;
  width: 250px;
  background-color: #bfc2c5;
  margin: 10px;
  padding: 1em;
  box-shadow: 0 1px 3px #575555 inset;
}
@media (max-width: 600px) {
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
  }
}
@media (max-width: 400px) {
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
  }
}
@keyframes zoomin {
  0% {
    max-width: 50%;
    transform: rotate(-30deg);
    filter: blur(4px);
  }
  30% {
    filter: blur(4px);
    transform: rotate(-80deg);
  }
  70% {
    max-width: 50%;
    transform: rotate(45deg);
  }
  100% {
    max-width: 100%;
    transform: rotate(0deg);
  }
}
</style>
