import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'

export async function PUT(request: NextRequest) {
    try {
      // Log the incoming request and parameters
      APILogger(request, null)
  
      // Parse the request body
      const body = await request.json()

    // Extract senior data from request body
    const {
      id,
      applicationtype,
      firstname,
      middlename,
      lastname,
      sex,
      placeofbirth,
      civilstatus,
      education,
      occupation,
      barangay,
      name,
      relationship,
      contact,
      health,
    } = body

    // Validate required fields
    if (
      !id ||
      !applicationtype ||
      !firstname ||
      !lastname ||
      !sex ||
      !placeofbirth ||
      !civilstatus ||
      !education ||
      !occupation ||
      !barangay ||
      !name ||
      !relationship ||
      !contact ||
      !health
    ) {
      return APIResponse({ error: 'All required parameters are needed' }, 400)
    }

    // Insert senior information directly into the senior table
    const updateResult = await Query({
        query: `
          UPDATE senior SET 
            applicationtype = $1, 
            firstname = $2, 
            middlename = $3, 
            lastname = $4, 
            sex = $5, 
            placeofbirth = $6, 
            civilstatus = $7, 
            education = $8, 
            occupation = $9, 
            barangay = $10, 
            name = $11, 
            relationship = $12, 
            contact = $13, 
            health = $14
          WHERE id = $15
        `,
        values: [
          applicationtype,
          firstname,
          middlename,
          lastname,
          sex,
          placeofbirth,
          civilstatus,
          education,
          occupation,
          barangay,
          name,
          relationship,
          contact,
          health,
          id
        ],
      })
      
      return APIResponse({ message: 'Senior information updated successfully' }, 200)
    } catch (error: any) {
      console.error('Database query failed:', error)
  
      const apiError = APIErrHandler(error)
      if (apiError) {
        return apiError
      }
  
      return APIResponse({ error: 'Internal server error' }, 500)
    }
  }