// import EnhancedMetaDataLibrary from "@/modules/userManagement/components/EnhancedRoleManagement";
import EnhancedMetaDataLibrary from "@/modules/metadataLibrary/views/EnhancedMetaDataLibrary";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Metadata Library - StewardCore",
    description:
        "Standardize metadata fields across all dataset types. Create templates so every dataset follows the same governance rules.",
};

export default function MetaDataLibraryPage() {
    return <EnhancedMetaDataLibrary />;
}
