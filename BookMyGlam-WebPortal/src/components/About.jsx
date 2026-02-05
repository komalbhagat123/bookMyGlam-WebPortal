import React from 'react';
import { Link } from 'react-router-dom';

const TeamCard = ({ image, name, role }) => (
  <div className="flex flex-col items-center p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl transition-all duration-300 hover:border-purple-500/50 hover:-translate-y-2">
    <img
      src={image}
      alt={name}
      className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-purple-500/20"
    />
    <h3 className="text-xl font-semibold text-white">{name}</h3>
    <p className="text-purple-400 text-sm">{role}</p>
  </div>
);

const GalleryCard = ({ image }) => (
  <div className="relative group overflow-hidden rounded-xl h-full w-full">
    <img
      src={image}
      alt="Salon Interior"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </div>
);

// --- DATA ---

const teamMembers = [
  { id: 1, name: "Arjun Mehra", role: "Master Stylist", img: "https://media.gettyimages.com/id/1973194644/photo/young-professional-hairdresser-cutting-hair-of-client-in-salon.jpg?s=612x612&w=gi&k=20&c=M_xv4xeBdOpAvG8rSZOiXhUk8m5C0b3zoZcjApGCgi0=" },
  { id: 2, name: "Priya Sharma", role: "Senior Colorist", img: "https://media.gettyimages.com/id/1783214772/photo/processional-hair-dresser-styling-hair-of-young-woman-in-beauty-salon.jpg?s=612x612&w=gi&k=20&c=ZKhmGIJ00EMB--GASO1GtpPTcT-h3tR60bTI011HQG0=" },
  { id: 3, name: "Ananya Iyer", role: "Lead Aesthetician", img: "https://media.gettyimages.com/id/1783230082/photo/portrait-of-young-female-hairdresser-in-salon.jpg?s=2048x2048&w=gi&k=20&c=bxlwcogDyGs4hIjUOw_8ANOasknMHwpLbocgRiGhEOs=" },
  { id: 4, name: "Vikram Sethi", role: "Junior Stylist", img: "https://www.kapilssalon.com/wp-content/uploads/2025/08/How-to-Become-a-Professional-Hairdresser-in-India-Step-by-Step-Career-Guide-2025-Edition-1024x576.png" },
];

const galleryPhotos = [
  "1560066984-138dadb4c035",
  "1522337660859-02fbefca4702",
  "1633681926022-84c23e8cb2d6",
  "1521590832167-7bcbfaa6381f",
  "1600948836101-f9ffda59d250",
  "1562322140-8baeececf3df",
  "1595476108010-b4d1f102b1b1",
  "1492707892479-7bc8d5a4ee93",
];

// --- MAIN COMPONENT ---

const About = () => {
  return (
    <div className="bg-black text-white selection:bg-purple-500/30 min-h-screen">

      {/* HERO SECTION */}
      <section className="px-6 pt-10">
        <div className="relative rounded-3xl overflow-hidden group max-w-7xl mx-auto">
          <img
            src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80&w=2000"
            alt="Interior of Aura Salon"
            className="w-full h-[320px] md:h-[500px] object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              About <span className="text-purple-500">BookMyGlam</span>
            </h1>
            <p className="mt-4 max-w-2xl text-gray-300 text-base md:text-lg">
              Discover our passion for beauty, our talented team, and the modern
              experience that sets us apart.
            </p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl font-semibold leading-tight">Our Philosophy</h2>
            <div className="h-1 w-12 bg-purple-600 mt-4"></div>
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe in the art of beauty, tailored to you. Our mission is to
              provide an unparalleled salon experience with expert craftsmanship
              and a warm, welcoming atmosphere.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
                <h3 className="font-semibold mb-3 text-purple-400 text-xl group-hover:text-purple-300">
                  Client Commitment
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Your satisfaction is our top priority. We listen, advise, and
                  create a look that is uniquely yours.
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
                <h3 className="font-semibold mb-3 text-purple-400 text-xl group-hover:text-purple-300">
                  Our Smart System
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  From seamless booking to personalized profiles, our system ensures
                  your experience is effortless.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="px-6 py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10 text-center md:text-left">
            Meet Our Talented Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamCard
                key={member.id}
                image={member.img}
                name={member.name}
                role={member.role}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10">A Glimpse Inside</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryPhotos.map((id, index) => (
            <div key={index} className="overflow-hidden rounded-xl aspect-square">
              <GalleryCard
                image={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=600`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready for Your Transformation?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Experience the difference at Aura Salon.
          </p>

          <Link to="/booking">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-10 py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] active:scale-95"
              aria-label="Book an appointment"
            >
              Book Your Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;