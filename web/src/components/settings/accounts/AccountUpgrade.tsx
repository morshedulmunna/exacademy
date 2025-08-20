import UpgradeProSvg from "@/assets/svg/UpgradeProSvg";
import ButtonPrimary from "@/components/ButtonPrimary";
import React from "react";

type Props = object;

export default function AccountUpgrade({}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed">Pro membership unlocks projects, problems, AI, all courses, learning paths, and more.</p>
      </div>
      <div className="flex-shrink-0">
        <ButtonPrimary icon={<UpgradeProSvg />} text="Upgrade Pro" className="w-full sm:w-auto " />
      </div>
    </div>
  );
}
