"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Users, Clock, CheckCircle, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans">
      {/* Navbar */}
      <header className="w-full fixed top-0 left-0 right-0 flex items-center justify-between px-10 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/images/admin.svg" alt="Logo" width={30} height={30} />
          <h1 className="text-xl font-semibold text-blue-700">MEDFLOW</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between container mx-auto px-10 py-16 md:py-24">
        {/* Left content */}
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get Ready For Your <br />
            Best Ever <span className="text-blue-600">Dental Experience</span>
          </h1>
          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            Discover top-quality dental care with our expert team, dedicated to improving your oral health and providing a comfortable, stress-free visit.
          </p>
          <div className="mt-8 flex gap-4 items-center">
            <Link
              href="#"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Book Now
            </Link>
            <Link
              href="#"
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                ▶
              </div>
              See How We Work
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-6">
            <StatCard icon={<CheckCircle />} title="93%" desc="Satisfaction Rate" />
            <StatCard icon={<Users />} title="21+" desc="Expert Doctors" />
          </div>
        </div>

        {/* Right image */}
        <div className="relative mt-10 md:mt-0">
          <div className="absolute -z-10 right-0 top-0 w-[400px] h-[400px] bg-blue-100 rounded-full"></div>
          <Image
            src="/images/doctor.png"
            alt="Doctor"
            width={400}
            height={400}
            className="relative z-10"
          />
          {/* Floating cards */}
          <div className="absolute top-10 -left-16 bg-white shadow-md p-3 rounded-xl flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <div className="text-sm font-medium">
              <div className="text-gray-400 text-xs">24 Hrs Emergency</div>
              <div>+12 1234567890</div>
            </div>
          </div>

          <div className="absolute bottom-10 -left-10 bg-white shadow-md p-3 rounded-xl">
            <div className="flex items-center gap-2 text-sm">
              <Users className="text-blue-600 w-4 h-4" />
              <span className="font-semibold">1.5K Patients Love It</span>
            </div>
          </div>

          <div className="absolute top-20 -right-12 bg-white shadow-md p-3 rounded-xl text-center">
            <Clock className="mx-auto text-blue-600 w-5 h-5" />
            <div className="text-xs mt-1 font-medium">24 Hrs Doctor</div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-10 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex gap-5">
            <Image
              src="/images/doctor.png"
              alt="Dental Room"
              width={240}
              height={180}
              className="rounded-xl shadow-md object-cover"
            />
            <Image
              src="/images/doctor.png"
              alt="Doctor with Patient"
              width={240}
              height={180}
              className="rounded-xl shadow-md object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              All In One Treatment And Health Solution
            </h2>
            <p className="mt-3 text-gray-600">
              At MEDFLOW, we offer comprehensive dental services, including routine check-ups, advanced treatments, and personalized care plans to meet all your oral health needs.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <InfoCard title="Dedicated Team" desc="Our skilled dentists and staff are committed to your care." />
              <InfoCard title="Medical & Health" desc="State-of-the-art facilities for top-notch dental treatments." />
              <InfoCard title="Friendly Environment" desc="A welcoming clinic designed for your comfort and relaxation." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- Small Components --- */
function StatCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2 bg-white shadow p-3 rounded-xl min-w-[120px]">
      <div className="text-blue-600">{icon}</div>
      <div>
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition">
      <div className="text-blue-600 text-xl mb-2">💠</div>
      <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  );
}