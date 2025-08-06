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
          <Link href={each.href} key={index} className={` ${path === each.href && "bg-gray-200/80 dark:bg-gray-700/50"}  text-sm rounded group cursor-pointer flex items-center mb-2 gap-4`}>
            <div className={`w-1 h-9 rounded ${path === each.href && "bg-primary"}`}></div>
            <div className={` ${path === each.href && "dark:text-white text-black"} flex py-1.5  font-semibold dark:text-gray-400 text-gray-900 dark:group-hover:text-gray-300 transition-all ease-in-out cursor-pointer items-center gap-2`}>
              {each.icon}
              <span>{each.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
