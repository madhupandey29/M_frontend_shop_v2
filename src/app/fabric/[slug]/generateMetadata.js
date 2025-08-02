import { notFound } from 'next/navigation';
import { configureStore } from '@reduxjs/toolkit';
import { seoApi } from '@/redux/features/seoApi';
import { newProductApi } from '@/redux/features/newProductApi';

// Create a new store instance for server-side usage
const store = configureStore({
  reducer: {
    [seoApi.reducerPath]: seoApi.reducer,
    [newProductApi.reducerPath]: newProductApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seoApi.middleware, newProductApi.middleware),
});

function getDefaultMetadata(product) {
  const defaultTitle = `${product.name} | Your Site Name`;
  const defaultDescription = product.productdescription || `Shop ${product.name} - ${product.category?.name || 'Fabric'}`;
  const defaultKeywords = [
    product.name,
    product.category?.name,
    'fabric',
    'textile',
    product.gsm && `${product.gsm} gsm`,
    product.oz && `${product.oz} oz`,
    product.width && `${product.width} width`,
    product.sku && `SKU: ${product.sku}`,
    product.productIdentifier && `ID: ${product.productIdentifier}`,
  ].filter(Boolean).join(', ');

  // Create structured data for rich results
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.productdescription || defaultDescription,
    sku: product.sku,
    productID: product._id,
    image: product.img ? [product.img] : undefined,
    brand: {
      '@type': 'Brand',
      name: product.vendor?.name || 'Your Brand Name',
    },
    offers: {
      '@type': 'Offer',
      price: product.price || '0',
      priceCurrency: 'INR',
      priceValidUntil: product.offerDate?.endDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
      availability: product.status === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'GSM', value: product.gsm },
      { '@type': 'PropertyValue', name: 'OZ', value: product.oz },
      { '@type': 'PropertyValue', name: 'Width', value: product.width },
      { '@type': 'PropertyValue', name: 'Color', value: product.color?.map(c => c.name).join(', ') },
      { '@type': 'PropertyValue', name: 'Design', value: product.design?.name },
      { '@type': 'PropertyValue', name: 'Category', value: product.category?.name },
    ].filter(prop => prop.value !== undefined && prop.value !== '' && prop.value !== null),
  };
  
  // Create base metadata object
  const metadata = {
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords,
    metadataBase: new URL('https://yoursite.com'),
    alternates: {
      canonical: `/fabric/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: defaultDescription,
      url: `/fabric/${product.slug}`,
      siteName: 'Your Site Name',
      images: [
        {
          url: product.img,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: defaultDescription,
      images: [product.img].filter(Boolean),
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {},
  };

  // Add structured data
  if (structuredData) {
    metadata.other['application/ld+json'] = JSON.stringify(structuredData);
  }

  // Add additional meta tags
  metadata.other['product:price:amount'] = product.price || '0';
  metadata.other['product:price:currency'] = 'INR';
  metadata.other['product:availability'] = product.status === 'in-stock' ? 'in stock' : 'out of stock';
  
  if (product.gsm) {
    metadata.other['product:gsm'] = product.gsm.toString();
  }
  
  if (product.width) {
    metadata.other['product:width'] = product.width;
  }

  return metadata;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    // Get product data
    const productResult = await store.dispatch(
      newProductApi.endpoints.getSingleNewProduct.initiate(slug)
    );

    if (!productResult.data?.data) {
      return {
        title: 'Product Not Found | Your Site Name',
        description: 'The product you are looking for does not exist or has been removed.'
      };
    }

    const product = productResult.data.data;
    let metadata = getDefaultMetadata(product);
    
    // Get SEO data if available
    try {
      const seoResult = await store.dispatch(
        seoApi.endpoints.getSeoByProduct.initiate(product._id)
      );
      
      if (seoResult.data?.data) {
        const seoData = seoResult.data.data;
        
        // Update metadata with SEO data
        metadata = {
          ...metadata,
          title: seoData.metaTitle || metadata.title,
          description: seoData.metaDescription || metadata.description,
          keywords: seoData.metaKeywords || metadata.keywords,
          openGraph: {
            ...metadata.openGraph,
            title: seoData.ogTitle || metadata.openGraph.title,
            description: seoData.ogDescription || metadata.openGraph.description,
            images: [{
              ...metadata.openGraph.images[0],
              url: seoData.ogImage || metadata.openGraph.images[0].url,
              alt: seoData.ogImageAlt || metadata.openGraph.images[0].alt,
            }],
          },
          twitter: {
            ...metadata.twitter,
            title: seoData.twitterTitle || metadata.twitter.title,
            description: seoData.twitterDescription || metadata.twitter.description,
            images: seoData.twitterImage ? [seoData.twitterImage] : metadata.twitter.images,
          },
        };

        // Add additional SEO fields if they exist
        if (seoData.canonical) {
          metadata.alternates = {
            ...metadata.alternates,
            canonical: seoData.canonical,
          };
        }

        if (seoData.robots) {
          metadata.robots = {
            ...metadata.robots,
            ...seoData.robots,
          };
        }

        // Add structured data if available
        if (seoData.structuredData) {
          metadata.other = {
            ...metadata.other,
            'application/ld+json': JSON.stringify(seoData.structuredData),
          };
        }
      }
    } catch (seoError) {
      console.error('Error fetching SEO data:', seoError);
    }

    // Clean up the store
    store.dispatch(seoApi.util.resetApiState());
    store.dispatch(newProductApi.util.resetApiState());

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Page',
      description: 'Product details',
    };
  }
}
