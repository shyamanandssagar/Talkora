import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyForgotOTP, forgotPassword } from "../lib/api";
import { MessageCircle, ShieldCheckIcon, RefreshCwIcon } from "lucide-react";
import toast from "react-hot-toast";

const VerifyForgotOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const { mutate: verifyMutation, isPending } = useMutation({
    mutationFn: verifyForgotOTP,
    onSuccess: (data) => {
      toast.success("OTP verified!");
      navigate("/reset-password", {
        state: { email, resetToken: data.resetToken },
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const { mutate: resendMutation, isPending: isResending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP resent");
      setCooldown(60);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to resend"),
  });

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter the full 6-digit OTP");
    verifyMutation({ email, otp: code });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4" data-theme="night">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl p-10 flex flex-col items-center gap-8">

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/30">
                <MessageCircle className="w-5 h-5 text-primary-content" />
              </div>
              <span className="text-xl font-black tracking-tight text-base-content">
                Talk<span className="text-primary">ora</span>
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-base-content">Enter OTP</h2>
            <p className="text-sm text-base-content/50 leading-relaxed">
              We sent a 6-digit code to<br />
              <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-xl font-black rounded-xl border border-base-content/15 bg-base-200 focus:border-primary focus:bg-base-100 focus:outline-none transition-all text-base-content"
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 font-bold"
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-spinner loading-sm" /> : null}
              {isPending ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-base-content/40">Didn't receive the code?</p>
            <button
              onClick={() => resendMutation(email)}
              disabled={isResending || cooldown > 0}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2 disabled:text-base-content/30 disabled:no-underline"
            >
              <RefreshCwIcon className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyForgotOTPPage;
