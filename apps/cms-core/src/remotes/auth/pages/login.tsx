import { Link } from '@tanstack/react-router'

function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <p>Please enter your credentials to login.</p>
      <div className="flex flex:column">
        <Link to="/">Go to Home</Link>
        <Link to="/register">Go to Register</Link>
      </div>
    </div>
  )
}

export default LoginPage
