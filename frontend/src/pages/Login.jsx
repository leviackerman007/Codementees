import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api.js";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(form);

            if (data.token) {
                login(data);
                navigate("/");
            } else {
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Something went wrong");
        }

        setLoading(false);
    };

    return (
        <section className="surface min-h-screen flex items-center justify-center px-6">
            <div className="card w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Welcome Back
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-muted block mb-1">
                            Email
                        </label>
                        <input type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-default rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted block mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border border-default rounded-md px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-muted">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-indigo-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    )
}