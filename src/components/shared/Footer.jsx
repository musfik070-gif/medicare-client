import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      {/* 1. Logo & Copyright */}
      <aside>
        <div className="text-3xl font-bold text-primary mb-2">
          MediCare Connect
        </div>
        <p>Copyright © 2026 - All right reserved by MediCare Connect Ltd.</p>
      </aside>

      {/* 2. Quick Links */}
      <nav>
        <h6 className="footer-title">Quick Links</h6>
        <Link href="/" className="link link-hover">
          Home
        </Link>
        <Link href="/find-doctors" className="link link-hover">
          Find Doctors
        </Link>
        <Link href="/about" className="link link-hover">
          About Us
        </Link>
        <Link href="/contact" className="link link-hover">
          Contact Us
        </Link>
        <Link href="/dashboard" className="link link-hover">
          Dashboard
        </Link>
      </nav>

      {/* 3. Contact Information */}
      <nav>
        <h6 className="footer-title">Contact Information</h6>
        <p>Email: support@medicareconnect.com</p>
        <p>Phone: +880 1234 567 890</p>
        <p>Address: 123 Health Ave, Medical City</p>
      </nav>

      {/* 4. Emergency Hotline (Added) */}
      <nav>
        <h6 className="footer-title text-error">Emergency Hotline</h6>
        <p className="text-xl font-bold text-error">Dial: 911 / 102</p>
        <p>24/7 Ambulance & Emergency Support</p>
      </nav>

      {/* 5. Social Media Links (Added) */}
      <nav>
        <h6 className="footer-title">Social Media</h6>
        <div className="grid grid-flow-col gap-4">
          <a href="#" aria-label="Facebook">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current hover:text-primary transition-colors"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current hover:text-primary transition-colors"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </a>
        </div>
      </nav>
    </footer>
  );
}
