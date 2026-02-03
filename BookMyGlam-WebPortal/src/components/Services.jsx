import React from "react";
import {
  Scissors,
  Paintbrush,
  Sparkles,
  Hand,
  Flower,
  Droplets,
} from "lucide-react";

const services = [
  {
    title: "Haircuts & Styling",
    desc: "From precision cuts and transformative blowouts to elegant updos for any occasion.",
    icon: <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    title: "Hair Color & Treatments",
    desc: "Expert services from vibrant balayage and highlights to nourishing deep conditioning treatments.",
    icon: <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    title: "Skin & Face Care",
    desc: "Rejuvenating facials, chemical peels, and personalized skincare consultations for a radiant glow.",
    icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    title: "Spa & Relaxation",
    desc: "Unwind with therapeutic massages and luxurious body treatments designed to soothe your body and mind.",
    icon: <Flower className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    title: "Cupping Therapy",
    desc: "Experience the ancient wellness benefits of cupping therapy to relieve tension and promote circulation.",
    icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
  {
    title: "Hands & Feet Care",
    desc: "Impeccable manicures, relaxing pedicures, and stunning custom nail art for the perfect finishing touch.",
    icon: <Hand className="w-5 h-5 sm:w-6 sm:h-6" />,
  },
];

const Services = () => {
  return (
    <section className="min-h-screen bg-black text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-4 py-1 text-[10px] sm:text-xs rounded-full border border-purple-500/30 text-purple-400 tracking-widest">
            PREMIUM EXPERIENCE
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          Services Tailored to Your Style <br />
          <span className="text-purple-500">& Comfort</span>
        </h1>

        {/* Description */}
        <p className="text-center max-w-3xl mx-auto mt-6 text-gray-400 text-sm sm:text-base leading-relaxed">
          Indulge in a personalized experience where our expert stylists and
          therapists use premium products to bring out your best. We are
          committed to providing exceptional care and quality in every service.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-14 sm:mt-16">
          {services.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 sm:p-7
              hover:border-purple-500/40 hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center mb-4 text-purple-400">
                {item.icon}
              </div>

              <h3 className="text-base sm:text-lg font-semibold mb-2">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
