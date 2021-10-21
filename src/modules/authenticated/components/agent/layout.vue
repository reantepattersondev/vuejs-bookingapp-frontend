<template>
  <div class="admin-container h-screen">
    <md-toolbar class="md-primary sticky top-0" md-sync-route>
      <div>
        <!-- <md-avatar class="md-avatar-icon ml-1">
          <md-icon></md-icon>
        </md-avatar> -->
      </div>
      <md-tabs class="md-primary ml-auto admin-tab mr-32" md-alignment="right">
        <md-tab id="tab-room" md-label="Book Meeting" md-icon="home" to="booking"></md-tab>
        <md-tab id="tab-schedule" md-label="My Schedule" md-icon="schedule" to="schedule"></md-tab>
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
    <router-view></router-view>
  </div>
</template>

<script>
import { logout } from '@/common/service/auth'

export default {
  name: 'AgentLayout',
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
  .admin-container {
    background-color: #eee;
  }
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
