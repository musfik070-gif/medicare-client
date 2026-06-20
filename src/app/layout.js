export const metadata = {
  title: "MediCare Connect",
  description: "MediCare Connect application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
