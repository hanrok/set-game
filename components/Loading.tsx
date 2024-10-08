'use client'

import { BeatLoader } from "react-spinners";


const Loading = () => {
    return (
        <div className="flex flex-grow justify-center items-center">
            <div>
            <BeatLoader color="#F2386C" size={20} />
            </div>
        </div>
    );
}

export default Loading;