import { LandingFooter } from "@/modules/landing/components/Footer";
import LandingHeader from "@/modules/landing/components/Header";
import { Fragment, ReactNode } from "react";

export default function LandingPageLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <Fragment>
            <LandingHeader />
            {children}
            <LandingFooter />
        </Fragment>
    );
}
