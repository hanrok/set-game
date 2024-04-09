"use client";

import { useContext } from "react";
import Logotype from "@/components/Logotype";
import Timer from "@/components/Timer";
import { Context, ContextValues } from "../Context";

const Header = () => {
  const { sets } = useContext(Context) as ContextValues;

  return (
    <header className="pt-12 pb-2">
      <div className="container mx-auto px-6 md:px-8 lg:px-4 xl:px-0 max-w-screen-lg relative">
        <div className="flex justify-between items-center">
          <div>
            <Logotype />
          </div>
          <div className="py-2">
            <ul className="flex justify-end items-center space-x-4">
              <li>
                <Timer />
              </li>
              <li>
                <div className="flex items-center text-white text-2xl w-16">
                  <svg className="text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M7 7H10V16H7z"></path>
                    <path d="M14 7H17V12H14z"></path>
                  </svg>
                  <span className="inline-block">{sets.length}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
