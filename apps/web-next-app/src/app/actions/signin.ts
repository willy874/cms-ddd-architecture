'use server'

import { signIn } from '@/auth'

async function signInAction(formData: FormData) {
  return await signIn('credentials', formData)
}

export default signInAction
