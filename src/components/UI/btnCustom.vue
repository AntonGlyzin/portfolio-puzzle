<template>
  <button :class="myClass">
    <span class="text">{{ msgBtn }}</span>
    <span class="icon"><slot /></span>
  </button>
</template>

<script>
export default {
  name: 'BtnCustom',
  props: {
    msgBtn: {
      type: String,
      default: ''
    },
    myClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
    .icon{
        color: rgb(255, 255, 255);
        font-size: 20px;
    }
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
      transform: translateX(20px);
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
      transform: translateX(104px);
      height: 26px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button .i {
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

</style>
