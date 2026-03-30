import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { RefreshCw } from "lucide-react";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch offers from your backend API
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://bookmyglam-backend.vercel.app/api/offers/active"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log("Raw API Response:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("API returned invalid JSON");
      }

      console.log("Parsed Response:", result);

      // Handle different response formats
      let offersData = null;

      if (Array.isArray(result)) {
        offersData = result;
      } else if (result.success && Array.isArray(result.data)) {
        offersData = result.data; // ✅ Your backend format
      } else if (result.ok && Array.isArray(result.offers)) {
        offersData = result.offers;
      } else if (Array.isArray(result.data)) {
        offersData = result.data;
      }

      if (offersData && offersData.length > 0) {
        setOffers(offersData);
      } else {
        console.warn("No offers in response");
        // Keep existing offers or set empty array
        setOffers([]);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err.message);

      // Fallback to static offers
      setOffers([
        {
          _id: "1",
          tag: "SIGNATURE",
          title: "Valentine Offer",
          description: "Redefine your style this Valentine's with our exclusive grooming trio: a premium haircut, expert beard sculpting, and a charcoal detox facial for that perfect date-ready glow.",
          buttonText: "Book Experience",
          imageUrl: "https://images.unsplash.com/photo-1706515056156-845f73bc81f3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          category: "Packages",
        },
        {
          _id: "2",
          tag: "HAPPY HOURS",
          title: "Mid-Day Glow",
          description: "Get flat 20% off on all hair spa and skin treatments between 12 PM to 4 PM, Tuesday through Thursday.",
          buttonText: "Claim Spot",
          imageUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070&auto=format&fit=crop",
          category: "Weekday Specials",
        },
        {
          _id: "3",
          tag: "TRENDING",
          title: "Keratin & Shine",
          description: "Restore your hair's natural strength and shine with our advanced Keratin treatment package.",
          buttonText: "View Details",
          imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop",
          category: "Packages",
        },
        {
          _id: "4",
          tag: "NEW MEMBER",
          title: "First Visit Special",
          description: "First time at BookMyGlam? Enjoy a complimentary head massage with any haircut or styling service.",
          buttonText: "Get Voucher",
          imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
          category: "Loyalty",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchOffers, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter offers by category
  const filteredOffers = activeFilter === "All"
    ? offers
    : offers.filter(offer => offer.category === activeFilter);

  const filterCategories = ["All", "Packages", "Weekday Specials", "Loyalty"];

  return (
    <section className="bg-[#0b0b0b] text-white py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Current Offers & Special Deals
            </h2>
            <p className="text-gray-400">
              Discover our exclusive promotions and packages designed to pamper you.
            </p>
          </div>

          <button
            onClick={fetchOffers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition disabled:opacity-50"
            title="Refresh offers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 mb-6 text-yellow-200 text-sm">
            ⚠️ {error}. Showing default offers.
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {filterCategories.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(item)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${item === activeFilter
                ? "bg-purple-600 text-white"
                : "bg-[#1a1a1a] text-gray-300 hover:bg-purple-600"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && offers.length === 0 ? (
          <div className="text-center py-20">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-gray-400">Loading offers...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No offers available in this category.</p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-purple-500 hover:text-purple-400"
            >
              View all offers
            </button>
          </div>
        ) : (
          /* Cards */
          <div className="grid md:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
              // Get image URL from different possible fields
              const imageUrl = offer.imageUrl || offer.image || offer.img || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop";

              return (
                <div
                  key={offer._id}
                  className="bg-[#121212] rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-600 transition"
                >
                  <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={offer.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop";
                      }}
                    />
                  </div>

                  <div className="p-6">
                    <span className="text-xs bg-purple-600 px-3 py-1 rounded-full">
                      {offer.tag || "OFFER"}
                    </span>

                    <h3 className="text-lg font-semibold mt-4">
                      {offer.title}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                      {offer.description}
                    </p>

                    <Link to="/booking">
                      <button className="mt-5 w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition">
                        {offer.buttonText || "Book Now"}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

          <button className="bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700 whitespace-nowrap">
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
            <button className="bg-[#7C3AED] text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
              Book Your Appointment Now
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Offers;