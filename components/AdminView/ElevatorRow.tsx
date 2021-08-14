import React, { FunctionComponent } from 'react'

import { ElevatorUpdatesMemo } from './ElevatorUpdates'
import { UpdatesState } from 'lib/socketIO/UpdatesReducer'

import styles from './AdminView.module.scss'

interface ElevatorRowProps {
  elevatorUpdates: UpdatesState
}

export const ElevatorRow: FunctionComponent<ElevatorRowProps> = ({
  elevatorUpdates,
}: ElevatorRowProps) => {
  const elevatorIds = Object.keys(elevatorUpdates)

  return (
    <>
      <div className={styles.updatesContainer}>
        {elevatorIds.length === 0 && (
          <span>No elevator updates have been received yet</span>
        )}
        {elevatorIds.map((elevatorId) => {
          const elevatorUpdatesArr = elevatorUpdates[elevatorId]

          return (
            <ElevatorUpdatesMemo
              key={elevatorId}
              elevatorId={elevatorId}
              elevatorUpdatesArr={elevatorUpdatesArr}
            />
          )
        })}
      </div>
    </>
  )
}
