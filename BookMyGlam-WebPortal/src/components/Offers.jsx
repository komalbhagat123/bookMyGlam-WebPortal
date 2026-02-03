import React from "react";
import { Link } from 'react-router-dom';

const offers = [
  {
    tag: "SIGNATURE",
    title: "The Royal Grooming",
    desc: "Experience the ultimate makeover with a premium haircut, beard sculpting, and a charcoal detox facial.",
    btn: "Book Experience",
    img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop",
  },
  {
    tag: "HAPPY HOURS",
    title: "Mid-Day Glow",
    desc: "Get flat 20% off on all hair spa and skin treatments between 12 PM to 4 PM, Tuesday through Thursday.",
    btn: "Claim Spot",
    img: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop",
  },
  {
    tag: "TRENDING",
    title: "Keratin & Shine",
    desc: "Restore your hair's natural strength and shine with our advanced Keratin treatment package.",
    btn: "View Details",
    img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop",
  },
  {
    tag: "NEW MEMBER",
    title: "First Visit Special",
    desc: "First time at BookMyGlam? Enjoy a complimentary head massage with any haircut or styling service.",
    btn: "Get Voucher",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
  },
];

const Offers = () => {
  return (
    <section className="bg-[#0b0b0b] text-white py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Current Offers & Special Deals
        </h2>
        <p className="text-gray-400 mb-6">
          Discover our exclusive promotions and packages designed to pamper you.
        </p>

        {/* Filters */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", "Packages", "Weekday Specials", "Loyalty"].map((item, i) => (
            <button
              key={i}
              className={`px-4 py-1.5 rounded-full text-sm ${item === "All"
                  ? "bg-purple-600 text-white"
                  : "bg-[#1a1a1a] text-gray-300 hover:bg-purple-600"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {offers.map((offer, i) => (
            <div
              key={i}
              className="bg-[#121212] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-600 transition"
            >
              <img
                src={offer.img}
                alt={offer.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">
                <span className="text-xs bg-purple-600 px-3 py-1 rounded-full">
                  {offer.tag}
                </span>

                <h3 className="text-lg font-semibold mt-4">
                  {offer.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  {offer.desc}
                </p>

                <button className="mt-5 w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition">
                  {offer.btn}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loyalty Banner */}
        <div className="mt-20 bg-gradient-to-r from-[#1a1a1a] to-[#101010] rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold">
              Join Our Loyalty Rewards Program
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Earn points on every visit and redeem them for exclusive discounts and free services.
            </p>
          </div>

          <button className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700">
            Learn More
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <h2 className="text-3xl font-bold mb-4">
            Ready for a Transformation?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Let us help you discover your perfect look. Schedule your visit today.
          </p>

          <Link to="/booking">
            <button className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700">
              Book Your Appointment Now
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Offers;