import Image from "next/image";
import { certifications } from "../data/certifications";

export default function LandingCertifications() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white"
      data-aos="fade-up"
    >
      <div className="w-full sm:w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-foreground mb-8 sm:mb-12 md:mb-16">
          Our Certifications
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-8 sm:gap-12 md:gap-16 lg:gap-20">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40"
            >
              <Image
                src={cert}
                alt={`Certification ${index + 1}`}
                width={160}
                height={160}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
