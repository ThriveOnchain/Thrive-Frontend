"use client";


import Link from "next/link";
export default function Footer() {
  return (
    <footer className="flex w-full justify-between p-4 text-sm border-t mt-12">
      <p>© 2024 Thrive. All rights reserved.</p>

      <div>
        <Link href="/termsofservice">Terms of Service</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
