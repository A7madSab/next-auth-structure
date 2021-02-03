import { createContext, useEffect, useReducer } from "react"
import jwtDecode from "jwt-decode"
import axios from "../utils/axios"

const initialAuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null
}

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false
  }

  const decoded = jwtDecode(accessToken)
  const currentTime = Date.now() / 1000

  return decoded.exp > currentTime
}

const setSession = (accessToken, user) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("user", JSON.stringify(user))
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  } else {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common.Authorization
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case "INITIALISE": {
      const { isAuthenticated, user } = action.payload

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user
      }
    }
    case "LOGIN": {
      const { user } = action.payload

      return {
        ...state,
        isAuthenticated: true,
        user
      }
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null
      }
    }
    case "REGISTER": {
      const { user } = action.payload

      return {
        ...state,
        isAuthenticated: true,
        user
      }
    }
    default: {
      return { ...state }
    }
  }
}

const AuthContext = createContext({
  ...initialAuthState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => { },
  register: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updateProfile: () => Promise.resolve()
})

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState)

  const login = async ({ email, password }) => {
    const response = await axios.post(`http://localhost:1337/auth/local`, { identifier: email, password })
    const { jwt, user } = response.data

    setSession(jwt, user)
    dispatch({ type: "LOGIN", payload: { user } })
  }

  const logout = () => {
    setSession(null, null)
    dispatch({ type: "LOGOUT" })
  }

  const register = async ({ email, name, password }) => {
    const response = await axios.post(`http://localhost:1337/auth/local/register`, { email, username: name, password })
    const { jwt, user } = response.data

    window.localStorage.setItem("accessToken", jwt)

    dispatch({ type: "REGISTER", payload: { user } })
  }

  const resetPassword = async form => {
    console.log("resetPassword", form)
  }

  const updateProfile = async currentUser => {
    console.log("resetPassword", currentUser)
  }

  useEffect(() => {
    const initialise = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken")
        const userJSON = window.localStorage.getItem("user")
        const user = JSON.parse(userJSON)

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken, user)

          dispatch({ type: "INITIALISE", payload: { isAuthenticated: true, user } })
        } else {
          dispatch({ type: "INITIALISE", payload: { isAuthenticated: false, user: null } })
        }
      } catch (err) {
        dispatch({ type: "INITIALISE", payload: { isAuthenticated: false, user: null } })
      }
    }

    initialise()
  }, [])

  if (!state.isInitialised) {
    return <p>loading</p>
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext