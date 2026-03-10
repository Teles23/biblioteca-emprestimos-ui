import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            {isSidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
                  onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div className="flex-1 flex flex-col min-h-screen">
                <Header onToggleSidebar={() => setIsSidebarOpen(true)} />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
