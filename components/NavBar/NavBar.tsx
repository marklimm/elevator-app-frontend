import React, { FunctionComponent } from 'react'
import Link from 'next/link'
// import { LinkDropdown } from 'components/LinkDropdown/LinkDropdown'

import styles from './NavBar.module.scss'

export const NavBar: FunctionComponent = () => {
  return (
    <div className={styles.navBar}>
      <span className='text-2xl font-bold'>Elevator Simulator</span>

      <div className='flex justify-end'>
        <Link href='/'>
          <a className={`${styles.link}`}>Home</a>
        </Link>{' '}
        <Link href='/devblog'>
          <a className={styles.link}>Developer Blog</a>
        </Link>
      </div>
    </div>
  )
}
