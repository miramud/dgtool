import { LANDING_ROUTES } from "@/constants/routes";

export const footerLinks = {
    company: [
        { label: "About", href: LANDING_ROUTES.ABOUT },
        { label: "Contact", href: LANDING_ROUTES.CONTACT },
    ],

    services: [
        { label: "Enterprise Data Catalog", href: LANDING_ROUTES.DATA_CATALOG },
        { label: "Data Lineage", href: LANDING_ROUTES.DATA_LINEAGE },
        { label: "Metadata Management", href: LANDING_ROUTES.METADATA_MANAGEMENT },
    ],

    support: [
        {
            label: "FAQs",
            href: "#",
        },

        {
            label: "Privacy Policy",
            href: "#",
        },

        {
            label: "Terms & Condition",
            href: "#",
        },
    ],
};
