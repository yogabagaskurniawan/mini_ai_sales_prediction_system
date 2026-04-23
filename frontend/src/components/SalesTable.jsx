import React, { useState, useEffect } from "react";
import { salesApi } from "../services/api";

export default function SalesTable() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Fungsi ambil data dari backend
    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const res = await salesApi.getAll({
                page,
                limit: 15,
                status: filterStatus || undefined,
                search: search || undefined,
            });
            setData(res.data.data);
            setPagination(res.data.pagination);
        } catch {
            alert("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    // Jalankan ulang setiap filter berubah
    useEffect(() => { fetchData(1); }, [filterStatus, search]);

    return (
        <div className="bg-white rounded-xl shadow-sm border">
            {/* Filter bar */}
            <div className="p-4 border-b flex gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="Laris">Laris</option>
                    <option value="Tidak">Tidak Laris</option>
                </select>
            </div>

            {/* Tabel */}
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Nama Produk</th>
                    <th className="px-4 py-3 text-right">Terjual</th>
                    <th className="px-4 py-3 text-right">Harga</th>
                    <th className="px-4 py-3 text-right">Diskon</th>
                    <th className="px-4 py-3 text-center">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">Memuat...</td></tr>
                ) : data.map((row) => (
                    <tr key={row.product_id} className="hover:bg-gray-100">
                        <td className="px-4 py-3 text-gray-400 text-xs font-mono">{row.product_id}</td>
                        <td className="px-4 py-3 font-medium">{row.product_name}</td>
                        <td className="px-4 py-3 text-right">{row.jumlah_penjualan}</td>
                        <td className="px-4 py-3 text-right">Rp {row.harga.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">{row.diskon}%</td>
                        <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                            ${row.status === "Laris" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                            {row.status === "Laris" ? "✓ Laris" : "✗ Tidak"}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-3 border-t flex justify-between items-center text-sm text-gray-500">
                <span>Total: {pagination.total} produk</span>
                <div className="flex gap-1">
                    <button
                        onClick={() => fetchData(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-40"
                    >‹</button>
                    <span className="px-3 py-1">Hal. {pagination.page} / {pagination.total_pages}</span>
                    <button
                        onClick={() => fetchData(pagination.page + 1)}
                        disabled={pagination.page === pagination.total_pages}
                        className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-40"
                    >›</button>
                </div>
            </div>
        </div>
    );
}