import ArrowDown from "@/components/icons/ArrowDown";
import { features } from "../data/features";

export function LandingFeatureSection() {
    return (
        <section className="py-20 bg-primary relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[350px] h-[350px] bg-white rounded-full filter blur-[40px] opacity-10 -z-10"></div>
            <div className="absolute -top-28 -right-28 w-[250px] h-[250px] bg-white rounded-full filter blur-[60px] opacity-10 -z-20"></div>
            <div className="absolute -top-36 -right-36 w-[150px] h-[150px] bg-white rounded-full filter blur-[80px] opacity-10 -z-30"></div>

            <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-white rounded-full filter blur-[40px] opacity-10 -z-10"></div>
            <div className="absolute -bottom-28 -left-28 w-[250px] h-[250px] bg-white rounded-full filter blur-[60px] opacity-10 -z-20"></div>
            <div className="absolute -bottom-36 -left-36 w-[150px] h-[150px] bg-white rounded-full filter blur-[80px] opacity-10 -z-30"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        A Complete Data Governance Platform for Enterprise Use
                    </h2>
                    <p className="text-white/90 font-medium text-lg max-w-3xl mx-auto">
                        Steward Core combines multiple capabilities into a single platform,
                        eliminating the need for disconnected tools and manual processes.
                    </p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {features.map(({ icon: Icon, title, description }, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center py-10 relative"
                        >
                            <div
                                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center"
                                style={{ marginTop: "15px" }}
                            >
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                                {i < features.length - 1 && <ArrowDown className="text-white" />}
                            </div>

                            <div
                                className={`w-fit max-w-md z-0 ${
                                    i % 2 === 0
                                        ? "md:ml-[calc(50%+80px)] text-left"
                                        : "md:mr-[calc(50%+80px)] text-left"
                                }`}
                            >
                                <h3 className="text-2xl font-medium mb-2 whitespace-pre-line text-white">
                                    {title}
                                </h3>
                                <p className="text-white/90 whitespace-pre-line">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
