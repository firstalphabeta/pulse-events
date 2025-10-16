import React, { useState, useEffect } from "react";

/*
  React single-file booking site
  - Tabs for Garden / Poolside / Studio / Padel
  - Blue & white theme, black text
  - Submissions go directly to your Google Form (via formResponse)
*/

const COMPANY_NAME = "PULSE FITNESS EVENT CENTER"; 
const SITE_DESCRIPTION = "Book your perfect event space in just a few clicks.";
const BOOKING_EMAIL = "";

const eventTypes = [
  {
    id: "garden",
    title: "Garden",
    subtitle: "Garden Event",
    rate: "Ghc 2,000 / hour",
    maxCapacity: 150,
    image: process.env.PUBLIC_URL + "/garden.jpg",
  },
  {
    id: "poolside",
    title: "Poolside",
    subtitle: "Poolside Event",
    rate: "Ghc 1,500 / hour",
    maxCapacity: 50,
    image: process.env.PUBLIC_URL + "/poolside 2.jpg",
  },
  {
    id: "studio",
    title: "Studio",
    subtitle: "Studio Event",
    rate: "Ghc 1,000 / hour",
    maxCapacity: 100,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "padel",
    title: "Padel",
    subtitle: "Padel Court Event",
    rate: "Ghc 1,500 / hour",
    maxCapacity: 150,
    image: process.env.PUBLIC_URL + "/padel 2.jpg",
  },
];

