'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { loginPerform } from '@/server/action/login'
import * as z from 'zod'
import { Lock, User, AlertCircle } from 'lucide-react'

const formSchema = z.object({
  username: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export type AuthFormValue = z.infer<typeof formSchema>

export default function AuthenticationPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<AuthFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: AuthFormValue) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await loginPerform(data)
      
      // Optional: Additional client-side token management
      localStorage.setItem('user', JSON.stringify({
        id: result.id,
        username: result.username
      }))
      
      router.push('/admin')
    } catch (error: any) {
      setError(error.message || 'Login failed')
      console.error('Login failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your account
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              {error && (
                <div className="flex items-center bg-red-50 border border-red-200 text-red-700 p-3 rounded-md space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>Username</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your username"
                        disabled={loading}
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      <span>Password</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={loading}
                        className="mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              
              <Button 
                disabled={loading} 
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors" 
                type="submit"
              >
                {loading ? 'Logging in...' : 'Sign In'}
                {loading && (
                  <span className="ml-2 animate-spin">🔄</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}