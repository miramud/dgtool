import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { processSteps } from "../data/steps";
import ArrowRight from "@/components/icons/ArrowRight";
import { Fragment } from "react";

export function LandingProcessSection() {
    return (
        <section className="py-20 bg-gray-50" data-aos="slide-up">
            <div className="container">
                <div className="text-center mb-16">
                    <p className="text-primary font-medium text-lg">
                        How It Works
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Governance That Works the Way You Work
                    </h2>
                </div>

                <div className="w-full mx-auto">
                    <div className="flex md:justify-center gap-8 flex-wrap">
                        {processSteps.map((step, index) => (
                            <Fragment key={index}>
                                <div className="flex flex-col items-center w-full md:w-auto">
                                    <Card
                                        className={`${step.bgColor} text-white border-0 w-full max-w-xs`}
                                    >
                                        <CardContent className="p-6 text-center">
                                            <CardTitle className="text-xl font-medium mb-2 opacity-90">
                                                {step.step}
                                            </CardTitle>

                                            <CardDescription className="text-white whitespace-pre-line text-lg">
                                                {step.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </div>

                                {index + 1 < processSteps.length && (
                                    <div className="hidden md:flex items-center">
                                        <ArrowRight />
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
