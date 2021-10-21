<template>
  <div>
    <router-view></router-view>
    <CommonSpinner v-if="$store.state.AppState.busy == true"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    components: {
    }
  }
</script>

<style>
</style>
