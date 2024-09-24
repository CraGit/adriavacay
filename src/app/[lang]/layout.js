import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";

export default function LangLayout({ children, params }) {
  return (
    <SearchProvider>
      <Navbar navClass="navbar-white" locale={params.lang} />
      {children}
      <Footer />
      <ContactBar />
    </SearchProvider>
  );
}
