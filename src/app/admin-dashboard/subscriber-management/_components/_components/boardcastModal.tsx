// 📄 src/app/admin-dashboard/subscriber-management/_components/BroadcastModal.tsx

'use client'

import React, { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { useBroadcastEmail } from '@/lib/subscriberApi'
import { Button } from '@/components/ui/button'

interface BroadcastModalProps {
  accessToken: string
  onClose: () => void
}

export default function BroadcastModal({
  accessToken,
  onClose,
}: BroadcastModalProps) {
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [success, setSuccess] = useState(false)

  const { mutate: sendBroadcast, isPending } = useBroadcastEmail(accessToken)

  const handleSend = () => {
    if (!subject.trim() || !html.trim()) {
      alert('Please fill in all fields')
      return
    }

    sendBroadcast(
      { subject, html },
      {
        onSuccess: () => {
          setSuccess(true)
          setTimeout(() => {
            onClose()
          }, 2000)
        },
        onError: error => {
          alert(`Failed to send broadcast: ${error.message}`)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-[#181818]">
            Broadcast to All Subscribers
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Email Sent Successfully!
            </h3>
            <p className="text-gray-600">
              Your broadcast has been sent to all subscribers.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={html}
                onChange={e => setHtml(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter email content"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                onClick={onClose}
                variant={'ghost'}
                className="border border-gray-300"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isPending}
                className="px-6 py-2.5 flex items-center gap-2 disabled:opacity-50 transition-colors bg-red-600 hover:bg-red-600/60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
