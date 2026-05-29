import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import { MessageCircle, Mail, ArrowRight, KeyRoundIcon } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent! Check your email.");
      navigate("/verify-forgot-otp", { state: { email } });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4" data-theme="night">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl p-10 flex flex-col items-center gap-8">

          {/* Logo + Icon */}
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
              <KeyRoundIcon className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Copy */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-base-content">Forgot password?</h2>
            <p className="text-sm text-base-content/50 leading-relaxed">
              Enter your email and we'll send you a reset OTP.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">Email address</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 font-bold text-sm"
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-spinner loading-sm" /> : <ArrowRight className="w-4 h-4" />}
              {isPending ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>

          <Link to="/login" className="text-xs text-primary font-semibold hover:underline underline-offset-2">
            ← Back to Login
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
