"use client";
import { Button } from "@/components/ui/button";
import OTPInput from "react-otp-input";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AUTH_ROUTES } from "@/constants/routes";
import { useResendOtp } from "../controllers/resendOtpController";
import { signIn } from "next-auth/react";
import AuthFormHeader from "./AuthFormHeader";

export default function VerifyEmailClient() {
    const [otp, setOtp] = useState("");

    const [timer, setTimer] = useState(300);

    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const type = searchParams.get("type");

    const [isSignInLoading, setIsSignInLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer((prevTime) => prevTime - 1);
            }
        }, 1000);
        return () => clearInterval(countdown);
    }, [timer]);

    const { resendOtp } = useResendOtp();

    const onSubmit = async () => {
        if (!otp) {
            return toast.success("Please enter the otp code");
        }

        if (type === "RESET_PASSWORD") {
            return router.push(
                `${AUTH_ROUTES.RESET_PASSWORD}?email=${email}&token=${otp}`
            );
        }

        if (email && otp) {
            setIsSignInLoading(true);

            const res = await signIn("credentials", {
                redirect: false,
                email,
                totp: otp,
            });

            router.push("/user/dashboard");

            const error = JSON.parse(res?.error as string);

            if (error?.message) {
                setIsSignInLoading(false);
                return toast.error(error.message);
            }
        }
    };

    const handleResendOtp = async () => {
        if (email) {
            await resendOtp({
                email: email,
            });

            setTimer(300);
            toast.success("We've sent another OTP to your inbox");
        }
    };

    return (
        <Fragment>
            <AuthFormHeader
                title="Verify OTP"
                description="Enter the code sent to your email"
            />

            <OTPInput
                containerStyle="w-full items-center justify-between mt-2 flex mb-10"
                inputStyle={{
                    width: 60,
                    height: 60,
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                }}
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mr-3"></span>}
                renderInput={(props) => <input {...props} />}
            />

            <p className="text-center text-sm">
                OTP will expire in{" "}
                <span className="font-bold">
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:
                    {String(timer % 60).padStart(2, "0")}
                </span>
            </p>

            {timer === 0 && (
                <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="p-0 ml-auto block text-[#3F3465] font-normal"
                    onClick={handleResendOtp}
                >
                    Resend OTP
                </Button>
            )}

            <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={onSubmit}
                isLoading={isSignInLoading}
            >
                Verify OTP
            </Button>
        </Fragment>
    );
}
