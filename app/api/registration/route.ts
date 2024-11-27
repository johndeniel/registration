import { type NextRequest } from 'next/server'
import { APIResponse } from '@/lib/api-res-helper'
import { APIErrHandler } from '@/lib/api-err-handler'
import { APILogger } from '@/lib/api-req-logger'
import { Query } from '@/lib/postgres'

export async function POST(request: NextRequest) {
  try {
    // Log the incoming request and parameters
    APILogger(request, null)

    // Parse the request body
    const body = await request.json()

    // Extract senior data from request body
    const {
      applicationtype,
      firstname,
      middlename,
      lastname,
      sex,
      dateofbirth,
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
      !applicationtype ||
      !firstname ||
      !lastname ||
      !sex ||
      !dateofbirth ||
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
    const seniorResult = await Query({
      query: `
        INSERT INTO senior (
          applicationtype, 
          firstname, 
          middlename, 
          lastname, 
          sex, 
          dateofbirth, 
          placeofbirth, 
          civilstatus, 
          education, 
          occupation, 
          barangay, 
          name, 
          relationship, 
          contact, 
          health
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `,
      values: [
        applicationtype,
        firstname,
        middlename,
        lastname,
        sex,
        dateofbirth,
        placeofbirth,
        civilstatus,
        education,
        occupation,
        barangay,
        name,
        relationship,
        contact,
        health,
      ],
    })

    return APIResponse({ message: 'Senior information inserted successfully' }, 201)
  } catch (error: any) {
    console.error('Database query failed:', error)

    const apiError = APIErrHandler(error)
    if (apiError) {
      return apiError
    }

    return APIResponse({ error: 'Internal server error' }, 500)
  }
}