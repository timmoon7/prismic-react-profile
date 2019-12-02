import React, { useEffect, useState } from 'react';
import { DefaultLayout, SliceZone } from '../components';
import NotFound from './NotFound';
import { client } from '../utils/prismicHelpers';

/**
 * Website page component
 */
const Page = ({ match }) => {
  const [prismicData, setPrismicData] = useState({ pageDoc: null, menuDoc: null });
  const [notFound, toggleNotFound] = useState(false);

  const uid = match.params.uid;

  // Get the page document from Prismic
  useEffect(() => {
    const fetchPrismicData = async () => {
      try {
        const pageDoc = await client.getByUID('page', uid);
        const menuDoc = await client.getSingle('menu');
  
        if (pageDoc) {
          setPrismicData({ pageDoc, menuDoc });
        } else {
          console.warn('Page document was not found. Make sure it exists in your Prismic repository');
          toggleNotFound(true);
        }
      } catch (error) {
        console.error(error);
        toggleNotFound(true);
      }
    }
    fetchPrismicData();

    // Load new page at the top (when linking from the middle of another page)
    window.scrollTo(0, 0);
  }, [uid]);

  // Return the page if a document was retrieved from Prismic
  if (prismicData.pageDoc) {
    const pageDoc = prismicData.pageDoc;
    const menuDoc = prismicData.menuDoc;

    return (
      <DefaultLayout
        wrapperClass="page"
        menuDoc={menuDoc}
      >
        <SliceZone sliceZone={pageDoc.data.page_content} />
      </DefaultLayout>
    );
  } else if (notFound) {
    return <NotFound />;
  }
  return null;
}

export default Page
