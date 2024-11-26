import { type NextRequest, NextResponse } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'
import { comparePassword } from '@/lib/password-hash'
import { generateToken, setTokenCookie } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    APILogger(request, { username })

    const users = await Query({
      query: 'SELECT * FROM auth WHERE username = $1',
      values: [username],
    })

    if (users.length === 0) {
      return APIResponse({ error: 'User not found' }, 404)
    }

    let foundUser = null
    for (const user of users) {
      const passwordMatch = await comparePassword(password, user.password)
      if (passwordMatch) {
        foundUser = user
        break
      }
    }

    if (!foundUser) {
      return APIResponse({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT token
    const token = await generateToken({
      id: foundUser.id,
      username: foundUser.username,
    })

    // Create response without the token
    const response = NextResponse.json(
      {
        id: foundUser.id,
        username: foundUser.username,
        token, // Include token in response for client-side storage if needed
      },
      { status: 200 }
    )

    // Set HttpOnly cookie with the token
    setTokenCookie(token)

    return response
  } catch (error: any) {
    console.error('Authentication error:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}