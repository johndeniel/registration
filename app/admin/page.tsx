'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/server/action/logout'


import React, { useEffect, useState } from 'react'
import { columns } from '@/components/columns'
import { DataTable } from '@/components/data-table'
import { fetchRecord } from '@/server/queries/fetch-record'
import { PopulationTypedef } from '@/lib/population-typedef'
import { z } from 'zod'
import { DataTableSkeleton } from '@/components/data-table-skeleton'

type PopulationData = z.infer<typeof PopulationTypedef>

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [populationData, setPopulationData] = useState<PopulationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRecord()
        const validatedData = PopulationTypedef.array().parse(data)
        setPopulationData(validatedData)
      } catch (error) {
        console.error('Error fetching population data:', error)
        setError('Failed to fetch population data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      // Clear all client-side storage related to authentication
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      
      // Perform server-side logout
      await logout()
    } catch (error) {
      console.error('Logout failed', error)
      
      // Fallback redirect to home page
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-gray-200 bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="flex h-24 items-center justify-between py-4">
            {/* Logo on the left */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Image
                  src={'/logo.png'}
                  alt={'Admin'}
                  width={52}
                  height={52}
                  className="rounded-full border-2 border-gray-200 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                />
                <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-50 blur-sm"></div>
              </div>
            </div>

            {/* Admin text centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-2xl font-bold text-black 
                drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)] 
                stroke-white stroke-[0.5px]">
                Admin
              </h1>
            </div>

            {/* Dropdown menu on the right */}
            <nav className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full 
                      border-gray-300 bg-white 
                      hover:bg-gray-100 
                      focus:ring-2 focus:ring-gray-300"
                  >
                    <div className="relative">
                      <Image
                        src={'/placeholder-user.jpg'}
                        width={42}
                        height={42}
                        alt="User Avatar"
                        className="overflow-hidden rounded-full 
                          border-2 border-gray-200 
                          shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                      />
                      <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-50 blur-sm"></div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-white border-gray-200 text-black 
                    shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
                >
                  <DropdownMenuLabel className="text-gray-600">My Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <Link href="/admin/account" className="w-full">
                    <DropdownMenuItem 
                      className="hover:bg-gray-100 focus:bg-gray-200 
                        text-black hover:text-gray-800 cursor-pointer"
                    >
                      Account
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    className="hover:bg-gray-100 focus:bg-gray-200 
                      text-black hover:text-gray-800 cursor-pointer"
                    onClick={handleLogout} 
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Senior Data Table
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of the Records!
              </p>
            </div>
          </div>
          {loading ? (
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={1}
              cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
              shrinkZero
            />
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <DataTable data={populationData} columns={columns} />
          )}
        </div>
      </div>
    </div>
  )
}