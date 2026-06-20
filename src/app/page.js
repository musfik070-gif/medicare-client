import Link from "next/link";

const routes = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/doctors/1", label: "Doctor Details" },
  { href: "/find-doctors", label: "Find Doctors" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1>MediCare Connect</h1>
      <p>App router structure is ready.</p>
      <ul>
        {routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href}>{route.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
