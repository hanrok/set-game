'use client'

import { app } from "@/firebase";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

import { FcGoogle } from "react-icons/fc"; // Google logo
import { FaGithub } from "react-icons/fa"; // GitHub logo
import { MdEmail } from "react-icons/md"; // Email logo

const AuthComponent = () => {
  const auth = getAuth(app);
  const router = useRouter(); // Initialize the router for navigation

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between sign-in and sign-up
  const [step, setStep] = useState(1); // To manage signup steps

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/"); // Navigate to root after sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push("/"); // Navigate to root after sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Navigate to root after sign-in
    } catch (error) {
      setError(error.message);
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
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Navigate to root after sign-up
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h1>

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
              className="flex items-center justify-center w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-700 transition-colors"
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
              className="flex items-center justify-center w-full bg-green-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-700 transition-colors"
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
        <p className="mt-4 text-sm text-gray-600">
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
  );
};

export default AuthComponent;
