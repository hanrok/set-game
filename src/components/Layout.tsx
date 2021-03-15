import React from "react";
import Header from "@/components/partials/Header";

interface ILayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return <>
    <Header />
    <main className="py-4">
      {children}
    </main>
  </>
};

export default Layout;
