import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import { AppProps } from 'next/app'

import './tailwind.scss'

//  import a root level SCSS file
import './_app.scss'

const MyApp: FunctionComponent<AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  return (
    <>
      <Head>
        <title>Elevator App</title>
      </Head>
      <div className=''>
        <Component {...pageProps} />
      </div>
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
