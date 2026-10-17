const CardRevealScreen = ({ player, word, hint = '', onNext, isLastPlayer, audioManager }) => {
    const [step, setStep] = useState('handover'); 
    const [isFlipped, setIsFlipped] = useState(false);
    
    useEffect(() => {
        if (step === 'handover' && player.audioData) {
            const audio = new Audio(player.audioData);
            audio.play().catch(e => console.error(e));
        }
    }, [player, step]);

    const handleReveal = () => {
        if (!isFlipped) {
            setIsFlipped(true);
            audioManager.playSound('uiClick');
            if (navigator.vibrate) navigator.vibrate();
        }
    };
    
    const handleAckAndNext = () => {
         audioManager.playSound('uiClick');
         if(navigator.vibrate) navigator.vibrate(20);
         onNext();
    };

    const renderHandover = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-slide-up relative z-10">
            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-10 relative">
                <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse-slow"></div>
                <div className="glass-panel w-full h-full rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                    <img src="https://em-content.zobj.net/source/microsoft-teams/363/detective_light-skin-tone_1f575-1f3fb_1f3fb.png" alt="Detective" draggable="false" className="w-35 h-35 relative top-3" />
                </div>
            </div>
            
            <h2 className="text-brand-400 text-xs font-bold uppercase tracking-[0.4em] mb-4">Informação Confidencial Para</h2>
            <h1 className="text-6xl font-display font-black text-white mb-16 drop-shadow-2xl">{player.name}</h1>
            
            <div className="w-full max-w-sm">
                <button 
                    onClick={() => {
                        audioManager.playSound('uiClick');
                        setStep('reveal');
                        if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    className="w-full glass-panel hover:bg-white/5 border border-white/10 text-white font-display font-bold text-lg py-5 rounded-[1.5rem] transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-fingerprint text-brand-400"></i> Verificar Identidade
                </button>
            </div>
        </div>
    );

    const renderFlipCard = () => (
        <div className="flex flex-col items-center justify-center h-full w-full p-6 relative">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-0"></div>

            <div className="relative w-full max-w-xs aspect-[3/4] perspective-1000 z-10 cursor-pointer" onClick={handleReveal}>
                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    <div className="absolute inset-0 backface-hidden">
                        <div className="w-full h-full bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                            <div className="w-24 h-24 flex items-center justify-center mb-8">
                                <img src="https://em-content.zobj.net/source/microsoft-teams/337/locked_1f512.png" alt="Locked" className="w-20 h-20" />
                            </div>
                            <h3 className="text-white font-display font-bold text-2xl mb-2">ULTRA SECRETO</h3>
                            <p className="text-white/40 font-medium text-sm text-center tracking-wide">Toque para descriptografar</p>
                            <div className="absolute bottom-10 flex gap-2 items-center text-white/20 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                <span>Toque para Abrir</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-0 rotate-y-180 backface-hidden">
                        <div className={`w-full h-full rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-2xl border ${
                             word === "IMPOSTER" ? 'bg-gradient-to-br from-red-950 to-slate-950 border-red-500/20' : 'bg-gradient-to-br from-teal-950 to-slate-950 border-teal-500/20'
                        }`}>
                            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
                                 <div className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine"></div>
                            </div>
                            <div className={`absolute top-[-50%] w-full h-full opacity-30 blur-[100px] z-0 ${word === 'IMPOSTER' ? 'bg-red-600' : 'bg-teal-500'}`}></div>

                            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                <p className={`text-[10px] uppercase tracking-[0.4em] font-bold mb-8 ${word === 'IMPOSTER' ? 'text-red-400' : 'text-teal-400'}`}>Sua Missão</p>
                                
                                {word === "IMPOSTER" ? (
                                    <>
                                        <div className="w-28 h-28 flex items-center justify-center mb-6">
                                            <img src="https://em-content.zobj.net/source/microsoft-teams/337/shushing-face_1f92b.png" alt="Shushing" className="w-24 h-24 drop-shadow-lg" />
                                        </div>
                                        <h2 className="text-4xl font-display font-black text-red-500 tracking-tight mb-4 drop-shadow-sm">IMPOSTOR</h2>
                                        <p className="text-red-200/60 text-xs font-medium leading-relaxed max-w-[200px]">Disfarce-se. Engane. Não deixe que saibam que você é o espião.</p>
                                        {hint && (
                                            <div className="mt-5 w-full max-w-[220px] rounded-xl border border-sky-300/20 bg-sky-400/10 px-4 py-3">
                                                <p className="text-sky-300 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">Dica secreta</p>
                                                <p className="text-sky-100 text-xs font-medium leading-relaxed">{hint}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-28 h-28 flex items-center justify-center mb-6">
                                            <img src="https://em-content.zobj.net/source/microsoft-teams/337/clipboard_1f4cb.png" alt="Clipboard" className="w-20 h-20 drop-shadow-lg" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-white mb-4 drop-shadow-sm">{word}</h2>
                                        <p className="text-teal-200/60 text-xs font-medium leading-relaxed max-w-[200px]">Memorize esta palavra. Ela prova sua inocência.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full max-w-sm mt-8 transition-all duration-700 transform ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleAckAndNext(); }}
                    className="w-full bg-white hover:bg-slate-200 text-slate-950 py-5 rounded-[1.5rem] font-display font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <i className="fa-solid fa-check-circle text-lg"></i>
                    {isLastPlayer ? "REVELAR ORDEM DOS TURNOS" : "PRÓXIMO JOGADOR"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-[100dvh] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                 <div className="blob bg-brand-600 top-[-10%] left-[-10%] w-[50%] h-[50%]"></div>
                 <div className="blob bg-cyan-600 bottom-[-10%] right-[-10%] w-[50%] h-[50%] animation-delay-2000"></div>
            </div>
            <div className="relative z-10 h-full">
                {step === 'handover' ? renderHandover() : renderFlipCard()}
            </div>
        </div>
    );
};
