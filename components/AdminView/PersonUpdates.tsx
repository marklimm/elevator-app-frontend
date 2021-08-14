import React, { FunctionComponent } from 'react'
import styles from './AdminView.module.scss'

interface PersonUpdatesProps {
  personId: string
  personUpdatesArr: string[]
}

const PersonUpdates: FunctionComponent<PersonUpdatesProps> = ({
  personId,
  personUpdatesArr,
}: PersonUpdatesProps) => {
  return (
    <div className='w-1/2'>
      <div className='text-2xl'>Updates for {personId}</div>

      <div className={styles.updatesBox}>
        {personUpdatesArr.length > 0 &&
          personUpdatesArr.map((personUpdateText) => (
            <div key={personUpdateText}>{personUpdateText}</div>
          ))}
      </div>
    </div>
  )
}

export const PersonUpdatesMemo = React.memo(PersonUpdates)
