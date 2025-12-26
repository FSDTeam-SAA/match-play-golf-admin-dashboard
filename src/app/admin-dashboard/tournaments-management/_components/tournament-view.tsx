import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tournament } from '../_components/tournament-data-type'
import moment from 'moment'

const TournamentView = ({
  open,
  onOpenChange,
  tournamentData,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournamentData: Tournament | null
}) => {
  if (!tournamentData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">{tournamentData?.tournamentName}</h2>

        <div className="space-y-2">
          <p>
            <strong>Location :</strong>{' '}
            {tournamentData?.billingAddress?.country}
          </p>
          <p>
            <strong>Start Date :</strong>{' '}
            {moment(tournamentData?.startDate).format('MMM DD, YYYY')}
          </p>
          <p>
            <strong>End Date :</strong>{' '}
            {moment(tournamentData?.endDate).format('MMM DD, YYYY')}
          </p>
          <p>
            <strong>Total Players :</strong> {0}
          </p>
          <p>
            <strong>Status :</strong> {tournamentData?.status}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TournamentView
