import ResetPasswordClient from "@/modules/auth/components/ResetPasswordClient";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordClient />;
        </Suspense>
    );
}
