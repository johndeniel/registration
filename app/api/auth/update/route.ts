import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'
import { hashPassword, comparePassword } from '@/lib/password-hash'
import { QueryResultRow } from 'pg'

export async function PUT(request: NextRequest) {
  try {
    APILogger(request, null)

    const body = await request.json()

    const { newusername, newpassword, oldpassword } = body

    if (!newusername || !newpassword || !oldpassword) {
      return APIResponse({ error: 'All required parameters are needed' }, 400)
    }

    // Explicitly type the query result
    const userResult: QueryResultRow[] = await Query({
      query: 'SELECT password FROM auth WHERE id = $1',
      values: [1]
    })

    // Check if user exists using length property directly on array
    if (userResult.length === 0) {
      return APIResponse({ error: 'User not found' }, 404)
    }

    const isPasswordValid = await comparePassword(oldpassword, userResult[0].password)

    if (!isPasswordValid) {
      return APIResponse({ error: 'Current password is incorrect' }, 401)
    }

    const hashedNewPassword = await hashPassword(newpassword)

    await Query({
      query: `
        UPDATE auth
        SET username = $1,
            password = $2
      `,
      values: [newusername, hashedNewPassword]
    })

    return APIResponse({ message: 'Username and password updated successfully' }, 200)
  } catch (error: any) {
    console.error('Update operation failed:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}