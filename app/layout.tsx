import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./ui/nav";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-row">
        <div className="lg:w-[22%] 2xl:w-[17%]">
          <Nav/>
        </div>
        <div  className="lg:w-[78%] 2xl:w-[83%]">
          {children}
        </div>
        </body>
    </html>
  );
}
