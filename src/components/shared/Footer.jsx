import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">
              MediCare Connect
            </h2>
            <p className="text-sm leading-relaxed text-base-content/70">
              Modern healthcare made simple with trusted doctors, secure
              appointments, and patient-first care.
            </p>
          </div>

          <div>
            <h6 className="footer-title mb-3 text-primary">Quick Links</h6>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="link link-hover">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/find-doctors" className="link link-hover">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/about" className="link link-hover">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link link-hover">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="link link-hover">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="footer-title mb-3 text-primary">Contact</h6>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li>Email: support@medicareconnect.com</li>
              <li>Phone: +880 1234 567 890</li>
              <li>Address: 123 Health Ave, Medical City</li>
            </ul>
          </div>

          <div>
            <h6 className="footer-title mb-3 text-error">Emergency</h6>
            <p className="text-xl font-bold text-error">Dial: 911 / 102</p>
            <p className="mt-2 text-sm text-base-content/80">
              24/7 ambulance and emergency support.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-base-300 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-base-content/60">
            © 2026 MediCare Connect. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
