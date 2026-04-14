"use client";
import { Button } from "@/components/ui/button";
import { LANDING_ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Paragraphs({ text, className }: { text: string; className?: string }) {
    const paragraphs = text.split("\n\n");
    return (
        <>
            {paragraphs.map((p, i) => (
                <p key={i} className={className}>
                    {p}
                </p>
            ))}
        </>
    );
}

interface ContentSection {
    title: string;
    content: string;
    subsections?: {
        title: string;
        content: string;
    }[];
    bulletPoints?: string[];
    contentAfterBullets?: string;
}

interface ServicePageProps {
    heroTitle: string;
    heroDescription: string;
    sections: ContentSection[];
    ctaTitle: string;
    ctaDescription: string;
}

export default function ServicePageLayout({
    heroTitle,
    heroDescription,
    sections,
    ctaTitle,
    ctaDescription,
}: ServicePageProps) {
    useEffect(() => {
        AOS.init({
            duration: 500,
            easing: "ease-out-cubic",
            once: false,
            disable: "phone",
        });
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#F8F7FB] via-[#EFEBF7] to-[#f8f7fc] text-foreground overflow-hidden">
                <div className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-primary rounded-full filter blur-[80px] md:blur-[100px] opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full filter blur-[100px] md:blur-[120px] opacity-15 animate-pulse"></div>
                <div className="absolute bottom-10 left-1/4 w-56 h-56 md:w-80 md:h-80 bg-primary rounded-full filter blur-[100px] md:blur-[120px] opacity-20 animate-pulse"></div>

                <div className="py-16 sm:py-20 md:py-28 relative z-10" data-aos="fade-up">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 text-primary leading-tight">
                            {heroTitle}
                        </h1>

                        <Image
                            src="/images/stroke.svg"
                            alt="Stroke Divider"
                            width={200}
                            height={200}
                            className="w-[30%] md:w-[20%] block mx-auto -mt-4 mb-6"
                        />

                        <div className="space-y-4 max-w-3xl mx-auto">
                            <Paragraphs
                                text={heroDescription}
                                className="text-base sm:text-lg md:text-xl text-[#475467] font-normal leading-relaxed"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <Link href={LANDING_ROUTES.CONTACT}>
                                <Button size="lg">
                                    Book a Demo
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden z-0">
                    <svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="relative block w-full h-12 md:h-20"
                    >
                        <path
                            d="M0,120L20,100C40,80,80,40,120,35C160,30,200,60,240,70C280,80,320,70,360,65C400,60,440,60,480,70C520,80,560,100,600,105C640,110,680,100,720,90C760,80,800,70,840,60C880,50,920,40,960,45C1000,50,1040,70,1080,80C1120,90,1160,90,1200,80L1200,120L0,120Z"
                            className="fill-white"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Content Sections */}
            {sections.map((section, i) => {
                const isEven = i % 2 === 0;
                const hasSubsections = !!section.subsections?.length;
                const hasBullets = !!section.bulletPoints?.length;

                return (
                    <section
                        key={i}
                        className={`py-16 sm:py-20 md:py-24 ${isEven ? "bg-white" : "bg-[#FAFAFE]"}`}
                    >
                        <div className="container">
                            <div className="max-w-6xl mx-auto">
                                {/* Section header with accent */}
                                <div
                                    className={`mb-10 ${hasSubsections || hasBullets ? "text-center max-w-3xl mx-auto" : ""}`}
                                    data-aos="fade-up"
                                >
                                    <div className={`${!hasSubsections && !hasBullets ? "border-l-4 border-primary pl-6" : ""}`}>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                                            {section.title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Body text - constrained width for readability */}
                                <div
                                    className={`space-y-5 mb-10 ${hasSubsections || hasBullets ? "max-w-3xl mx-auto" : "max-w-prose"}`}
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                >
                                    <Paragraphs
                                        text={section.content}
                                        className="text-[#475467] text-base sm:text-lg leading-[1.8]"
                                    />
                                </div>

                                {/* Bullet points */}
                                {hasBullets && (
                                    <div className="max-w-3xl mx-auto mb-10" data-aos="fade-up">
                                        <div className="bg-white rounded-xl border border-[#E9E5F5] p-6 sm:p-8 shadow-sm">
                                            <ul className="space-y-4">
                                                {section.bulletPoints!.map((point, j) => (
                                                    <li key={j} className="flex items-center gap-4">
                                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[#3D4347] font-medium text-base sm:text-lg">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {/* Content after bullets */}
                                {section.contentAfterBullets && (
                                    <div
                                        className={`space-y-5 mb-10 ${hasSubsections ? "max-w-3xl mx-auto" : "max-w-prose"}`}
                                        data-aos="fade-up"
                                    >
                                        <Paragraphs
                                            text={section.contentAfterBullets}
                                            className="text-[#475467] text-base sm:text-lg leading-[1.8]"
                                        />
                                    </div>
                                )}

                                {/* Subsections as cards */}
                                {hasSubsections && (
                                    <div className={`grid grid-cols-1 ${section.subsections!.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
                                        {section.subsections!.map((sub, j) => (
                                            <div
                                                key={j}
                                                className={`rounded-xl p-6 sm:p-7 border shadow-sm transition-all hover:shadow-md ${
                                                    isEven
                                                        ? "bg-[#FAFAFE] border-[#E9E5F5]"
                                                        : "bg-white border-[#E9E5F5]"
                                                }`}
                                                data-aos="fade-up"
                                                data-aos-delay={j * 80}
                                            >
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                                    <span className="text-primary font-bold text-sm">
                                                        {String(j + 1).padStart(2, "0")}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                                                    {sub.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                                    {sub.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* CTA Section */}
            <div className="bg-gray-50 py-16 sm:py-20" data-aos="fade-in">
                <div className="container">
                    <section className="relative py-16 sm:py-20 bg-gradient-to-r from-primary to-purple-300 text-white overflow-hidden rounded-xl">
                        <div className="absolute -top-24 -left-24 w-[250px] h-[250px] bg-white rounded-full blur-[80px] opacity-60 animate-pulse"></div>
                        <div className="absolute -bottom-28 -right-28 w-[280px] h-[280px] bg-white rounded-full blur-[90px] opacity-55 animate-pulse"></div>
                        <div className="absolute top-1/4 left-1/3 w-[200px] h-[200px] bg-white rounded-full blur-[70px] opacity-50 animate-pulse"></div>

                        <div className="container mx-auto px-4 text-center relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                {ctaTitle}
                            </h2>
                            <div className="space-y-4 mb-8 max-w-2xl mx-auto">
                                <Paragraphs
                                    text={ctaDescription}
                                    className="text-lg text-purple-100 leading-relaxed"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={LANDING_ROUTES.CONTACT}>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
                                    >
                                        Book a Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
