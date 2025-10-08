"use client";
import { Button } from "@/components/ui/button";
import OTPInput from "react-otp-input";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AUTH_ROUTES } from "@/constants/routes";
import { useResendOtp } from "../controllers/resendOtpController";
// import { signIn } from "next-auth/react";
import AuthFormHeader from "./AuthFormHeader";
import { useVerifyEmail } from "../controllers/verifyEmailController";
import { useVerifyMfa } from "../controllers/verifyMfaController";

export default function VerifyEmailClient() {
  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(300);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const type = searchParams.get("type");
  const isMfa = searchParams.get("mfa") === "true";
  const isFpr = searchParams.get("fpr") === "true";

  //   const [isSignInLoading, setIsSignInLoading] = useState(false);

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
  const { verifyEmail, isLoading: isVerifyLoading } = useVerifyEmail();
  const { verifyMfa, isLoading: isMfaLoading } = useVerifyMfa();

  const onSubmit = async () => {
    if (!otp) {
      return toast.error("Please enter the otp code");
    }

    if (email && otp) {
      if (isFpr) {
        const res = await verifyEmail({
          email,
          totp: otp,
        });
        if (res?.status === true) {
          return router.push(
            `${AUTH_ROUTES.RESET_PASSWORD}?email=${email}&token=${otp}&fpr=true`
          );
        }
      }
      if (type === "RESET_PASSWORD") {
        const res = await verifyEmail({
          email,
          totp: otp,
        });
        if (res?.status === true) {
          return router.push(
            `${AUTH_ROUTES.RESET_PASSWORD}?email=${email}&token=${otp}`
          );
        }
      }
      if (isMfa) {
        const res = await verifyMfa({
          email,
          totp: otp,
        });

        if (res?.status === true && res?.data?.access_token) {
          localStorage.setItem("access_token", res.data.access_token);
          toast.success("MFA verified successfully");
          router.push("/admin/dashboard");
          return;
        }
      } else {
        const res = await verifyEmail({
          email,
          totp: otp,
        });

        if (res?.status === true) {
          toast.success("Email verified successfully");
          router.push("/auth/signin");
          return;
        }
      }

      toast.error("Verification failed. Please try again.");
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
        title={isMfa ? "Multi-Factor Authentication" : "Verify OTP"}
        description={
          isMfa
            ? "Enter your MFA code to continue"
            : "Enter the code sent to your email"
        }
      />

      <OTPInput
        containerStyle='w-full items-center justify-between mt-2 flex mb-10'
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
        renderSeparator={<span className='mr-3'></span>}
        renderInput={(props) => <input {...props} />}
      />

      <p className='text-center text-sm'>
        OTP will expire in{" "}
        <span className='font-bold'>
          {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </span>
      </p>

      {timer === 0 && (
        <Button
          type='button'
          variant='ghost'
          size='lg'
          className='p-0 ml-auto block text-[#3F3465] font-normal'
          onClick={handleResendOtp}
        >
          Resend OTP
        </Button>
      )}

      <Button
        type='button'
        className='w-full'
        size='lg'
        onClick={onSubmit}
        isLoading={isMfa ? isMfaLoading : isVerifyLoading}
      >
        Verify OTP
      </Button>
    </Fragment>
  );
}
