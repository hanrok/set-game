'use client'

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; // Google logo
import { FaGithub } from "react-icons/fa"; // GitHub logo
import { MdEmail } from "react-icons/md"; // Email logo
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Context, ContextValues } from "@/components/Context";
import { sendEmailVerification, updateProfile } from "firebase/auth"; // Import updateProfile

const AuthComponent = (): JSX.Element => {
  const { user, signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail } = useAuth();
  const { sets, gameOver } = useContext(Context) as ContextValues;
  
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(true); // Toggle between sign-in and sign-up
  const [step, setStep] = useState<number>(1); // To manage signup steps
  const [name, setName] = useState<string>(""); // To capture user name
  const [isNameStep, setIsNameStep] = useState<boolean>(false); // Step for adding name

  useEffect(() => {
    if (Boolean(user?.displayName)) {
      router.push("/game");
    }

    if (user && !user.displayName) {
      setIsNameStep(true); // If no name, show step to add it
      return; // Exit function early
    }
  }, [user]);

  const onSignIn = async () => {
    if (!user && isSignUp) {
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        return;
    }

    // Automatically move to name entry if displayName is not set
    if (user && !user.displayName) {
        setIsNameStep(true); // If no name, show step to add it
        return; // Exit function early
    }

    // Check if the user's email is verified
    /* Need to understand if we want to be so aggresive..
    
    if (user && user.emailVerified) {
        router.push("/game"); // Proceed to game page if email is verified
    } else if (user) {
        setError("Please verify your email before proceeding."); // Notify user to verify email
    }*/
  };


  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      await onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      await onSignIn();
    } catch (error: any) {
      setError(error.message); // Display error message to the user
    }
  };

  const handleEmailSignIn = async () => {
    try {
      await signInWithEmail(email, password);
      await onSignIn();
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
        const userCredential = await signUpWithEmail(email, password);
        console.log("userCredential", userCredential)
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);
        console.log("Verification email sent to " + user.email);
      } catch (error: any) {
        console.log("failed to sign up the user or something", error);
        setError(error.message); // Display error message to the user
      }
  };


  const handleNameSubmit = async () => {
    try {
      if (user) {
        // Update the user's profile with the provided name
        await updateProfile(user, { displayName: name });
        setIsNameStep(false);
        router.push("/game"); // Proceed to the game page
      }
    } catch (error: any) {
      setError("Error updating name: " + error.message);
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
        <h1 className="text-white text-3xl font-bold mb-6 text-center">{isNameStep ? "Your Nickname" : isSignUp ? "Sign Up" : "Sign In"}</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {isNameStep ? (
          // Step to add name after sign-in
          <div className="w-full max-w-sm flex flex-col items-center mb-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-2 mb-2 border rounded border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleNameSubmit}
              className="flex items-center justify-center w-full bg-green-600 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-700 transition-colors"
            >
              Submit Name
            </button>
          </div>
        ) : (
          <>
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
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition-colors"
              >
                <FaGithub className="mr-2" size={24} /> Sign in with GitHub
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
