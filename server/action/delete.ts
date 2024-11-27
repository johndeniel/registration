export async function deleteRecord(residentId: number): Promise<any> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    const endpoint = '/api/senior/delete'
  
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: residentId }),
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', response.status, errorText)
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        )
      }
  
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error deleting resident:', error)
      throw error
    }
  }