import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import type { Metadata } from 'next'
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import QueryClientProviderWrapper from '@/components/QueryClientProviderWrapper';

import HydrateAuth from "@/components/HydrateAuth";

const outfit = Outfit({
  subsets: ["latin"],
});




export const metadata: Metadata = {
  title: 'Astound AI',
  description: 'Your AI assistant',
  icons: {
    icon: '/images/favicon.ico', // default
    shortcut: '/images/favicon.ico',
    // apple: '/favicon.png',
  },
}



// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <QueryClientProviderWrapper>
            <ThemeProvider>
              <SidebarProvider>
                <HydrateAuth force={true} />
                {children}
              </SidebarProvider>
            </ThemeProvider>
          </QueryClientProviderWrapper>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}