import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'

export async function GET(request: NextRequest) {
  try {
    // Log the incoming request and parameters
    APILogger(request, null)

    // Execute the database query to fetch senior details
    const senior = await Query({
      query: `
        SELECT 
          id,
          CONCAT(
            firstname,
            CASE 
              WHEN middlename IS NOT NULL AND middlename <> 'NULL' THEN ' ' || middlename
              ELSE ''
            END,
            ' ' || lastname
          ) AS name,
          sex, 
          civilstatus AS status,
          occupation,
          EXTRACT(YEAR FROM AGE(dateofbirth)) AS age, 
          applicationtype
        FROM senior
      `,
      values: [],
    })

    console.log('Query Result:', senior)

    // Check if the senior record was found
    if (senior.length === 0) {
      return APIResponse({ error: 'Senior not found' }, 404)
    }

    // Return the formatted response
    return APIResponse(senior, 200)
  } catch (error: any) {
    console.error('Error:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}
