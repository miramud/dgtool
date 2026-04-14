"use client";
import { Button } from "@/components/ui/button";
import { LANDING_ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

export function LandingHeroSection() {
    return (
        <section className="relative bg-gradient-to-br from-[#F8F7FB] via-[#EFEBF7] to-[#f8f7fc] text-foreground h-screen">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-primary rounded-full filter blur-[120px] opacity-15 animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 right-1/3 w-64 h-64 bg-primary rounded-full filter blur-[100px] opacity-15 animate-pulse"></div>

            <div className="py-20 relative z-10" data-aos="fade-up">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-primary leading-tight">
                        Data Governance Platform for Oil & Gas Companies
                    </h1>

                    <Image
                        src="/images/stroke.svg"
                        alt="Stroke Divider"
                        width={200}
                        height={200}
                        className="w-[40%] block mx-auto -mt-5"
                    />

                    <p className="text-base sm:text-lg md:text-xl mb-4 text-[#475467] max-w-3xl mx-auto font-normal leading-relaxed">
                        Data governance platform solutions are essential for oil and gas companies that rely on
                        accurate, secure, and well-managed data to operate efficiently. In today&apos;s complex energy
                        landscape, organizations generate massive volumes of data from exploration, drilling,
                        production, and enterprise systems. Without a structured governance framework, this data
                        quickly becomes fragmented, inconsistent, and difficult to trust.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl mb-8 text-[#475467] max-w-3xl mx-auto font-normal leading-relaxed">
                        Steward Core is built to solve this challenge. It is a modern data governance platform designed
                        specifically to support oil and gas data governance, helping enterprises ensure data quality,
                        maintain compliance, and gain full visibility into their data ecosystem. By combining governance,
                        metadata management, and lineage capabilities into one unified platform, Steward Core
                        enables organizations to transform raw data into a trusted strategic asset.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16 px-5">
                        <Link href={LANDING_ROUTES.CONTACT}>
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-gray-100 border border-[#D0D5DD]"
                            >
                                Book Demo
                            </Button>
                        </Link>
                    </div>
                </div>

                <div
                    className="relative z-30 -mb-32 lg:-mb-40"
                >
                    <Image
                        src="/images/dashboard-mockup.svg"
                        alt="Dashboard Mockup"
                        width={1000}
                        height={1000}
                        className="w-[80%] md:max-w-4xl mx-auto block drop-shadow-2xl"
                    />
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden z-0">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16 md:h-24 lg:h-32"
                >
                    <path
                        d="M0,120L20,100C40,80,80,40,120,35C160,30,200,60,240,70C280,80,320,70,360,65C400,60,440,60,480,70C520,80,560,100,600,105C640,110,680,100,720,90C760,80,800,70,840,60C880,50,920,40,960,45C1000,50,1040,70,1080,80C1120,90,1160,90,1200,80C1240,70,1280,50,1320,40C1360,30,1400,30,1420,30L1440,30L1440,120L1420,120C1400,120,1360,120,1320,120C1280,120,1240,120,1200,120C1160,120,1120,120,1080,120C1040,120,1000,120,960,120C920,120,880,120,840,120C800,120,760,120,720,120C680,120,640,120,600,120C560,120,520,120,480,120C440,120,400,120,360,120C320,120,280,120,240,120C200,120,160,120,120,120C80,120,40,120,20,120L0,120Z"
                        className="fill-white"
                    ></path>
                </svg>
            </div>
        </section>
    );
}
