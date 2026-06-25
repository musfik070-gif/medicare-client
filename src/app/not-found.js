import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Page Not Found</p>

      <Link href="/" className="btn btn-primary">
        Back Home
      </Link>
    </div>
  );
}
