"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = object;

export default function SettingsPage({}: Props) {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (path === "/username/settings") {
      router.push("/username/settings/account");
    }
  }, [path, router]);

  return null;
}
