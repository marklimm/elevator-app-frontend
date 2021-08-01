import React, { FunctionComponent } from 'react'

interface ElevatorUpdatesProps {
  elevatorId: string
  elevatorUpdatesArr: string[]
}

const ElevatorUpdates: FunctionComponent<ElevatorUpdatesProps> = ({
  elevatorId,
  elevatorUpdatesArr,
}: ElevatorUpdatesProps) => {
  console.log(`<ElevatorUpdates /> rendering for ${elevatorId} `)
  return (
    <div className='p-3 w-1/2'>
      <div className='text-2xl'>Updates for {elevatorId}</div>

      {elevatorUpdatesArr.length > 0 &&
        elevatorUpdatesArr.map((elevatorUpdateText) => (
          <div key={elevatorUpdateText}>{elevatorUpdateText}</div>
        ))}
    </div>
  )
}

export const ElevatorUpdatesMemo = React.memo(ElevatorUpdates)
