const state = () => {
    return {
        loggedIn: false,
        accessToken: "",
        refreshToken: "",
        accessTokenLifetime: 0,
        busy: false
    }
}

export default state;