interface PopulationTypedef {
    id: number
    username: string
    password: string
  }
  
  export async function fetchTest(): Promise<PopulationTypedef[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const endpoint = '/api/auth/test'
  
    try {
      const response = await fetch(`${baseUrl}${endpoint}`)
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const data: PopulationTypedef[] = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching population records:', error)
      throw error
    }
  }