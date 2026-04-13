import HeroSection from "../components/HeroSection";
import BestSellers from "../components/BestSellers";
import Collections from "../components/Collections";
import Features from "../components/Features";
import AboutPurpose from "../components/AboutPurpose";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <HeroSection />
      <Features />
      <BestSellers />
      <Collections />
      <AboutPurpose />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
