interface PopulationTypedef {
    id: number
    name: string
    sex: string
    age: string 
    occupation: string
    status: string
    applicationtype: string
  }
  
  export async function fetchRecord(): Promise<PopulationTypedef[]> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const endpoint = '/api/record'
  
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