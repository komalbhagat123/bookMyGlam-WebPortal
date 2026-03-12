import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ADMIN_QR_URL = "/QR.jpeg";

// Add these styles to your global CSS or Tailwind config
const styles = `
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes confetti-1 {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(-30px, -40px) rotate(180deg);
      opacity: 0;
    }
  }
  
  @keyframes confetti-2 {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(30px, -40px) rotate(-180deg);
      opacity: 0;
    }
  }
  
  @keyframes confetti-3 {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(-35px, 40px) rotate(90deg);
      opacity: 0;
    }
  }
  
  @keyframes confetti-4 {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translate(35px, 40px) rotate(-90deg);
      opacity: 0;
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out;
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.6s ease-out;
  }
  
  .animate-confetti-1 {
    animation: confetti-1 1s ease-out forwards;
  }
  
  .animate-confetti-2 {
    animation: confetti-2 1s ease-out forwards;
  }
  
  .animate-confetti-3 {
    animation: confetti-3 1s ease-out forwards;
  }
  
  .animate-confetti-4 {
    animation: confetti-4 1s ease-out forwards;
  }
`;

function Booking() {
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    stylist: "",
    customerName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    mode: "offline",
  });

  const [otpCode, setOtpCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const otpTimerRef = useRef(null);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    otpTimerRef.current = setInterval(() => {
      setOtpCooldown((c) => {
        if (c <= 1) {
          clearInterval(otpTimerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(otpTimerRef.current);
  }, [otpCooldown]);

  const [showQR, setShowQR] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const totalPrice = selectedServices.reduce(
    (total, s) => total + Number(s.price || 0),
    0,
  );

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetchServices();
    fetchStylists();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("https://bookmyglam-backend.vercel.app/api/Manageservices");
      const data = res.data?.data || res.data || [];
      const normalized = data.map((s) => ({
        ...s,
        serviceName: s.serviceName ?? s.service ?? "",
      }));
      setServices(normalized);
    } catch {
      toast.error("Unable to load services");
    }
  };

  const fetchStylists = async () => {
    try {
      const res = await axios.get("https://bookmyglam-backend.vercel.app/api/stylists", {
        params: { status: "active" },
      });
      const list = res.data || [];
      const activeOnly = list.filter(
        (s) => (s.status || "").toString().toLowerCase() === "active",
      );
      setStylists(activeOnly);
    } catch {
      toast.error("Unable to load stylists");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "service") {
      const service = services.find((s) => s._id === value);
      if (service && !selectedServices.some((s) => s._id === service._id)) {
        setSelectedServices([...selectedServices, service]);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "email") {
      if (emailVerified) {
        setEmailVerified(false);
      }
      setOtpCode("");
      setOtpCooldown(0);
      clearInterval(otpTimerRef.current);
    }
  };

  const removeService = (id) => {
    setSelectedServices((prev) => prev.filter((s) => s._id !== id));
  };

  const sendOtpEmail = async () => {
    const email = formData.email?.trim();
    if (!email) return toast.error("Enter email first");
    if (otpCooldown > 0) {
      toast.error(`Please wait ${otpCooldown}s before resending`);
      return;
    }

    try {
      setOtpLoading(true);
      const res = await axios.post("https://bookmyglam-backend.vercel.app/api/auth/send-otp", {
        to: email,
        channel: "email",
      });
      if (res.data.ok) {
        toast.success("OTP Sent");
        setOtpCooldown(60);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "OTP failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtpEmail = async () => {
    const email = formData.email?.trim();
    if (!email) return toast.error("Enter email first");
    if (!otpCode) return toast.error("Enter OTP");

    try {
      setOtpLoading(true);
      const res = await axios.post(
        "https://bookmyglam-backend.vercel.app/api/auth/verify-otp",
        {
          to: email,
          code: otpCode.trim(),
          channel: "email",
        },
      );

      if (res.data.ok) {
        setEmailVerified(true);
        toast.success("Email verified ✅");
      } else {
        toast.error(res.data.message || "OTP verification failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const validateForm = () => {
    setFormErrors({});

    if (!formData.email?.trim()) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      toast.error("Enter email");
      return false;
    }
    if (!emailVerified) {
      toast.error("Verify your email first");
      return false;
    }
    if (selectedServices.length === 0) {
      toast.error("Select at least one service");
      return false;
    }
    if (!formData.customerName) {
      toast.error("Enter customer name");
      return false;
    }
    if (!formData.phone) {
      toast.error("Enter phone number");
      return false;
    }
    if (!formData.date) {
      toast.error("Select date");
      return false;
    }
    if (!formData.time) {
      toast.error("Select time");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.mode === "online") {
      setShowQR(true);
      return;
    }

    await submitBooking();
  };

  const submitBooking = async () => {
    try {
      setQrLoading(true);

      const res = await axios.post("https://bookmyglam-backend.vercel.app/api/bookings", {
        selectedServices: selectedServices.map((s) => ({
          ...s,
          serviceName: s.serviceName ?? s.service ?? "",
        })),
        ...formData,
      });

      if (res.data.ok) {
        toast.success(
          formData.mode === "online"
            ? "Booking submitted! Admin will verify your payment 🎉"
            : "Booking confirmed! Pay at salon 💇",
        );
        setShowSuccessPopup(true);
        setShowQR(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg || "Booking failed. Try again.");
      console.error("submitBooking error:", err);
    } finally {
      setQrLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServices([]);
    setEmailVerified(false);
    setOtpCode("");
    setFormData({
      stylist: "",
      customerName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      mode: "offline",
    });
    setShowSuccessPopup(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Book Your Appointment
          </h1>
          <p className="text-slate-400">Select services and choose your preferred time</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#000111] backdrop-blur-xl border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Services Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Select Services
              </label>
              <select
                name="service"
                onChange={handleChange}
                className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              >
                <option value="">Choose a service...</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.serviceName} — ₹{s.price}
                  </option>
                ))}
              </select>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedServices.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3 group hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white font-medium">{s.serviceName}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-purple-300 font-semibold">₹{s.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(s._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {/* Total Price */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                    <span className="text-white font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name
                </label>
                <input
                  name="customerName"
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Email + OTP */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                Email Verification
              </label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`flex-1 bg-[#1f1435] border ${
                    formErrors.email ? "border-red-500/50" : "border-purple-500/30"
                  } rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all`}
                />
                <button
                  type="button"
                  onClick={sendOtpEmail}
                  disabled={otpLoading || otpCooldown > 0}
                  className="sm:px-6 px-4 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/50 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all whitespace-nowrap"
                >
                  {otpCooldown > 0 ? `${otpCooldown}s` : "Send OTP"}
                </button>
              </div>
              
              {formErrors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {formErrors.email}
                </p>
              )}

              {otpCooldown > 0 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="flex-1 bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={verifyOtpEmail}
                    disabled={otpLoading || !otpCode}
                    className={`sm:px-6 px-4 py-3.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      emailVerified
                        ? "bg-green-600 text-white"
                        : "bg-purple-600 hover:bg-purple-500 text-white disabled:bg-purple-900/50 disabled:text-slate-500"
                    }`}
                  >
                    {emailVerified ? "✓ Verified" : "Verify"}
                  </button>
                </div>
              )}

              {emailVerified && (
                <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Email verified successfully</span>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Appointment Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {/* Stylist */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Preferred Stylist (Optional)
              </label>
              {stylists.length > 0 ? (
                <select
                  name="stylist"
                  onChange={handleChange}
                  className="w-full bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  <option value="">Any available stylist</option>
                  {stylists.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="bg-[#1f1435] border border-purple-500/30 rounded-xl px-4 py-3.5 text-slate-500">
                  No stylists available at the moment
                </div>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: "offline" })}
                  className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                    formData.mode === "offline"
                      ? "bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-500 shadow-lg shadow-slate-500/20"
                      : "bg-[#1f1435] border border-purple-500/30 hover:border-slate-500/50"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      formData.mode === "offline" ? "bg-slate-600" : "bg-[#2a1b3d]"
                    }`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Pay at Salon</p>
                      <p className="text-slate-400 text-xs mt-1">Cash or card</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: "online" })}
                  className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                    formData.mode === "online"
                      ? "bg-gradient-to-br from-green-700 to-emerald-800 border-2 border-green-500 shadow-lg shadow-green-500/20"
                      : "bg-[#1f1435] border border-purple-500/30 hover:border-green-500/50"
                  }`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      formData.mode === "online" ? "bg-green-600" : "bg-[#2a1b3d]"
                    }`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Pay Online</p>
                      <p className="text-slate-400 text-xs mt-1">UPI / QR Code</p>
                    </div>
                  </div>
                </button>
              </div>

              {formData.mode === "online" && (
                <div className="mt-3 flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-300 text-sm">
                    A QR code will appear for instant payment via UPI apps
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200 text-lg"
            >
              {formData.mode === "online" ? "Proceed to Payment →" : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#2a1b3d]/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Scan & Pay</h3>
                <p className="text-slate-400">
                  Complete your payment of{" "}
                  <span className="text-green-400 font-bold text-xl">₹{totalPrice}</span>
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-2xl mb-6">
                <img
                  src={ADMIN_QR_URL}
                  alt="UPI QR Code"
                  className="w-full h-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="w-full aspect-square bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-600"
                >
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="font-semibold">QR Code Image</p>
                  <p className="text-sm mt-1">Place at /public/QR.jpeg</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#1f1435] border border-purple-500/30 rounded-2xl p-5 mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 text-sm font-bold">1</span>
                  <p className="text-slate-300 text-sm">Open any UPI app (PhonePe, GPay, Paytm)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 text-sm font-bold">2</span>
                  <p className="text-slate-300 text-sm">Scan the QR code above</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 text-sm font-bold">3</span>
                  <p className="text-slate-300 text-sm">Pay ₹{totalPrice} and complete the transaction</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 text-sm font-bold">4</span>
                  <p className="text-slate-300 text-sm">Click "I've Paid" below to confirm</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={submitBooking}
                  disabled={qrLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {qrLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>I've Paid — Confirm Booking</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className="w-full bg-[#1f1435] hover:bg-purple-900/50 text-slate-300 hover:text-white font-semibold py-3 rounded-xl transition-all border border-purple-500/30"
                >
                  Go Back
                </button>
              </div>

              <p className="text-center text-slate-500 text-xs mt-6">
                Admin will verify your payment within a few minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#2a1b3d]/95 backdrop-blur-xl border border-purple-500/20 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 relative">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce-in">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Confetti Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-confetti-1"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 rounded-full animate-confetti-2"></div>
                  <div className="absolute bottom-0 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-3"></div>
                  <div className="absolute bottom-0 right-4 w-2 h-2 bg-green-400 rounded-full animate-confetti-4"></div>
                </div>
              </div>

              {/* Success Message */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Booking Confirmed!
              </h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {formData.mode === "online" 
                  ? "Your payment is being verified. You'll receive a confirmation email shortly!"
                  : "Your appointment has been successfully booked. See you at the salon!"}
              </p>

              {/* Booking Details */}
              <div className="bg-[#1a1f2e] border border-gray-700/50 rounded-2xl p-6 mb-6 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Customer</span>
                  <span className="text-white font-semibold">{formData.customerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Date</span>
                  <span className="text-white font-semibold">{formData.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Time</span>
                  <span className="text-white font-semibold">{formData.time}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                  <span className="text-slate-400 text-sm">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={resetForm}
                className="w-full bg-purple-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200"
              >
                Book Another Appointment
              </button>

              <p className="text-slate-500 text-xs mt-4">
                A confirmation has been sent to {formData.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Booking;