import NextTopLoader from "nextjs-toploader"

import { fontSans } from "@/lib/fonts"
import { SolanaProvider } from "@/components/wrappers/SolanaProvider"
import { ThemeProvider } from "@/components/wrappers/ThemeProvider"

import "@/styles/globals.css"

import { Metadata } from "next"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Header } from "@/components/layout/Header"
import ReactQueryProvider from "@/components/wrappers/ReactQueryProvider"
import SessionProviderWrapper from "@/components/wrappers/SessionProvider"
import Toaster from "@/components/wrappers/SonnerToaster"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SolanaProvider>
            <SessionProviderWrapper>
              <ReactQueryProvider>
                <NextTopLoader
                  color="#ffffff"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                />
                <Toaster />

                <div className="relative flex min-h-screen flex-col">
                  <Header />
                  <main className="flex flex-col items-center min-h-full mx-6 mt-8 mb-12 h-fit">
                    {children}
                  </main>
                </div>
              </ReactQueryProvider>
            </SessionProviderWrapper>
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
