const HomeScreen = ({ onStartLocal, onShowHowToPlay, audioManager, onMuteToggle, isMuted }) => {
    return (
        <div className="h-[100dvh] flex flex-col items-center justify-center p-6 bg-slate-950 text-center relative overflow-hidden animate-fadeIn">
            <div className="absolute top-6 right-6 z-20">
                 <button onClick={onMuteToggle} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-white/50 hover:bg-white/10 active:scale-90 transition-transform">
                    <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                </button>
            </div>
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto">
                 <div className="mb-10 text-center">
                    <Title />
                    <div className="subtle-shine-container inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase">Não Confie em Ninguém</span>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4 mt-8">
                    <button
                        onClick={() => { onStartLocal(); audioManager.playSound('uiClick'); }}
                        className="w-full bg-white text-slate-950 font-display font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <i className="fa-solid fa-play text-brand-500"></i> JOGAR AGORA
                    </button>
                </div>

                <button
                    onClick={() => { onShowHowToPlay(); audioManager.playSound('uiClick'); }}
                    className="mt-8 text-white/40 font-bold hover:text-white transition-colors flex items-center gap-2"
                >
                    <i className="fa-solid fa-question-circle"></i> Como Jogar
                </button>
            </div>
        </div>
    );
};
