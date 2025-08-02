import './globals.scss';
import { Inter } from 'next/font/google';
import Providers from '../components/provider';
import GoogleAnalytics from '../components/analytics/GoogleAnalytics';
import MicrosoftClarity from '../components/analytics/MicrosoftClarity';

// Load Inter font with preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: {
    default: 'Amrita Global Enterprises',
    template: '%s | Amrita Global Enterprises',
  },
  description: 'Premium quality fabrics and textiles',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Amrita Global Enterprises',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
    siteName: 'Amrita Global Enterprises',
    title: 'Amrita Global Enterprises',
    description: 'Premium quality fabrics and textiles',
    images: [
      {
        url: '/images/logo/logo.png',
        width: 800,
        height: 600,
        alt: 'Amrita Global Enterprises',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amrita Global Enterprises',
    description: 'Premium quality fabrics and textiles',
    images: ['/images/logo/logo.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  },
};

// Add any additional head elements that need to be included in the document head
const HeadElements = () => (
  <>
    {/* Preconnect to external domains */}
    <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
    
    {/* Font Awesome CSS */}
    <link rel="stylesheet" href="/assets/css/font-awesome-pro.css" />
    
    {/* Google Site Verification */}
    {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
      <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
    )}
    
    {/* Analytics Components */}
    <GoogleAnalytics />
    <MicrosoftClarity />
  </>
);

// Main layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <HeadElements />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}