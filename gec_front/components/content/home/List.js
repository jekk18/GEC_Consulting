import React, { useEffect, useState } from 'react'
import MainBanner from '@/components/MainBanner/MainBanner'
import { useRouter } from 'next/router';
import { getSectionPosts } from '@/core/sections/requests';

const List = (props) => { 
 
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const posts = await getSectionPosts(
          props.page.id,
        );
        setData(posts.posts.data);
      } catch (error) {
        console.error("Error fetching section posts:", error);
      }
      setLoader(false);
    };
    fetchData();
  }, [props.page.id, locale]); 
    
  return (
    <>
      <MainBanner data={data} loading={loader} locale={locale}/> 
      { !loader && props.components}   
    </>
  ) 
}

export default List