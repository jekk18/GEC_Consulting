import { Html, Head, Main, NextScript } from 'next/document'


export default function Document(props) {    
  return (
    <Html lang={props.locale}>
      <Head />
      <body >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
