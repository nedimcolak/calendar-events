import GoogleSignIn from "./GoogleSignIn";
import UserInfo from "./UserInfo";
import SyncButton from "./SyncButton";

interface AppHeaderProps {
  onSync?: () => void;
  isSyncing?: boolean;
}

function AppHeader({ onSync, isSyncing = false }: AppHeaderProps) {
  return (
    <div className="bg-white rounded-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <GoogleSignIn />
          {onSync && <SyncButton onClick={onSync} isLoading={isSyncing} />}
        </div>

        <UserInfo />
      </div>
    </div>
  );
}

export default AppHeader;
