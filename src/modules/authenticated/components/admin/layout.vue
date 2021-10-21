<template>
  <div class="admin-container h-screen md-layout-column flex flex-col">
    <md-toolbar class="md-primary sticky top-0" md-sync-route>
      <div>
        <!-- <md-avatar class="md-avatar-icon ml-1">
          <md-icon></md-icon>
        </md-avatar> -->
      </div>
      <md-tabs class="md-primary ml-auto admin-tab mr-32" md-alignment="right" md-active-tab="tab-user">
        <md-tab id="tab-room" md-label="Rooms" md-icon="home" to="room"></md-tab>
        <md-tab id="tab-schedule" md-label="Schedule" md-icon="schedule" to="schedule"></md-tab>
        <md-tab id="tab-user" md-label="Users" md-icon="person" to="user"></md-tab>
      </md-tabs>
      <md-menu md-size="medium" md-align-trigger>
          <md-avatar md-menu-trigger class="md-avatar-icon ">
            <md-icon>person_pin</md-icon>
          </md-avatar>

        <md-menu-content>
          <md-menu-item>
            <md-button class="w-full" @click="onLogout">Profile</md-button>
          </md-menu-item>
          <md-menu-item>
            <md-button class="w-full" @click="onLogout">Logout</md-button>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    <div class="flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { logout } from '@/common/service/auth'

export default {
  name: 'AdminLayout',
  data: () => {
    return {
      
    }
  },
  methods : {
    onLogout() {
      logout()
      this.$router.push('/')
    }
  }
}
</script>

<style>
  .admin-tab .md-button-content {
    flex-direction: row !important;
    align-items: center;
  }
  .admin-tab .md-tab-nav-button {
    height: 48px !important;
  }
  .admin-tab .md-tab-label {
    margin: 0px !important;
    margin-left: 10px !important;
  }
</style>
