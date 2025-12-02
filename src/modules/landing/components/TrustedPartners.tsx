import Image from "next/image";
import { partners } from "../data/partners";

export default function LandingTrustedPartners() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#F4F5F6]">
      <div className="w-full sm:w-[90%] lg:w-[80%] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 sm:gap-8 lg:gap-10">
          <p className="text-[#344054] text-sm sm:text-base text-left lg:text-left w-full lg:w-auto lg:whitespace-nowrap">
            Trusted Partnership <br className="hidden lg:block" />
            <span className="lg:block">with 100+ companies</span>
          </p>

          <div className="w-full flex-1 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-4">
            {partners.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <Image
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  width={1000}
                  height={1000}
                  className="w-auto h-8 sm:h-10 md:h-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
