import React from "react";

export default function BookingHero() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-10 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Experience <br />
            <span className="text-purple-600">BookMyGlam</span> & Style
          </h1>

          <p className="text-gray-400 mt-6 max-w-md">
            Book your appointment effortlessly with our new streamlined
            process. Select your service, verify your details, and secure
            your time slot in just a few clicks.
          </p>

          <div className="flex gap-4 mt-10">
            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4">
              <p className="font-medium">Expert Stylists</p>
              <p className="text-sm text-gray-400">Top-tier professionals</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4">
              <p className="font-medium">Easy Booking</p>
              <p className="text-sm text-gray-400">Instant confirmation</p>
            </div>
          </div>

        </div>

        {/* Booking Card */}
        <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md mx-auto w-full">
          <h2 className="text-xl font-semibold mb-6 text-center">
            New Booking
          </h2>

          <div className="space-y-4">
            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none">
              <option>Select Service</option>
            </select>

            <input
              type="text"
              placeholder="Customer Name (letters only)"
              className="input"
            />

            <input
              type="text"
              placeholder="Phone (10 digits)"
              className="input"
            />

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Email"
                className="input flex-1"
              />
              <button className="bg-purple-700 hover:bg-purple-800 px-4 rounded-lg text-sm">
                Send OTP
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter OTP"
                className="input flex-1"
              />
              <button className="bg-white text-black px-4 rounded-lg text-sm font-medium">
                Verify
              </button>
            </div>

            <input type="date" className="input" />
            <input type="time" className="input" />

            <button className="w-full bg-purple-700 hover:bg-purple-800 py-3 rounded-xl font-medium mt-4">
              Add Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
