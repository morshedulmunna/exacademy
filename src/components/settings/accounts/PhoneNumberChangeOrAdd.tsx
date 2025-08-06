import EditSvgIcon from "@/assets/svg/EditSvgIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import React from "react";

type Props = object;

export default function PhoneNumberChangeOrAdd({}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <p className="text-muted-foreground text-sm">
          Your phone number is not added
        </p>
      </div>
      <div className="flex-shrink-0">
        <ButtonPrimary 
          icon={<EditSvgIcon />} 
          text="Add Phone" 
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
