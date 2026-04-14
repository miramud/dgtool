import DataLineagePageClient from "@/modules/landing/components/DataLineagePage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Lineage Visualization for Oil & Gas | Steward Core",
    description:
        "Data lineage visualization for oilfield data tracking. Understand data flow, improve compliance, and ensure trusted reporting with Steward Core.",
    keywords:
        "data lineage visualization, oilfield data lineage tracking, data flow tracking, oil and gas data lineage, data governance lineage",
};

export default function DataLineage() {
    return <DataLineagePageClient />;
}
