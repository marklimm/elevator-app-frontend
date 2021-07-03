import React, { FunctionComponent } from 'react'

interface PersonUpdatesProps {
  personId: string
  personUpdatesArr: string[]
}

const PersonUpdates: FunctionComponent<PersonUpdatesProps> = ({
  personId,
  personUpdatesArr,
}: PersonUpdatesProps) => {
  return (
    <div className='p-3 w-1/2'>
      <div className='text-2xl'>Updates for {personId}</div>

      {personUpdatesArr.length > 0 &&
        personUpdatesArr.map((personUpdateText) => (
          <div key={personUpdateText}>{personUpdateText}</div>
        ))}
    </div>
  )
}

export const PersonUpdatesMemo = React.memo(PersonUpdates)
