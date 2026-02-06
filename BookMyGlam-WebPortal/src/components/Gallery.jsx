import React from "react";
import { Link } from 'react-router-dom';

export default function Gallery() {
  const galleryData = [
    {
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
      title: "Signature Platinum Blonde Transformation",
    },
    {
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop",
      title: "Premium Minimalist Styling Stations",
    },
    {
      image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1000&auto=format&fit=crop",
      title: "Artisan Color Mixing & Formulation",
    },
    {
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop",
      title: "Luxury Wash & Scalp Therapy Lounge",
    },
    {
      image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=1000&auto=format&fit=crop",
      title: "Precision Cut & Editorial Styling",
    },
    {
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop",
      title: "Our Selection of Professional Care",
    },
  ];

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

        {/* Filter Buttons */}
        {/* <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["All", "The Space", "Before & After", "Our Stylists"].map(
            (item, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm border border-white/10
                ${item === "All"
                    ? "bg-purple-600"
                    : "hover:bg-white/10"
                  }`}
              >
                {item}
              </button>
            )
          )}
        </div> */}

        {/* Gallery Grid */}
<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* Prepending the Demo Video object to the array */}
  {[
    {
      video: "../src/assets/demo.mp4",
      title: "Valentine's Special",
      isVideo: true 
    },
    ...galleryData
  ].map((item, index) => (
    <div
      key={index}
      className="relative rounded-2xl overflow-hidden group aspect-[4/5] bg-gray-900"
    >
      {item.isVideo ? (
        /* Video Rendering */
        <video
          src={item.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      ) : (
        /* Image Rendering */
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      )}

      {/* Overlay Text */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
        <p className="text-sm font-medium text-white flex items-center gap-2">
          {item.isVideo && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          {item.title}
        </p>
      </div>
    </div>
  ))}
</div>

        {/* CTA */}
        <Link to="/booking">
          <div className="text-center mt-16">
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full">
              Ready for Your Transformation? Book Now
            </button>
          </div></Link>

      </div>
    </section>
  );
}