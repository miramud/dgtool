"use client";
import ServicePageLayout from "./ServicePageLayout";

const sections = [
    {
        title: "Why Data Lineage Visualization Matters in Oil and Gas",
        content:
            "In oil and gas operations, data is constantly moving between upstream systems, data lakes, enterprise applications, and reporting tools. Without proper visibility, it becomes difficult to understand how data is being used, whether it has been altered, or if it can be trusted.\n\nData lineage visualization provides a clear, structured view of how data flows across systems. This is particularly important for organizations that rely on accurate reporting for regulatory compliance, operational decision-making, and financial analysis.\n\nBy implementing data lineage visualization, companies can reduce uncertainty, improve transparency, and ensure that every data-driven decision is based on reliable information.",
    },
    {
        title: "Oilfield Data Lineage Tracking Across Complex Systems",
        content:
            "Oilfield data lineage tracking is essential for managing the flow of data generated during exploration and production activities. These datasets often pass through multiple systems before being used in analytics or reporting, making it difficult to track their origin and transformation.\n\nSteward Core enables organizations to monitor oilfield data lineage tracking across:",
        bulletPoints: [
            "Exploration and seismic systems",
            "Drilling and production databases",
            "SCADA and operational platforms",
            "Data warehouses and analytics tools",
            "Financial and reporting systems",
        ],
        contentAfterBullets:
            "By mapping these connections, the platform provides a complete picture of how data moves throughout the organization.",
        subsections: [
            {
                title: "End-to-End Data Flow Visibility",
                content:
                    "The platform captures every stage of the data journey, from ingestion to transformation and final output. This ensures that users can trace data back to its source at any time.",
            },
            {
                title: "Transformation and Dependency Mapping",
                content:
                    "Understanding how data is transformed is critical for identifying errors and maintaining consistency. Steward Core shows how datasets are modified, merged, or enriched across systems.",
            },
            {
                title: "Cross-System Integration",
                content:
                    "The platform integrates seamlessly with existing infrastructure, allowing organizations to track data across multiple environments without disrupting operations.",
            },
        ],
    },
    {
        title: "Improve Data Trust and Reporting Accuracy",
        content:
            "One of the biggest challenges in data-driven organizations is ensuring that reports and dashboards are based on accurate and reliable data. Without visibility into data lineage, errors can go unnoticed, leading to incorrect insights and poor decision-making.\n\nData lineage visualization addresses this issue by providing transparency into every step of the data process. Teams can verify where data comes from, how it has been transformed, and whether it meets quality standards.\n\nThis level of visibility builds confidence in reporting and ensures that stakeholders can rely on the data used for critical business decisions.",
    },
    {
        title: "Strengthen Compliance and Audit Readiness",
        content:
            "Regulatory compliance is a major concern for oil and gas companies. Organizations must demonstrate that their data is accurate, properly managed, and aligned with industry standards.\n\nOilfield data lineage tracking plays a key role in achieving this. By documenting how data flows and changes over time, Steward Core provides a clear audit trail that can be used to support compliance requirements.\n\nDuring audits, teams can quickly trace data back to its origin, validate transformations, and demonstrate adherence to governance policies. This reduces risk and ensures that compliance processes are efficient and transparent.",
    },
    {
        title: "Visual and Interactive Data Lineage Maps",
        content:
            "Traditional documentation methods are often insufficient for understanding complex data environments. Steward Core addresses this by providing visual, interactive data lineage maps that make data flows easy to understand.\n\nThese visualizations allow users to explore relationships between datasets, identify dependencies, and analyze the impact of changes. Both technical and non-technical users can benefit from this approach, as it simplifies complex data structures into intuitive diagrams.\n\nBy making data lineage visualization accessible, the platform improves collaboration and enables faster problem resolution.",
    },
    {
        title: "Reduce Operational Risk and Improve Efficiency",
        content:
            "Without proper lineage tracking, organizations face significant operational risks. Changes to one dataset can have unintended consequences across multiple systems, leading to disruptions and inaccuracies.\n\nSteward Core helps mitigate these risks by providing clear visibility into data dependencies. Before making changes, teams can assess the potential impact and ensure that all affected systems are considered.\n\nThis proactive approach reduces downtime, improves efficiency, and ensures that operations run smoothly even in complex environments.",
    },
    {
        title: "Built for Oil & Gas Data Complexity",
        content:
            "Generic data lineage tools often struggle to handle the scale and complexity of oil and gas data environments. Steward Core is designed specifically for this industry, taking into account the unique challenges of upstream operations, regulatory requirements, and multi-system integration.\n\nThe platform combines data lineage visualization with governance and metadata management, creating a comprehensive solution that supports the entire data lifecycle.\n\nBy focusing on real-world use cases and operational needs, Steward Core delivers practical value that goes beyond basic lineage tracking.",
    },
];

export default function DataLineagePageClient() {
    return (
        <ServicePageLayout
            heroTitle="Data Lineage Visualization for Oilfield Data Tracking"
            heroDescription={"Data lineage visualization is a critical capability for organizations that need to understand how data flows across complex systems, especially in oil and gas environments. With large volumes of operational, geological, and financial data moving between multiple platforms, maintaining visibility into data origins and transformations is essential for accuracy, compliance, and trust.\n\nSteward Core provides advanced data lineage visualization designed specifically for oilfield data lineage tracking. The platform enables organizations to trace data from its original source through every transformation, movement, and usage point, ensuring complete transparency across the data lifecycle. By making data flows visible and understandable, Steward Core helps teams identify issues quickly, validate reporting accuracy, and maintain strong governance standards."}
            sections={sections}
            ctaTitle="Start Gaining Full Visibility into Your Data"
            ctaDescription={"Organizations that invest in data lineage visualization gain a deeper understanding of their data and how it supports business operations. This leads to better decision-making, improved compliance, and increased confidence in reporting.\n\nSteward Core provides the tools needed to implement effective oilfield data lineage tracking and ensure that data remains accurate, transparent, and trustworthy.\n\nWith full visibility into your data flows, you can move from reactive problem-solving to proactive data management."}
        />
    );
}
