import React from "react";

export const metadata = {
  title: "About Us | MediCare Connect",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-4 font-sans transition-colors duration-200">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">
          About MediCare Connect
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
          MediCare Connect is a modern healthcare management platform that
          connects patients with doctors and hospitals through a centralized
          online system. Our goal is to digitize appointment booking, reduce
          patient waiting times, and provide a seamless healthcare experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-t-4 border-t-sky-500 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Our Mission</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              To maintain healthcare records securely and improve communication
              between patients and providers.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-t-4 border-t-emerald-500 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">For Patients</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Easily search for verified specialists, book appointments, and
              manage your medical journey in one place.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-t-4 border-t-violet-500 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">For Doctors</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Manage schedules, handle patient consultations, and securely store
              medical prescriptions with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
