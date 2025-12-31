// 📄 src/app/admin-dashboard/subscriber-management/_components/SpecificEmailModal.tsx

'use client'

import React, { useState } from 'react'
import { X, Mail, Loader2 } from 'lucide-react'
import { useSendSpecificEmail } from '@/lib/subscriberApi'
import type { Subscriber } from '@/../types/subscriber'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SpecificEmailModalProps {
  accessToken: string
  subscriber: Subscriber
  onClose: () => void
}

export default function SpecificEmailModal({
  accessToken,
  subscriber,
  onClose,
}: SpecificEmailModalProps) {
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [success, setSuccess] = useState(false)

  const { mutate: sendEmail, isPending } = useSendSpecificEmail(accessToken)

  const handleSend = () => {
    if (!subject.trim() || !html.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    sendEmail(
      {
        email: subscriber.email,
        subject,
        html,
      },
      {
        onSuccess: () => {
          setSuccess(true)
          setTimeout(() => {
            onClose()
          }, 2000)
        },
        onError: error => {
          toast.error(`Failed to send email: ${error.message}`)
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Send Email</h2>
            <p className="text-sm text-gray-600 mt-1">To: {subscriber.email}</p>
          </div>
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
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Email Sent Successfully!
            </h3>
            <p className="text-gray-600">
              Your email has been sent to {subscriber.email}
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
                className="px-6 py-2.5 border border-gray-300 "
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
                    <Mail className="w-4 h-4" />
                    Send Email
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
