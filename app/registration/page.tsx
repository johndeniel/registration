'use client'

import React from 'react';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";


// Zod Schema for Validation
const registrationSchema = z.object({
  applicationType: z.enum(["New", "Lost", "Replacement", "Transfer"], {
    required_error: "Application type is required"
  }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  middleName: z.string().optional(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required"
  }),
  sex: z.enum(["Male", "Female", "Other"], {
    required_error: "Sex is required"
  }),
  placeOfBirth: z.string().min(2, { message: "Place of birth is required" }),
  barangay: z.string({ required_error: "Barangay is required" }),
  civilStatus: z.enum(["Single", "Married", "Divorced", "Widowed"], {
    required_error: "Civil status is required"
  }),
  educationalAttainment: z.string({ required_error: "Educational attainment is required" }),
  healthCondition: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2, { message: "Emergency contact name is required" }),
    relationship: z.string({ required_error: "Relationship is required" }),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, { message: "Invalid phone number" })
  })
});

// Barangay and Educational Attainment Options (example data)
const barangayOptions = [
  "Barangay 1", "Barangay 2", "Barangay 3", 
  "Barangay 4", "Barangay 5"
];

const educationalAttainmentOptions = [
  "Elementary", "High School", "College", 
  "Post-Graduate", "Vocational"
];

const RelationshipOptions = [
  "Parent", "Spouse", "Sibling", 
  "Child", "Friend", "Guardian"
];

export default function RegistrationForm() {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      applicationType: "New",
      firstName: "",
      middleName: "",
      lastName: "",
      sex: "Male",
      placeOfBirth: "",
      barangay: "",
      civilStatus: "Single",
      educationalAttainment: "",
      healthCondition: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phoneNumber: ""
      }
    }
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    console.log(values);
    // Add submission logic here
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="applicationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Application Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["New", "Lost", "Replacement", "Transfer"].map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={form.control}
            name="placeOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Place of Birth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barangay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    barangayOptions
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Other form fields follow similar pattern... */}
          <Button type="submit" className="w-full">Submit Registration</Button>
        </form>
      </Form>
    </div>
  );
}