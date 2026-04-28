import React from "react";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <div className="animate-fade-in pb-10">
      <div className="max-w-[1200px] mx-auto space-y-16 mt-8 px-4">
        {/* Page Title */}
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold tracking-tight">
            About Tiana Luxora
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full opacity-50"></div>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/40 rounded-[2rem] overflow-hidden border border-accent/10 shadow-xl shadow-accent/5 transition-all hover:shadow-2xl hover:shadow-accent/10 group">
          <div className="h-[300px] md:h-auto overflow-hidden">
            <img
              src="/images/about/story.png"
              alt="Woman spraying perfume"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="font-serif text-3xl text-primary font-bold mb-4 relative inline-block">
              Our Story
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent"></span>
            </h2>
            <p className="text-primary/80 leading-relaxed text-lg font-light">
              Tiana Luxora was born from a vision to redefine luxury through
              fragrance. Crafted with rare ingredients and timeless artistry,
              our perfumes are designed to express elegance, confidence, and
              individuality. Every bottle tells a story of sophistication made
              for the modern woman.
            </p>
          </div>
        </div>

        {/* Secondary Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Women Empowerment */}
          <div className="bg-white/40 p-6 md:p-10 rounded-[2rem] border border-accent/10 flex flex-col items-center text-center shadow-lg transition-all hover:-translate-y-2 group">
            <div className="relative mb-6 w-full h-64 rounded-2xl overflow-hidden shadow-inner">
              <img
                src="/images/about/empowerment.png"
                alt="Empowered women"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
              <div className="absolute bottom-4 left-0 w-full">
                <h3 className="font-serif text-2xl text-primary font-bold italic">
                  Women Empowerment
                </h3>
              </div>
            </div>
            <p className="text-primary/80 leading-relaxed font-light">
              At Tiana Luxora, empowerment is at the heart of everything we
              create. We celebrate strength, confidence, and grace by designing
              fragrances that inspire women to embrace their true selves and
              shine unapologetically. We are proud to align with Hon'ble PM
              Narendra Modi ji's vision for women empowerment, fostering an
              environment where every woman is honored and empowered.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white/40 p-6 md:p-10 rounded-[2rem] border border-accent/10 flex flex-col items-center text-center shadow-lg transition-all hover:-translate-y-2 group">
            <h2 className="font-serif text-3xl text-primary font-bold mb-6">
              Why Choose Us
            </h2>
            <div className="mb-6 w-64 h-64 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse-slow"></div>
              <img
                src="/images/about/why-us.png"
                alt="Premium perfume bottle"
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
              />
            </div>
            <p className="text-primary/80 leading-relaxed font-light">
              We blend premium ingredients with expert craftsmanship to deliver
              long-lasting, unforgettable fragrances. With a commitment to
              quality, authenticity, and luxury, Tiana Luxora ensures every
              scent becomes a signature of your personality.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
