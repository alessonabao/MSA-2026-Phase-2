import { useAccount } from "@/lib/hooks/useAccount";
import { Navigate, Outlet } from "react-router";
import type { Role } from "@/lib/types";

type Props = {
  allow: Role[];
};

function RequireRole({ allow }: Props) {
  const { currentUser, loadingUserInfo } = useAccount();

  if (loadingUserInfo) {
    return "Loading...";
  }

  if (!currentUser || !allow.includes(currentUser.role)) {
    return <Navigate to="/activities" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
export default RequireRole;
