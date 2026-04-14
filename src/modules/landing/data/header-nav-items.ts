import { LANDING_ROUTES } from "@/constants/routes";

export const serviceNavItems = [
    {
        label: "Enterprise Data Catalog",
        href: LANDING_ROUTES.DATA_CATALOG,
    },
    {
        label: "Data Lineage",
        href: LANDING_ROUTES.DATA_LINEAGE,
    },
    {
        label: "Metadata Management",
        href: LANDING_ROUTES.METADATA_MANAGEMENT,
    },
];

export const headerNavItems = [
    {
        label: "Home",
        href: LANDING_ROUTES.HOME,
    },

    {
        label: "Services",
        href: "#",
        children: serviceNavItems,
    },

    {
        label: "About Us",
        href: LANDING_ROUTES.ABOUT,
    },

    {
        label: "Contact Us",
        href: LANDING_ROUTES.CONTACT,
    },
];
