"use client";
import { LandingCtaSection } from "@/modules/landing/components/CtaSection";
import { LandingFeatureSection } from "@/modules/landing/components/FeatureSection";
import { LandingHeroSection } from "@/modules/landing/components/HeroSection";
import { LandingProcessSection } from "@/modules/landing/components/Process";
import { LandingPropositionSection } from "@/modules/landing/components/PropositionSection";
import { LandingTestimonialsSection } from "@/modules/landing/components/Testimonial";
import { Fragment, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LandingTrustedPartners from "./TrustedPartners";
import LandingCertifications from "./Certifications";

export default function LandingPageClient() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-out-cubic",
      once: false,
      disable: "phone",
    });
  }, []);

  return (
    <Fragment>
      <LandingHeroSection />
      <LandingPropositionSection />
      <LandingFeatureSection />
      <LandingCertifications />
      <LandingTestimonialsSection />
      <LandingProcessSection />
      <LandingTrustedPartners />
      <LandingCtaSection />
    </Fragment>
  );
}
