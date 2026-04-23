import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  UserIcon,
  BookOpenIcon,
  GlobeIcon,
  CameraIcon,
  SparklesIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
  onSuccess: (updatedUser) => {
    toast.success("Profile onboarded successfully");

    queryClient.setQueryData(["authUser"], updatedUser); 
  },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

const handleRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(7);

  const randomAvatar = `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`;

  setFormState((prev) => ({
    ...prev,
    profilePic: randomAvatar,
  }));

  toast.success("Random profile picture generated!");
};

  return (
    <div className="min-h-screen bg-base-300 flex items-center justify-center p-4" data-theme="night">

      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <SparklesIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">Step 1 of 1</span>
          </div>
          <h1 className="text-4xl font-black text-base-content">
            Set up your <span className="text-primary">profile</span>
          </h1>
          <p className="text-base-content/40 text-sm mt-2">
            Tell the community a little about yourself
          </p>
        </div>

        
        <div className="bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl overflow-hidden">

          
          <div className="bg-gradient-to-br from-primary/20 to-secondary/10 px-8 pt-8 pb-10 flex flex-col items-center gap-4 border-b border-base-content/10">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-base-300 border-4 border-base-100 shadow-xl">
                {formState.profilePic ? (
                  <img src={formState.profilePic} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="w-10 h-10 text-base-content/20" />
                  </div>
                )}
              </div>
              
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-base-100" />
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="btn btn-sm bg-base-100 border border-base-content/10 hover:border-primary hover:text-primary gap-2 rounded-xl shadow-sm"
            >
              <ShuffleIcon className="w-3.5 h-3.5" />
              Generate Random Avatar
            </button>
          </div>

          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Full Name
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <UserIcon className="w-4 h-4 text-primary/50 shrink-0" />
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  placeholder="Your full name"
                />
              </label>
            </div>

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Bio
                </span>
              </label>
              <div className="relative">
                <BookOpenIcon className="absolute top-3 left-3 w-4 h-4 text-primary/50" />
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered w-full h-24 pl-10 bg-base-200 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all rounded-xl text-sm placeholder:text-base-content/20 resize-none"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                    Native Language
                  </span>
                </label>
                <div className="relative">
                  <GlobeIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-primary/50 pointer-events-none" />
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full pl-9 bg-base-200 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all rounded-xl text-sm"
                  >
                    <option value="">Select native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control gap-1">
                <label className="label py-0">
                  <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                    Learning Language
                  </span>
                </label>
                <div className="relative">
                  <BookOpenIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-primary/50 pointer-events-none" />
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                    className="select select-bordered w-full pl-9 bg-base-200 border-base-content/10 focus:border-primary focus:bg-base-100 transition-all rounded-xl text-sm"
                  >
                    <option value="">Select learning language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            
            <div className="form-control gap-1">
              <label className="label py-0">
                <span className="label-text text-xs font-semibold tracking-widest uppercase text-base-content/40">
                  Location
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-3 bg-base-200 border-base-content/10 focus-within:border-primary focus-within:bg-base-100 transition-all rounded-xl">
                <MapPinIcon className="w-4 h-4 text-primary/50 shrink-0" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="grow bg-transparent placeholder:text-base-content/20 text-sm"
                  placeholder="City, Country"
                />
              </label>
            </div>

            
            <div className="divider my-0 opacity-20" />

            
            <button
              className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 font-bold tracking-wide"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <>
                  <LoaderIcon className="animate-spin w-4 h-4" />
                  Saving profile...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="w-4 h-4" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>

        
        <p className="text-center text-xs text-base-content/25 mt-6">
          You can update your profile anytime from settings.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;