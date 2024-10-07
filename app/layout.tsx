import "tailwindcss/tailwind.css";
import { Metadata } from "next";
import SetGameContext from "@/components/Context";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "ElementaryDataSet Game",
  description: "Data Set game developed by ElementaryData",

  // to add?
  generator: "Next.js",
  manifest: "/manifest.json",
  // keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  // themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  // authors: [
  //   {
  //     name: "imvinojanv",
  //     url: "https://www.linkedin.com/in/imvinojanv/",
  //   },
  // ],
  // viewport:
  //   "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  // icons: [
  //   { rel: "apple-touch-icon", url: "icons/icon-128x128.png" },
  //   { rel: "icon", url: "icons/icon-128x128.png" },
  // ],
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
