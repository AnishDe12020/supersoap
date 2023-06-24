"use client"

import Link from "next/link"
import {
  ArrowRightIcon,
  BadgeDollarSignIcon,
  CombineIcon,
  FuelIcon,
  ZapIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const Home = () => {
  return (
    <section className="relative flex flex-col items-center w-full text-center">
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] -top-64"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={128}
          r={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.8"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#3f74c9" />
            <stop offset={1} stopColor="#0f1c7c" />
          </radialGradient>
        </defs>
      </svg>

      <div className="flex flex-col items-center max-w-3xl mt-16">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Distribute SOAPs like never before
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 dark:text-gray-400">
          Do gasless SOAP drops with compressed NFTs and get more people
          onboarded to Solana
        </p>
        <div className="flex flex-col mb-8 space-y-4 lg:mb-16 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link
            href="/drops"
            className={cn(
              buttonVariants({
                size: "lg",
                className: "text-lg font-semibold cursor-pointer",
              })
            )}
          >
            <span>Get started</span>
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-32 sm:grid-cols-2 w-fit">
          <div
            className="flex flex-col border-[1px] border-[#2A2427] rounded-xl bg-[#121212B2] w-64 h-56 items-center justify-center p-4"
            style={{ backdropFilter: "blur(150px)" }}
          >
            <FuelIcon className="w-8 h-8 mx-auto text-white" />

            <div className="flex flex-col items-center justify-center gap-2 mt-4">
              <h3 className="text-lg font-semibold text-white">
                Gasless Drops
              </h3>
              <p className="text-sm font-normal text-white">
                Users don&apos;t need to have SOL or pay gas to receive SOAPs.
                They can claim their SOAPs for free!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div
              className="flex flex-col border-[1px] border-[#2A2427] rounded-xl bg-[#121212B2] items-center justify-center w-64 h-56 p-4"
              style={{ backdropFilter: "blur(150px)" }}
            >
              <ZapIcon className="w-8 h-8 mx-auto text-white" />

              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <h3 className="text-lg font-semibold text-white">
                  Claim with Solana pay
                </h3>
                <p className="text-sm font-normal text-white">
                  Users can either directly scan a Solana Pay QR Code to claim
                  the SOAP or go to a URL where they can connect their wallet or
                  claim the SOAP with Solana Pay
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div
              className="flex flex-col border-[1px] border-[#2A2427] rounded-xl bg-[#121212B2] items-center justify-center w-64 h-56 p-4"
              style={{ backdropFilter: "blur(150px)" }}
            >
              <BadgeDollarSignIcon className="w-8 h-8 mx-auto text-white" />

              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <h3 className="text-lg font-semibold text-white">
                  Compressed NFTs
                </h3>
                <p className="text-sm font-normal text-white">
                  SOAPs are in the form of compressed NFTs making it cheap to do
                  SOAP drops. With compressed NFTs, you can do huge drops at 1%
                  the cost
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div
              className="flex flex-col border-[1px] border-[#2A2427] rounded-xl bg-[#121212B2] items-center justify-center w-64 h-56 p-4"
              style={{ backdropFilter: "blur(150px)" }}
            >
              <CombineIcon className="w-8 h-8 mx-auto text-white" />

              <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <h3 className="text-lg font-semibold text-white">
                  Advanced customizability
                </h3>
                <p className="text-sm font-normal text-white">
                  Customize your SOAP drops with custom attributes, artwork, and
                  add a link to your website
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
