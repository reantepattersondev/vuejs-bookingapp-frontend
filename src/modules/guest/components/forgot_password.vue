<template>
  <div class="flex flex-row ">
      <div class="flex flex-col flex-grow justify-center pl-14 text-white">
        <h1 class="text-8xl ">Booking Room</h1>
        <span class=" w-8/12 mt-10">
          There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
        </span>
      </div>
      <div class="flex flex-col justify-evenly form-container h-screen bg-white bg-opacity-0 pl-3 pr-3">
        <div>
          <div class="p-3 bg-white bg-opacity-50">
            <md-field md-clearable>
              <label class="font-bold text-white">
                Username or Email
                </label>
              <span class="md-prefix">
                <font-awesome-icon icon="user" />
              </span>
              <md-input v-model="username" placeholder="Please enter username or email"></md-input>
            </md-field>
          </div>
        </div>
        <div>
          <div>
            <md-button class="md-raised md-primary w-full m-0"  @click="sendEmail()">Send Reset Email</md-button>
          </div>
          <div class="mt-3">
            <md-button class="md-primary w-full m-0" @click="onBackToLogin()">Back to Login</md-button>
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
export default {
  name: 'ForgotPassword',
  props: {
    msg: String
  },
  data: () => {
    return {
      username: "",
      busy : false,
      result : false,
      snackbar: {
        show: false,
        msg: ""
      }
    }
  },
  methods: {
    onBackToLogin() {
      this.$router.push('signin')
    },
    async sendEmail() {
      const response = await this.$store.dispatch('APP_STATE_FORGOT_PSW', this.username) 
      this.result = response.data.forgotPassword.success
      if(this.result) {
        this.snackbar.msg = "Password reset mail is sent"
      } else {
        this.snackbar.msg = "Not found user. Try again with correct email address please"
      }
      this.snackbar.show = true
    }
  }
}
</script>


<style scoped language="scss">
  .form-container {
    backdrop-filter: blur(10px);
    min-width: 400px;
  }
  .input-container {
    background: white;
  }
</style>