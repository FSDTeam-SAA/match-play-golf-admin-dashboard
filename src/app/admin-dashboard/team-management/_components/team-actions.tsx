// 📄 src/components/team/team-actions.tsx

'use client'

import { useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TeamMember } from '@/../types/team'
import { TeamViewModal } from './team-view-modal'
import { TeamFormModal } from './team-form-modal'
import { DeleteTeamModal } from './delete-team-modal'

interface TeamActionsProps {
  member: TeamMember
}

export function TeamActions({ member }: TeamActionsProps) {
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewOpen(true)}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="h-8 w-8 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <TeamViewModal
        memberId={member._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <TeamFormModal
        mode="edit"
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteTeamModal
        memberId={member._id}
        memberName={member.memberName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
