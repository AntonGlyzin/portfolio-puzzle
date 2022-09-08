<template>
  <button class="portolio-btn">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'PortfButton',
  props: {}
}
</script>

<style  lang="scss">
 .portolio-btn {
    border: 1px solid #e67e22;
    padding: 10px;
    width: 220px;
    background: #e67e22;
    outline: none;
    color: #FFF;
    transition: all 300ms;
    &:hover > i{
        opacity: 1;
        -webkit-animation: moveFromTop 300ms ease-in-out;
        animation: moveFromTop 300ms ease-in-out;
    }
    &:hover{
        cursor: pointer;
        background: #f1882c;
        border: 1px solid #f1882c;
    }
}

</style>
