"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { testimonials } from "../data/testimonials";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import ArrowRightAlt from "@/components/icons/ArrowRightAlt";
import ArrowLeftAlt from "@/components/icons/ArrowLeftAlt";

export function LandingTestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-[#E1DDEE]"
      data-aos="fade-up"
    >
      <div className="w-full sm:w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 md:mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="w-full sm:w-auto">
            <p className="text-primary font-medium text-sm sm:text-base md:text-lg">
              Testimonials
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-0 sm:mb-4">
              Trusted by Data-Driven Enterprises
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center gap-1 border-solid border-[1px] border-[#3F3465] rounded-xl p-1.5 text-[#3F3465]">
              <p className="font-bold text-sm sm:text-base">4.9</p>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-[#3F3465] text-[#3F3465]"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#3F3465] font-semibold">
              10k+ reviews
            </p>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mx-auto"
        >
          <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
            {testimonials.map(({ name, position, description }) => (
              <CarouselItem
                key={name}
                className="pl-2 sm:pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <h3 className="text-[#3D4347] font-medium text-lg sm:text-xl md:text-2xl text-center">
                        {name}
                      </h3>

                      <p className="text-[#3D4347] text-sm sm:text-base font-medium text-center">
                        {position}
                      </p>

                      <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-[#3D4347] text-center">
                        {description}
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={() => api?.scrollPrev()}
            className="h-auto w-auto p-0 size-10 sm:size-12 md:size-[52px] rounded-full bg-transparent border-primary group hover:bg-primary transition-colors"
          >
            <ArrowLeftAlt className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:[&_path]:fill-white transition-colors" />
          </Button>
          <Button
            variant="outline"
            onClick={() => api?.scrollNext()}
            className="h-auto w-auto p-0 size-10 sm:size-12 md:size-[52px] rounded-full bg-primary border-primary group hover:bg-transparent transition-colors"
          >
            <ArrowRightAlt className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 [&_path]:fill-white group-hover:[&_path]:fill-primary transition-colors" />
          </Button>
        </div>
      </div>
    </section>
  );
}
