import { type NextRequest } from 'next/server';
import { APIResponse } from '@/lib/api-res-helper';
import { APIErrHandler } from '@/lib/api-err-handler';
import { APILogger } from '@/lib/api-req-logger';
import { Query } from '@/lib/postgres';
import { hashPassword, comparePassword } from '@/lib/password-hash';

export async function PUT(request: NextRequest) {
  try {
    // Log the incoming request and parameters
    APILogger(request, null);

    // Parse the request body
    const body = await request.json();

    // Extract data from request body
    const { newusername, newpassword, oldpassword } = body;

    // Validate required fields
    if (!newusername || !newpassword || !oldpassword) {
      return APIResponse({ error: 'All required parameters are needed' }, 400);
    }

    // Update the username and password in the auth table
    const updateResult = await Query({
      query: `
        UPDATE auth
        SET username = $1,
            password = $2
        WHERE password = $3
      `,
      values: [newusername, newpassword, oldpassword],
    });

    return APIResponse({ message: 'Username and password updated successfully' }, 200);
  } catch (error: any) {
    console.error('Database query failed:', error);

    const apiError = APIErrHandler(error);
    if (apiError) {
      return apiError;
    }

    return APIResponse({ error: 'Internal server error' }, 500);
  }
}
