import MaxWidthWrapper from "@/common/MaxWidthWrapper";
import Header from "@/components/Navbar/Header";
import AccountSettingsSidebar from "@/components/settings/accounts/AccountSettingsSidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  return (
    <>
      <Header />
      <MaxWidthWrapper className="mt-12 max-w-5xl">
        <h4 className="mb-8">Account Settings</h4>
        <div className="flex flex-col lg:flex-row h-full gap-4 justify-between items-start">
          <div className=" w-full lg:w-72 h-full ">
            <AccountSettingsSidebar />
          </div>
          <div className="w-full h-full">{children}</div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
