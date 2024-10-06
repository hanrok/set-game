import "tailwindcss/tailwind.css";
import { Metadata } from "next";
import SetGameContext from "@/components/Context";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "ElementaryDataSet Game",
  description: "Data Set game developed by ElementaryData",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="font-display bg-purple-1200 leading-normal antialiased" lang="en">
      <body className="flex h-dvh w-full justify-center">
        <main className="flex flex-grow flex-col align-middle">
          <AuthProvider>
            <SetGameContext>
                {children}
            </SetGameContext>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
