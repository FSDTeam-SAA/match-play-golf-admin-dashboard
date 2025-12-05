// ==================== FILE: _components/ProfileForm.tsx ====================
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
  fullName: string
  setFullName: (value: string) => void
  username: string
  setUsername: (value: string) => void
  email: string
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  role?: string
  setRole: (value: string) => void
  isUpdating: boolean
  onSubmit: () => void
  onReset: () => void
  setOrganizationName: (value: string) => void
  organizationName: string
}

export function ProfileForm({
  fullName,
  setFullName,
  setUsername,
  email,
  phoneNumber,
  setPhoneNumber,
  role,
  setRole,
  isUpdating,
  onSubmit,
  onReset,
  organizationName,
  setOrganizationName,
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-1 border border-[#DF1020] bg-white text-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            disabled
            className="mt-1 bg-gray-100 border border-[#DF1020]  text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={fullName.split(' ').join('').toLowerCase()}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            readOnly
            disabled
            className="mt-1 border border-[#DF1020] bg-white text-gray-600"
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="mt-1 border border-[#DF1020] bg-white text-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="User | Admin | Organizer"
            readOnly
            className="mt-1 border border-[#DF1020] bg-white text-gray-600"
          />
        </div>
        <div>
          <Label htmlFor="role">Organization Name</Label>
          <Input
            id="organaization"
            value={organizationName}
            onChange={e => setOrganizationName(e.target.value)}
            placeholder="organization name"
            className="mt-1 border border-[#DF1020] bg-white text-gray-600"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onSubmit}
          disabled={isUpdating}
          className="min-w-[140px] bg-[#DF1020] hover:bg-[#DF1020]/80"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={isUpdating}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
