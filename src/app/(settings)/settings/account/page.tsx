import DeleteIconSvg from "@/assets/svg/DeleteIconSvg";
import Divider from "@/common/Divider";
import ButtonPrimary from "@/components/ButtonPrimary";
import AccountUpgrade from "@/components/settings/accounts/AccountUpgrade";
import EmailChange from "@/components/settings/accounts/EmailChange";
import PasswordChangeForm from "@/components/settings/accounts/PasswordChangeForm";
import PhoneNumberChangeOrAdd from "@/components/settings/accounts/PhoneNumberChangeOrAdd";
import React from "react";

type Props = object;

export default function AccountPage({}: Props) {
  return (
    <div className="space-y-8">
      {/* Pro Membership Section */}
      <section className="bg-card border border-gray-900/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Manage Pro</h2>
        <AccountUpgrade />
      </section>

      {/* Account Details Section */}
      <section className="bg-card border border-gray-900/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Account Details</h2>
        <div className="space-y-4">
          <EmailChange />
          <Divider type="horizontal" />
          <PhoneNumberChangeOrAdd />
        </div>
      </section>

      {/* Password Change Section */}
      <section className="bg-card border border-gray-900/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Change Password</h2>
        <PasswordChangeForm />
      </section>

      {/* Delete Account Section */}
      <section className="bg-card border border-gray-900/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Danger Zone</h2>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <ButtonPrimary icon={<DeleteIconSvg />} text="Permanently Delete Account" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" />
        </div>
      </section>
    </div>
  );
}
