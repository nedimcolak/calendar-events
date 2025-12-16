import { Avatar, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/useAuth";

function UserInfo() {
  const { user, isLoading } = useAuth();

  return (
    <div className="mb-6">
      {user ? (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-4 border border-blue-200">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.profile_picture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.display_name}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center text-gray-600 py-4">
          Loading user info...
        </div>
      ) : (
        <div className="text-center text-gray-600 py-4">Not signed in</div>
      )}
    </div>
  );
}

export default UserInfo;
