const GameTimerScreen = ({ lobbyData, onEndGame, firstPlayer, audioManager }) => {
    const [showTurnOrder, setShowTurnOrder] = useState(false);
    const { duration, missionStartTime, turnOrder } = lobbyData || {};
    const [timeLeft, setTimeLeft] = useState(duration || 0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (audioManager) audioManager.playMusic('timerMusic');
    }, [audioManager]);

    useEffect(() => {
        if (!duration || !missionStartTime) return;

        let timerExpired = false;
        const updateTimer = () => {
            const getStartTime = () => {
                if (missionStartTime instanceof Date) return missionStartTime.getTime();
                return Date.now();
            };
            const startTime = getStartTime();
            const elapsed = (Date.now() - startTime) / 1000;
            const newTimeLeft = Math.round(Math.max(0, duration - elapsed));
            
            setTimeLeft(newTimeLeft);

            if (newTimeLeft <= 0 && !timerExpired) {
                timerExpired = true;
                clearInterval(timerRef.current);
                audioManager.stopMusic(); 
                audioManager.playSound('alarm');
                if (navigator.vibrate) navigator.vibrate();
            }
        };

        if(timerRef.current) clearInterval(timerRef.current);
        updateTimer(); 
        timerRef.current = setInterval(updateTimer, 1000);

        return () => { clearInterval(timerRef.current); audioManager.stopSound('alarm'); };
    }, [duration, missionStartTime, audioManager]);

    const handleIdentifyImposter = () => {
        if(navigator.vibrate) navigator.vibrate(50);
        onEndGame();
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = duration ? timeLeft / duration : 0;
    const strokeDasharray = 2 * Math.PI * 120;
    const strokeDashoffset = strokeDasharray * (1 - progress);
    const isActive = duration && timeLeft > 0;

    return (
        <div className="h-[100dvh] flex flex-col items-center justify-between p-6 relative overflow-hidden">
            {showTurnOrder && <TurnOrderReviewModal players={turnOrder} onClose={() => setShowTurnOrder(false)} />}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 bg-red-600/10 transition-opacity duration-1000 ${timeLeft < 30 && isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                <div className="blob bg-brand-900/30 top-0 left-0 w-full h-full"></div>
            </div>

            <div className="w-full mt-8 glass-panel p-4 rounded-[1.5rem] flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-brand-500/20 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fa-solid fa-comments text-brand-300"></i>
                    </div>
                    <div className="min-w-0">
                        <p className="text-brand-300/70 text-[10px] uppercase font-bold tracking-widest mb-1">Primeiro a Perguntar</p>
                        <div className="flex items-center gap-3">
                            <PlayerAvatar name={firstPlayer} className="w-6 h-6 rounded-full"/>
                            <p className="text-white font-display font-bold text-xl tracking-wide truncate">{firstPlayer}</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => { setShowTurnOrder(true); audioManager.playSound('uiClick'); }}
                    className="w-12 h-12 flex-shrink-0 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors active:scale-90"
                >
                    <i className="fa-solid fa-list-ol"></i>
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center z-10 w-full relative">
                {duration ? (
                    <div className="relative transform scale-90 sm:scale-100 transition-transform">
                        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-1000 ${timeLeft < 30 ? 'bg-red-500/20' : 'bg-brand-500/10'}`}></div>
                        <div className="relative">
                            <svg className="w-72 h-72 transform -rotate-90">
                                <circle cx="144" cy="144" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                                <circle 
                                    cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    className={`${timeLeft < 30 ? 'text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'text-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]'} transition-all duration-1000 drop-shadow-xl`}
                                    strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-7xl font-mono font-bold tracking-tighter tabular-nums ${timeLeft < 30 && isActive ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                                <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em] mt-4 ml-1">
                                    {timeLeft === 0 ? "TEMPO ESGOTADO" : "RESTANTES"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 px-8 glass-panel rounded-[2.5rem] border border-white/5">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-white/10">
                            <i className="fa-solid fa-infinity text-white/50 text-4xl"></i>
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4 text-white">Modo Sem Tempo</h2>
                        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                            Analise o comportamento. Observe tiques nervosos. Leve o tempo que precisar.
                        </p>
                    </div>
                )}
            </div>

            <div className="w-full z-10 pb-[env(safe-area-inset-bottom)] mb-6">
                <button 
                    onClick={handleIdentifyImposter}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-display font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_55px_rgba(234,88,12,0.5)] transition-all duration-300 ease-out active:scale-[0.98] hover:scale-[1.01] flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-user-secret text-xl"></i>
                    {duration && timeLeft === 0 ? 'REVELAR IMPOSTOR' : 'IDENTIFICAR IMPOSTOR'}
                </button>
            </div>
        </div>
    );
};
