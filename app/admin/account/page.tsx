'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const accountSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters').max(20, 'Username cannot exceed 20 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountPage() {
  const [successMessage, setSuccessMessage] = useState('')

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: AccountFormValues) => {
    // Mock API call
    setTimeout(() => {
      setSuccessMessage('Account updated successfully!')
      console.log('Updated account data:', data)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Update Account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              render={({ field }) => (
                <>
                  <FormLabel>Username</FormLabel>
                  <Input {...field} placeholder="Enter your username" />
                  <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                </>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <>
                  <FormLabel>Password</FormLabel>
                  <Input {...field} type="password" placeholder="Enter your password" />
                  <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                </>
              )}
            />
            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input {...field} type="password" placeholder="Confirm your password" />
                  <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                </>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Update
            </Button>
          </form>
        </Form>
        {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
      </div>
    </div>
  )
}
