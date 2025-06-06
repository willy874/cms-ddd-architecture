'use client'

import { useSession } from 'next-auth/react'

export default function ClientTest() {
  const { data } = useSession()

  return (
    <div>
      <h1>Client Test</h1>
      <p>This is a test component to verify client-side rendering.</p>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  )
}
