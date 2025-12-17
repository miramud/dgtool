import { Card, CardContent } from "@/components/ui/card";
import { propositions } from "../data/propositions";

export function LandingPropositionSection() {
    return (
        <section className="py-16 sm:py-20 bg-white md:mt-120 overflow-hidden">
            <div className="container">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-primary font-medium text-base sm:text-lg mb-2">
                        Value Proposition
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Why Steward Core needs to be different
                    </h2>

                    <p className="text-base sm:text-lg text-[#3D4347] font-medium max-w-2xl mx-auto">
                        Our platform centralizes governance, making it simple,
                        secure, and scalable.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    {propositions.map(
                        ({ icon: Icon, title, description }, index) => (
                            <Card
                                key={index}
                                className="text-center border border-solid border-[#A2A9AF] rounded-lg shadow-lg p-0 bg-transparent h-full"
                                data-aos={
                                    index === 0
                                        ? "slide-right"
                                        : index === 2
                                        ? "slide-left"
                                        : "slide-up"
                                }
                            >
                                <CardContent className="py-6 sm:py-8 px-4 sm:px-6 flex flex-col items-center text-center md:items-start md:text-left">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                                        {title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm sm:text-base whitespace-pre-line">
                                        {description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}
