import React from "react";

export const metadata = {
  title: "Contact Us | MediCare Connect",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-4 font-sans transition-colors duration-200">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Get In Touch</h2>
              <div className="space-y-4 text-base text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Address:</span> 123 Health Ave, Medical City
                </p>
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Email:</span> support@medicareconnect.com
                </p>
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">Phone:</span> +880 1234 567 890
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-red-500 font-bold text-xl">
                Emergency Hotline: 911 / 102
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Available 24/7 for ambulance & emergency support.
              </p>
            </div>
          </div>

          {/* Contact Form (UI only as per requirements) */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-sm">
            <form className="space-y-4">
              <div className="form-control">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-full text-sm"
                />
              </div>
              <div className="form-control">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-full text-sm"
                />
              </div>
              <div className="form-control">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-3 text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-full text-sm resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="button" className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 py-3 font-medium transition-all duration-200 w-full mt-4 text-sm">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
