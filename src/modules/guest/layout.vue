<template>
    <div class="layout-container min-w-full bg-fixed bg-center bg-no-repeat bg-cover">
        <router-view></router-view>
    </div>
</template>

<script>

import OfficeBackground from '~/assets/img/office_background.jpg'

export default {
  name: 'GuestLayout',
  props: {
    msg: String
  },
  data: () => {
    return {
      background : OfficeBackground
    }
  }
}
</script>

<style scoped>
    .layout-container {
        width: 100%;
        height: 100vh;
        background-image: url('~@/assets/img/office_background.jpg');
    }
</style>
