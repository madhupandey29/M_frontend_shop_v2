import React from 'react';
import { notFound } from 'next/navigation';
import { configureStore } from '@reduxjs/toolkit';
import { newProductApi } from '@/redux/features/newProductApi';
import { seoApi } from '@/redux/features/seoApi';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import ErrorMsg from '@/components/common/error-msg';
import ProductDetailsLoader from '@/components/loader/prd-details-loader';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';

// Import the metadata generator
import generateProductMetadata from './metadata';

// Create a new store instance for server-side usage
const store = configureStore({
  reducer: {
    [newProductApi.reducerPath]: newProductApi.reducer,
    [seoApi.reducerPath]: seoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newProductApi.middleware, seoApi.middleware),
});

// Enhanced mapping function to include all product data
function mapBackendProductToFrontend(product) {
  // Process all available images
  const images = [
    product.image && { img: product.image, type: "image" },
    product.image1 && { img: product.image1, type: "image" },
    product.image2 && { img: product.image2, type: "image" },
    product.img && !product.image && { img: product.img, type: "image" } // Fallback to product.img if exists
  ].filter(Boolean);

  // Add video thumbnail if available
  if (product.video && product.videoThumbnail) {
    images.push({
      img: product.videoThumbnail,
      type: "video"
    });
  }

  // Return complete product data including all SEO-relevant fields
  return {
    // Core product data
    _id: product._id,
    title: product.name || product.title,
    name: product.name || product.title, // Ensure name is always available
    img: product.image || product.img || "", // Handle both image and img fields
    imageURLs: images,
    videoId: product.video || "",
    video: product.video, // Add raw video field
    videoThumbnail: product.videoThumbnail, // Add video thumbnail
    price: product.salesPrice || product.price, // Handle both salesPrice and price
    description: product.description || product.productdescription || "", // Include productdescription
    status: product.status || 'in-stock',
    sku: product.sku || "",
    
    // Category and classification
    category: product.category || { 
      name: product.newCategoryId?.name || product.category?.name || 'Default Category',
      _id: product.newCategoryId?._id || product.category?._id
    },
    tags: product.tags || [],
    
    // Product details
    offerDate: product.offerDate || { endDate: null },
    additionalInformation: product.additionalInformation || [],
    
    // Product relationships
    structureId: product.structureId?._id || product.structureId || "",
    contentId: product.contentId?._id || product.contentId || "",
    finishId: product.finishId?._id || product.finishId || "",
    designId: product.designId?._id || product.designId || "",
    colorId: product.colorId?._id || product.colorId || "",
    motifsizeId: product.motifsizeId?._id || product.motifsizeId || "",
    suitableforId: product.suitableforId?._id || product.suitableforId || "",
    vendorId: product.vendorId?._id || product.vendorId || "",
    groupcodeId: product.groupcodeId?._id || product.groupcodeId || "",
    
    // Product specifications
    gsm: product.gsm,
    oz: product.oz,
    cm: product.cm,
    inch: product.inch,
    productIdentifier: product.productIdentifier || "",
    width: product.cm ? `${product.cm} cm` : product.inch ? `${product.inch} inch` : 'N/A',
    
    // Additional fields that might be useful for SEO
    slug: product.slug || "",
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    
    // Include the raw product data for reference
    _raw: product
  };
}

async function getProduct(slug) {
  try {
    const result = await store.dispatch(
      newProductApi.endpoints.getSingleNewProduct.initiate(slug)
    );

    if (!result.data?.data) {
      return { error: 'Product not found' };
    }

    // Get SEO data if needed
    const product = result.data.data;
    if (product._id) {
      // Fetch SEO data in parallel if needed
      await store.dispatch(
        seoApi.endpoints.getSeoByProduct.initiate(product._id)
      );
    }

    return { product };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { error: 'Failed to fetch product' };
  } finally {
    // Clean up the store
    store.dispatch(newProductApi.util.resetApiState());
    store.dispatch(seoApi.util.resetApiState());
  }
}

// Helper function to ensure URL is absolute
const getAbsoluteUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// This function generates metadata for the product page
export const dynamic = 'force-dynamic'; // Ensure this is a dynamic route
export const revalidate = 0; // Ensure fresh data on every request

export async function generateMetadata({ params, searchParams }, parent) {
  // Fetch parent metadata to inherit from
  const previousMetadata = await parent;
  const { slug } = params;
  
  try {
    // Get product data
    const productResult = await store.dispatch(
      newProductApi.endpoints.getSingleNewProduct.initiate(slug)
    );

    if (!productResult.data?.data) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist or has been removed.',
        robots: {
          index: false,
          follow: true,
          nocache: true,
        },
      };
    }

    const product = productResult.data.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
    const canonicalUrl = `${siteUrl}/fabric/${slug}`;
    
    // Get product details with fallbacks
    const productName = product.name || 'Product';
    const productDescription = product.productdescription || `Shop ${productName} - High quality fabrics from Amrita Global Enterprises`;
    const productImage = product.image || product.img || '/images/logo/logo.png';
    
    // Clean up the store
    store.dispatch(newProductApi.util.resetApiState());
    
    // Create absolute image URL
    const getAbsoluteImageUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    };
    
    const imageUrl = getAbsoluteImageUrl(productImage);
    
    // Return metadata in Next.js 13+ format
    return {
      title: {
        default: productName,
        template: `%s | Amrita Global Enterprises`
      },
      description: productDescription,
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: productName,
        description: productDescription,
        url: canonicalUrl,
        siteName: 'Amrita Global Enterprises',
        images: [{
          url: imageUrl,
          width: 800,
          height: 600,
          alt: productName,
        }],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: productName,
        description: productDescription,
        images: [{
          url: imageUrl,
          width: 800,
          height: 600,
          alt: productName,
        }],
      },
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
      applicationName: 'Amrita Global Enterprises',
      keywords: [productName, 'fabric', 'textile', 'Amrita Global Enterprises'].filter(Boolean),
      authors: [{ name: 'Amrita Global Enterprises' }],
      creator: 'Amrita Global Enterprises',
      publisher: 'Amrita Global Enterprises',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      other: {
        'product:price:amount': product.price?.toString() || '0',
        'product:price:currency': 'INR',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details',
      description: 'View product details at Amrita Global Enterprises',
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = params;
  const { product, error } = await getProduct(slug);

  if (error || !product) {
    notFound();
  }

  const mapped = mapBackendProductToFrontend(product);
  const content = <ProductDetailsArea product={mapped} />;

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
}