import { Button } from "@/components/ui/button";
import { LANDING_ROUTES } from "@/constants/routes";
import Link from "next/link";
import { BarChart3, ShieldCheck, Eye } from "lucide-react";

const highlights = [
    { icon: BarChart3, label: "Improve Data Quality" },
    { icon: ShieldCheck, label: "Strengthen Compliance" },
    { icon: Eye, label: "Increase Visibility" },
];

export function LandingTrustedAsset() {
    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div data-aos="fade-right">
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                                Unlock Your Data&apos;s Value
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                                Turn Data into a Trusted Business Asset
                            </h2>
                            <p className="text-[#475467] text-base sm:text-lg leading-[1.75] mb-5">
                                A well-implemented data governance platform does more than enforce rules — it enables
                                smarter decision-making. When data is accurate, accessible, and governed, organizations
                                can move faster and operate with confidence.
                            </p>
                            <p className="text-[#475467] text-base sm:text-lg leading-[1.75] mb-8">
                                Steward Core helps oil and gas companies transition from reactive data management to
                                proactive governance. By improving data quality, strengthening compliance, and increasing
                                visibility, the platform empowers teams to unlock the full value of their data.
                            </p>
                            <Link href={LANDING_ROUTES.CONTACT}>
                                <Button size="lg">
                                    Start Your Governance Journey
                                </Button>
                            </Link>
                        </div>

                        <div className="space-y-5" data-aos="fade-left">
                            {highlights.map(({ icon: Icon, label }, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-5 bg-[#FAFAFE] rounded-xl p-5 sm:p-6 border border-[#E9E5F5]"
                                >
                                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <span className="text-foreground font-semibold text-lg sm:text-xl">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
