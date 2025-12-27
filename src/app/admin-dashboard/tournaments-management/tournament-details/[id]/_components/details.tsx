'use client'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton' // Assuming you have shadcn skeleton installed

interface Tournament {
  tournamentName: string
  sportName: string
  format?: string
  drawFormat?: string
  drawSize?: number
  startDate?: string
  endDate?: string
  location?: string
}

interface DetailsProps {
  tournament?: Tournament
  isLoading: boolean
}

const Details = ({ tournament, isLoading }: DetailsProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <Skeleton className="mb-6 h-7 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // console.log('tournaments details', tournament)

  if (!tournament) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800">
          Event Details
        </h4>
        <p className="text-center text-gray-500">
          No tournament data available
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h4 className="mb-6 text-2xl font-semibold text-gray-800">
        Event Details
      </h4>

      <div className="space-y-4">
        <DetailItem
          label="Event Name"
          value={tournament.tournamentName}
          highlight
        />
        <DetailItem label="Sport" value={tournament.sportName} />
        <DetailItem label="Format" value={tournament.format} />
        <DetailItem label="Competition Type" value={tournament.drawFormat} />
        <DetailItem
          label="Draw Size"
          value={
            tournament.drawSize ? tournament.drawSize.toString() : undefined
          }
        />
        <DetailItem
          label="Start Date"
          value={
            tournament.startDate
              ? new Date(tournament.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : undefined
          }
        />
        <DetailItem
          label="End Date"
          value={
            tournament.endDate
              ? new Date(tournament.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : undefined
          }
        />
        <DetailItem label="Location" value={tournament.location} />
        <DetailItem label="Hold Each Round" value="" />
      </div>
    </div>
  )
}

interface DetailItemProps {
  label: string
  value?: string
  highlight?: boolean
}

const DetailItem = ({ label, value, highlight }: DetailItemProps) => (
  <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span
      className={`text-right text-sm ${
        highlight
          ? 'font-semibold text-gray-900'
          : value
          ? 'text-gray-800'
          : 'text-gray-400'
      }`}
    >
      {value || 'Not specified'}
    </span>
  </div>
)

export default Details
