import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'

export async function POST(request: NextRequest) {
  try {
    // Log the incoming request and parameters
    APILogger(request, null)

    const body = await request.json()

    const {
      id,
    } = body

    // Validate that the ID parameter is provided and is numeric
    if (!id || isNaN(Number(id))) {
      return APIResponse({ error: 'Valid ID parameter is required' }, 400)
    }

    // Fetch data from the database using the updated query
    const user = await Query({
      query: `
        SELECT id, applicationtype, firstname, middlename, lastname, sex, 
               placeofbirth, civilstatus, education, occupation, 
               barangay, name, relationship, contact, health
        FROM senior 
        WHERE id = $1
      `,
      values: [id], // Ensure ID is passed as a number
    })

    // Check if the user was found
    if (!user || user.length === 0) {
      return APIResponse({ error: 'Resident not found' }, 404)
    }

    // Return the formatted response
    return APIResponse(user, 200)
  } catch (error: any) {
    console.error('Database query failed:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}
