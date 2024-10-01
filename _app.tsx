'use client'

import SetGameContext from "./components/Context";

const Wrapper = ({children}) => {
    return (
        <SetGameContext>
            {children}
        </SetGameContext>
    );
}
          

export default  Wrapper;