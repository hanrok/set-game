'use client'

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // Google logo
import { FaGithub } from "react-icons/fa"; // GitHub logo
import { MdEmail } from "react-icons/md"; // Email logo
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Context, ContextValues } from "@/components/Context";
import { saveScore } from "@/utils/scores";


const AuthComponent = (): JSX.Element => {
  const { user, signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth();
  const { sets, gameOver } = useContext(Context) as ContextValues;
  
  const router = useRouter();

  if (user) {
    router.push("/scores");
  }

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between sign-in and sign-up
  const [step, setStep] = useState<number>(1); // To manage signup steps

  const onSignIn = () => {
    router.push("/"); // Navigate to root after sign-in
    if (gameOver && sets.length > 0) {
      saveScore(sets.length);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  const handleSignUpStep1 = () => {
    // Validate email before proceeding to the next step
    if (!email) {
      setError("Please enter a valid email.");
    } else {
      setError("");
      setStep(2); // Move to step 2 to enter password
    }
  };

  const handleSignUpStep2 = async () => {
    try {
      await signUpWithEmail(email, password);
      onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  return (
    <div className="flex flex-col items-stretch justify-center bg-purple-1200 flex-grow">
      <Link href="/">
        <div className="w-4/5 flex text-white mt-4 pl-5">
          <div className="w-3/4">
              <img src="/assets/svg/logo.svg" />
          </div>
          <div className="flex-grow w-1/4 flex flex-col justify-end">
            <div className="font-bold text-gray-100">SET GAME</div>
          </div>
        </div>
      </Link>
      
      <div className="flex flex-col justify-center items-center flex-grow mx-6">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">{isSignUp ? "Sign Up" : "Sign In"}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Email/Password Form */}
        <div className="w-full max-w-sm flex flex-col items-center mb-4">
          {!isSignUp && (
            <>
              {/* Sign in with email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-2 border rounded border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleEmailSignIn}
                className="flex items-center justify-center w-full bg-pink-1200 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition-colors"
              >
                <MdEmail className="mr-2" size={24} />
                Sign in with Email
              </button>
            </>
          )}

          {isSignUp && step === 1 && (
            <>
              {/* Step 1: Sign up with email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSignUpStep1}
                className="flex items-center justify-center w-full bg-orange-1200 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            </>
          )}

          {isSignUp && step === 2 && (
            <>
              {/* Step 2: Sign up with password */}
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 mb-2 border rounded border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleSignUpStep2}
                className="flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition-colors"
              >
                <MdEmail className="mr-2" size={24} />
                Sign up with Email
              </button>
            </>
          )}

          {/* Toggle between Sign In and Sign Up */}
          <p className="mt-4 text-sm text-gray-100">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStep(1); // Reset to step 1 when switching to sign-up
              }}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Sign in here" : "Sign up here"}
            </button>
          </p>
        </div>

        {/* Google and GitHub Sign In Buttons */}
        <div className="mt-6 w-full max-w-sm flex flex-col items-center">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition-colors mb-4"
          >
            <FcGoogle className="mr-2" size={24} /> Sign in with Google
          </button>

          <button
            onClick={handleGithubSignIn}
            className="flex items-center justify-center w-full bg-black text-white font-semibold py-2 px-4 rounded shadow hover:bg-gray-800 transition-colors"
          >
            <FaGithub className="mr-2" size={24} /> Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
