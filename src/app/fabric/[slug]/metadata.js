import { configureStore } from '@reduxjs/toolkit';
import { newProductApi } from '@/redux/features/newProductApi';
import { seoApi } from '@/redux/features/seoApi';

// Helper function to ensure URL is absolute
function getAbsoluteUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function generateProductMetadata({ params }) {
  const { slug } = params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  const defaultMetadata = {
    title: 'Product Details | Amrita Global Enterprises',
    description: 'Explore our premium fabric collection at Amrita Global Enterprises',
    metadataBase: new URL(siteUrl),
    robots: {
      index: true,
      follow: true,
    },
  };
  
  try {
    // Create a new store instance for metadata generation
    const metadataStore = configureStore({
      reducer: {
        [newProductApi.reducerPath]: newProductApi.reducer,
        [seoApi.reducerPath]: seoApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
          newProductApi.middleware,
          seoApi.middleware
        ),
    });

    // Get product data
    const result = await metadataStore.dispatch(
      newProductApi.endpoints.getSingleNewProduct.initiate(slug)
    );

    if (!result.data?.data) {
      return defaultMetadata;
    }

    const product = result.data.data;
    const productUrl = `${siteUrl}/fabric/${slug}`;
    const productImage = getAbsoluteUrl(product.img || product.image || '');
    const description = product.metaDescription || 
                       product.description?.substring(0, 160) || 
                       `Shop ${product.name} at Amrita Global Enterprises`;
    
    // Clean up the store
    metadataStore.dispatch(newProductApi.util.resetApiState());
    metadataStore.dispatch(seoApi.util.resetApiState());
    
    // Prepare images array with absolute URLs
    const images = [];
    if (productImage) {
      images.push({
        url: productImage,
        width: 1200,
        height: 630,
        alt: product.name,
      });
    }
    
    // Generate keywords if available
    const keywords = [
      product.name,
      product.category,
      'fabric',
      'textiles',
      'Amrita Global Enterprises'
    ].filter(Boolean).join(', ');
    
    // Base metadata
    const metadata = {
      title: `${product.name} | Amrita Global Enterprises`,
      description,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: productUrl,
      },
      keywords,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: `${product.name} | Amrita Global Enterprises`,
        description,
        url: productUrl,
        siteName: 'Amrita Global Enterprises',
        images: images.length > 0 ? images : undefined,
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Amrita Global Enterprises`,
        description,
        images: images.length > 0 ? images.map(img => img.url) : undefined,
        creator: '@amritaglobal',
        site: '@amritaglobal',
      },
      other: {
        'application-name': 'Amrita Global Enterprises',
        'msapplication-TileColor': '#ffffff',
        'theme-color': '#ffffff',
      }
    };

    return metadata;
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return defaultMetadata;
  }
}

// Export as default for Next.js 13+ metadata API
export default generateProductMetadata;
