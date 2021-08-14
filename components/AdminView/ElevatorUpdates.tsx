import React, { FunctionComponent } from 'react'

import styles from './AdminView.module.scss'

import { FormattedUpdate } from 'lib/socketIO/UpdatesReducer'

interface ElevatorUpdatesProps {
  elevatorId: string
  elevatorUpdatesArr: FormattedUpdate[]
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
          elevatorUpdatesArr.map((elevatorUpdate) => (
            <div key={elevatorUpdate.text} className=''>
              <div className={`${styles.time} text-green-700 `}>
                {elevatorUpdate.formattedTime}
              </div>
              {elevatorUpdate.text}
            </div>
          ))}
      </div>
    </div>
  )
}

export const ElevatorUpdatesMemo = React.memo(ElevatorUpdates)
