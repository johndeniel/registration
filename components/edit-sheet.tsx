'use client'

import React, { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { fetchInit } from '@/server/queries/fetch-init'
import { 
    barangayOptions, 
    sexOptions, 
    occupationOptions,
    civilStatusOptions, 
    applicationTypeOptions,
    educationalAttainmentOptions, 
    relationshipOptions
} from '@/lib/config'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

const registrationSchema = z.object({
    applicationType: z.string()
      .min(1, { message: 'Please select an application type' })
      .optional()
      .transform(val => val || ''),
  
    firstName: z.string()
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(50, { message: 'First name cannot exceed 50 characters' })
      .regex(/^[A-Za-zÑñ\s'-]*$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
      .optional()
      .transform(val => val || ''),
  
    middleName: z.string()
      .optional()
      .nullable()
      .transform(val => val || ''),
  
    lastName: z.string()
      .min(2, { message: 'Last name must be at least 2 characters' })
      .max(50, { message: 'Last name cannot exceed 50 characters' })
      .regex(/^[A-Za-zÑñ\s'-]*$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' })
      .optional()
      .transform(val => val || ''),
  
    sex: z.string()
      .min(1, { message: 'Please select your sex' })
      .optional()
      .transform(val => val || ''),
  
    occupation: z.string()
      .min(1, { message: 'Please select your occupation' })
      .optional()
      .transform(val => val || ''),
  
    placeOfBirth: z.string()
      .min(2, { message: 'Place of birth is required' })
      .max(100, { message: 'Place of birth is too long' })
      .regex(/^[A-Za-zÑñ\s,.-]*$/, { message: 'Place of birth contains invalid characters' })
      .optional()
      .transform(val => val || ''),
  
    barangay: z.string()
      .min(1, { message: 'Barangay selection is mandatory' })
      .optional()
      .transform(val => val || ''),
  
    civilStatus: z.string()
      .min(1, { message: 'Please select your civil status' })
      .optional()
      .transform(val => val || ''),
  
    educationalAttainment: z.string()
      .min(1, { message: 'Educational attainment is mandatory' })
      .optional()
      .transform(val => val || ''),
  
    healthCondition: z.string()
      .optional()
      .transform(val => val || ''),
  
    emergencyContact: z.object({
      name: z.string()
        .min(2, { message: 'Emergency contact name is required' })
        .max(100, { message: 'Emergency contact name is too long' })
        .regex(/^[A-Za-zÑñ\s'-]*$/, { message: 'Emergency contact name can only contain letters, spaces, hyphens, and apostrophes' })
        .optional()
        .transform(val => val || ''),
  
      relationship: z.string()
        .min(1, { message: 'Relationship is mandatory' })
        .optional()
        .transform(val => val || ''),
  
      phoneNumber: z.string()
        .regex(/^(09|\+639)\d{9}$/, { message: 'Invalid phone number format. Must start with 09 or +639 and be 11 digits' })
        .optional()
        .transform(val => val || '')
    }).optional(),
  })

interface EditSheetProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly query: number
}

export function EditSheet({ isOpen, onClose, query }: EditSheetProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      applicationType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      sex: '',
      occupation: '',
      placeOfBirth: '',
      barangay: '',
      civilStatus: '',
      educationalAttainment: '',
      healthCondition: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      },
    }
  })
  useEffect(() => {
    if (!query) {
      console.error('Query parameter is required for EditSheet')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchInit(query)
        
        if (result && result.length > 0) {
          const fetchedData = result[0]
          
          form.reset({
            applicationType: fetchedData.applicationtype || '',
            firstName: fetchedData.firstname || '',
            middleName: fetchedData.middlename || '',
            lastName: fetchedData.lastname || '',
            sex: fetchedData.sex || '',
            occupation: fetchedData.occupation || '',
            placeOfBirth: fetchedData.placeofbirth || '',
            barangay: fetchedData.barangay || '',
            civilStatus: fetchedData.civilstatus || '',
            educationalAttainment: fetchedData.education || '',
            healthCondition: fetchedData.health || '',
            emergencyContact: {
              name: fetchedData.name || '',
              relationship: fetchedData.relationship || '',
              phoneNumber: fetchedData.contact || ''
            },
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [query, form.reset])

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    setIsSubmitting(true)
    setSubmissionStatus('idle')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      const endpoint = '/api/senior/update'
    
      const requestBody = {
        id: query,
        applicationtype: values.applicationType,
        firstname: values.firstName,
        middlename: values.middleName || 'NULL',
        lastname: values.lastName,
        sex: values.sex,
        placeofbirth: values.placeOfBirth,
        civilstatus: values.civilStatus,
        education: values.educationalAttainment,
        occupation: values.occupation,
        barangay: values.barangay,
        name: values.emergencyContact?.name,
        relationship: values.emergencyContact?.relationship,
        contact: values.emergencyContact?.phoneNumber,
        health: values.healthCondition || 'NULL',
      }
    
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    
      setSubmissionStatus('success')
    } catch (error) {
      console.error('Submission Error:', error)
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[680px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-neutral-900">Update Resident Record</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-neutral-500" />
            <p className="text-neutral-600">Loading resident data...</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-10rem)] px-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Application Details Section */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-neutral-800 uppercase tracking-wider">Application Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="applicationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Application Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Application Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {applicationTypeOptions.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-neutral-800 uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter First Name" 
                            {...field} 
                            className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Middle Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter Middle Name" 
                            {...field} 
                            className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter Last Name" 
                            {...field} 
                            className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Sex</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                                <SelectValue placeholder="Select Sex" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sexOptions.map((sex) => (
                                <SelectItem key={sex} value={sex}>{sex}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="placeOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Place of Birth</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter Place of Birth"
                              {...field} 
                              className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                          {/* [Previous code continues...] */}
                    </FormItem>
                  )}
                  />
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-neutral-800 uppercase tracking-wider">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="civilStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Civil Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Civil Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {civilStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="educationalAttainment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Education</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Education" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationalAttainmentOptions.map((attainment) => (
                              <SelectItem key={attainment} value={attainment}>{attainment}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">
                          Occupation
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Occupation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {occupationOptions.map((occupation) => (
                              <SelectItem 
                                key={occupation} 
                                value={occupation}
                              >
                                {occupation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barangay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Barangay</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Barangay" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barangayOptions.map((barangay) => (
                              <SelectItem 
                                key={barangay} 
                                value={barangay}
                              >
                                {barangay}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-neutral-800 uppercase tracking-wider">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="emergencyContact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Emergency Contact Name" 
                            {...field} 
                            className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Relationship</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="border-neutral-300 focus:border-neutral-500">
                              <SelectValue placeholder="Select Relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relationshipOptions.map((relationship) => (
                              <SelectItem 
                                key={relationship} 
                                value={relationship}
                              >
                                {relationship}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="11-digit Phone Number" 
                            {...field} 
                            type="tel"
                            maxLength={11}
                            className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Health Condition Section */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                <FormField
                  control={form.control}
                  name="healthCondition"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">
                        Health Condition (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          value={value ?? ''} 
                          onChange={onChange}
                          placeholder="Any relevant health information" 
                          className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-neutral-600/70 ml-1">
                        Provide any important health information that might be relevant in an emergency.
                      </FormDescription>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {submissionStatus === 'success' ? (
                  <div className="flex flex-col items-center space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="text-green-600 font-semibold text-center">
                      Record Updated Successfully
                    </p>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 
                      transition-colors duration-300 uppercase tracking-wider 
                      font-bold py-3 rounded-xl shadow-md hover:shadow-lg 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Record'
                    )}
                  </Button>
                )}
              </form>
            </Form>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}