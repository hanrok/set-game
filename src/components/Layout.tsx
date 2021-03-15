import React from "react";
import Header from "@/components/partials/Header";

const Layout = (Component: React.ComponentType) => {
  return () => { 
    return <>
      <Header />
      <main className="py-4">
        <Component />
      </main>
    </>
  };
}

export default Layout;
