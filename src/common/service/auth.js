const login = (data) => {
    let strData = JSON.stringify(data)
    window.localStorage.setItem("profile", strData)
}

const logout = () => {
    window.localStorage.setItem("profile", "")
}

const isLogin = () => {
    let strData = window.localStorage.getItem("profile")
    if(strData == null || strData === "" ) {
        return false
    } else {
        return true
    }
}

const getProfile = () => {
    let strData = window.localStorage.getItem("profile")
    if(strData == null || strData === "" ) {
        return null
    } else {
        return JSON.parse(strData)
    }
}

export { login, isLogin, getProfile, logout }