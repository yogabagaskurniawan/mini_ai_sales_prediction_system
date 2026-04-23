import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { salesApi } from "../services/api";
import SalesTable from "../components/SalesTable";
import PredictForm from "../components/PredictForm";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [summary, setSummary] = useState(null);
    const [tab, setTab] = useState("table");

    useEffect(() => {
        salesApi.getAll({ page: 1, limit: 1 })
        .then(res => setSummary(res.data.summary));
    }, []);

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Navbar */}
            <header className="bg-white border-b px-6 h-14 flex items-center justify-between">
                <span className="font-bold text-gray-800">Sales Prediction</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Halo, {user?.username}</span>
                    <button onClick={logout} className="text-sm text-red-500 hover:underline">Keluar</button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
                {/* Stat Cards */}
                {summary && (
                    <div className="grid grid-cols-4 gap-4">
                        {
                            [
                                { label: "Total Produk", value: summary.total_produk},
                                { label: "Produk Laris", value: summary.total_laris},
                                { label: "Tidak Laris", value: summary.total_tidak},
                                { label: "Rata-rata Terjual", value: Math.round(summary.avg_penjualan)},
                            ].map((s) => (
                                <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm">
                                    <p className="text-xs text-gray-400 uppercase">{s.label}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{s.value.toLocaleString()}</p>
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                    {[{ key: "table", label: "Data Penjualan" }, { key: "predict", label: "Prediksi AI" }].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition
                                ${tab === t.key ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "table" ? <SalesTable /> : <PredictForm />}
            </main>
        </div>
    );
}