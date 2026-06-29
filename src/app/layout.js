import "./globals.css";
import { Providers } from "./providers";
import { wakeUpServer } from "../lib/wakeup";

// Ping server every 10 minutes to keep Render alive
if (typeof window !== "undefined") {
  wakeUpServer(); // ping on page load
  setInterval(wakeUpServer, 10 * 60 * 1000); // ping every 10 mins
}

export const metadata = {
  title: "MediCare Connect",
  description: "Hospital Appointment & Healthcare Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
