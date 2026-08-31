import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TournamentPlayerItem } from './players-management-data-type'
import Image from 'next/image'

const PlayersView = ({
  open,
  onOpenChange,
  tournamentData,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournamentData: TournamentPlayerItem | null
}) => {
  if (!tournamentData) return null
  const isTeam = tournamentData.tournamentDetails?.format?.toLowerCase() === 'team'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 space-y-4">
        <div className="space-y-2">
          <p>
            <strong>Tournament Name :</strong>{' '}
            {tournamentData?.tournamentDetails?.tournamentName || 'N/A'}
          </p>
          {isTeam && (
            <p>
              <strong>Team Name :</strong>{' '}
              {tournamentData?.playerDetails?.teamName || 'N/A'}
            </p>
          )}
          <p className="flex items-center gap-5">
            <strong>Player Profile :</strong>{' '}
            <Image
              src={
                tournamentData?.playerDetails?.profileImage ||
                '/images/demoUser.png'
              }
              alt="Player Profile"
              width={50}
              height={50}
              className="w-10 h-10 object-cover rounded-[10px]"
            />
          </p>
          <p>
            <strong>{isTeam ? 'Captain Name' : 'Player Name'} :</strong>{' '}
            {tournamentData?.playerDetails?.fullName || 'N/A'}
          </p>
          <p>
            <strong>Player Email :</strong>{' '}
            {tournamentData?.playerDetails?.email || 'N/A'}
          </p>
          <p>
            <strong>Phone :</strong>{' '}
            {tournamentData?.playerDetails?.phone || 'N/A'}
          </p>
          <p>
            <strong>Country :</strong>{' '}
            {tournamentData?.playerDetails?.country || 'N/A'}
          </p>
           <p>
            <strong>Club Name :</strong>{' '}
            {tournamentData?.playerDetails?.clubName || 'N/A'}
          </p>
          <p>
            <strong>Handicap :</strong>{' '}
            {tournamentData?.playerDetails?.handicap || 'N/A'}
          </p>
          <p>
            <strong>Status :</strong>{' '}
            {tournamentData?.playerDetails?.status || 'N/A'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlayersView
