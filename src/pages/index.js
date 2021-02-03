import styles from '../styles/Home.module.css'
import useAuth from "../hooks/useAuth"

export default function Home() {
  const { user, isAuthenticated, isInitialised, login, logout } = useAuth()

  const handleLogin = () => {
    login({ email: "ahmad@sabryy.com", password: "ahmad@sabryy.com", })
  }

  console.log("user", user)

  return (
    <div className={styles.container}>

      {!isAuthenticated
        ? <button onClick={handleLogin}>Login</button>
        : <button onClick={logout}>logout</button>}

      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(isAuthenticated)}</p>
      <p>{JSON.stringify(isInitialised)}</p>
    </div>
  )
}
