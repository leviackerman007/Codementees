import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "user") {
        navigate("/dashboard/student", { replace: true });
      } else if (user.role === "mentor") {
        navigate("/dashboard/mentor", { replace: true });
      } else if (user.role === "admin") {
        navigate("/dashboard/admin", { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );
}