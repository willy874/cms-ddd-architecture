import { Link } from '@tanstack/react-router'

function RegisterPage() {
  return (
    <div>
      <h1>Register Page</h1>
      <p>Please enter your credentials to register.</p>
      <div className="flex flex:column">
        <Link to="/">Go to Home</Link>
        <Link to="/login">Go to Login</Link>
      </div>
    </div>
  )
}

export default RegisterPage
