import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import { ApolloLink } from 'apollo-link'
import jwt_decode from 'jwt-decode';
import { print } from 'graphql';
import { Mutations } from './module/guest'
import { instance as AxiosInstance } from '../common/service/axios'
import { setContext } from 'apollo-link-context'
const moment = require('moment')
const httpLink = new HttpLink({
    uri: 'http://127.0.0.1:8000/api/graphql',
    // headers: getHeaders()
});

const RefreshToken = async () => {
    const refresh_token = localStorage.getItem('apollo-refresh-token')
    const {data} = await AxiosInstance.post(
        '',
        {
            query: print(Mutations.RefreshtokenMut),
            variables: {
                refreshToken: refresh_token
            }
        }
    )

    const new_token = data.data.refreshToken.token

    return new_token
}

const authMiddleware = setContext(async () => {
    let token = localStorage.getItem('apollo-token')
    
    console.log('old token', token)

    if(token != null && token != "") {
        const {exp} = jwt_decode(token)
        const now = moment().valueOf() / 1000
        console.log('exp : ', exp , '  now : ', now)
        if(now >= exp) {
            const new_token = await RefreshToken()
            token = new_token
        }
    }
    
    console.log('new token' , token)

    return ({
        headers: {
            Authorization: token ? `JWT ${token}` : null
        }
    })
})

// const authMiddleware = new ApolloLink((operation, forward) => {
//     let token = localStorage.getItem('apollo-token')
//     // const refresh_token = localStorage.getItem('apollo-refresh-token')
    
//     console.log('old token', token)

//     if(token != null && token != "") {
//         const {exp} = jwt_decode(token)
//         const now = moment().valueOf() / 1000
//         console.log('exp : ', exp , '  now : ', now)
//         if(now < exp) {
//             const result = RefreshToken()
//             console.log(result)
//         }
//     }
    
//     console.log('new token' , token)

//     operation.setContext({
//         headers: {
//             Authorization: token ? `JWT ${token}` : null
//         }
//     })
//     return forward(operation)
// })

const apolloClient = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache({
        resultCaching: false
    }),
    connectToDevTools: true
});

export default apolloClient