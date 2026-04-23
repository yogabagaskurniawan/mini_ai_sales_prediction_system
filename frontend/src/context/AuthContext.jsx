import React, { createContext, useContext, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Cek apakah sudah login sebelumnya
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        return token ? { token, username } : null;
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (username, password) => {
        setLoading(true);
        setError("");
        try {
            const res = await authApi.login(username, password);
            // console.log("Login response:", res.data);
            
            const { access_token, username: uname } = res.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("username", uname);
            
            setUser({ token: access_token, username: uname });
            return true;
        } catch (err) {
            setError(err.response?.data?.detail || "Login gagal");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, error, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}