import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobDataProvider } from "@/context/JobDataContext";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

export function Root({ user, onLogout }) {
    return (
        <JobDataProvider>
            <ScrollToTop />
            <Header user={user} onLogout={onLogout} />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />
        </JobDataProvider>
    );
}
