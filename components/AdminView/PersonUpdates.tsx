import React, { FunctionComponent } from 'react'
import styles from './AdminView.module.scss'

import { FormattedUpdate } from 'lib/socketIO/UpdatesReducer'

interface PersonUpdatesProps {
  personId: string
  personUpdatesArr: FormattedUpdate[]
}

const PersonUpdates: FunctionComponent<PersonUpdatesProps> = ({
  personId,
  personUpdatesArr,
}: PersonUpdatesProps) => {
  return (
    <div className=''>
      <div className='text-2xl'>Updates for {personId}</div>

      <div className={`${styles.personOrElevatorUpdates} bg-red-50  `}>
        {personUpdatesArr.length > 0 &&
          personUpdatesArr.map((personUpdate) => (
            <div key={personUpdate.text}>
              <div className={`${styles.time} text-red-700 `}>
                {personUpdate.formattedTime}
              </div>
              <span className={`${personUpdate.emphasize ? 'font-bold' : ''}`}>
                {personUpdate.text}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

export const PersonUpdatesMemo = React.memo(PersonUpdates)
