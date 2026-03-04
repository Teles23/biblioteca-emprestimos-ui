import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
    title?: string;
    breadcrumb?: string;
}

export function AppLayout({ title, breadcrumb }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
                <Header title={title} breadcrumb={breadcrumb} />
                <main className="ml-sidebar mt-header p-7 min-h-[calc(100vh-var(--header-height))] bg-surface-2">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
