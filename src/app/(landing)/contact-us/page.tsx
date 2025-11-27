import ContactUsPageClient from "@/modules/landing/components/ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - StewardCore",
    description:
        "Get in touch with us. We're here to help you with your StewardCore needs.",
    keywords: "contact, StewardCore support, get in touch, customer support",
};

export default function ContactUs() {
    return <ContactUsPageClient />;
}
