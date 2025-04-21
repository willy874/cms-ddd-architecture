import { Button } from '@/libs/components'
import { Link } from '@tanstack/react-router'

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <div>
        <Link to="/login">Go to Login</Link>
        <Link to="/register">Go to Register</Link>
      </div>
      <div className="flex flex:column">
        <div className="flex flex-wrap gap-2 items-center">
          <Button>
            Button
          </Button>
          <Button size="small">
            Button
          </Button>
          <Button size="large">
            Button
          </Button>
          <Button variant="outlined">
            Button
          </Button>
          <Button theme="error">
            Button
          </Button>
          <Button variant="outlined" theme="error">
            Button
          </Button>
          <Button theme="warning">
            Button
          </Button>
          <Button variant="outlined" theme="warning">
            Button
          </Button>
          <Button theme="info">
            Button
          </Button>
          <Button variant="outlined" theme="info">
            Button
          </Button>
          <Button theme="success">
            Button
          </Button>
          <Button variant="outlined" theme="success">
            Button
          </Button>
          <Button disabled>
            Button
          </Button>
          <Button variant="outlined" disabled>
            Button
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
