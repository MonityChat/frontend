import React from 'react'
import Login from './Login'
import Register from './Register'


const MODES = Object.freeze({
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER'
})

export default function Authentication() {
  const [mode, setMode] = React.useState(MODES.LOGIN);

    return (
    <div>
        <h1>Monity</h1>
      	<button onClick={() => setMode(MODES.REGISTER)}>Register</button>
      	<button onClick={() => setMode(MODES.LOGIN)}>Login</button>
        {mode === MODES.LOGIN ? <Login/> : <Register/>}
    </div>
  )
}
