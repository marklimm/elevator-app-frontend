import React, { FunctionComponent } from 'react'

import { PersonUpdatesMemo } from './PersonUpdates'
import { UpdatesState } from 'lib/socketIO/UpdatesReducer'

interface PeopleRowProps {
  peopleUpdates: UpdatesState
}

export const PeopleRow: FunctionComponent<PeopleRowProps> = ({
  peopleUpdates,
}: PeopleRowProps) => {
  const personIds = Object.keys(peopleUpdates)

  return (
    <>
      <div>
        {personIds.length === 0 && <span>There are currently no people</span>}

        {personIds.length > 0 && (
          <div className='flex mt-3'>
            {personIds.map((personId) => {
              const personUpdatesArr = peopleUpdates[personId] || []

              console.log('personUpdatesArr', personUpdatesArr)
              return (
                <PersonUpdatesMemo
                  key={personId}
                  personId={personId}
                  personUpdatesArr={personUpdatesArr}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}