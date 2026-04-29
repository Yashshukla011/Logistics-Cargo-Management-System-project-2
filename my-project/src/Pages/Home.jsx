import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

  return (
   <div className="bg-white min-h-screen flex flex-col justify-between overflow-x-hidden">

  {/* HERO SECTION */}
  <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-24 px-6 overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_white,_transparent_40%)]" />

    <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
      <div>
        <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 px-4 py-1 rounded-full text-sm mb-4">
          Trusted Logistics Partner
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Delivering Cargo
          <span className="block text-blue-400">Smarter & Faster</span>
        </h1>

        <p className="text-lg text-gray-300 mb-8 max-w-xl">
          End-to-end logistics solutions for businesses and individuals —
          secure, real-time tracked, and nationwide delivery coverage.
        </p>

        <button
          onClick={() => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user?.role === "admin") navigate("/admin");
            else if (user?.role === "user") navigate("/user");
            else navigate("/login");
          }}
          className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold shadow-xl transition-all hover:scale-105"
        >
          Get Started →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {[
          "Real-Time Tracking 📍",
          "Fast Dispatch ⚡",
          "Safe Packaging 📦",
          "24/7 Support ☎️",
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
          >
            <h3 className="font-semibold text-lg">{item}</h3>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* SERVICES */}
  <section className="py-20 px-6 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        Premium Logistics Services
      </h2>

      <div className="grid md:grid-cols-4 gap-8">
        {[
               "Fast Dispatch ⚡",

          "Road Transport 🚚",
          "Warehousing 🏬",
          "Express Delivery ⚡",
        ].map((service, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-3">{service}</h3>
            <p className="text-gray-500">
              High-performance cargo solutions tailored to your logistics needs.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* WHY CHOOSE US */}
  <section className="py-20 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-14">
        Why Businesses Trust CargoX
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {[
          ["Fast Delivery", "Lightning-fast shipping across all regions."],
          ["Secure Handling", "Advanced protection for every shipment."],
          ["24/7 Support", "Always available customer assistance team."],
        ].map(([title, desc], i) => (
          <div
            key={i}
            className="text-center p-8 rounded-3xl bg-gray-50 hover:bg-blue-50 transition"
          >
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* STATS */}
  <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
      {[
        ["500+", "Shipments Delivered"],
        ["100+", "Active Clients"],
        ["50+", "Cities Covered"],
        ["24/7", "Support Available"],
      ].map(([num, label], i) => (
        <div key={i}>
          <h3 className="text-5xl font-extrabold mb-2">{num}</h3>
          <p className="text-blue-100">{label}</p>
        </div>
      ))}
    </div>
  </section>

  {/* CTA */}
  <section className="py-24 px-6 bg-slate-900 text-white text-center">
    <h2 className="text-4xl font-bold mb-4">
      Ready to Move Your Cargo?
    </h2>

    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
      Join hundreds of businesses using CargoX for seamless cargo and logistics operations.
    </p>

    <button
      onClick={() => navigate("/support/create")}
      className="bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
    >
      Contact Us
    </button>
  </section>

  {/* FOOTER */}
  <footer className="bg-black text-gray-400">
    <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

      <div>
        <h2 className="text-white text-2xl font-bold mb-4">CargoX</h2>
        <p>
          Fast, secure and reliable logistics platform for modern cargo businesses.
        </p>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="/" className="hover:text-white">Home</a></li>
          <li><a href="/user" className="hover:text-white">Dashboard</a></li>
          <li><a href="/support/create" className="hover:text-white">Support</a></li>
          <li><a href="/search" className="hover:text-white">Track Shipment</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Services</h3>
        <ul className="space-y-2">
          <li>Air Freight ✈️</li>
          <li>Road Transport 🚚</li>
          <li>Warehousing 🏬</li>
          <li>Express Delivery ⚡</li>
        </ul>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Contact</h3>
        <p>Email: yashshukla@gmail.com</p>
        <p>Phone: +91 9569405365</p>
        <p>India</p>
      </div>

    </div>

    <div className="border-t border-gray-800 text-center py-5 text-sm">
      © {new Date().getFullYear()} CargoX. All rights reserved.
    </div>
  </footer>
</div>
  );
};

export default Home;