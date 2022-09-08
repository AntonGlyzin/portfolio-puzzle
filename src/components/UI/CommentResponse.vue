<template>
    <div>
          <div   v-for="comment in comments" :key="comment?.id" >
              <div   class="media-res" v-if="comment">
              <a :name="comment.id" :id="'comment'+comment.id"></a>
                    <i class="fa fa-user ava" aria-hidden="true" v-if="!comment?.user?.photo"></i>
                    <img class="rounded-circle img-thumbnail" :src="comment.user.photo" alt="" v-else style="max-height: 109px;">
                    <div class="media-body ms-3">
                        <h4 class="media-heading">
                          <p v-if="!comment?.user?.full_name">{{comment.name}}</p>
                          <p v-else>{{comment.user.full_name}}</p>
                        <p class="calendar"><i class="fa fa-calendar"></i> {{comment.get_date}}</p></h4>
                        <p>{{comment.body}}</p>
                        <div class="d-flex justify-content-end action-comment" >
                          <btnCustomVue :myClass="'del'" :msgBtn="'Удалить'" @click="$emit('removeComment', comment.id)"  v-if="comment.is_me_comment && $store.state.usertoken"  data-bs-toggle="modal" data-bs-target="#portModalDel">
                          <i class="fa fa-trash" aria-hidden="true"></i>
                          </btnCustomVue>
                          <!-- <button @click="$emit('removeComment', comment.id)" data-bs-toggle="modal" data-bs-target="#portModalDel" v-if="comment.is_me_comment && $store.state.usertoken" class="del">
                          <span class='text'>Удалить</span><span class="icon"><i class="fa fa-trash" aria-hidden="true"></i></span></button> -->
                        </div>
                    </div>
                </div>
              </div>
        </div>
</template>

<script>
import btnCustomVue from '@/components/UI/btnCustom.vue'
export default {
  name: 'comment-resp',
  props: {
    comments: {
      type: Array
    }
  },
  components: {
    btnCustomVue
  }
}
</script>

<style  lang="scss" scoped>
.itemsPort{
  // .fade-enter-active{
  //   transition: opacity 2s;
  // }
 .fade-enter-active,
.fade-leave-active {
  transition: all .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  // opacity: 0;
  transform: scaleY(0);
  margin: 0;
}
.captcha{
  overflow: hidden;
}
  .action-comment {
    .del{
      background: #cf443e;
    }
    .say{
      background: #4f585e;
    }
    button {
      width: 150px;
      height: 35px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border: none;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
    }

    button, button span {
      transition: 200ms;
    }

    button .text {
      transform: translateX(35px);
      color: white;
      font-weight: bold;
    }
    .del .icon{
      border-left: 1px solid #ab3936;
    }
    .say .icon{
      border-left: 1px solid #42494e;
    }
    button .icon {
      position: absolute;
      transform: translateX(110px);
      height: 26px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button i {
      width: 15px;
      color: #eee;
    }

    .del:hover {
      background: #dd514b;
    }
    .say:hover{
      background: #e67e22;
    }

    button:hover .text {
      color: transparent;
    }

    button:hover .icon {
      width: 150px;
      border-left: none;
      transform: translateX(0);
    }

    button:focus {
      outline: none;
    }
  }
  .input-group-text{
    background-color: #fff;
  }
  .captcha{
    margin-top: 20px;
  }
  .form-bags-name-tel{
    padding-bottom: 20px;
  }
  .form-bags {
    padding: 55px;
    max-width: 676px;
    box-sizing: border-box;
    .form-control{
      &:focus{
        border: 1px solid #e67e22;
        box-shadow: none;
      }
    }
  }
  .items-comment{
    padding: 55px;
    max-width: 676px;
    box-sizing: border-box;
  }
  .media-res {
    border-top:1px dashed #DDDDDD;
    padding:20px 0;
    margin:0;
    display: flex;
        background-color: #f1f1f1;
    .media-body{
      width: 100%;
    }
    .ava{
      font-size: 5.1em;
      margin-right: 16px;
      color: #4f585e;
    }
    .pull-left {
      margin-right:20px;
      display: flex;
      list-style-type: none;
    }
    h4 {
      margin: 0 0 -6px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      .calendar {
        font-size:.7em;
        padding-right: 20px;
            font-weight: 900;
      }
      p{
        font-size: .7em;
        font-weight: 900;
      }
    }
    p {
      margin-bottom:15px;
      text-align:justify;
    }
    .pull-left li {
        // color:#AAAAAA;
        // font-size:12px;
        padding-right: 10px;
        // font-weight:600;
      }
  }
}
</style>
