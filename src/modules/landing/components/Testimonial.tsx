import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const logos = ["Microsoft", "Google", "Amazon", "Meta", "Apple"];
export function LandingTestimonialsSection() {
    return (
        <section className="py-16 sm:py-20 bg-[#E1DDEE]" data-aos="fade-up">
            <div className="w-[80%] mx-auto px-4">
                <div className="mb-12 sm:mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="">
                        <p className="text-primary font-medium text-base sm:text-lg">
                            Testimonials
                        </p>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-8">
                            Trusted by Data-Driven Enterprises
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center gap-1 border-solid border-[1px] border-[#3F3465] rounded-xl p-1.5 text-[#3F3465]">
                            <p className="font-bold">4.9</p>
                            <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 sm:w-5 sm:h-5 fill-[#3F3465] text-[#3F3465]"
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-[#3F3465] font-semibold">
                            10k+ reviews
                        </p>
                    </div>
                </div>

                <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-transparent">
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                            <Image
                                src="/images/avatar.png"
                                alt="Happy customer"
                                width={500}
                                height={500}
                                className="size-[120px] sm:size-[150px] md:size-[180px] mx-auto md:mx-0"
                            />
                            <div className="space-y-6 sm:space-y-8 md:space-y-10 text-center md:text-left">
                                <h3 className="text-[#3D4347] text-base sm:text-lg">
                                    Chief Data Officer, Energy Co.
                                </h3>

                                <blockquote className="text-xl sm:text-2xl md:text-3xl text-foreground">
                                    This platform gave us full visibility into
                                    our data quality and compliance posture in
                                    less than 30 days.
                                </blockquote>

                                <p className="text-sm sm:text-base">
                                    May 8, 2020
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 mb-12 sm:mb-16 opacity-60 mt-8 sm:mt-10">
                    <p className="text-[#344054] text-center sm:text-left">
                        Trusted Partnership <br /> with 100+ companies
                    </p>

                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center"
                        >
                            <span className="text-base sm:text-lg font-semibold text-gray-400">
                                {logo}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
