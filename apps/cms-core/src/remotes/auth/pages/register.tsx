import { getCoreContext } from '@/libs/CoreContext'
import { createRoute, Link } from '@tanstack/react-router'

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

export const RegisterRoute = createRoute({
  getParentRoute: () => getCoreContext().rootRoute,
  path: '/register',
  component: RegisterPage,
})
