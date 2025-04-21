
import { Settings } from "lucide-react";

const AccountSettingsPage = () => {
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="text-primary" size={28} />
        <h1 className="text-3xl font-bold">Account Settings</h1>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        This is a placeholder for Account Settings (e.g., password & security). Implement settings here as needed.
      </p>
    </div>
  );
};

export default AccountSettingsPage;
