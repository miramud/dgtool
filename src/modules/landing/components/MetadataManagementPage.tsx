"use client";
import ServicePageLayout from "./ServicePageLayout";

const sections = [
    {
        title: "Why Metadata Management Matters in Oil and Gas",
        content:
            "In oil and gas operations, data is constantly generated from multiple sources — exploration systems, drilling operations, production monitoring, and financial reporting. Without proper metadata management, it becomes difficult to track what each dataset represents, who owns it, and how it should be used.\n\nSteward Core addresses this challenge by providing a robust metadata management tool that tracks, categorizes, and documents data assets. This ensures that every piece of information is contextualized, traceable, and easy to locate, improving overall operational efficiency and governance.",
    },
    {
        title: "Key Features of Steward Core's Metadata Management Tool",
        content:
            "Steward Core's platform combines advanced features to simplify metadata management while maintaining high standards of governance:",
        subsections: [
            {
                title: "Comprehensive Data Dictionary",
                content:
                    "The integrated data dictionary provides a single source of truth for all organizational data. Teams can easily define, document, and access dataset attributes, relationships, and lineage.",
            },
            {
                title: "Metadata Discovery and Cataloging",
                content:
                    "Automatically catalog datasets across multiple systems, making it simple to find and understand data assets. Metadata discovery supports accurate classification and reduces duplication or inconsistent definitions.",
            },
            {
                title: "Role-Based Access Control",
                content:
                    "Secure sensitive metadata with granular access permissions. Steward Core ensures that only authorized personnel can view or modify metadata, reducing risk while enabling collaboration.",
            },
            {
                title: "Compliance and Audit-Ready Reporting",
                content:
                    "Metadata management supports regulatory compliance by maintaining detailed records of data definitions, transformations, and usage. Reports can be generated quickly to satisfy auditors and regulators.",
            },
        ],
    },
    {
        title: "Supporting Oil & Gas Data Governance",
        content:
            "Steward Core's metadata management tool aligns closely with the needs of the oil and gas sector. By tracking critical operational and financial data, the platform provides:",
        bulletPoints: [
            "Clarity on data ownership",
            "Centralized metadata visibility",
            "Improved reporting accuracy",
            "Reduced operational risk",
        ],
        contentAfterBullets:
            "The platform integrates seamlessly with existing data cataloging, data lineage, and quality monitoring tools, creating a complete governance ecosystem that supports strategic decision-making and operational excellence.",
    },
    {
        title: "Improve Operational Efficiency with Metadata Management",
        content:
            "Without an effective metadata management strategy, organizations risk wasted time searching for data, misunderstanding datasets, and making decisions based on incomplete information. Steward Core solves this problem by providing a clear, structured view of all organizational data assets.\n\nTeams can quickly locate datasets, understand definitions, and validate their accuracy before using the data for reporting, analysis, or operational planning. This reduces errors, saves time, and increases confidence in data-driven decisions.",
    },
    {
        title: "Enhance Data Collaboration Across Teams",
        content:
            "Metadata management is not only about control — it's about enabling collaboration. Steward Core allows data stewards, analysts, engineers, and managers to work from a shared understanding of the organization's data assets. Clear definitions, context, and usage guidelines foster collaboration while maintaining compliance and governance standards.",
    },
    {
        title: "Build Trust and Authority with Your Data",
        content:
            "Effective metadata management improves trust in organizational data. When every dataset is properly defined, documented, and linked to a centralized data dictionary, stakeholders can rely on the information for decision-making. This builds internal authority and external confidence for regulatory, financial, and operational reporting.\n\nSteward Core ensures that metadata management supports the organization's broader goals, including compliance, operational efficiency, and data-driven growth.",
    },
];

export default function MetadataManagementPageClient() {
    return (
        <ServicePageLayout
            heroTitle="Metadata Management Tool and Data Dictionary for Oil & Gas"
            heroDescription={"Metadata management is essential for organizations that aim to maintain structured, accurate, and actionable data. In complex industries like oil and gas, managing metadata efficiently ensures that every dataset is well-documented, searchable, and aligned with business and regulatory standards. Steward Core's metadata management tool and integrated data dictionary provide a unified platform to manage all metadata assets across your organization.\n\nBy centralizing metadata, organizations can reduce errors, improve collaboration, and make data more discoverable. Whether it's operational, geological, or financial data, Steward Core helps teams maintain a comprehensive understanding of their information assets, supporting better decision-making and compliance."}
            sections={sections}
            ctaTitle="Start Managing Your Metadata Today"
            ctaDescription={"Investing in metadata management is an investment in organizational intelligence. Steward Core provides the tools necessary to centralize metadata, enforce standards, and maintain visibility across all datasets. By adopting a structured approach, companies gain streamlined operations, improved data discovery and usability, reduced compliance risk, and higher confidence in reporting.\n\nWith Steward Core, metadata management and the data dictionary become central pillars of your enterprise data governance strategy, enabling teams to make informed decisions and maintain regulatory compliance with ease."}
        />
    );
}
