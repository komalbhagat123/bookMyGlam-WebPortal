import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles, User, Crown, Loader2, RefreshCw,
  Calendar, Clock, X, ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Date helpers
───────────────────────────────────────────── */
function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function toShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function toDayLabel(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/** Build a 7-day window starting from `anchor` date */
function buildWeekFrom(anchor) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return {
      label:   toDayLabel(d),
      date:    toISO(d),
      display: toShortDate(d),
      dateObj: d,
    };
  });
}

/** Add `n` days to a date, return new Date */
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const SLOTS = [
  { key: "morning",   label: "Morning",   range: "6 AM – 12 PM",  hours: [6,7,8,9,10,11]       },
  { key: "afternoon", label: "Afternoon", range: "12 PM – 5 PM",  hours: [12,13,14,15,16]       },
  { key: "evening",   label: "Evening",   range: "5 PM – 12 AM",  hours: [17,18,19,20,21,22,23] },
];
const TIME_OPTIONS = [
  { label: "All Hours",  value: "all"       },
  { label: "Morning",    value: "morning"   },
  { label: "Afternoon",  value: "afternoon" },
  { label: "Evening",    value: "evening"   },
];
const MAX_WEEKS_BACK = 4; // ~1 month

/* ─────────────────────────────────────────────
   Data helpers
───────────────────────────────────────────── */
function getSlotKey(hour) {
  return SLOTS.find((s) => s.hours.includes(hour))?.key ?? null;
}

function buildCrowdData(timings, weekDays) {
  const counts = {};
  weekDays.forEach(({ date }) => { counts[date] = { morning: 0, afternoon: 0, evening: 0 }; });

  timings.forEach(({ date, time }) => {
    if (!counts[date]) return;
    const hour = parseInt(time.split(":")[0], 10);
    const slot = getSlotKey(hour);
    if (slot) counts[date][slot]++;
  });

  const allValues = weekDays.flatMap(({ date }) => SLOTS.map((s) => counts[date][s.key]));
  const maxCount  = Math.max(...allValues, 1);

  const percentages = {};
  weekDays.forEach(({ date }) => {
    percentages[date] = {};
    SLOTS.forEach((s) => {
      percentages[date][s.key] = Math.round((counts[date][s.key] / maxCount) * 100);
    });
  });

  return { percentages, counts };
}

function getCrowdLevel(pct) {
  if (pct >= 75) return { label: "Very Busy", barColor: "bg-red-500",    textColor: "text-red-400"    };
  if (pct >= 45) return { label: "Moderate",  barColor: "bg-yellow-500", textColor: "text-yellow-400" };
  if (pct >= 10) return { label: "Quiet",     barColor: "bg-purple-500", textColor: "text-purple-400" };
  return              { label: "No data",    barColor: "bg-gray-700",   textColor: "text-gray-500"   };
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const CrowdBar = ({ slot, pct, count, visible }) => {
  const level = getCrowdLevel(pct);
  if (!visible) return null;
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-200 font-medium">{slot.label}</p>
          <span className="text-xs text-gray-600">{slot.range}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${level.textColor}`}>{level.label}</span>
          <span className="text-xs text-gray-500">{count} booking{count !== 1 ? "s" : ""}</span>
          <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${level.barColor}`}
          style={{ width: pct > 0 ? `${Math.max(pct, 4)}%` : "0%" }}
        />
      </div>
    </div>
  );
};

