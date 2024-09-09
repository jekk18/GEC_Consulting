import Head from "next/head"

const Meta = (props) => { 
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={props.description} />
      <meta name="keywords" content={props.keywords} />
      <link rel="icon" href="/favicon.ico" />
      <meta charSet="utf-8" />
      <title>{props.title}</title> 
      <meta property="og:title" content={props.title} />
      <meta property="og:url" content={props.url} />
      <meta property="og:image" content={props.image} />
      <meta property="og:description" content={props.description} />
      <meta property="og:site_name" content={props.site} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={props.site} />
      {/* <meta name="twitter:creator" content="@SarahMaslinNir" /> */}
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={props.image} />

    </Head>
  )
}

Meta.defaultProps = {
  title: 'GEC',
  keywords: 'gec',
  description: 'GEC',
  image: '',
  url: '',
  site: 'GEC'
}

export default Meta