export default function App() {
  const [active, setActive] = useState(eventTypes[0].id);
  const [form, setForm] = useState({
    bookedBy: "",
    contactNumber: "",
    activityType: "",
    participants: "",
    dates: "",
    timeFrom: "",
    timeTo: "",
    areaRequested: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(t);
    }
  }, [success]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.bookedBy || !form.contactNumber || !form.activityType || !form.participants || !form.dates || !form.timeFrom || !form.timeTo) {
      setError("Please fill out all required fields.");
      return false;
    }
    setError("");
    return true;
  }

  // ✅ UPDATED handleSubmit — sends directly to Google Form
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("entry.559509858", form.bookedBy);
    formData.append("entry.1783154546", form.contactNumber);
    formData.append("entry.1861626872", form.activityType);
    formData.append("entry.1258085781", form.participants);
    formData.append("entry.1789557843", active); // Venue (Garden, Poolside, etc.)
    formData.append("entry.307675881", form.areaRequested || "none");

    // Split time and date values
    const [fromHour, fromMinute] = form.timeFrom.split(":");
    const [toHour, toMinute] = form.timeTo.split(":");

    const [year, month, day] = form.dates.split("-");

    formData.append("entry.178440163_hour", fromHour);
    formData.append("entry.178440163_minute", fromMinute);
    formData.append("entry.627693669_hour", toHour);
    formData.append("entry.627693669_minute", toMinute);
    formData.append("entry.973823948_year", year);
    formData.append("entry.973823948_month", month);
    formData.append("entry.973823948_day", day);

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScwOzzBooryj-QNyB0hzN4xbre1N2_gMjwq1LtmlVjnhSuaJg/formResponse",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      );

      setSuccess("✅ Booking submitted successfully!");
      setForm({
        bookedBy: "",
        contactNumber: "",
        activityType: "",
        participants: "",
        dates: "",
        timeFrom: "",
        timeTo: "",
        areaRequested: "",
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("There was an error submitting your booking.");
    } finally {
      setSubmitting(false);
    }
  }

  const activeEvent = eventTypes.find((e) => e.id === active);

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f3f8ff 0%, #ffffff 60%)", padding: 24 }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <header style={{ textAlign: "center", marginBottom: 18 }}>
            <h1 style={{ color: "#0b4f9b", fontSize: 32, margin: 0, fontWeight: 700 }}>{COMPANY_NAME}</h1>
            <p style={{ color: "#0b4f9b", marginTop: 8 }}>{SITE_DESCRIPTION}</p>
          </header>

          {/* Tabs */}
          <nav style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
            {eventTypes.map((ev) => (
              <button
                key={ev.id}
                onClick={() => {
                  setActive(ev.id);
                  setError("");
                  setSuccess("");
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  border: active === ev.id ? "2px solid #0b4f9b" : "1px solid rgba(11,79,155,0.12)",
                  background: active === ev.id ? "#0b4f9b" : "#fff",
                  color: active === ev.id ? "#fff" : "#0b4f9b",
                  cursor: "pointer",
                  boxShadow: active === ev.id ? "0 6px 18px rgba(11,79,155,0.12)" : "none",
                }}
              >
                {ev.title}
              </button>
            ))}
          </nav>

          <main style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 10px 30px rgba(11,79,155,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 18 }}>
              {/* Left: Image + details */}
              <section>
                <img src={activeEvent.image} alt={activeEvent.title} style={{ width: "100%", borderRadius: 12, objectFit: "cover", height: 260 }} />
                <div style={{ marginTop: 12 }}>
                  <h2 style={{ margin: 0, color: "#071023" }}>
                    {activeEvent.title} — <span style={{ color: "#0b4f9b" }}>{activeEvent.rate}</span>
                  </h2>
                  <p style={{ marginTop: 6, color: "#071023" }}>
                    Capacity: {activeEvent.maxCapacity} people — Minimum booking duration: 1 week
                  </p>
                  <p style={{ marginTop: 6, color: "#071023" }}>Choose your activity type and preferred date/time on the right to submit a booking.</p>
                </div>

                <div style={{ marginTop: 16 }}>
                  <h3 style={{ margin: 0, color: "#071023" }}>Activity examples</h3>
                  <ul style={{ marginTop: 8, color: "#071023" }}>
                    <li>Birthday parties</li>
                    <li>Corporate events</li>
                    <li>Photoshoots</li>
                    <li>Workshops</li>
                  </ul>
                </div>
              </section>

              {/* Right: Form */}
              <aside>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ color: "#071023", fontSize: 13 }}>
                    Booked By *
                    <input type="text" name="bookedBy" value={form.bookedBy} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} />
                  </label>

                  <label style={{ color: "#071023", fontSize: 13 }}>
                    Contact Number *
                    <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} placeholder="Phone number" />
                  </label>

                  <label style={{ color: "#071023", fontSize: 13 }}>
                    Activity Type *
                    <input type="text" name="activityType" value={form.activityType} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} placeholder="e.g., Birthday, Corporate, Photoshoot" />
                  </label>

                  {active === "poolside" && (
                    <div style={{ color: "#071023" }}>
                      <div style={{ marginBottom: 6 }}>Area Requested *</div>
                      <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                        <input type="radio" name="areaRequested" value="Restaurant" checked={form.areaRequested === "Restaurant"} onChange={handleChange} required /> Restaurant
                      </label>
                      <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
                        <input type="radio" name="areaRequested" value="Pool" checked={form.areaRequested === "Pool"} onChange={handleChange} /> Pool
                      </label>
                      <label style={{ display: "inline-flex", gap: 8, alignItems: "center", marginLeft: 12 }}>
                        <input type="radio" name="areaRequested" value="Both" checked={form.areaRequested === "Both"} onChange={handleChange} /> Both
                      </label>
                    </div>
                  )}

                  <label style={{ color: "#071023", fontSize: 13 }}>
                    Number of Participants *
                    <input type="number" name="participants" value={form.participants} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} placeholder={`Max ${activeEvent.maxCapacity}`} />
                  </label>

                  <label style={{ color: "#071023", fontSize: 13 }}>
                    Date(s) Requested *
                    <input
                      type="date"
                      name="dates"
                      value={form.dates}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 6,
                        borderRadius: 8,
                        border: "1px solid rgba(11,79,155,0.16)",
                      }}
                    />
                  </label>

                  <div style={{ display: "flex", gap: 8 }}>
                    <label style={{ flex: 1, color: "#071023", fontSize: 13 }}>
                      Time: From *
                      <input type="time" name="timeFrom" value={form.timeFrom} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} />
                    </label>
                    <label style={{ flex: 1, color: "#071023", fontSize: 13 }}>
                      Time: To *
                      <input type="time" name="timeTo" value={form.timeTo} onChange={handleChange} required style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid rgba(11,79,155,0.16)" }} />
                    </label>
                  </div>

                  {error && <div style={{ color: "#c53030", background: "#ffecec", padding: 10, borderRadius: 8 }}>{error}</div>}

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button type="submit" disabled={submitting} style={{ flex: 1, padding: 12, borderRadius: 10, background: "#0b4f9b", color: "#fff", border: "none", cursor: "pointer" }}>
                      {submitting ? "Submitting..." : "Submit Booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ bookedBy: "", contactNumber: "", activityType: "", participants: "", dates: "", timeFrom: "", timeTo: "", areaRequested: "" });
                        setError("");
                        setSuccess("");
                      }}
                      style={{ padding: 12, borderRadius: 10, background: "#fff", border: "1px solid rgba(11,79,155,0.12)", cursor: "pointer" }}
                    >
                      Reset
                    </button>
                  </div>

                  {success && (
                    <div style={{ marginTop: 10, padding: 12, borderRadius: 8, background: "#ecfdf5", color: "#065f46", border: "1px solid #bbf7d0" }}>{success}</div>
                  )}

                  <div style={{ marginTop: 10, fontSize: 12, color: "#334155" }}>
                    <strong>You will love it here!!!</strong>   <a href={`mailto:${BOOKING_EMAIL}`}>{BOOKING_EMAIL}</a>.
                  </div>
                </form>
              </aside>
            </div>
          </main>

          <footer style={{ marginTop: 18, textAlign: "center", color: "#475569" }}>
            <p style={{ margin: 0 }}></p>
          </footer>
        </div>
      </div>
    </div>
  );
}
