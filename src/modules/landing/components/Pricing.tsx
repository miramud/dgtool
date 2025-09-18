import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { plans } from "../data/plans";

export function LandingPricingSection() {
    return (
        <section className="py-16 sm:py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <p className="text-primary font-medium text-base sm:text-lg">
                        Pricing Plan
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h2>

                    <p className="text-base sm:text-lg text-[#3D4347] font-medium">
                        Choose the plan that fits your team and scale with
                        confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative border-0 shadow-lg bg-[#E4E1EF66] ${
                                plan.popular ? "ring-2 ring-primary" : ""
                            }`}
                            data-aos={
                                index === 0
                                    ? "slide-right"
                                    : index === 2
                                    ? "slide-left"
                                    : "slide-up"
                            }
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-white px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader className="pb-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                                    {plan.name}
                                </h3>
                                <div className="mb-2">
                                    <span className="text-2xl sm:text-3xl font-bold text-foreground">
                                        {plan.price}
                                    </span>
                                    <span className="text-sm sm:text-base text-muted-foreground">
                                        {plan.period}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line">
                                    {plan.description}
                                </p>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button
                                    className="w-full mb-5 sm:mb-6"
                                    variant={plan.buttonVariant}
                                    size="lg"
                                >
                                    {plan.buttonText}
                                </Button>
                                <ul className="space-y-2 sm:space-y-3">
                                    {plan.features.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start space-x-2 sm:space-x-3"
                                            >
                                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm text-foreground">
                                                    {feature}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <ul className="space-y-2 sm:space-y-3 mt-3">
                                    {plan?.nonFeatures?.map(
                                        (feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start space-x-2 sm:space-x-3"
                                            >
                                                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-xs sm:text-sm text-foreground">
                                                    {feature}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
