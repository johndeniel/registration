'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  try {
    // Remove JWT token cookie
    const cookieStore = await cookies()
    
    // Remove token cookie if it exists
    if (cookieStore.has('token')) {
      cookieStore.delete('token')
    }

    // Optional: Clear any additional cookies
    // cookieStore.delete('refresh_token')

    // Log the logout attempt
    console.log('Logout successful: Token cookie removed')
  } catch (error) {
    console.error('Logout error:', error)
  }

  // Redirect to home page
  redirect('/')
}