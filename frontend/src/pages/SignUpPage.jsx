
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  MessageCircle,
  ArrowRight,
  Globe,
  Zap,
  Users,
} from "lucide-react";

import useSignUp from "../hooks/useSignUp";



const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

 const { isPending, error, signUpMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signUpMutation(signupData);
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300 p-4"
      data-theme="night"
    >
      
      <div className="flex flex-col lg:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-base-content/10">

        
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
              New Account
            </div>
            <h2 className="text-4xl font-black text-base-content leading-tight">
              Start your<br />
              <span className="text-primary">journey</span> today.
            </h2>
            <p className="text-base-content/50 text-sm pt-1">
              Connect with people worldwide and grow together.
            </p>
          </div>

          
          <form onSubmit={handleSignup} className="space-y-4">

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Full Name
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all">
                <User className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Email
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all">
                <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
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
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all">
                <Lock className="w-4 h-4 text-primary/60 shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            
            {error && (
              <div className="alert alert-error rounded-xl py-3 text-sm">
                <span>
                  {error.response?.data?.message ||
                    error.message ||
                    "Signup failed"}
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
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          
          <p className="text-center text-xs text-base-content/40">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>

        
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 to-secondary/80 flex-col items-center justify-center p-12 gap-10 relative overflow-hidden">

          
          <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />

          
          <div className="avatar">
            <div className="w-44 rounded-2xl ring ring-primary-content/20 ring-offset-4 ring-offset-primary shadow-2xl">
              <img src="/i.jpg" alt="illustration" />
            </div>
          </div>

          
          <div className="text-center space-y-2 z-10">
            <h3 className="text-2xl font-black text-primary-content leading-snug">
              Connect with people<br />worldwide 🌍
            </h3>
            <p className="text-primary-content/60 text-sm max-w-xs">
              Practice conversations, make friends, and grow together.
            </p>
          </div>

          
          <div className="flex flex-col gap-3 w-full max-w-xs z-10">
            {[
              { icon: <Globe className="w-4 h-4" />, label: "Global Community", desc: "Talk to people from 100+ countries" },
              { icon: <Zap className="w-4 h-4" />,  label: "Real-time Chat",    desc: "Instant, lag-free messaging" },
              { icon: <Users className="w-4 h-4" />, label: "Language Exchange", desc: "Learn while you connect" },
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

export default SignUpPage;