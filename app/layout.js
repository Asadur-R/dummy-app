import "./globals.css";

export const metadata = {
  title: "Cloudinary + Neon DB App",
  description: "A dummy app with Cloudinary and Neon DB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
