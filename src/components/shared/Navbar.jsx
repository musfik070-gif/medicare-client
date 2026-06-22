import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="container mx-auto">
        <Link href="/" className="text-2xl font-bold">
          MediCare Connect
        </Link>
      </div>
    </div>
  );
}
