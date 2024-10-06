'use client'

import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Logout = () => {
    const {user, logout} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        logout().then(() => router.push("/"));
    }, []);

    if (!user) {
        router.push("/");
    }

    return (
        <div>Logging out...</div>
    );
};

export default Logout;