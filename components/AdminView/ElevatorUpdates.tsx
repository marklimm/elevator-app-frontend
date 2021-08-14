import React, { FunctionComponent } from 'react'

import styles from './AdminView.module.scss'

interface ElevatorUpdatesProps {
  elevatorId: string
  elevatorUpdatesArr: string[]
}

const ElevatorUpdates: FunctionComponent<ElevatorUpdatesProps> = ({
  elevatorId,
  elevatorUpdatesArr,
}: ElevatorUpdatesProps) => {
  // console.log(`<ElevatorUpdates /> rendering for ${elevatorId} `)
  return (
    <div className='w-1/2'>
      <div className='text-2xl'>Updates for {elevatorId}</div>

      <div className={`${styles.personOrElevatorUpdates} bg-green-50`}>
        {elevatorUpdatesArr.length > 0 &&
          elevatorUpdatesArr.map((elevatorUpdateText) => (
            <div key={elevatorUpdateText}>{elevatorUpdateText}</div>
          ))}
      </div>
    </div>
  )
}

export const ElevatorUpdatesMemo = React.memo(ElevatorUpdates)
