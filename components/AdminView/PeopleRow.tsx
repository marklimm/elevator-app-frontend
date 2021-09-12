import React, { FunctionComponent } from 'react'

import { PersonUpdatesMemo } from './PersonUpdates'
import { UpdatesState } from 'lib/socketIO/UpdatesReducer'

import styles from './AdminView.module.scss'

interface PeopleRowProps {
  peopleUpdates: UpdatesState
}

export const PeopleRow: FunctionComponent<PeopleRowProps> = ({
  peopleUpdates,
}: PeopleRowProps) => {
  const personIds = Object.keys(peopleUpdates)

  return (
    <>
      <div className='grid grid-cols-3 gap-4'>
        {personIds.length === 0 && (
          <span>No people updates have been received yet</span>
        )}

        {personIds.map((personId) => {
          const personUpdatesArr = peopleUpdates[personId] || []

          return (
            <PersonUpdatesMemo
              key={personId}
              personId={personId}
              personUpdatesArr={personUpdatesArr}
            />
          )
        })}
      </div>
    </>
  )
}

export const PeopleRowMemo = React.memo(PeopleRow)
