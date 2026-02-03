import React from "react";
export default function Gallery() {
  const galleryData = [
    {
      image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250",
      title: "Balayage by Jessica",
    },
    {
      image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3",
      title: "Our relaxing lounge area",
    },
    {
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
      title: "Stylist Michael in action",
    },
    {
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      title: "Vibrant copper color refresh",
    },
    {
      image: "https://images.unsplash.com/photo-1595475884562-073c30d45670",
      title: "Elegant salon interior design",
    },
    {
      image: "https://images.unsplash.com/photo-1607779097040-26e80aa6e4e7",
      title: "Dramatic haircut transformation",
    },
    {
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
      title: "Golden hour at the salon",
    },
    {
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
      title: "Our professional styling stations",
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
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["All", "The Space", "Before & After", "Our Stylists"].map(
            (item, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm border border-white/10
                ${
                  item === "All"
                    ? "bg-purple-600"
                    : "hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {galleryData.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* Overlay Text */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full">
            Ready for Your Transformation? Book Now
          </button>
        </div>

      </div>
    </section>
  );
}