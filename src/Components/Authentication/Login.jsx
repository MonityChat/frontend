import React from 'react'
import PasswordField from './PasswordField'

export default function Login() {
  return (
    <div>
      <h2>Login</h2>
        <div>

            <input type="text" />
            <input type="text" className="email" placeholder="Email or Username" />
            <PasswordField/>


        </div>
    </div>
  )
}
