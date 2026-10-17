const TurnOrderScreen = ({ players, onStartMission, audioManager }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (audioManager) audioManager.playSound('turnOrderReveal');
        return () => { if (audioManager) audioManager.stopSound('turnOrderReveal'); };
    }, [audioManager]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onStartMission();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onStartMission]);
    
    return (
        <div className="h-[100dvh] flex flex-col items-center p-6 text-center relative overflow-hidden animate-fadeIn">
             <div className="absolute inset-0 pointer-events-none">
                 <div className="blob bg-teal-600/30 top-[-20%] left-[-20%] w-[60%] h-[60%]"></div>
                 <div className="blob bg-sky-600/30 bottom-[-20%] right-[-20%] w-[60%] h-[60%] animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-sm pt-12">
                <h1 className="text-4xl font-display font-bold text-white mb-4">Ordem dos Turnos</h1>
                <p className="text-white/60 mb-8 max-w-xs mx-auto">A missão seguirá na seguinte sequência aleatória.</p>
            </div>
            
            <div className="flex-1 w-full max-w-sm my-4 flex flex-col min-h-0">
                <div className="w-full glass-panel rounded-2xl p-6 overflow-y-auto no-scrollbar">
                    <div className="space-y-4">
                        {players.map((player, index) => (
                            <div key={index} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-900/50 text-sky-400 font-mono font-bold text-sm rounded-lg border border-sky-400/20">{index + 1}</div>
                                <PlayerAvatar name={player.name} className="w-6 h-6 rounded-full" />
                                <div className="text-left font-display font-semibold text-lg text-white/90 truncate">{player.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm pb-8">
                <div className="w-full bg-white text-slate-950 font-display font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center justify-center gap-3">
                    {countdown > 0 ? (
                        <span className="font-mono text-2xl tracking-widest">{countdown}</span>
                    ) : (
                        <><i className="fa-solid fa-rocket text-sky-500"></i> COMEÇAR MISSÃO</>
                    )}
                </div>
            </div>
        </div>
    );
};
