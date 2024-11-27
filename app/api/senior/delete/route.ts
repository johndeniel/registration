import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'

export async function DELETE(request: NextRequest) {
  try {
    // Log the incoming request and parameters
    APILogger(request, null)

    const body = await request.json()

    const { id } = body

    // Validate that the ID parameter is provided and is numeric
    if (!id || isNaN(Number(id))) {
      return APIResponse({ error: 'Valid ID parameter is required' }, 400)
    }

    // Check if the senior exists before attempting to delete
    const user = await Query({
      query: `
        SELECT id
        FROM senior
        WHERE id = $1
      `,
      values: [id],
    })

    // If the record does not exist, return a 404 error
    if (!user || user.length === 0) {
      return APIResponse({ error: 'Resident not found' }, 404)
    }

    // Delete the senior record by ID
    await Query({
      query: `
        DELETE FROM senior
        WHERE id = $1
      `,
      values: [id],
    })

    // Return a success response
    return APIResponse({ message: 'Resident deleted successfully' }, 200)
  } catch (error: any) {
    console.error('Database query failed:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}
