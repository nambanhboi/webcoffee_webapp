import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, metadata }) {

  return (
    <>
      <Header />  
        <div className={inter.className} metadata={metadata}>{children}</div>
      <Footer />    
    </>
  );
}
