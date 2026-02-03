import React, { useState } from "react";
import { Sparkles, User, Crown } from "lucide-react";

/* ------------------ Crowd Data ------------------ */
const crowdData = {
  Mon: { morning: 30, afternoon: 50, evening: 40 },
  Tue: { morning: 40, afternoon: 60, evening: 70 },
  Wed: { morning: 35, afternoon: 70, evening: 55 },
  Thu: { morning: 25, afternoon: 45, evening: 60 },
  Fri: { morning: 50, afternoon: 80, evening: 90 },
  Sat: { morning: 60, afternoon: 85, evening: 95 },
  Sun: { morning: 55, afternoon: 65, evening: 75 },
};

const Choose = () => {
  const [activeDay, setActiveDay] = useState("Wed");
  const data = crowdData[activeDay];

  return (
    <>
      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-[#0b0b0b] text-white py-12 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">
              Why Choose Us?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              We are dedicated to providing the highest quality of service and
              care. Our team of expert stylists is committed to helping you look
              and feel your best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Sparkles className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Stylists</h3>
              <p className="text-gray-400 text-sm">
                Our team consists of highly trained and experienced professionals
                passionate about their craft and your satisfaction.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                <User className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Personalized Care</h3>
              <p className="text-gray-400 text-sm">
                Every service is tailored to your unique needs and preferences
                for a truly bespoke experience.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Crown className="text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Luxurious Ambiance</h3>
              <p className="text-gray-400 text-sm">
                Relax and unwind in our beautifully designed space, created for
                ultimate comfort and peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BEST TIME TO VISIT ================= */}
      <section className="bg-black text-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Know the Best Time to Visit
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Use crowd insights to help you choose the perfect slot for a relaxing
            experience.
          </p>

          <div className="bg-[#0f0f0f] rounded-xl p-8 border border-gray-800">
            {/* Days */}
            <div className="flex justify-between text-sm text-gray-400 mb-6">
              {Object.keys(crowdData).map((day) => (
                <span
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`cursor-pointer pb-1 transition ${
                    activeDay === day
                      ? "text-purple-500 font-semibold border-b-2 border-purple-500"
                      : "hover:text-white"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Crowd Bars */}
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-1">Morning</p>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gray-500 h-3 rounded-full transition-all"
                    style={{ width: `${data.morning}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm mb-1">Afternoon</p>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${data.afternoon}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm mb-1">Evening</p>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gray-600 h-3 rounded-full transition-all"
                    style={{ width: `${data.evening}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                <span>Happy Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                <span>Quiet</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
                <span>Busy</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Choose;
