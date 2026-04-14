import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LANDING_ROUTES } from "@/constants/routes";

export function LandingGovernanceScales() {
    return (
        <section className="py-16 sm:py-20 bg-[#FAFAFE]">
            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-6" data-aos="fade-up">
                        <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                            Enterprise-Ready
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-5">
                            Governance That Scales Across Your Operations
                        </h2>
                    </div>

                    {/* Stacked paragraphs with max width for readability */}
                    <div className="max-w-3xl mx-auto text-center space-y-4 mb-14" data-aos="fade-up" data-aos-delay="100">
                        <p className="text-base sm:text-lg text-[#475467] leading-[1.75]">
                            Oil and gas enterprises operate across multiple environments, including legacy systems,
                            cloud platforms, and vendor solutions. Managing data across these systems requires a
                            governance approach that is both flexible and scalable.
                        </p>
                        <p className="text-base sm:text-lg text-[#475467] leading-[1.75]">
                            Steward Core integrates seamlessly into existing infrastructures, providing enterprise-wide
                            visibility without disrupting operations. Whether managing upstream exploration data or
                            corporate reporting systems, the platform ensures consistent governance across the
                            entire organization.
                        </p>
                        <p className="text-base sm:text-lg text-[#475467] font-medium leading-[1.75]">
                            This scalability makes it ideal for organizations looking to grow without losing control
                            of their data.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        <Link href={LANDING_ROUTES.DATA_CATALOG} className="group">
                            <div
                                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-[#E9E5F5] hover:shadow-lg hover:border-primary/30 transition-all h-full"
                                data-aos="fade-up"
                                data-aos-delay="0"
                            >
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                                    Enterprise Data Catalog
                                </h3>
                                <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                                    Search, discover, and understand datasets across the organization with a centralized data cataloging and discovery platform.
                                </p>
                                <span className="text-primary font-medium text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>

                        <Link href={LANDING_ROUTES.DATA_LINEAGE} className="group">
                            <div
                                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-[#E9E5F5] hover:shadow-lg hover:border-primary/30 transition-all h-full"
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                <div className="w-12 h-12 bg-[#395A98] rounded-lg flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                                    Data Lineage Visualization
                                </h3>
                                <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                                    Track how data flows from source systems to reports and dashboards with interactive lineage maps.
                                </p>
                                <span className="text-primary font-medium text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>

                        <Link href={LANDING_ROUTES.METADATA_MANAGEMENT} className="group">
                            <div
                                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-[#E9E5F5] hover:shadow-lg hover:border-primary/30 transition-all h-full"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-5">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                                    Metadata Management
                                </h3>
                                <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                                    Define data standards, maintain a data dictionary, and ensure consistency across all departments.
                                </p>
                                <span className="text-primary font-medium text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                    Learn more <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
