import { Inter } from 'next/font/google';

// Load Inter font with preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Export metadata to be used by the root layout
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure fresh data on every request

export const metadata = {
  // This will be merged with the page's metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  // Add any layout-specific metadata here
  title: {
    default: 'Amrita Global Enterprises',
    template: '%s | Amrita Global Enterprises',
  },
  description: 'Premium quality fabrics and textiles',
};

export default function ProductLayout({ children }) {
  return (
    <div className={inter.variable}>
      {children}
    </div>
  );
}