const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-purple-600/15 border border-purple-600/30 text-purple-300 text-xs px-2.5 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-white transition"><X className="w-3 h-3" /></button>
  </span>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const Choose = () => {
  // anchor = the first day of the currently viewed 7-day window
  const today = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d; }, []);
  const todayISO = useMemo(() => toISO(today), [today]);

  // weekOffset: 0 = current (today-anchored), -1 = last week, -2 = 2 weeks ago …
  const [weekOffset, setWeekOffset] = useState(0);

  // anchor shifts by 7 days per offset step
  const anchor = useMemo(() => addDays(today, weekOffset * 7), [today, weekOffset]);
  const weekDays = useMemo(() => buildWeekFrom(anchor), [anchor]);

  // limits
  const canGoPrev = weekOffset > -MAX_WEEKS_BACK;
  const canGoNext = weekOffset < 0; // can't go beyond current week

  /* raw data */
  const [allTimings,     setAllTimings]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  /* filters */
  const [activeDate,     setActiveDate]     = useState(todayISO);
  const [timeSlotFilter, setTimeSlotFilter] = useState("all");
  const [showFilters,    setShowFilters]    = useState(false);

  /* when week changes, auto-select first day of that window */
  useEffect(() => {
    if (weekDays.length > 0) {
      // if current week, select today; otherwise select first day
      const todayInWindow = weekDays.find(d => d.date === todayISO);
      setActiveDate(todayInWindow ? todayISO : weekDays[0].date);
    }
  }, [weekOffset]);

  /* ── fetch ── */
  const fetchTimings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("https://bookmyglam-backend.vercel.app/api/bookings/timings");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok || !Array.isArray(json.timings)) throw new Error("Unexpected response");
      setAllTimings(json.timings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTimings(); }, []);

  /* ── filter timings to current window + time slot ── */
  const windowISOs = useMemo(() => weekDays.map(d => d.date), [weekDays]);

  const filteredTimings = useMemo(() => {
    return allTimings.filter(({ date, time }) => {
      if (!windowISOs.includes(date)) return false;
      if (timeSlotFilter !== "all") {
        const hour = parseInt(time.split(":")[0], 10);
        if (getSlotKey(hour) !== timeSlotFilter) return false;
      }
      return true;
    });
  }, [allTimings, windowISOs, timeSlotFilter]);

  /* ── crowd data ── */
  const { percentages: crowdPct, counts: crowdCounts } = useMemo(
    () => buildCrowdData(filteredTimings, weekDays),
    [filteredTimings, weekDays]
  );

  /* ── derived for selected day ── */
  const dayPct    = crowdPct[activeDate]    ?? { morning: 0, afternoon: 0, evening: 0 };
  const dayCounts = crowdCounts[activeDate] ?? { morning: 0, afternoon: 0, evening: 0 };

  const visibleSlots = timeSlotFilter === "all" ? SLOTS : SLOTS.filter(s => s.key === timeSlotFilter);
  const bestSlot     = visibleSlots.reduce((b, s) => (dayPct[s.key] < dayPct[b.key] ? s : b), visibleSlots[0] ?? SLOTS[0]);
  const busiestSlot  = visibleSlots.reduce((b, s) => (dayPct[s.key] > dayPct[b.key] ? s : b), visibleSlots[0] ?? SLOTS[0]);
  const totalDay     = visibleSlots.reduce((sum, s) => sum + dayCounts[s.key], 0);

  const activeDayInfo = weekDays.find(d => d.date === activeDate);
  const isCurrentWeek = weekOffset === 0;

  /* active chips */
  const activeFilters = [];
  if (timeSlotFilter !== "all") activeFilters.push({
    label: TIME_OPTIONS.find(t => t.value === timeSlotFilter)?.label,
    clear: () => setTimeSlotFilter("all"),
  });

  /* window label */
  const windowLabel = `${weekDays[0]?.display} – ${weekDays[6]?.display}`;

  /* week badge label */
  const weekBadge = weekOffset === 0
    ? "This week"
    : weekOffset === -1
      ? "Last week"
      : `${Math.abs(weekOffset)} weeks ago`;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.35s ease both; }
        @keyframes slideDown { from { opacity:0; max-height:0; } to { opacity:1; max-height:200px; } }
        .animate-slideDown { animation: slideDown 0.3s ease both; overflow:hidden; }
      `}</style>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-[#0b0b0b] text-white py-12 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3">Why Choose Us?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              We are dedicated to providing the highest quality of service and care. Our team
              of expert stylists is committed to helping you look and feel your best.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Sparkles className="text-purple-500" />, title: "Expert Stylists",    desc: "Our team consists of highly trained and experienced professionals passionate about their craft and your satisfaction." },
              { icon: <User     className="text-purple-500" />, title: "Personalized Care",  desc: "Every service is tailored to your unique needs and preferences for a truly bespoke experience." },
              { icon: <Crown    className="text-purple-500" />, title: "Luxurious Ambiance", desc: "Relax and unwind in our beautifully designed space, created for ultimate comfort and peace of mind." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#141414] border border-gray-800 rounded-2xl p-8 text-center hover:border-purple-600 transition">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">{icon}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BEST TIME TO VISIT ================= */}
      <section className="bg-black text-white py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Know the Best Time to Visit</h2>
            <div className="flex items-center gap-2 text-gray-400 text-sm flex-wrap justify-center mb-6">
              <Calendar className="w-3.5 h-3.5" />
              <span>{windowLabel}</span>
              <span className="w-1 h-1 rounded-full bg-gray-700 inline-block" />
              <span className={`font-medium ${isCurrentWeek ? "text-purple-400" : "text-yellow-500"}`}>
                {weekBadge}
              </span>
            </div>
          </div>

          {/* ── Time filter panel ── */}
          {showFilters && (
            <div className="animate-slideDown bg-[#0f0f0f] border border-gray-800 rounded-xl px-6 py-5 mb-6">
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Filter by time of day
              </p>
              <div className="flex gap-2 flex-wrap">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeSlotFilter(opt.value)}
                    className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                      timeSlotFilter === opt.value
                        ? "border-purple-600 bg-purple-600/20 text-purple-300"
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* active chips */}
          {!showFilters && activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {activeFilters.map((f) => (
                <FilterChip key={f.label} label={f.label} onRemove={f.clear} />
              ))}
            </div>
          )}

          <div className="bg-[#0f0f0f] rounded-xl p-8 border border-gray-800">

            {/* status */}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Loading crowd data…</span>
              </div>
            )}
            {!loading && error && (
              <div className="text-xs text-yellow-600 bg-yellow-600/10 border border-yellow-600/20 rounded-lg px-4 py-2 mb-6">
                ⚠ Could not load live data ({error}).
              </div>
            )}

            {/* ── Week navigation ── */}
            <div className="flex items-center justify-between mb-5">
              {/* Prev arrow */}
              <button
                onClick={() => setWeekOffset(o => o - 1)}
                disabled={!canGoPrev}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition ${
                  canGoPrev
                    ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                    : "border-gray-800 text-gray-700 cursor-not-allowed"
                }`}
                title={canGoPrev ? "Previous week" : "Limit reached (1 month back)"}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev week</span>
              </button>

              {/* Centre label */}
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isCurrentWeek
                    ? "bg-purple-600/20 text-purple-300 border border-purple-600/30"
                    : "bg-yellow-600/10 text-yellow-500 border border-yellow-600/20"
                }`}>
                  {weekBadge}
                </span>
                {!isCurrentWeek && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    className="text-xs text-gray-500 hover:text-purple-400 underline underline-offset-2 transition"
                  >
                    Back to current
                  </button>
                )}
              </div>

              {/* Next arrow */}
              <button
                onClick={() => setWeekOffset(o => o + 1)}
                disabled={!canGoNext}
                className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition ${
                  canGoNext
                    ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                    : "border-gray-800 text-gray-700 cursor-not-allowed"
                }`}
                title={canGoNext ? "Next week" : "This is the current week"}
              >
                <span className="hidden sm:inline">Next week</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── 7-day tabs ── */}
            <div className="grid grid-cols-7 gap-1.5 mb-8">
              {weekDays.map(({ label, date, display, dateObj }) => {
                const isActive   = date === activeDate;
                const isToday    = date === todayISO;
                const isPast     = date < todayISO;
                const isFuture   = date > todayISO;
                const totalCount = SLOTS.reduce((s, sl) => s + (crowdCounts[date]?.[sl.key] ?? 0), 0);

                return (
                  <button
                    key={date}
                    onClick={() => setActiveDate(date)}
                    className={`relative flex flex-col items-center py-2.5 px-1 rounded-xl border transition text-center
                      ${isActive
                        ? "border-purple-600 bg-purple-600/10 text-white"
                        : isPast
                          ? "border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400"
                          : isToday
                            ? "border-gray-600 text-gray-200 hover:border-purple-600/50"
                            : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white"
                      }`}
                  >
                    {isToday && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full leading-none whitespace-nowrap">
                        Today
                      </span>
                    )}
                    <span className={`text-xs font-semibold mb-0.5 ${isActive ? "text-purple-300" : ""}`}>
                      {label}
                    </span>
                    <span className="text-[11px] leading-none mb-1.5 text-gray-500">{display}</span>
                    {totalCount > 0 ? (
                      <span className={`text-[10px] font-medium tabular-nums ${isActive ? "text-purple-300" : isPast ? "text-gray-600" : "text-gray-500"}`}>
                        {totalCount}
                      </span>
                    ) : (
                      <span className="w-1 h-1 rounded-full inline-block bg-gray-800" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Summary cards ── */}
            {!loading && (
              <div className="grid grid-cols-3 gap-3 mb-7">
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Best Slot</p>
                  <p className="text-sm font-semibold text-green-400">
                    {bestSlot?.label ?? "—"}
                    <span className="text-gray-500 font-normal text-xs ml-1">
                      {bestSlot ? `${dayPct[bestSlot.key]}% crowd` : ""}
                    </span>
                  </p>
                </div>
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Busiest Slot</p>
                  <p className="text-sm font-semibold text-red-400">
                    {busiestSlot?.label ?? "—"}
                    <span className="text-gray-500 font-normal text-xs ml-1">
                      {busiestSlot ? `${dayPct[busiestSlot.key]}% crowd` : ""}
                    </span>
                  </p>
                </div>
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {activeDayInfo?.date === todayISO ? "Today's" : `${activeDayInfo?.label}'s`} Bookings
                  </p>
                  <p className="text-sm font-semibold text-white">{totalDay} total</p>
                </div>
              </div>
            )}

            {/* ── Crowd bars ── */}
            <div className="space-y-5">
              {SLOTS.map((slot) => (
                <CrowdBar
                  key={slot.key}
                  slot={slot}
                  pct={dayPct[slot.key]}
                  count={dayCounts[slot.key]}
                  visible={timeSlotFilter === "all" || timeSlotFilter === slot.key}
                />
              ))}
            </div>

            {/* empty state */}
            {!loading && visibleSlots.every(s => dayCounts[s.key] === 0) && (
              <div className="text-center py-8 text-gray-600 text-sm">
                No bookings for{" "}
                <span className="text-gray-400">{activeDayInfo?.display}</span>
                {timeSlotFilter !== "all" && (
                  <> during <span className="text-gray-400">{TIME_OPTIONS.find(t => t.value === timeSlotFilter)?.label}</span></>
                )}.
              </div>
            )}

            {/* ── Legend ── */}
            <div className="flex flex-wrap gap-5 mt-8 text-xs text-gray-400 border-t border-gray-800 pt-6">
              {[
                { color: "bg-purple-500", label: "Quiet"     },
                { color: "bg-yellow-500", label: "Moderate"  },
                { color: "bg-red-500",    label: "Very Busy" },
                { color: "bg-gray-700",   label: "No data"   },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
              <div className="ml-auto text-gray-600 text-[11px]">
                Numbers on tabs = bookings that day
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Choose;