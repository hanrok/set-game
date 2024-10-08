'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImBook } from "react-icons/im";
import { FaPlayCircle, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { Bounce, Fade, Zoom } from "react-awesome-reveal";
import useSound from "use-sound";
import PWAInstallPrompt from "@/components/PWAInstallPrompt"; // Import the PWAInstallPrompt

export default function MainPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [playTapSound] = useSound('assets/sounds/tap.wav');

    const handleOpenModal = () => {
        playTapSound();
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // Close modal on clicking outside
    const handleOutsideClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            handleCloseModal();
        }
    };

    const handleRegister = () => {
        playTapSound();
        router.push('/signin');
    };

    return (
        <div className="m-5 flex-grow flex flex-col justify-between text-white">
            {/* Add PWAInstallPrompt component */}
            <PWAInstallPrompt />

            <h1 className="font-bold text-4xl text-center mt-20 block drop-shadow-xl shadow-black text-stroke-gray-200 text-stroke">
                <Zoom cascade={true} damping={0.3}>
                    <div>
                        Welcome To<br />
                    </div>
                    <div className="flex justify-center">
                        <img className="my-10" src="/assets/svg/logo.svg" alt="Data SET Logo" />
                    </div>
                    <div>Data SET!</div>
                </Zoom>
            </h1>
            <div className="flex flex-col space-y-5 p-10 mb-10">
                <Bounce cascade delay={700} damping={0.4}>
                    <div className="flex justify-stretch">
                        <button className="flex items-center justify-center bg-pink-1200 py-5 rounded-md text-white font-bold w-full" onClick={() => {playTapSound(); router.push("/game")}}>
                            <FaPlayCircle className="mr-2" size={24} /> PLAY NOW!
                        </button>
                    </div>
                    <div className="flex justify-between space-x-2">
                        <button className="flex-grow text-gray-200 flex items-center justify-center bg-orange-1200 py-5 rounded-md font-bold" onClick={handleOpenModal}>
                            <ImBook className="mr-2" size={24} /> RULES
                        </button>
                        {!user && (
                            <Link href="/signin" className="flex-grow flex">
                                <button className="flex-grow text-gray-900 flex items-center justify-center bg-gray-1200 py-5 rounded-md font-bold" onClick={(handleRegister)}>
                                <FaUserCircle className="mr-2" size={24} /> Register
                                </button>
                            </Link>
                        )}
                    </div>
                </Bounce>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 modal-overlay bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOutsideClick}>
                    <div className="bg-purple-1200 p-6 rounded-md shadow-lg max-w-md h-3/5 w-4/5 overflow-y-auto space-y-2">
                        <h2 className="text-2xl font-bold mb-4">Game Rules</h2>
                        {/* TL;DR Section */}
                        <h3 className="text-lg font-semibold mb-2">TL;DR:</h3>
                        <p>Find as many sets of three data product cards in the same category as you can before the timer runs out!</p>
                        
                        <p><strong>Objective:</strong> Identify as many sets of three data product cards as possible before the timer runs out.</p>
                        <p><strong>Setup:</strong> The game consists of a deck of data product cards, each featuring various attributes (e.g., color, size, features). A selection of cards (e.g., 12 or 15) is displayed on the screen.</p>
                        <p><strong>Identifying a Set:</strong> A valid set consists of three cards that all represent data products in the same category. For example, if the category is "Electronics," a valid set might include three different smartphones.</p>
                        <p><strong>Timer:</strong> A countdown timer starts when the game begins. You have a fixed amount of time (e.g., 60 seconds) to find sets. The timer will count down to zero, and the game ends when the time is up.</p>
                        <p><strong>Finding Sets:</strong> While the timer is running, look for valid sets of three cards among the displayed selection. You can click on the cards you believe form a set.</p>
                        <p><strong>Validating the Set:</strong> Once you select three cards, the game will automatically validate whether the selection is a valid set. If it is a valid set, the cards will be removed from the display, and new cards will be drawn to replace them. If it is not a valid set, you can try again without losing time.</p>
                        <p><strong>Scoring:</strong> Your score is based on the number of valid sets you find before the timer reaches zero. The game may also display additional statistics, such as the time remaining and your total score at the end.</p>
                        <p><strong>Hints:</strong> If you're struggling to find sets, you can request a hint. The game will highlight one valid set from the displayed cards. Use hints wisely, as they may be limited.</p>
                        <p><strong>Categories and Attributes:</strong> Familiarize yourself with the various categories of the data product cards to improve your chances of finding sets.</p>
                        <div>
                            <button className="mt-4 bg-gray-1300 text-gray-950 py-2 px-4 rounded-md" onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
