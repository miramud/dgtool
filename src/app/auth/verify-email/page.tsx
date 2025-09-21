import VerifyOtpClient from "@/modules/auth/components/VerifyEmailClient";
import { Suspense } from "react";

export default function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyOtpClient />
        </Suspense>
    );
}
