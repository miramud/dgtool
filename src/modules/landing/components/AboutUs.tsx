import Image from "next/image";
import { aboutStats } from "../data/about-stats";

export default function AboutUsPageClient() {
    return (
        <section className="space-y-12 md:space-y-20 bg-[#F6F6F6]">
            <div
                className="relative h-fit overflow-hidden"
                style={{
                    backgroundImage: "url(/images/triangle-bg.svg)",
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                }}
            >
                <div className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-primary rounded-full filter blur-[80px] md:blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute top-40 right-10 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-primary rounded-full filter blur-[100px] md:blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/4 w-56 h-56 md:w-80 md:h-80 bg-primary rounded-full filter blur-[100px] md:blur-[120px] opacity-35 animate-pulse"></div>
                <div className="absolute bottom-10 right-1/3 w-48 h-48 md:w-64 md:h-64 bg-primary rounded-full filter blur-[80px] md:blur-[100px] opacity-25 animate-pulse"></div>

                <div className="text-center py-12 md:py-20 px-4 relative z-10 flex flex-col items-center gap-2 pb-0 -mb-2 md:-mb-28">
                    <h1 className="text-[#26292C] font-semibold text-3xl sm:text-4xl md:text-5xl max-w-4xl">
                        Take Control of Your Data
                    </h1>
                    <Image
                        src="/images/stroke.svg"
                        alt="Stroke Divider"
                        width={200}
                        height={200}
                        className="w-[40%] md:w-[20%] block mx-auto -mt-2"
                    />
                    <p className="text-[#6C757D] font-medium text-sm md:text-base max-w-3xl px-4">
                        Ensure data quality, compliance, and trust with a
                        platform designed for enterprises of all sizes. Our
                        StewardCore platform helps enterprises ensure data
                        quality, security, and compliance — all in one simple,
                        modern workspace.
                    </p>

                    <Image
                        src="/images/about-us.svg"
                        alt="Dashboard image"
                        width={1000}
                        height={1000}
                        className="w-full max-w-5xl px-4"
                    />
                </div>
            </div>

            <div className="container px-8 md:!px-30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                    <h2 className="text-3xl md:text-5xl font-semibold text-[#26292C] text-center md:text-left">
                        About Us
                    </h2>

                    <div className="space-y-4 md:space-y-6 text-[#26292C] font-medium text-sm md:text-base leading-relaxed">
                        <p>
                            We believe that data should be an organization&apos;s
                            most valuable asset, not its biggest liability. Our
                            mission is to empower businesses to unlock the full
                            potential of their information by establishing
                            comprehensive, effective, and sustainable
                            StewardCore frameworks.
                        </p>

                        <p>
                            We&apos;re here to ensure your data is accurate, secure,
                            compliant with regulations, and, most importantly,
                            trustworthy enough to drive confident, data-driven
                            decisions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container px-8 md:!px-30">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between gap-x-6 gap-y-6 md:gap-y-8 pb-12 md:pb-20">
                    {aboutStats.map(({ title, description }, i) => (
                        <div
                            key={i}
                            className="space-y-2 md:space-y-3 w-[40%] md:w-auto text-center md:text-left"
                        >
                            <h3 className="text-[#6C757D] font-semibold text-3xl md:text-5xl">
                                {title}
                            </h3>
                            <p className="text-[#6C757D] font-medium text-xs md:text-base">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
