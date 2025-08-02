import Link from 'next/link';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';

export default function ProductNotFound() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <div className="container py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but we couldn't find the product you're looking for. It may have been moved or no longer available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/fabric" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              Browse All Fabrics
            </Link>
            <Link 
              href="/" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
