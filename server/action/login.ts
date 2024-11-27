'use server'

import { AuthFormValue } from '@/app/login/page'
import { cookies } from 'next/headers'

interface LoginResponse {
  id: string
  username: string
  token: string
}

export async function loginPerform(data: AuthFormValue): Promise<LoginResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const endpoint = '/api/auth/login'

  try {
    const requestBody = {
      username: data.username,
      password: data.password,
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Login failed: ${errorBody || response.statusText}`)
    }

    const result = await response.json()
    
    // Optionally set server-side cookie
    ;(await
      // Optionally set server-side cookie
      cookies()).set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return {
      id: result.id,
      username: result.username,
      token: result.token
    }
  } catch (error) {
    console.error('Error during login:', error)
    throw error
  }
}