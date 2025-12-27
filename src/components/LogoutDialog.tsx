'use client'

import { LogOut, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react' // Import signOut

export default function LogoutDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    setIsOpen(false)
    await signOut({ callbackUrl: '/signin' }) // Logs out and redirects to /signin
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-6 py-3 rounded-lg cursor-pointer transition-all text-[#E53E3E] hover:bg-red-50 w-full"
      >
        <LogOut size={22} />
        <span className="text-base font-medium">Log Out</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/20 backdrop-blur-[2px] animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 ">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to log out? You’ll need to sign in again
                to access your account.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 ">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-[#E53E3E] text-white hover:bg-[#cc3232] transition-colors font-medium cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
