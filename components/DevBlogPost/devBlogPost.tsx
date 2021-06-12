import React, { FunctionComponent } from 'react'

import DisplayDate from 'components/DisplayDate/DisplayDate'
import { Post } from 'lib/types/Post'

import styles from './devBlogPost.module.scss'

interface DevBlogPostProps {
  devBlogPost: Post
}

export const DevBlogPost: FunctionComponent<DevBlogPostProps> = ({
  devBlogPost,
}: DevBlogPostProps) => {
  return (
    <div className={styles.blogEntry}>
      <h1 className='text-lg'>{devBlogPost.title}</h1>

      <div className='text-sm text-red-600'>
        <DisplayDate dateString={devBlogPost.date} />
      </div>

      <div className='markdownContent mt-1'>
        <div dangerouslySetInnerHTML={{ __html: devBlogPost.contentHtml }} />
      </div>
    </div>
  )
}
