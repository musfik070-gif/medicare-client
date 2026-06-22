import "./globals.css";

import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export const metadata = {
  title: "MediCare Connect",
  description: "Healthcare Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
