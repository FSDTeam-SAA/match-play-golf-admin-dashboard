import { Dialog, DialogContent } from '@/components/ui/dialog'
import React from 'react'
import { Match } from './draw'
import Image from 'next/image'

interface Props {
  isModalOpen: boolean
  handleCloseModal: () => void
  matchInfo: Match | null
}

const VsModal = ({ isModalOpen, handleCloseModal, matchInfo }: Props) => {
  if (!matchInfo) return null

  const isCompleted =
    matchInfo?.status === 'completed' || matchInfo?.status === 'Completed'
  const winner1 = matchInfo?.winner === matchInfo?.player1Id?._id
  const winner2 = matchInfo?.winner === matchInfo?.player2Id?._id

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="bg-white lg:max-w-3xl max-w-[95vw] sm:max-w-lg md:max-w-xl">
        <div className="p-4 md:p-6">
          {/* Match Info Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Match Details
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span
                className={`text-sm font-medium px-4 py-1.5 rounded-full ${getStatusColor(
                  matchInfo?.status,
                )}`}
              >
                {matchInfo?.status || 'upcoming'}
              </span>
              {matchInfo?.matchType && (
                <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-purple-100 text-purple-800">
                  {matchInfo?.matchType}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Player 1 */}
            <div
              className={`flex flex-col items-center text-center w-full md:w-1/3 p-4 rounded-lg transition-all ${
                isCompleted && winner1
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-gray-50'
              }`}
            >
              {isCompleted && winner1 && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                    🏆 Winner
                  </span>
                </div>
              )}

              <h1 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                {matchInfo?.matchType === 'Team' ? 'Team 1' : 'Player 1'}
              </h1>

              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={
                    matchInfo?.player1Id?.profileImage ||
                    '/images/common/user_placeholder.png'
                  }
                  alt="Player 1"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="text-lg md:text-xl font-semibold text-gray-800 mt-2 line-clamp-2">
                {matchInfo?.player1Id?.fullName || 'N/A'}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 break-words max-w-full">
                {matchInfo?.player1Id?.email || 'No email'}
              </p>

              {isCompleted && (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-800">
                    {matchInfo?.player1Score || '0'}
                  </span>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center px-4">
              <div className="text-3xl md:text-5xl font-bold text-red-500 mb-2">
                VS
              </div>
              {isCompleted && (
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-700">
                    {matchInfo?.player1Score || '0'} :{' '}
                    {matchInfo?.player2Score || '0'}
                  </span>
                </div>
              )}
            </div>

            {/* Player 2 */}
            <div
              className={`flex flex-col items-center text-center w-full md:w-1/3 p-4 rounded-lg transition-all ${
                isCompleted && winner2
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-gray-50'
              }`}
            >
              {isCompleted && winner2 && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                    🏆 Winner
                  </span>
                </div>
              )}

              <h1 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                {matchInfo?.matchType === 'Team' ? 'Team 2' : 'Player 2'}
              </h1>

              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={
                    matchInfo?.player2Id?.profileImage ||
                    '/images/common/user_placeholder.png'
                  }
                  alt="Player 2"
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="text-lg md:text-xl font-semibold text-gray-800 mt-2 line-clamp-2">
                {matchInfo?.player2Id?.fullName || 'N/A'}
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1 break-words max-w-full">
                {matchInfo?.player2Id?.email || 'No email'}
              </p>

              {isCompleted && (
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-800">
                    {matchInfo?.player2Score || '0'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Match Date/Time Info */}
          {matchInfo?.date && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(matchInfo.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-sm font-medium">
                  {new Date(matchInfo.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Comments Section */}
          {isCompleted && matchInfo?.comments && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Match Comments:
              </h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {matchInfo.comments}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper function for status styling
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800'
    case 'in progress':
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default VsModal
