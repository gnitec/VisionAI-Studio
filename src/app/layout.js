import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata = {
  title: "VisionAI Studio | Premium AI Video Generation",
  description: "Create stunning AI videos with a minimalist, professional studio experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <main className="page-wrapper">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
