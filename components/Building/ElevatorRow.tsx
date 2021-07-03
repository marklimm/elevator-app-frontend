import React, { FunctionComponent } from 'react'

import { ElevatorUpdatesMemo } from './ElevatorUpdates'

interface ElevatorRowProps {
  elevatorUpdates: string[]
}

export const ElevatorRow: FunctionComponent<ElevatorRowProps> = ({
  elevatorUpdates,
}: ElevatorRowProps) => {
  const elevatorIds = Object.keys(elevatorUpdates)

  return (
    <>
      <div>
        {elevatorIds.length === 0 && (
          <span>There are currently no elevators</span>
        )}

        {elevatorIds.length > 0 && (
          <div className='flex mt-3'>
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
        )}
      </div>
    </>
  )
}
