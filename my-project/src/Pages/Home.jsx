import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">

      {/* 🚚 Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Fast & Reliable Cargo Delivery
        </h1>
        <p className="text-lg mb-6">
          We deliver your goods safely, quickly, and efficiently across the country.
        </p>

        <button 
       onClick={() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "admin") navigate("/admin");
  else if(user?.role === "user") navigate("/user");
  else navigate("/login")
}}
        className="bg-black px-6 py-3 rounded-lg text-white hover:bg-gray-800 transition">
          Get Started
        </button>
      </section>

      {/* 📦 Services */}
      <section className="py-14 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Services
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            "Air Freight ✈️",
            "Road Transport 🚚",
            "Warehousing 🏬",
            "Express Delivery ⚡",
          ].map((service, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl transition text-center"
            >
              <h3 className="text-lg font-semibold">{service}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Reliable and fast service for your cargo needs.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ Why Choose Us */}
      <section className="bg-white py-14 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-500">
              We ensure quick and timely delivery of your shipments.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Secure Handling</h3>
            <p className="text-gray-500">
              Your goods are handled with utmost care and safety.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-500">
              Our team is always available to assist you anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 📊 Stats */}
      <section className="bg-blue-600 text-white py-12">
        <div className="grid md:grid-cols-4 text-center gap-6">
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p>Shipments Delivered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">100+</h3>
            <p>Active Clients</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">50+</h3>
            <p>Cities Covered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">24/7</h3>
            <p>Support Available</p>
          </div>
        </div>
      </section>

      {/* 📞 Call to Action */}
      <section className="py-16 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Ship Your Cargo?
        </h2>
        <p className="text-gray-600 mb-6">
          Join us today and experience hassle-free logistics service.
        </p>

        <button 
        onClick={() => navigate("/support/create")}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
          Contact Us
        </button>
      </section>

      {/* 🔻 Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-10">

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* COMPANY */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">CargoX</h2>
          <p className="text-sm text-gray-400">
            Fast, secure and reliable logistics & cargo delivery system across the country.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/user" className="hover:text-white">Dashboard</a></li>
            <li><a href="/support/create" className="hover:text-white">Contact Support</a></li>
            <li><a href="/search" className="hover:text-white">Track Shipment</a></li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="text-white font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Air Freight ✈️</li>
            <li>Road Transport 🚚</li>
            <li>Warehousing 🏬</li>
            <li>Express Delivery ⚡</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm">Email: yashshukla@gmail.com</p>
          <p className="text-sm">Phone: +91 9569405365</p>
          <p className="text-sm">India</p>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} CargoX. All rights reserved.
      </div>

    </footer>

    </div>
  );
};

export default Home;