import ProductDetailsLoader from '@/components/loader/prd-details-loader';

export default function Loading() {
  return (
    <div className="container py-16">
      <ProductDetailsLoader loading={true} />
    </div>
  );
}
