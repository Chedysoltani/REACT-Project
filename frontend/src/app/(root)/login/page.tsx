// LoginPage.jsx
"use client"
import React from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="h-screen flex bg-cover bg-center" style={{
      backgroundImage: `url('https://img.freepik.com/photos-gratuite/hopital-blur-est-la_1203-7972.jpg?t=st=1760183601~exp=1760187201~hmac=be10422c10d75df487e849bbd426680f23c1a31c880be1665f89050d5ad68c63&w=1060')`,
    }}>
      {/* Login form section */}
      <div className="w-full flex justify-end items-center pr-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white p-10 rounded-2xl shadow-lg w-96"
        >
          <h1 className="text-center text-2xl font-bold mb-6 text-gray-800">MedFlow</h1>
          <form className="space-y-4">
            <div className="flex flex-col">
              <label className="block text-gray-700 mb-1">
                Your email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="block text-gray-700 mb-1">
                Your password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-right text-sm mt-1 text-blue-600 cursor-pointer">
                Forgot password?
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition mt-4"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 transition mt-4"
            >
              Not registered? Signup
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}