
import { useState } from "react";
import { Link } from "react-router-dom";

import { Mail, Lock, ArrowRight, MessageCircle, Globe, Zap, Users } from "lucide-react";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  //const queryClient = useQueryClient();

  // const { mutate: loginMutation, isPending, error } = useMutation({
  //   mutationFn: login,
  //   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  // });

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   loginMutation(loginData);
  // };

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300 p-4"
      data-theme="night"
    >
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-base-content/10">

        
        <div className="w-full lg:w-1/2 bg-base-100 p-10 flex flex-col justify-between gap-8">

          
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2 shadow-lg shadow-primary/30">
              <MessageCircle className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-2xl font-black tracking-tight text-base-content">
              Talk<span className="text-primary">ora</span>
            </span>
          </div>

          
          <div className="space-y-1">
            <div className="badge badge-primary badge-outline badge-sm mb-3 font-medium tracking-widest uppercase">
              Welcome back
            </div>
            <h2 className="text-4xl font-black text-base-content leading-tight">
              Sign in to your<br />
              <span className="text-primary">account.</span>
            </h2>
            <p className="text-base-content/50 text-sm pt-1">
              Continue your language learning journey.
            </p>
          </div>

          
          <form onSubmit={handleLogin} className="space-y-4">

           
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Email address
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </label>
            </div>

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Password
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <Lock className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </label>
            </div>

            
            {error && (
              <div className="alert alert-error rounded-xl py-3 text-sm">
                <span>
                  {error.response?.data?.message || error.message || "Login failed"}
                </span>
              </div>
            )}

            
            <button
              className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 text-sm font-bold tracking-wide mt-2"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          
          <p className="text-center text-xs text-base-content/40">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline underline-offset-2"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 to-secondary/80 flex-col items-center justify-center p-12 gap-10 relative overflow-hidden">

          
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />

          
          <div className="avatar">
            <div className="w-44 rounded-2xl ring ring-primary-content/20 ring-offset-4 ring-offset-primary shadow-2xl">
              <img src="/i.jpg" alt="illustration" className="w-full h-full object-cover" />
            </div>
          </div>

          
          <div className="text-center space-y-2 z-10">
            <h3 className="text-2xl font-black text-primary-content leading-snug">
              Connect with language<br />partners worldwide 🌍
            </h3>
            <p className="text-primary-content/60 text-sm max-w-xs">
              Practice conversations, make friends, and improve your skills together.
            </p>
          </div>

          
          <div className="flex flex-col gap-3 w-full max-w-xs z-10">
            {[
              { icon: <Globe className="w-4 h-4" />, label: "Global Community",   desc: "Talk to people from 100+ countries" },
              { icon: <Zap className="w-4 h-4" />,   label: "Real-time Chat",     desc: "Instant, lag-free messaging" },
              { icon: <Users className="w-4 h-4" />, label: "Language Exchange",  desc: "Learn while you connect" },
            ].map(({ icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-primary-content/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-primary-content/10"
              >
                <div className="bg-primary-content/20 rounded-lg p-2 text-primary-content">
                  {icon}
                </div>
                <div>
                  <p className="text-primary-content text-xs font-bold">{label}</p>
                  <p className="text-primary-content/50 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;