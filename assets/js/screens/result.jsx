const ResultScreen = ({ lobbyData, onRestart, onBackToHome, audioManager }) => {
    const { imposterIndices, fakeWordPlayerIndices, secretWord, fakeWord, players, isFakeWordMode } = lobbyData;
    
    const roguePlayerIndices = isFakeWordMode ? fakeWordPlayerIndices : imposterIndices;
    const roguePlayers = roguePlayerIndices.map(i => players[i]);
    const roguePlayerNames = roguePlayers.map(p => p?.name || "Desconhecido").join(' & ');
    const title = isFakeWordMode ? `O Jogador com a Palavra Falsa Era...` : (roguePlayers.length > 1 ? `Os Impostores Eram...` : `O Impostor Era...`);

    const soundPlayedRef = useRef(false);

    useEffect(() => {
        if (soundPlayedRef.current) return;
        const soundToPlay = audioManager.getSound('imposterWin');
        if (soundToPlay) {
            soundPlayedRef.current = true;
            soundToPlay.currentTime = 0;
            soundToPlay.play().catch(e => console.error(e));
        }
        return () => { if (soundToPlay) { soundToPlay.pause(); soundToPlay.currentTime = 0; } };
    }, [audioManager]);

    return (
        <div className="h-[100dvh] flex flex-col items-center p-6 text-center overflow-y-auto no-scrollbar">
            <div className="absolute inset-0 pointer-events-none">
                <div className={`blob bg-red-600/20 top-0 left-0 w-full h-full`}></div>
            </div>
            
            <div className="relative my-8 animate-float w-full max-w-sm z-10">
                <div className={`absolute inset-0 bg-red-500 rounded-[2.5rem] blur-[50px] opacity-20`}></div>
                <div className={`relative glass-panel p-10 rounded-[2.5rem] border border-red-500/30`}>
                    <div className="w-28 h-28 bg-gradient-to-br from-red-500/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)] overflow-hidden">
                        <img src="https://em-content.zobj.net/source/microsoft-teams/337/ninja_medium-light-skin-tone_1f977-1f3fc_1f3fc.png" alt="Ninja" className="w-30 h-30 drop-shadow-lg relative top-3" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">{title}</h2>
                    <p className="text-4xl font-black text-red-400 tracking-tight drop-shadow-sm">{roguePlayerNames}</p>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] w-full max-w-sm mb-8 border border-white/5 z-10">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-3">{isFakeWordMode ? 'A Palavra Real' : 'A Palavra Secreta'}</p>
                <p className="text-3xl font-display font-bold text-teal-400 tracking-wide">{secretWord}</p>
                 {isFakeWordMode && fakeWord && (
                    <>
                        <div className="h-px bg-white/10 my-4"></div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-3">A Palavra Falsa</p>
                        <p className="text-3xl font-display font-bold text-yellow-400 tracking-wide">{fakeWord}</p>
                    </>
                 )}
            </div>
            
            <div className="w-full max-w-sm z-10 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)] mb-8">
                <button 
                    onClick={() => { if(navigator.vibrate) navigator.vibrate(20); onRestart(); }}
                    className="w-full bg-white text-slate-950 py-5 rounded-[1.5rem] font-display font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-rotate-right text-lg"></i> JOGAR NOVAMENTE
                </button>
                <button 
                    onClick={onBackToHome}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/70 py-4 rounded-[1.5rem] font-display font-bold text-base active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-gear text-sm"></i> ALTERAR CONFIGURAÇÕES
                </button>
            </div>
        </div>
    );
};
