'use client';
import React from 'react';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import ProductDetailsContent from '';

/* ---------- map backend → shape expected by UI ---------- */
function mapBackendProductToFrontend(product) {
  const images = [
    product.image  && { img: product.image,  type: 'image' },
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
    structureId:   product.structureId?._id   || product.structureId   || '',
    contentId:     product.contentId?._id     || product.contentId     || '',
    finishId:      product.finishId?._id      || product.finishId      || '',
    designId:      product.designId?._id      || product.designId      || '',
    colorId:       product.colorId?._id       || product.colorId       || '',
    motifsizeId:   product.motifsizeId?._id   || product.motifsizeId   || '',
    suitableforId: product.suitableforId?._id || product.suitableforId || '',
    vendorId:      product.vendorId?._id      || product.vendorId      || '',
    groupcodeId:   product.groupcodeId?._id   || product.groupcodeId   || '',
    gsm:  product.gsm,
    oz:   product.oz,
    productIdentifier: product.productIdentifier,
    width: product.cm
      ? `${product.cm} cm`
      : product.inch
      ? `${product.inch} inch`
      : 'N/A',
  };
}

/* ---------- main client component ---------- */
export default function ClientPage({ product }) {
  const mapped = mapBackendProductToFrontend(product);

  return (
    <Wrapper>
      <HeaderTwo style_2 />
      <ProductDetailsContent productItem={mapped} />
      <Footer primary_style />
    </Wrapper>
  );
}
