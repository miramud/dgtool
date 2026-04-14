"use client";
import ServicePageLayout from "./ServicePageLayout";

const sections = [
    {
        title: "Centralized Data Cataloging and Discovery",
        content:
            "Data cataloging and discovery often become challenging when data is spread across multiple systems, vendors, and environments. Without a centralized view, teams spend valuable time searching for datasets, validating accuracy, and reconciling inconsistencies.\n\nThe Steward Core enterprise data catalog solves this by creating a unified inventory of all data assets. It automatically ingests metadata from various sources and organizes it into a searchable, structured system.\n\nThis approach allows users to find relevant datasets in seconds rather than hours, improving productivity and reducing operational delays. By making data more accessible while maintaining governance controls, organizations can accelerate analytics and decision-making without compromising data quality.",
    },
    {
        title: "Upstream Data Catalog for Exploration and Production",
        content:
            "Upstream operations generate some of the most complex and high-volume datasets in the oil and gas industry. Seismic data, drilling logs, reservoir models, and production metrics are often stored across disconnected systems, making it difficult to manage and utilize effectively.\n\nAn upstream data catalog provides a structured way to organize and govern these datasets. Steward Core's solution is specifically designed to handle the unique challenges of exploration and production environments.",
        subsections: [
            {
                title: "Automated Data Source Integration",
                content:
                    "The platform connects to upstream databases, data lakes, and operational systems, automatically scanning and indexing datasets. This ensures that all relevant data is captured and made available within the catalog.",
            },
            {
                title: "Metadata Context and Business Alignment",
                content:
                    "Technical data alone is not enough. Steward Core links metadata with business context, allowing engineers, geoscientists, and analysts to understand what the data represents and how it should be used.",
            },
            {
                title: "Ownership and Stewardship Visibility",
                content:
                    "Clear ownership is essential for governance. The platform assigns data owners and stewards, ensuring accountability and improving data reliability across upstream operations.",
            },
            {
                title: "Compliance and Regulatory Readiness",
                content:
                    "Oil and gas companies operate under strict regulatory frameworks. The upstream data catalog tracks data usage and lineage, helping organizations maintain compliance and prepare for audits with confidence.",
            },
        ],
    },
    {
        title: "Enterprise-Wide Data Visibility Across Systems",
        content:
            "Modern organizations operate across a combination of legacy systems, cloud platforms, and third-party applications. Without integration, these systems create silos that limit data visibility and increase operational risk.\n\nThe enterprise data catalog brings all these environments together into a single, unified ecosystem. Users can explore datasets across systems without needing to understand where the data is physically stored.\n\nThis level of visibility enables organizations to identify dependencies, assess the impact of changes, and ensure that data is consistent across all business functions. It also reduces duplication and improves collaboration between teams.",
    },
    {
        title: "Improve Collaboration Across Teams",
        content:
            "Data governance is not just a technical function — it requires collaboration across the entire organization. An effective enterprise data catalog supports both technical users and business stakeholders by providing a shared understanding of data.\n\nEngineers and analysts can quickly discover trusted datasets, while data stewards maintain governance standards and metadata accuracy. Compliance teams can track data usage and ensure regulatory alignment, and executives can rely on consistent reporting for decision-making.\n\nBy bridging the gap between technical and business users, Steward Core transforms the data catalog into a strategic asset that supports enterprise wide collaboration.",
    },
    {
        title: "Intelligent Metadata and AI-Assisted Classification",
        content:
            "Managing metadata manually in large-scale environments is both time-consuming and prone to errors. Steward Core enhances the enterprise data catalog with intelligent automation that improves accuracy and scalability.\n\nThe platform uses AI-assisted classification to identify patterns, detect sensitive data, and recommend metadata tags. This reduces manual effort while ensuring that datasets are properly categorized and governed.\n\nAs the data environment grows, this intelligent approach allows organizations to maintain control without increasing complexity.",
    },
    {
        title: "Benefits of Enterprise Data Cataloging",
        content:
            "Implementing an enterprise data catalog delivers significant operational and strategic benefits for oil and gas organizations.",
        subsections: [
            {
                title: "Faster Data Discovery",
                content:
                    "Teams can locate relevant datasets quickly using advanced search and filtering capabilities, reducing delays in analysis and reporting.",
            },
            {
                title: "Reduced Data Silos",
                content:
                    "By connecting systems and centralizing metadata, the platform eliminates silos and improves data accessibility across departments.",
            },
            {
                title: "Improved Data Quality and Trust",
                content:
                    "With clear ownership, validation processes, and governance controls, organizations can rely on their data with confidence.",
            },
            {
                title: "Stronger Compliance and Audit Readiness",
                content:
                    "Tracking data lineage and usage ensures that regulatory requirements are met and audits can be handled efficiently.",
            },
            {
                title: "Better Decision-Making",
                content:
                    "When data is accurate, accessible, and well-governed, decision-makers can act quickly and confidently.",
            },
        ],
    },
    {
        title: "Why Steward Core for Enterprise Data Catalog in Oil & Gas",
        content:
            "Generic data catalog tools often fail to address the complexity of oil and gas environments. Steward Core is built with a deep understanding of industry-specific requirements, including upstream data structures, regulatory compliance, and multi-system integration.\n\nThe platform combines enterprise data catalog capabilities with governance, lineage, and metadata management, providing a complete solution tailored to the needs of oil and gas organizations.\n\nBy focusing on real operational challenges and delivering practical solutions, Steward Core ensures that the enterprise data catalog is not just a documentation tool, but a core component of business success.",
    },
];

export default function DataCatalogPageClient() {
    return (
        <ServicePageLayout
            heroTitle="Enterprise Data Catalog for Oil & Gas Operations"
            heroDescription={"Enterprise data catalog solutions are essential for organizations that need to manage, discover, and trust their data across complex systems. In oil and gas environments, where data is generated from exploration, drilling, production, and corporate operations, having a centralized system for data cataloging and discovery is critical for efficiency and compliance.\n\nSteward Core's enterprise data catalog is designed to help organizations gain full visibility into their data assets while maintaining strong governance. By combining intelligent data cataloging and discovery with metadata management and lineage tracking, the platform enables teams to quickly locate, understand, and use trusted data across the enterprise."}
            sections={sections}
            ctaTitle="Start Building Your Enterprise Data Catalog Today"
            ctaDescription={"Organizations that invest in data cataloging and discovery gain a competitive advantage by improving efficiency, reducing risk, and enabling better decision-making.\n\nSteward Core provides the foundation for a modern enterprise data catalog that supports both current operations and future growth. With the right system in place, your organization can unlock the full value of its data and operate with greater confidence."}
        />
    );
}
