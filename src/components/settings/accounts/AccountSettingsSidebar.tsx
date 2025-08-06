"use client";

import EditProfileSvg from "@/assets/svg/EditProfileSvg";
import EmailSvgIcon from "@/assets/svg/EmailSvgIcon";
import ProfileIconSvg from "@/assets/svg/ProfileIconSvg";
import PurchaseSvgIcon from "@/assets/svg/PurchaseSvgIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = object;

export default function AccountSettingsSidebar({}: Props) {
  const path = usePathname();

  return (
    <>
      <div>
        {[
          {
            label: "Account",
            href: "/settings/account",
            icon: <ProfileIconSvg />,
          },
          {
            label: "Edit Profile",
            href: "/settings/edit-profile",
            icon: <EditProfileSvg />,
          },
          {
            label: "Email Preferences",
            href: "/settings/email-preferences",
            icon: <EmailSvgIcon />,
          },
          {
            label: "Purchases",
            href: "/settings/purchases",
            icon: <PurchaseSvgIcon />,
          },
        ].map((each, index) => (
          <Link
            href={each.href}
            key={index}
            className={`${path === each.href ? "bg-primary/10 dark:bg-primary/20 border-l-2 border-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800/40"} text-sm rounded-r group cursor-pointer flex items-center mb-2 gap-4 transition-all duration-200 ease-in-out`}
          >
            <div className={`w-1 h-9 rounded ${path === each.href ? "bg-primary" : "bg-transparent"}`}></div>
            <div className={`${path === each.href ? "text-primary dark:text-primary font-semibold" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"} flex py-1.5 font-medium transition-all ease-in-out cursor-pointer items-center gap-2`}>
              {each.icon}
              <span>{each.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
