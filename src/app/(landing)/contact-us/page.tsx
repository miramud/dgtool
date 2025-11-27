import ContactUsPageClient from "@/modules/landing/components/ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Data Governance Tool",
    description:
        "Get in touch with us. We're here to help you with your data governance needs.",
    keywords:
        "contact, data governance support, get in touch, customer support",
};

export default function ContactUs() {
    return <ContactUsPageClient />;
}
