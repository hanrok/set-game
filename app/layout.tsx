import "tailwindcss/tailwind.css";
import { Metadata } from "next";
import SetGameContext from "@/components/Context";

export const metadata: Metadata = {
  title: "ElementaryDataSet Game",
  description: "Data Set game developed by ElementaryData",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="font-display bg-gray-800 leading-normal antialiased" lang="en">
      <body className="flex h-screen wh-screen justify-center">
        <main className="flex flex-grow flex-col align-middle">
          <SetGameContext>
            {children}
          </SetGameContext>
        </main>
      </body>
    </html>
  );
}
