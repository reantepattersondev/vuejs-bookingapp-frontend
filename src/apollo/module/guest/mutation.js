import gql from 'graphql-tag'

const ForgotPasswordMut = gql`
  mutation($username:String!) {
    forgotPassword(username:$username) {
      success
    }
  }
`
const SigninMutation = gql`
  mutation ($username: String!, $password: String!) {
    signin(username:$username, password:$password) {
      token,
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
      }
    }
  }
`;

const ResetPasswordMut = gql`
    mutation($token:String!, $password:String!) {
        resetPassword(token:$token, password:$password) {
            success
        }
    }
`

const RefreshtokenMut = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      payload
      refreshToken
      refreshExpiresIn
    }
  }
`

export default {
    ForgotPasswordMut,
    SigninMutation,
    ResetPasswordMut,
    RefreshtokenMut
}