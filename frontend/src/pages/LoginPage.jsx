import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();                           // cegah reload halaman
        const ok = await login(form.username, form.password);
        if (ok) navigate("/dashboard");               // kalau berhasil, pindah halaman
    };

    return (
        <div className="min-h-screen bg-blue-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl w-full max-w-sm shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Login</h1>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Username</label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <p className="text-xs text-gray-400 mt-4">Demo: admin / admin123</p>
            </div>
        </div>
    );
}