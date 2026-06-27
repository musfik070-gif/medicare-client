import React from "react";

export const metadata = {
  title: "Contact Us | MediCare Connect",
};

export default function ContactPage() {
  return (
    <div className="min-h-[70vh] bg-base-100 py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-10 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-base-200 p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            <div className="space-y-4 text-lg">
              <p>
                <span className="font-semibold">Address:</span> 123 Health Ave,
                Medical City
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                support@medicareconnect.com
              </p>
              <p>
                <span className="font-semibold">Phone:</span> +880 1234 567 890
              </p>
              <div className="divider"></div>
              <p className="text-error font-bold text-xl">
                Emergency Hotline: 911 / 102
              </p>
              <p className="text-sm text-gray-500">
                Available 24/7 for ambulance & emergency support.
              </p>
            </div>
          </div>

          {/* Contact Form (UI only as per requirements) */}
          <div className="bg-base-100 p-8 rounded-xl shadow-lg border border-base-200">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full mt-4">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
