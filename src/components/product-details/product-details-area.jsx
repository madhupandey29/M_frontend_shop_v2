'use client';

import React from "react";
import ErrorMsg from "../common/error-msg";
import ProductDetailsBreadcrumb from "../breadcrumb/product-details-breadcrumb";
import ProductDetailsContent from "./product-details-content";

const ProductDetailsArea = ({ product }) => {
  if (!product || !product.title) {
    return <ErrorMsg msg="No product found!" />;
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <ProductDetailsBreadcrumb
        category={product?.category?.name || "Uncategorized"}
        title={product?.title || "Product"}
      />

      {/* Main Product Content */}
      <ProductDetailsContent productItem={product} />
    </>
  );
};

export default ProductDetailsArea;
