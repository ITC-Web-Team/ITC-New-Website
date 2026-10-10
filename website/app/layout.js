import "./globals.css";
import MobileBlock from "./components/MobileBlock";

export const metadata = {
  title: "Institute Technical Council | IIT Bombay",
  description:
    "The Institute Technical Council (ITC) at IIT Bombay — fostering innovation, technical growth, and student leadership through clubs, tech teams, and competitions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Open connections to Spline hosts early so scene files start downloading sooner */}
        <link rel="preconnect" href="https://prod.spline.design" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <MobileBlock />
        {children}
      </body>
    </html>
  );
}
