'use client'
import React, { useState } from 'react'
import { Match } from './draw'
import Image from 'next/image'
import PairVsModal from './pair-vs-modal'
import MomentsModal from './moments-modal'
import EnterResultModal from './enter-result-modal'

const getInitial = (name?: string, fallback: string = 'P') =>
  name?.trim().charAt(0).toUpperCase() || fallback

const PairPlayerRow = ({
  profileImage,
  fullName,
  fallback,
  isWinner,
}: {
  profileImage?: string
  fullName?: string
  fallback: string
  isWinner: boolean
}) => {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
      {profileImage ? (
        <Image
          src={profileImage}
          alt={fullName || fallback}
          width={88}
          height={88}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          className={`text-sm font-semibold ${
            isWinner ? 'text-red-100' : 'text-red-800'
          }`}
        >
          {getInitial(fullName, fallback)}
        </span>
      )}
    </div>
  )
}

const PairNames = ({
  firstName,
  secondName,
  firstFallback,
  secondFallback,
}: {
  firstName?: string
  secondName?: string
  firstFallback: string
  secondFallback: string
}) => {
  return (
    <div className="space-y-1">
      <h1 className="text-sm font-semibold leading-6 sm:text-base">
        {firstName || firstFallback}
      </h1>
      <h1 className="text-sm font-semibold leading-6 sm:text-base">
        {secondName || secondFallback}
      </h1>
    </div>
  )
}

const PairCard = ({
  item,
  index,
  getStatusColor,
  refetchMatches,
}: {
  item: Match
  index: number
  getStatusColor: (value: string) => string
  refetchMatches?: () => void
}) => {
  const [isPairVsModalOpen, setIsPairVsModalOpen] = useState(false)
  const [matchInfo, setMatchInfo] = useState<Match>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEnterResultModalOpen, setIsEnterResultModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const pairWinner1 = item?.winner === item?.pair1Id?._id
  const pairWinner2 = item?.winner === item?.pair2Id?._id

  const handlePairVsOpen = (match: Match) => {
    setIsPairVsModalOpen(true)
    setMatchInfo(match)
  }

  const handlePairCloseModal = () => {
    setIsPairVsModalOpen(false)
  }

  const handleOpenModal = (match: Match) => {
    setIsModalOpen(true)
    setMatchInfo(match)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleEnterResultOpen = (match: Match, editMode: boolean = false) => {
    setIsEnterResultModalOpen(true)
    setMatchInfo(match)
    setIsEditMode(editMode)
  }

  const handleEnterResultClose = () => {
    setIsEnterResultModalOpen(false)
    setIsEditMode(false)
  }

  const handleResultSuccess = () => {
    refetchMatches?.()
  }

  return (
    <>
      <div className="flex items-center gap-5 space-y-5">
        <div className="font-medium text-gray-500 pt-5">
          {index + 1 < 10 ? `0${index + 1}` : index + 1}
        </div>

        <div className="flex-1 shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="flex items-stretch border-b border-b-gray-300">
            {/* winner 1 card */}
            <div
              className={`flex flex-1 items-center border-r border-gray-300 p-6 ${
                pairWinner1 ? `bg-[#39674b] text-white` : ''
              }`}
            >
              <div className="flex w-full items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <PairPlayerRow
                    profileImage={item.pair1Id?.player1?.profileImage}
                    fullName={item.pair1Id?.player1?.fullName}
                    fallback="Player 1"
                    isWinner={pairWinner1}
                  />
                  <PairPlayerRow
                    profileImage={item.pair1Id?.player2?.profileImage}
                    fullName={item.pair1Id?.player2?.fullName}
                    fallback="Player 2"
                    isWinner={pairWinner1}
                  />
                </div>

                <div className="text-center">
                  <PairNames
                    firstName={item.pair1Id?.player1?.fullName}
                    secondName={item.pair1Id?.player2?.fullName}
                    firstFallback="Player 1"
                    secondFallback="Player 2"
                  />
                </div>
              </div>
            </div>

            {/* vs button */}
            <div
              className={`px-8 flex items-center gap-2 ${
                pairWinner1 && 'flex-row-reverse'
              }`}
            >
              <div
                onClick={() => handlePairVsOpen(item)}
                className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
              >
                VS
              </div>
              {item.status === 'completed' && (
                <div className="text-sm font-medium text-gray-600">
                  <span className="text-red-700 font-bold text-xl flex">
                    <span>{item.pair1Score}</span> <span> /</span>{' '}
                    <span> {item.pair2Score}</span>
                  </span>
                </div>
              )}
            </div>

            {/* winner 2 card */}
            <div
              className={`flex flex-1 items-center border-l border-gray-300 p-6 ${
                pairWinner2 ? `bg-[#39674b] text-white` : ''
              }`}
            >
              <div className="flex w-full items-center justify-center gap-4">
                <div className="flex items-center gap-3">
                  <PairPlayerRow
                    profileImage={item.pair2Id?.player1?.profileImage}
                    fullName={item.pair2Id?.player1?.fullName}
                    fallback="Player 1"
                    isWinner={pairWinner2}
                  />
                  <PairPlayerRow
                    profileImage={item.pair2Id?.player2?.profileImage}
                    fullName={item.pair2Id?.player2?.fullName}
                    fallback="Player 2"
                    isWinner={pairWinner2}
                  />
                </div>

                <div className="text-center">
                  <PairNames
                    firstName={item.pair2Id?.player1?.fullName}
                    secondName={item.pair2Id?.player2?.fullName}
                    firstFallback="Player 1"
                    secondFallback="Player 2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#eaeaeecb] py-2 px-4">
            <div
              className={`flex flex-col sm:flex-row ${
                item.status === 'completed'
                  ? 'justify-between'
                  : 'justify-center'
              } items-start sm:items-center gap-4`}
            >
              <div></div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <span className="text-gray-700 text-sm">
                    {item?.date
                      ? new Date(item?.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Date not set'}
                  </span>
                  <span>, </span>
                  <span className="text-gray-700 text-sm">
                    {item?.date
                      ? new Date(item?.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <div
                    className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                      item.status,
                    )}`}
                  >
                    {item.status || 'upcoming'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {item.status === 'completed' || item.status === 'Completed' ? (
                  <>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-primary font-semibold text-sm hover:text-red-700 transition-colors"
                    >
                      Moments
                    </button>
                    <button
                      onClick={() => handleEnterResultOpen(item, true)}
                      className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                    >
                      Edit Result
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnterResultOpen(item, false)}
                    className="text-primary font-semibold text-sm hover:text-red-700 transition-colors"
                  >
                    Enter Result
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPairVsModalOpen && (
        <PairVsModal
          handleCloseModal={handlePairCloseModal}
          isModalOpen={isPairVsModalOpen}
          matchInfo={matchInfo as Match}
        />
      )}

      {isModalOpen && (
        <MomentsModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          match={matchInfo as Match}
          pairWinner1={pairWinner1}
        />
      )}

      {isEnterResultModalOpen && matchInfo && (
        <EnterResultModal
          isOpen={isEnterResultModalOpen}
          onClose={handleEnterResultClose}
          match={matchInfo}
          onSuccess={handleResultSuccess}
          isEditMode={isEditMode}
        />
      )}
    </>
  )
}

export default PairCard
