<template>
  <div class="flex spinner-container w-screen h-screen bg-white bg-opacity-10 absolute top-0 left-0 z-50">
      <div class="animate-spin spinner  m-auto  bg-center bg-no-repeat bg-cover">
      </div>
  </div>
</template>

<script>
export default {
  name: 'CommonSpinner',
  props: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .spinner-container {
        backdrop-filter: blur(10px);
    }
    .spinner {
        width: 200px;
        height: 200px;
        background-image: url('~@/assets/img/spinner.png');
    }
</style>