import { use } from "react";
import {useAuth} from "../../context/AuthContext";

export default function DashboardHome(){
    const {user}=useAuth();

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">
                Welcome back, {user?.name}
            </h1>
            <p className="text-muted">
                This is your dashboard overview.
            </p>
        </div>
    );
}