import React from "react";

export const metadata = {
  title: "About Us | MediCare Connect",
};

export default function AboutPage() {
  return (
    <div className="min-h-[70vh] bg-base-100 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          About MediCare Connect
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          MediCare Connect is a modern healthcare management platform that
          connects patients with doctors and hospitals through a centralized
          online system. Our goal is to digitize appointment booking, reduce
          patient waiting times, and provide a seamless healthcare experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 bg-base-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To maintain healthcare records securely and improve communication
              between patients and providers.
            </p>
          </div>
          <div className="p-6 bg-base-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">For Patients</h3>
            <p className="text-gray-600">
              Easily search for verified specialists, book appointments, and
              manage your medical journey in one place.
            </p>
          </div>
          <div className="p-6 bg-base-200 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-2">For Doctors</h3>
            <p className="text-gray-600">
              Manage schedules, handle patient consultations, and securely store
              medical prescriptions with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
