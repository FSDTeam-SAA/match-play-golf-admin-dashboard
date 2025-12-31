import React from 'react'
import EditMatchForm from './_components/edit-match-form'
// import EditMatchHeader from './_components/edit-match-header'

const EditMatch = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      {/* <EditMatchHeader/> */}
      <EditMatchForm id={params?.id} />
    </div>
  )
}

export default EditMatch
