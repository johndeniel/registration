'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

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

  dateOfBirth: z.date({
    required_error: 'Date of birth is required'
  }).refine(date => {
    const today = new Date()
    const age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    const dayDiff = today.getDate() - date.getDate()
    
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age
  
    return adjustedAge >= 60 && adjustedAge <= 120
  }, { message: 'You must be at least 60 years old to register' }),

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

  termsAccepted: z.boolean()
    .refine(accepted => accepted, {
      message: 'You must accept the terms and conditions'
    })
    .optional()
})

export default function ProfessionalRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      applicationType: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: undefined,
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
      termsAccepted: false
    }
  })

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    setIsSubmitting(true)
    setSubmissionStatus('idle')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Real submission would happen here
      console.log('Submitted Registration:', values)
      
      setSubmissionStatus('success')
      form.reset()
    } catch (error) {
      console.error('Submission Error:', error)
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const TermsAndConditionsTooltip = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-neutral-600 underline cursor-help">Terms and Conditions</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-4 bg-white shadow-lg rounded-lg">
          <div className="prose prose-sm">
            <h4 className="text-lg font-semibold mb-2">Terms and Conditions</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>By submitting this form, you consent to verify the information provided.</li>
              <li>Your personal data will be handled confidentially and used only for official purposes.</li>
              <li>Any false information may result in application rejection.</li>
              <li>Data will be stored securely and in compliance with data protection regulations.</li>
              <li>You authorize the verification of submitted information.</li>
            </ol>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-12">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral-800 tracking-tight">
            Senior Citizens Affairs Registration
          </h2>

          {submissionStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle2 className="mr-3 text-green-600" />
              <p className="text-green-800">Registration submitted successfully!</p>
            </div>
          )}

          {submissionStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="mr-3 text-red-600" />
              <p className="text-red-800">Submission failed. Please check your information and try again.</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-sm text-neutral-700 uppercase tracking-wider">Date of Birth</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              value={field.value ? field.value.toISOString().split('T')[0] : ''}
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              className="border-neutral-300 focus:border-neutral-500 focus:ring-neutral-200"
                            />
                          </FormControl>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <FormDescription className="text-xs text-neutral-600/70 ml-1">
                          Your current educational background
                        </FormDescription>
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
                        <FormDescription className="text-xs text-neutral-600/70 ml-1">
                          Your current professional status
                        </FormDescription>
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

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 mt-4">
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I agree to the <TermsAndConditionsTooltip />
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full mt-8 bg-neutral-800 text-white hover:bg-neutral-700 
                  transition-colors duration-300 uppercase tracking-wider 
                  font-bold py-3 rounded-xl shadow-md hover:shadow-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit Registration'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}