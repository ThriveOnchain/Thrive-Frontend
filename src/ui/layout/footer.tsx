"use client";

import Link from "next/link";
import { ThemeModeToggle } from "../theme-switch";
export default function Footer() {
  return (
    <footer className="flex w-full justify-between p-4 text-sm border-t mt-12 py-8">
      <p>
        © 2024 Thrive. <br /> All rights reserved.
      </p>

      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center ">
        <ThemeModeToggle />
        <Link href="/termsofservice">Terms of Service</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/privacy">Docs</Link>
      </div>
    </footer>
  );
}
