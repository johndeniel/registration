'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

// Enhanced password validation
const passwordValidation = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password cannot exceed 50 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()]/, 'Password must contain at least one special character')

// Comprehensive account schema
const accountSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  username: z.string()
    .min(6, 'Username must be at least 6 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: passwordValidation,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type AccountFormValues = z.infer<typeof accountSchema>;

export default function AccountUpdateForm() {
  const [successMessage, setSuccessMessage] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      oldPassword: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
  })

  const togglePasswordVisibility = (field: keyof typeof isPasswordVisible) => {
    setIsPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const onSubmit = async (data: AccountFormValues) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      const endpoint = '/api/auth/update'
    
      const requestBody = {
        newusername: data.username,
        newpassword: data.confirmPassword,
        oldpassword: data.oldPassword,
      }
    
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'An unexpected error occurred')
      }

      setSuccessMessage('Account updated successfully!')
      form.reset() // Clear form after successful submission
      console.log('Account updated:', { 
        username: data.username 
        // Avoid logging passwords in real-world scenario
      })
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Update Account
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter new username" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={isPasswordVisible.newPassword ? 'text' : 'password'}
                        placeholder="Enter new password" 
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {isPasswordVisible.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={isPasswordVisible.confirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password" 
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {isPasswordVisible.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={isPasswordVisible.oldPassword ? 'text' : 'password'}
                        placeholder="Enter current password" 
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {isPasswordVisible.oldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-red-500 text-center">
                {form.formState.errors.root.message}
              </p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Updating...' : 'Update Account'}
            </Button>
          </form>
        </Form>

        {successMessage && (
          <p className="text-green-600 text-center mt-4 animate-pulse">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  )
}