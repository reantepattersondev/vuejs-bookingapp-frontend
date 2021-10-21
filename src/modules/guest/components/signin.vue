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
          <div class="p-3 mt-3 bg-white bg-opacity-50">
            <md-field>
              <label class="font-bold">
                Password
              </label>
              <span class="md-prefix">
                <font-awesome-icon icon="user-secret" />
              </span>
              <md-input v-model="password" placeholder="Please enter password" type="password"></md-input>
            </md-field>
          </div>
        </div>
        <div>
          <div>
            <md-button class="md-raised md-primary w-full m-0" @click="onLogin()">Login</md-button>
          </div>
          <div class="mt-3">
            <md-button class="md-primary w-full m-0" @click="onForgotPassword()">Forgot Password</md-button>
          </div>
        </div>
      </div>
      <CommonSpinner v-if="lazy == true"/>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import { login } from '@/common/service/auth'

const SigninMutation = gql`
  mutation ($username: String!, $password: String!) {
    signin(username:$username, password:$password) {
      token
      refreshToken
      user {
        id
        username
        email
        userPermissions {
          id
          codename
        }
        groups {
            name
        }
        profile {
          role
        }
      }
    }
  }
`;

  export default {
    name: 'Signin',
    props: {
      msg: String
    },

    created: function() {
      console.log('created')
      window.localStorage.setItem("apollo-token", '')
    },

    data: function() {
      return {
        username: "",
        password: "",
        lazy : false,
        loginProcess : false
      }
    },
    methods : {
      onLogin() {
        this.lazy = true;
        this.loginProcess = true
        // this.$store.dispatch('AppStateLogin', {
        //     username: this.username,
        //     password: this.password
        // })
        //signin
        this.$apollo.mutate({
          mutation: SigninMutation,
          variables: {
            username: this.username,
            password: this.password
          },
        }).then( data => {
          console.log(data)
          window.localStorage.setItem("apollo-token", data['data']['signin']['token'])
          window.localStorage.setItem("apollo-refresh-token", data['data']['signin']['refreshToken'])
          
          let profile = data.data.signin.user
          
          login(profile)
          // let role = this.userRoleName(profile.groups)

          // this.lazy = false

          // if(role === "admin") {
          //   this.$router.push("/authenticated/admin/")
          // } else {
          //   this.$router.push("/authenticated/agent/")
          // }
          
          let role = profile.profile.role
          
          if(role == "A_1") {
            this.$router.push("/authenticated/admin/")
          } else {
            this.$router.push("/authenticated/agent/")
          }
          
        })
        .catch( error => console.log(error))
      },
      onForgotPassword() {
        this.$router.push('/guest/forgot_password')
      },
      userRoleName(groups) {
          if(groups.length == 0) {
              return ""
          } else {
              return (groups[0]['name'])
          }
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped language="scss">
  .form-container {
    backdrop-filter: blur(10px);
    min-width: 400px;
  }
  .input-container {
    background: white;
  }
</style>
<style>
  input:focus {
    outline: none;
  }
  .md-field {
    margin: 0px  !important;
  }
  .md-button {
    margin: 0px  !important;
  }
</style>