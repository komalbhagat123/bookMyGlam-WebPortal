import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

// Backend URL
const API_BASE = "https://bookmyglam-backend.vercel.app"; 

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Backend
  const fetchGallery = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/api/uploads?public=true`);
      if (resp.data.ok) {
        setGalleryItems(resp.data.items);
      }
    } catch (error) {
      console.error("Gallery fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  return (
    <section className="bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See Our Space. Feel the Vibe.
          </h2>
          <p className="text-gray-400">
            Step inside our world of style and transformation. Explore our
            curated interior, relaxing ambiance, and stunning results.
          </p>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-purple-500 animate-pulse">Loading Gallery...</p>
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="relative rounded-2xl overflow-hidden group aspect-[4/5] bg-gray-900 border border-white/5"
              >
                {/* Logic for Video */}
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onMouseOver={(e) => e.target.play()}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  /* Logic for Image */
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                )}

                {/* Overlay Text */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      {item.type === "video" && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                      {item.caption || "Salon Transformation"}
                    </p>
                    {item.stylist && (
                      <p className="text-xs text-gray-400">by {item.stylist}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">No photos published yet.</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/booking">
            <button className="bg-purple-600 hover:bg-purple-700 transition-colors px-8 py-3 rounded-full font-semibold">
              Ready for Your Transformation? Book Now
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}