interface HeaderProps {
    title?: string;
    breadcrumb?: string;
}

export function Header({ title, breadcrumb }: HeaderProps) {
    return (
        <header className="fixed top-0 left-sidebar right-0 h-header bg-surface border-b border-border flex items-center px-6 gap-4 z-50 shadow-sm">
            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                <span>📚 LibraManager</span>
                <span>›</span>
                <strong className="text-text-primary font-bold">
                    {breadcrumb || title || 'Dashboard'}
                </strong>
            </div>

            <div className="ml-auto flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-sm py-1.5 px-3 text-[13px] text-text-secondary cursor-text transition-all hover:border-accent min-w-[200px]">
                    <span>🔍</span>
                    <span>Buscar...</span>
                </div>

                <button
                    className="relative w-9 h-9 rounded-sm border border-border flex items-center justify-center text-[15px] text-text-secondary transition-all hover:bg-surface-2 hover:text-text-primary"
                    title="Notificações"
                >
                    🔔
                    <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-danger rounded-full border-2 border-surface" />
                </button>
            </div>
        </header>
    );
}
