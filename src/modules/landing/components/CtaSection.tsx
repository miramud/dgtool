import { Button } from "@/components/ui/button";
import { LANDING_ROUTES } from "@/constants/routes";
import Link from "next/link";

export function LandingCtaSection() {
    return (
        <div className="bg-gray-50 py-20" data-aos="fade-in">
            <div className="container">
                <section className="relative py-20 bg-gradient-to-r from-primary to-purple-300 text-white overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-[250px] h-[250px] bg-white rounded-full blur-[80px] opacity-60 animate-pulse"></div>
                    <div className="absolute -bottom-28 -right-28 w-[280px] h-[280px] bg-white rounded-full blur-[90px] opacity-55 animate-pulse"></div>
                    <div className="absolute top-1/4 left-1/3 w-[200px] h-[200px] bg-white rounded-full blur-[70px] opacity-50 animate-pulse"></div>
                    <div className="absolute top-2/3 right-1/4 w-[220px] h-[220px] bg-white rounded-full blur-[75px] opacity-50 animate-pulse"></div>
                    <div className="absolute bottom-1/3 left-1/4 w-[180px] h-[180px] bg-white rounded-full blur-[65px] opacity-55 animate-pulse"></div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Start Your Data Governance Journey Today
                        </h2>
                        <p className="text-lg mb-4 text-purple-100 max-w-2xl mx-auto">
                            If your organization is struggling with data silos, compliance risks, or inconsistent
                            reporting, now is the time to implement a structured governance framework.
                        </p>
                        <p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto">
                            Steward Core provides the tools and expertise needed to build a strong foundation for
                            data governance in oil and gas. With the right platform in place, your data becomes a
                            reliable asset that supports growth, efficiency, and innovation.
                        </p>
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
    );
}
