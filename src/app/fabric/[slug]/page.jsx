// ✅ FILE: app/fabric/[slug]/page.jsx
import ProductDetailsArea from '../../../components/product-details/product-details-area';
import ErrorMsg from '../../../components/common/error-msg';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';

export const revalidate = 60; // ISR

// ✅ METADATA (SSR Friendly)
export async function generateMetadata({ params }) {
  if (!params?.slug) return {};
  const slug = params.slug;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/slug/${slug}`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('❌ Metadata fetch failed with status:', res.status);
      return {};
    }

    const { data: product } = await res.json();

    return {
      title: product?.name || 'Product Details',
      description: product?.description?.slice(0, 160) || '',
      openGraph: {
        title: product?.name,
        description: product?.description?.slice(0, 160) || '',
        url: `https://yourdomain.com/fabric/${slug}`,
        type: 'website',
        images: [product?.image || 'https://yourdomain.com/default-og-image.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: product?.name,
        description: product?.description,
        images: [product?.image || 'https://yourdomain.com/default-og-image.jpg'],
      },
    };
  } catch (err) {
    console.error('❌ Metadata fetch error:', err);
    return {};
  }
}

function mapBackendProductToFrontend(product) {
  const images = [
    product.image && { img: product.image, type: 'image' },
    product.image1 && { img: product.image1, type: 'image' },
    product.image2 && { img: product.image2, type: 'image' },
  ].filter(Boolean);

  if (product.video && product.videoThumbnail) {
    images.push({ img: product.videoThumbnail, type: 'video' });
  }

  return {
    _id: product._id,
    title: product.name || product.title,
    img: product.image || '',
    imageURLs: images,
    videoId: product.video || '',
    price: product.salesPrice,
    description: product.description,
    status: product.status || 'in-stock',
    sku: product.sku,
    category: { name: product.newCategoryId?.name || 'Default Category' },
    tags: product.tags || [],
    offerDate: product.offerDate || { endDate: null },
    additionalInformation: product.additionalInformation || [],
    structureId: product.structureId?._id || product.structureId || '',
    contentId: product.contentId?._id || product.contentId || '',
    finishId: product.finishId?._id || product.finishId || '',
    designId: product.designId?._id || product.designId || '',
    colorId: product.colorId?._id || product.colorId || '',
    motifsizeId: product.motifsizeId?._id || product.motifsizeId || '',
    suitableforId: product.suitableforId?._id || product.suitableforId || '',
    vendorId: product.vendorId?._id || product.vendorId || '',
    groupcodeId: product.groupcodeId?._id || product.groupcodeId || '',
    gsm: product.gsm,
    oz: product.oz,
    productIdentifier: product.productIdentifier,
    width: product.cm ? `${product.cm} cm` : product.inch ? `${product.inch} inch` : 'N/A',
  };
}

// ✅ PAGE COMPONENT (Server Component)
export default async function ProductDetailsPage({ params }) {
  const slug = params.slug;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/slug/${slug}`, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return (
        <Wrapper>
          <HeaderTwo style_2={true} />
          <ErrorMsg msg={`Failed to fetch product (${res.status})`} />
          <Footer primary_style={true} />
        </Wrapper>
      );
    }

    const { data: product } = await res.json();
    if (!product) {
      return (
        <Wrapper>
          <HeaderTwo style_2={true} />
          <ErrorMsg msg="Product not found." />
          <Footer primary_style={true} />
        </Wrapper>
      );
    }

    const mapped = mapBackendProductToFrontend(product);

    return (
      <Wrapper>
        <HeaderTwo style_2={true} />
        <ProductDetailsArea product={mapped} />
        <Footer primary_style={true} />
      </Wrapper>
    );
  } catch (err) {
    return (
      <Wrapper>
        <HeaderTwo style_2={true} />
        <ErrorMsg msg="Server error while loading product." />
        <Footer primary_style={true} />
      </Wrapper>
    );
  }
}
