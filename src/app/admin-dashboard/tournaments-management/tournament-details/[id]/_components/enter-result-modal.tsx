'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface Player {
  _id: string
  fullName: string
  email: string
  profileImage?: string
}

interface Match {
  _id: string
  player1Id: Player
  player2Id: Player
  player1Score?: string
  player2Score?: string
  date?: string
  winner?: string
  venue?: string
  comments?: string
  matchPhoto?: string[]
}

interface EnterResultModalProps {
  isOpen: boolean
  onClose: () => void
  match: Match | null
  onSuccess?: () => void
  isEditMode?: boolean
}

export default function EnterResultModal({
  isOpen,
  onClose,
  match,
  onSuccess,
  isEditMode = false,
}: EnterResultModalProps) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const [selectedWinner, setSelectedWinner] = useState<string>('')
  const [player1Score, setPlayer1Score] = useState('')
  const [player2Score, setPlayer2Score] = useState('')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [comments, setComments] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])

  // Load existing data when in edit mode
  useEffect(() => {
    if (isOpen && match && isEditMode) {
      setSelectedWinner(match.winner || '')
      setPlayer1Score(match.player1Score || '')
      setPlayer2Score(match.player2Score || '')
      setLocation(match.venue || '')
      setComments(match.comments || '')
      setExistingPhotos(match.matchPhoto || [])

      if (match.date) {
        const date = new Date(match.date)
        const formattedDate = date.toISOString().slice(0, 16)
        setDateTime(formattedDate)
      }
    } else if (isOpen && !isEditMode) {
      // Reset form for new entry
      setSelectedWinner('')
      setPlayer1Score('')
      setPlayer2Score('')
      setLocation('')
      setDateTime('')
      setComments('')
      setPhotos([])
      setPhotoPreviews([])
      setExistingPhotos([])
    }
  }, [isOpen, match, isEditMode])

  const updateMatchMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = session?.user?.accessToken || ''

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/match/${match?._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update match')
      }

      return data
    },
    onSuccess: () => {
      toast.success('Match result saved successfully!')

      // Invalidate matches queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['match', match?._id] })

      onSuccess?.()
      onClose()

      // Reset form
      setSelectedWinner('')
      setPlayer1Score('')
      setPlayer2Score('')
      setLocation('')
      setDateTime('')
      setComments('')
      setPhotos([])
      setPhotoPreviews([])
      setExistingPhotos([])
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong. Please try again.')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      addPhotos(files)
    }
  }

  const addPhotos = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => file.type.startsWith('image/'))

    setPhotos((prev) => [...prev, ...validFiles])

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      addPhotos(imageFiles)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!match) {
      toast.error('Match information is missing')
      return
    }

    if (!session?.user?.accessToken) {
      toast.error('You must be logged in')
      return
    }

    if (!selectedWinner) {
      toast.error('Please select a winner')
      return
    }

    if (!player1Score || !player2Score) {
      toast.error('Please enter both scores')
      return
    }

    // Validate scores
    const score1 = parseInt(player1Score)
    const score2 = parseInt(player2Score)

    if (selectedWinner === match?.player1Id?._id && score1 <= score2) {
      toast.error('Winner score must be higher than opponent')
      return
    }

    if (selectedWinner === match?.player2Id?._id && score2 <= score1) {
      toast.error('Winner score must be higher than opponent')
      return
    }

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('player1Score', player1Score)
    formData.append('player2Score', player2Score)
    formData.append('winner', selectedWinner)
    formData.append('status', 'completed')

    if (location) formData.append('venue', location)
    if (dateTime) formData.append('date', new Date(dateTime).toISOString())
    if (comments) formData.append('comments', comments)

    // Append all new photos to matchPhotos field
    photos.forEach((photo) => {
      formData.append('matchPhotos', photo)
    })

    // If in edit mode and there are existing photos, we might need to handle them
    // depending on your backend implementation
    if (isEditMode && existingPhotos.length > 0) {
      formData.append('existingPhotos', JSON.stringify(existingPhotos))
    }

    updateMatchMutation.mutate(formData)
  }

  if (!isOpen || !match) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b">
            <div className="flex-1"></div>
            <h2 className="text-2xl font-bold text-red-700 flex-1 text-center">
              {isEditMode ? 'Edit Result' : 'Enter Result'}
            </h2>
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                disabled={updateMatchMutation.isPending}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Select Winner */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Winner
              </label>
              <div className="space-y-3">
                {/* Player 1 */}
                <div
                  onClick={() => setSelectedWinner(match?.player1Id?._id || '')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedWinner === match?.player1Id?._id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedWinner === match?.player1Id?._id
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedWinner === match?.player1Id?._id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {match?.player1Id?.fullName || 'Player 1'}
                  </span>
                </div>

                {/* Player 2 */}
                <div
                  onClick={() => setSelectedWinner(match?.player2Id?._id || '')}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedWinner === match?.player2Id?._id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedWinner === match?.player2Id?._id
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedWinner === match?.player2Id?._id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {match?.player2Id?.fullName || 'Player 2'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scores - Updated Layout */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Match Scores
              </label>

              {/* Player 1 Score */}
              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 flex-1">
                  {match?.player1Id?.fullName || 'Player 1'}
                </span>
                <input
                  type="number"
                  min="0"
                  value={player1Score}
                  onChange={(e) => setPlayer1Score(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center font-semibold"
                  placeholder="0"
                  required
                />
              </div>

              {/* Player 2 Score */}
              <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 flex-1">
                  {match?.player2Id?.fullName || 'Player 2'}
                </span>
                <input
                  type="number"
                  min="0"
                  value={player2Score}
                  onChange={(e) => setPlayer2Score(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center font-semibold"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Location and Date/Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Collingtree Park GC"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date/Time
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Match Play Moments Report */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Match Play Moments Report
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Very Close match played against 2 great players"
              />
            </div>

            {/* Multiple Photos Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Match Photos (Multiple)
              </label>

              {/* Existing Photos (Edit Mode) */}
              {isEditMode && existingPhotos.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Existing Photos:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {existingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={photo}
                          alt={`Existing ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Photo Previews Grid */}
              {photoPreviews.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">New Photos:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              >
                <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600 mb-1">Drag and drop files here</p>
                <p className="text-sm text-gray-500 mb-3">
                  or click to browse (Multiple files allowed)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="photos-upload"
                />
                <label
                  htmlFor="photos-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  Browse Files
                </label>
                {photoPreviews.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {photoPreviews.length} new photo(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMatchMutation.isPending}
              className="flex-1 px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMatchMutation.isPending}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {updateMatchMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
