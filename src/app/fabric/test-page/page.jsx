export async function generateMetadata() {
  return {
    title: 'Test Page | Amrita Global Enterprises',
    description: 'This is a test page to verify metadata generation.',
    openGraph: {
      title: 'Test Page | Amrita Global Enterprises',
      description: 'This is a test page to verify metadata generation.',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/fabric/test-page`,
      siteName: 'Amrita Global Enterprises',
      images: [
        {
          url: '/images/logo.png',
          width: 1200,
          height: 630,
          alt: 'Amrita Global Enterprises',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Test Page | Amrita Global Enterprises',
      description: 'This is a test page to verify metadata generation.',
      images: ['/images/logo.png'],
    },
  };
}

export default function TestPage() {
  return (
    <div>
      <h1>Test Metadata Page</h1>
      <p>This is a test page to verify metadata generation.</p>
      <p>View the page source to check the head tags.</p>
      <p>Current URL: {process.env.NEXT_PUBLIC_SITE_URL}</p>
    </div>
  );
}
