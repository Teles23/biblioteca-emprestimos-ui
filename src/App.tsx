function App() {
    return (
        <div className="min-h-screen bg-surface-2 flex items-center justify-center p-4 font-sans">
            <div className="bg-surface p-8 rounded-lg shadow-lg border border-border max-w-md w-full text-center">
                <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center text-3xl mx-auto mb-6">
                    📚
                </div>
                <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
                    LibraManager
                </h1>
                <p className="text-text-secondary mb-8">
                    Sistema de Gerenciamento de Empréstimos de Livros.
                    <br />
                    <span className="text-accent font-medium">Clean Architecture + DDD Modular</span>
                </p>
                <div className="flex flex-col gap-3">
                    <div className="p-3 bg-surface-2 rounded-sm border border-border text-sm flex items-center justify-between">
                        <span className="text-text-secondary">Vite + React + TS</span>
                        <span className="text-success font-bold">● Pronto</span>
                    </div>
                    <div className="p-3 bg-surface-2 rounded-sm border border-border text-sm flex items-center justify-between">
                        <span className="text-text-secondary">Tailwind CSS v3</span>
                        <span className="text-success font-bold">● Pronto</span>
                    </div>
                    <div className="p-3 bg-surface-2 rounded-sm border border-border text-sm flex items-center justify-between">
                        <span className="text-text-secondary">Clean Architecture</span>
                        <span className="text-success font-bold">● Estruturado</span>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-top border-border">
                    <button className="btn-primary w-full justify-center">
                        Verificar Backend →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
