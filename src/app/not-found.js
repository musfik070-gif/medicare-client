import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="text-lg text-base-content/70">Page Not Found</p>

      <Link href="/" className="btn btn-primary shadow-lg shadow-primary/20">
        Back Home
      </Link>
    </div>
  );
}
