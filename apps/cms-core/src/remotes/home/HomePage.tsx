import { Link } from '@tanstack/react-router'

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <div className="flex flex:column">
        <Link to="/login">Go to Login</Link>
        <Link to="/register">Go to Register</Link>
      </div>
    </div>
  )
}

export default HomePage
