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
      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-center gap-2">
        {/* VIEW */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setViewOpen(true)}
          className="h-10 w-10 [&_svg]:h-6 [&_svg]:w-6"
        >
          <Eye />
        </Button>

        {/* EDIT */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditOpen(true)}
          className="h-10 w-10 [&_svg]:h-6 [&_svg]:w-6"
        >
          <Pencil />
        </Button>

        {/* DELETE */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteOpen(true)}
          className="h-10 w-10 text-red-600 hover:text-red-700 [&_svg]:h-6 [&_svg]:w-6"
        >
          <Trash2 />
        </Button>
      </div>

      {/* VIEW MODAL */}
      <TeamViewModal
        memberId={member._id}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      {/* EDIT MODAL */}
      <TeamFormModal
        mode="edit"
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* DELETE MODAL */}
      <DeleteTeamModal
        memberId={member._id}
        memberName={member.memberName}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
