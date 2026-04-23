import React, { useState } from "react";
import { predictApi } from "../services/api";

export default function PredictForm() {
    const [form, setForm] = useState({ jumlah_penjualan: "", harga: "", diskon: "" });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await predictApi.predict({
                jumlah_penjualan: parseFloat(form.jumlah_penjualan),
                harga: parseFloat(form.harga),
                diskon: parseFloat(form.diskon),
            });
            setResult(res.data);
        } catch {
            alert("Prediksi gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Prediksi Status Produk</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-4">
            <div>
                <label className="text-xs text-gray-500 font-medium">Jumlah Terjual</label>
                <input type="number" value={form.jumlah_penjualan}
                    onChange={(e) => setForm({ ...form, jumlah_penjualan: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="cth: 150" required />
            </div>
            <div>
                <label className="text-xs text-gray-500 font-medium">Harga (Rp)</label>
                <input type="number" value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="cth: 50000" required />
            </div>
            <div>
                <label className="text-xs text-gray-500 font-medium">Diskon (%)</label>
                <input type="number" value={form.diskon}
                    onChange={(e) => setForm({ ...form, diskon: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="cth: 10" min="0" max="100" required />
            </div>
            <div className="col-span-3">
                <button type="submit" disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
                    {loading ? "Memprediksi..." : "Prediksi"}
                </button>
            </div>
        </form>

        {/* Hasil prediksi */}
        {result && (
            <div className={`p-4 rounded-xl border-2 ${result.status === "Laris" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <p className="text-sm text-gray-500">Hasil Prediksi</p>
                <p className={`text-2xl font-bold ${result.status === "Laris" ? "text-green-700" : "text-red-700"}`}>
                    {result.status === "Laris" ? "🚀 LARIS" : "📉 TIDAK LARIS"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            </div>
        )}
        </div>
    );
}