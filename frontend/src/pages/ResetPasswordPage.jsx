import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import { MessageCircle, Lock, ArrowRight, CheckCircle2Icon } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) navigate("/forgot-password");
  }, [email, resetToken, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Reset failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    mutate({ email, resetToken, newPassword });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300 p-4" data-theme="night">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl p-10 flex flex-col items-center gap-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
              <CheckCircle2Icon className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-base-content">Password reset!</h2>
              <p className="text-sm text-base-content/50">
                Your password has been updated successfully. You can now sign in.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary w-full rounded-xl font-bold">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-base-content">Set new password</h2>
            <p className="text-sm text-base-content/50">Must include uppercase, lowercase, number & special character</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">New Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <Lock className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">Confirm Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <Lock className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
