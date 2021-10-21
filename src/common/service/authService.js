import {Mutations} from '../../apollo/module/guest'
import apolloClient from '@/apollo';

const login = async (credential) => {
    return apolloClient.mutate({
        mutation: Mutations.SigninMutation,
        variables: {
            username: credential.username,
            password: credential.password
        }
    })
}

const forgotPassword = async (username) => {
  return apolloClient.mutate({
    mutation: Mutations.ForgotPasswordMut,
    variables: {
      username:username
    }
  })
}

const resetPassword = async (token, password) => {
  return apolloClient.mutate({
    mutation: Mutations.ResetPasswordMut,
    variables: {
      token: token,
      password: password
    }
  })
}

export {
  login,
  forgotPassword,
  resetPassword
}

