<template>
  <div class="flex flex-row h-screen">
      <div class=" bg-white bg-opacity-0 pl-3 pr-3 m-auto">
        <div class="form-container h-auto p-5">
          <div>
            <div class="p-3 bg-white bg-opacity-50">
              <md-field>
                <label class="font-bold text-white">
                  New password
                  </label>
                <span class="md-prefix">
                  <font-awesome-icon icon="user-secret" />
                </span>
                <md-input v-model="password.newPassword" placeholder="New password" type="password"></md-input>
              </md-field>
            </div>
            <div class="p-3 mt-3 bg-white bg-opacity-50">
              <md-field>
                <label class="font-bold text-white">
                  Confirm password
                </label>
                <span class="md-prefix">
                  <font-awesome-icon icon="user-secret" />
                </span>
                <md-input v-model="password.confirmPassword" placeholder="Confirm password" type="password"></md-input>
              </md-field>
            </div>
          </div>
          <div class="mt-2">
            <div>
              <md-button class="md-raised md-primary w-full m-0" @click="setPassword()">Set Password</md-button>
            </div>
            <div class="mt-3">
              <md-button class="md-primary w-full m-0" @click="gotoLogin()">Goto Login</md-button>
            </div>
          </div>
        </div>
      </div>
      <md-snackbar :md-active.sync="snackbar.show" md-persistent>
        <span>{{snackbar.msg}}</span>
        <md-button class="md-primary" @click="snackbar.show = false">Dismiss</md-button>
      </md-snackbar>
  </div>
</template>

<script>
import {resetPassword} from '@/common/service/authService'
export default {
  name: 'ResetPassword',
  data: () => {
    return {
      password: {
        newPassword:"",
        confirmPassword:""
      },
      snackbar: {
        show: false,
        msg: "This link is expired. Try with another please"
      }
    }
  },
  methods: {
    async setPassword() {
      const {data} = await resetPassword(this.$route.params.token, this.password.newPassword)
      if(data.resetPassword.success) {
        this.$router.push("/guest/signin")
      } else {
        this.snackbar.show = true
      }
    },
    gotoLogin() {
      this.$router.push("/guest/signin")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-container {
    backdrop-filter: blur(10px);
    min-width: 400px;
  }
  .input-container {
    background: white;
  }
</style>