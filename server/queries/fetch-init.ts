interface initTypedef {
    id: number;                 // Unique identifier
    applicationtype: string;    // Type of application
    firstname: string;          // First name of the individual
    middlename: string;         // Middle name of the individual
    lastname: string;           // Last name of the individual
    sex: string;                // Gender (e.g., Male, Female)
    placeofbirth: string;       // Place of birth
    civilstatus: string;        // Marital status (e.g., Single, Married)
    education: string;          // Educational attainment
    occupation: string;         // Current occupation
    barangay: string;           // Barangay or local area
    name: string;               // Emergency contact name
    relationship: string;       // Relationship with the emergency contact
    contact: string;            // Contact number of the emergency contact
    health: string;             // Health status or remarks
}
  
export async function fetchInit(query: number): Promise<initTypedef[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const endpoint = '/api/senior/id'
  
    try { 

      const requestBody = {
        id: query,
      }
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error posting registration data:', error)
    throw error
  }
}