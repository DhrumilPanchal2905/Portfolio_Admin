import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const FontJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${FontJakarta.variable} ${FontJakarta.className} bg-primary-bg !static`}
      >
        <div id="app">
          <div id="modal-root">{children}</div>
        </div>
      </body>
    </html>
  );
}
