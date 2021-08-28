import React, { FunctionComponent } from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'

import { ElevatorAdminView } from 'components/AdminView/ElevatorAdminView'
import { NavBar } from 'components/NavBar/NavBar'

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
        <NavBar />

        <div className='m-3'>
          <div className='mb-8'>
            <span className='text-xl font-bold'>What is this? </span>&nbsp; This
            app simulates 2 elevators moving to different floors within an
            apartment building!
          </div>

          <ElevatorAdminView socketIOUrl={socketIOUrl} />

          <div className='mt-16'>
            This app simulates 2 elevators moving to different floors within an
            apartment building!
            <br />
            <br />
            Please click the &quot;Add New Person&quot; button to spawn a new
            person who will call for an elevator
          </div>

          <div className='flex mt-8'>
            <div className='w-1/2'>
              <span className='text-lg'>People can:</span>
              <ul className='list-decimal ml-5'>
                <li>Spawn into existence</li>
                <li>Request an elevator</li>
                <li>Get into an elevator</li>
                <li>Push the button once they are in the elevator</li>
                <li>
                  Get off the elevator when they&apos;ve reached their
                  destination floor
                </li>
                <li>Un-spawn from the app</li>
              </ul>
            </div>
            <div className='w-1/2'>
              <span className='text-lg'>Elevators can:</span>
              <ul className='list-decimal ml-5'>
                <li>Take requests to pick up people</li>
                <li>Move between floors</li>
                <li>Open doors when they reach their destination</li>
                <li>
                  Close doors when the person has pressed a button for what
                  floor
                </li>
              </ul>
            </div>
          </div>
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
