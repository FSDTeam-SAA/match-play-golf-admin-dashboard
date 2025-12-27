'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface PasswordFormProps {
  oldPassword: string
  setOldPassword: (value: string) => void
  newPassword: string
  setNewPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  isUpdating: boolean
  onSubmit: () => void
  onReset: () => void
}

export function PasswordForm({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isUpdating,
  onSubmit,
  onReset,
}: PasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  return (
    <div className="space-y-12 max-w-full">
      {/* --- FIRST TWO FIELDS IN GRID --- */}
      <div className="grid grid-cols-2 gap-8">
        {/* Current Password */}
        <div className="space-y-3.5">
          <Label htmlFor="oldPassword">Current Password</Label>
          <div className="relative mt-1">
            <Input
              id="oldPassword"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Enter current password"
              className="border border-[#DF1020] bg-white text-gray-600 py-5"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showOldPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-3.5">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative mt-1">
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border border-[#DF1020] bg-white text-gray-600 py-5"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- CONFIRM PASSWORD FULL WIDTH --- */}
      {/* <div className="space-y-3.5"> */}
      <div className="space-y-3.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative mt-1">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="border border-[#DF1020] bg-white text-gray-600 py-5"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
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
            'Change Password'
          )}
        </Button>
        <Button
          type="button"
          className="border border-gray-300 bg-white rounded-sm font-normal text-gray-500"
          variant="ghost"
          onClick={onReset}
          disabled={isUpdating}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
