// ==================== FILE: _components/SettingsPage.tsx (UPDATED) ====================
'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import {
  useGetUserProfile,
  useUpdateProfile,
  useUpdateProfileImage,
  useChangePassword,
  UpdateProfileData,
} from '@/lib/profileApi'
import { toast } from 'sonner'
import { ProfileImageUpload } from './profileImageUpload'
import { ProfileForm } from './profileForm'
import { PasswordForm } from './passwordForm'

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession()
  const accessToken = session?.user?.accessToken || ''

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Profile states
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileImage, setProfileImage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  // Password states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const {
    data: profileData,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetUserProfile(accessToken)

  console.log('Profile Image:', profileData?.data?.phone)

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile(accessToken, {
      onSuccess: async () => {
        toast.success('Profile updated successfully ✅')
        // Refetch profile to get latest data
        await refetchProfile()
        // Update session if username changed
        await updateSession()
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to update profile ❌'),
    })

  const { mutate: updateProfileImage, isPending: isUpdatingImage } =
    useUpdateProfileImage(accessToken, {
      onSuccess: async () => {
        toast.success('Profile image updated successfully ✅')
        setImageFile(null)
        // Force refetch to get the new image immediately
        await refetchProfile()
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to update profile image ❌'),
    })

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword(accessToken, {
      onSuccess: () => {
        toast.success('Password changed successfully ✅')
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      },
      onError: (error: Error) =>
        toast.error(error.message || 'Failed to change password ❌'),
    })

  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data
      setFullName(profile.fullName || '')
      setUsername(profile.username || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      setRole(profile.role || '')
      setOrganizationName(profile.organizationName || '')
      setProfileImage(profile.profileImage || '')
      setImagePreview(profile.profileImage || '')
    }
  }, [profileData])

  const handleImageChange = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUploadProfileImage = () => {
    if (!imageFile) {
      toast.error('Please select an image before uploading')
      return
    }

    const formData = new FormData()
    formData.append('profileImage', imageFile)
    updateProfileImage(formData)
  }

  const handleUpdateProfile = () => {
    const profilePayload: UpdateProfileData = {
      fullName,
      username,
      phone,
      role,
      organizationName,
    }
    updateProfile(profilePayload)
  }

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    changePassword({ oldPassword, newPassword })
  }

  const handleReset = () => {
    if (activeTab === 'profile') {
      if (profileData?.data) {
        const profile = profileData.data
        setFullName(profile.fullName || '')
        setUsername(profile.username || '')
        setPhone(profile.phone || '')
        setRole(profile.role || '')
        setOrganizationName(profile.organizationName || '')
        setImagePreview(profile.profileImage || '')
        setImageFile(null)
      }
    } else {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto ">
      {/* <div className="mb-5">
        <h1 className="text-3xl font-bold text-[#5A8DEE] mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div> */}

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="">
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'primary-color-red border-b-2 border-[#DF1020]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 font-medium transition-colors cursor-pointer ${
                activeTab === 'password'
                  ? 'primary-color-red border-b-2 border-[#DF1020]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Change Password
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <ProfileImageUpload
                imagePreview={imagePreview}
                fullName={fullName}
                isUpdating={isUpdatingImage}
                onImageChange={handleImageChange}
                onUpload={handleUploadProfileImage}
              />

              <hr className="bg-[#DF1020] h-[1.5px]" />

              <ProfileForm
                fullName={fullName}
                setFullName={setFullName}
                username={username}
                setUsername={setUsername}
                email={email}
                phone={phone}
                setPhone={setPhone}
                role={role}
                setRole={setRole}
                isUpdating={isUpdatingProfile}
                onSubmit={handleUpdateProfile}
                onReset={handleReset}
                organizationName={organizationName}
                setOrganizationName={setOrganizationName}
              />
            </div>
          )}

          {activeTab === 'password' && (
            <PasswordForm
              oldPassword={oldPassword}
              setOldPassword={setOldPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isUpdating={isChangingPassword}
              onSubmit={handleChangePassword}
              onReset={handleReset}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
