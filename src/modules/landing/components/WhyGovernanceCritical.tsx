import { AlertTriangle, ShieldCheck, TrendingUp, Target } from "lucide-react";


const points = [
    {
        icon: TrendingUp,
        text: "Oil and gas organizations operate in highly regulated and data-intensive environments. From upstream exploration data to financial reporting systems, every dataset plays a role in operational efficiency and regulatory compliance.",
    },
    {
        icon: AlertTriangle,
        text: "However, many companies still struggle with disconnected systems, unclear ownership, and inconsistent data standards. This leads to delays in decision-making, increased operational risk, and potential compliance failures.",
    },
    {
        icon: ShieldCheck,
        text: "Data governance in oil and gas is not just about control, it is about trust. When data is governed properly, teams can rely on it to make faster, more accurate decisions across exploration, production, and corporate operations.",
    },
    {
        icon: Target,
        text: "Steward Core provides a structured approach to oil and gas data governance by ensuring that every dataset is properly classified, owned, monitored, and aligned with business objectives.",
    },
];

export function LandingWhyGovernanceCritical() {
    return (
        <section className="py-16 sm:py-20 bg-white md:mt-120 overflow-hidden">
            <div className="container">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 sm:mb-14" data-aos="fade-up">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Why Data Governance in Oil and Gas Is Critical
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {points.map(({ icon: Icon, text }, i) => (
                            <div
                                key={i}
                                className="flex gap-5 p-6 rounded-xl bg-[#FAFAFE] border border-[#EFEBF7] hover:shadow-md transition-shadow"
                                data-aos="fade-up"
                                data-aos-delay={i * 80}
                            >
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-[#475467] text-base sm:text-lg leading-[1.75]">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
