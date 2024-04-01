import "./globals.css";
import type { Metadata } from "next";

import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";
import Provider from "./_trpc/Provider";

export const metadata: Metadata = {
  title: "INSTANT QUOTE TRADESMEN INSTANTLY",
  description: "INSTANT QUOTE TRADESMEN INSTANTLY",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      data-theme='winter'
    >
      <body>
        <AuthProvider>
          <Provider>
            <NavBar />
            <main className=''>{children}</main>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
