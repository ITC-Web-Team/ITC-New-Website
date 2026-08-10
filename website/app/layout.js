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
      <body className="min-h-full flex flex-col">
        <MobileBlock />
        {children}
      </body>
    </html>
  );
}
