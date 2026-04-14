import { Layers, Link2, Users } from "lucide-react";

const capabilities = [
    {
        icon: Layers,
        heading: "Centralized Governance",
        text: "The platform centralizes governance across systems, allowing organizations to manage data from upstream operations, data lakes, enterprise applications, and third-party vendors within a single environment.",
    },
    {
        icon: Link2,
        heading: "Unified Solution",
        text: "Instead of relying on fragmented tools, Steward Core provides a unified solution where governance policies, metadata, and lineage are interconnected. This ensures consistency, reduces duplication, and improves overall data integrity.",
    },
    {
        icon: Users,
        heading: "Aligned with Workflows",
        text: "By aligning governance with real operational workflows, the platform supports both technical teams and business users without adding unnecessary complexity.",
    },
];

export function LandingWhyStewardCore() {
    return (
        <section className="py-16 sm:py-20 bg-[#FAFAFE]">
            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
                        {/* Left column - headline + intro */}
                        <div className="lg:col-span-2 lg:sticky lg:top-28" data-aos="fade-right">
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                                Why Steward Core
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                                What Makes Steward Core the Best Data Governance Platform for Oil and Gas Companies
                            </h2>
                            <p className="text-[#475467] text-base sm:text-lg leading-[1.75]">
                                Not all governance platforms are built for the complexity of oil and gas
                                environments. Steward Core is designed with industry-specific challenges in mind,
                                making it one of the best data governance platforms for oil and gas companies
                                seeking scalability and reliability.
                            </p>
                        </div>

                        {/* Right column - capability cards */}
                        <div className="lg:col-span-3 space-y-6" data-aos="fade-left">
                            {capabilities.map(({ icon: Icon, heading, text }, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-6 sm:p-7 border border-[#E9E5F5] shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                                {heading}
                                            </h3>
                                            <p className="text-[#475467] text-base leading-[1.75]">
                                                {text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
