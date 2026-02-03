import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-black text-white min-h-screen">
 
      

      {/* ---------------- Header ---------------- */}
      <section className="text-center py-16 px-6">
        <h1 className="text-3xl md:text-5xl font-bold">
          Visit Us or <span className="text-purple-500">Get in Touch</span>
        </h1>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Experience luxury and elegance in the heart of the city.
        </p>
      </section>

      {/* ---------------- Content ---------------- */}
      <section className="px-6 md:px-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* -------- Contact Card -------- */}
        <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">
          <h2 className="text-purple-500 text-xl font-semibold mb-6">
            Contact Details
          </h2>

          <div className="space-y-5">
            <div className="flex gap-4">
              <MapPin className="text-purple-500" />
              <div>
                <p className="text-gray-400 text-sm">ADDRESS</p>
                <p>123 Fashion Street, City Center,<br />Nagpur, India</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-purple-500" />
              <div>
                <p className="text-gray-400 text-sm">PHONE</p>
                <p>+91 XXXX XXXX XX</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Mail className="text-purple-500" />
              <div>
                <p className="text-gray-400 text-sm">EMAIL</p>
                <p>hello@bookmyglam.com</p>
              </div>
            </div>
          </div>

          {/* -------- Working Hours -------- */}
          <h3 className="text-purple-500 text-lg font-semibold mt-10 mb-4">
            Working Hours
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between bg-black/40 rounded-lg px-4 py-3">
              <span>Monday - Friday</span>
              <span className="text-purple-500">9:00 AM - 7:00 PM</span>
            </div>

            <div className="flex justify-between bg-black/40 rounded-lg px-4 py-3">
              <span>Weekends</span>
              <span className="text-purple-500">10:00 AM - 6:00 PM</span>
            </div>
          </div>

          {/* -------- Buttons -------- */}
          <div className="flex gap-4 mt-8">
            <button className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg text-sm">
              Get Directions
            </button>
            <button className="border border-white/20 hover:bg-white/10 transition px-6 py-3 rounded-lg text-sm">
              Call Now
            </button>
          </div>
        </div>

        {/* -------- Map Section -------- */}
        <iframe
  title="map"
  className="w-full h-full"
  // src="https://www.google.com/maps?q=Beverly+Hills+CA&output=embed"
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41709426629!2d79.0024673434674!3d21.159340291739547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31f9301%3A0x34994d3c307e3b2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1706800000000!5m2!1sen!2sin"
  loading="lazy"
/>

      </section>
    </div>
  );
};

export default Contact;
