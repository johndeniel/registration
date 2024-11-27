import { string, z } from 'zod'

export const PopulationTypedef = z.object({
  id: z.number(),
  name: z.string(),
  sex: z.string(),
  age: z.string(),
  occupation: string(),
  status: string(),
  applicationtype: z.string(),
})

export type Population = z.infer<typeof PopulationTypedef>