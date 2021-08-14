import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { NavBar } from 'components/NavBar/NavBar'

import { Post } from 'lib/types/Post'
import { getSortedMarkdownFiles } from 'lib/markdownParser'

import { DevBlogPost } from 'components/DevBlogPost/devBlogPost'

interface DevBlogProps {
  devBlogPosts: Post[]
}

const DevBlog: FunctionComponent<DevBlogProps> = ({
  devBlogPosts,
}: DevBlogProps) => {
  return (
    <>
      <Head>
        <title>Developer blog</title>
        <meta
          name='description'
          content='Markdown files being output to HTML.  A log of updates made to my NextJS app'
        ></meta>
      </Head>

      <div className=''>
        <NavBar />

        <div className='m-3'>
          <h1 className='text-2xl text-center'>Developer Blog</h1>

          <div className='mt-8 flex justify-center'>
            <div className='lg:w-3/4 xl:w-2/3 2xl:w-1/2'>
              {devBlogPosts.length > 0 &&
                devBlogPosts.map((post) => (
                  <div key={post.id} className=''>
                    <DevBlogPost devBlogPost={post} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const devBlogPosts = await getSortedMarkdownFiles('data/devblog')
  const lastTwentyPosts = devBlogPosts.slice(0, 20)

  return {
    props: {
      devBlogPosts: lastTwentyPosts,
    },
  }
}

export default DevBlog
