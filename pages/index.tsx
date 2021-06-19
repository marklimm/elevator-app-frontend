import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Building } from 'components/Building/Building'

// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import styles from './index.module.scss'

interface HomePageProps {
  readmeContent: string
  socketIOUrl: string
}

// //  styling the toastr taking cues from https://fkhadra.github.io/react-toastify/how-to-style#css-classes-as-function
// const contextClass = {
//   success: "bg-green-600",
//   error: "bg-red-700",
//   info: "bg-gray-500",
//   // warning: "bg-orange-400",
//   default: "bg-indigo-600",
//   // dark: "bg-white-600 font-gray-300",
// };

// const socket = io('localhost:8000')

const HomePage: FunctionComponent<HomePageProps> = ({
  // readmeContent,
  socketIOUrl,
}: HomePageProps) => {
  return (
    <>
      <Head>
        <title>Elevator app</title>
        <meta name='description' content='A nextjs elevator app'></meta>
      </Head>

      <div className=''>
        This is a nextJS app!
        <br />
        <Link href='/devblog'>
          <a>Developer Blog</a>
        </Link>
        <div className='m-3'>
          <Building socketIOUrl={socketIOUrl} />
        </div>
      </div>
      {/* 
      <div className="flex justify-center">
        <div
          className={`${styles.markdownContent} ${styles.whiteBlock}`}
          dangerouslySetInnerHTML={{ __html: readmeContent }}
        />
      </div> */}

      {/* CSS classes taken from https://fkhadra.github.io/react-toastify/how-to-style#css-classes-as-function */}
      {/* <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        style={{ width: "600px" }}
        toastClassName={({ type }) =>
          contextClass[type || "default"] +
          " relative flex mt-3 p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
      /> */}
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // const readmeData = await getMarkdownFileData(
  //   "",
  //   "pages/landing-page-intro.md"
  // );

  return {
    props: {
      // readmeContent: readmeData.contentHtml,
      readmeContent: '',
      socketIOUrl: process.env.SOCKETIO_URL,
    },
  }
}

export default HomePage
