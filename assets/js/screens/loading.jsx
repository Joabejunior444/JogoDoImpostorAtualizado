const TIPS = [
    "O Impostor não sabe a palavra secreta. Faça perguntas que possam expô-lo!",
    "Preste atenção à hesitação. O Impostor pode precisar de tempo extra para inventar uma mentira.",
    "Tente fazer uma pergunta que apenas um verdadeiro agente saberia a resposta.",
    "Pressione e segure uma categoria durante a configuração para ver exemplos de palavras.",
    "O primeiro jogador na ordem de turnos faz a primeira pergunta.",
    "Agentes inocentes devem tentar provar que sabem a palavra sem revelá-la.",
    "O Modo Mistério escolhe uma categoria de todo o banco de palavras para um desafio extra.",
    "O objetivo do Impostor é sobreviver à rodada sem ser identificado.",
    "Como agente, seja específico o suficiente para provar inocência, mas vago o suficiente para não revelar a palavra ao Impostor.",
    "Ouça como os outros respondem. Alguém está sendo muito genérico ou mudando a história?",
    "Se você é o Impostor, tente fazer os outros falarem primeiro para copiar a vibe deles.",
    "Silêncio é suspeito! Tenha uma resposta pronta antes do seu turno.",
    "Se o grupo estiver confuso, o Impostor geralmente vence. Mantenha suas perguntas claras.",
    "No modo Palavra Falsa, um jogador tem uma palavra diferente da mesma categoria. Ele acha que a dele é a real!",
    "Dica para Palavra Falsa: Se alguém der uma dica que está confiantemente errada, pode ter a palavra falsa."
];

const LoadingScreen = ({ onStart, onFinishedLoading }) => {
    const [currentTipIndex, setCurrentTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
    const [isReady, setIsReady] = useState(false);
    const [targetProgress, setTargetProgress] = useState(0);
    const [visualProgress, setVisualProgress] = useState(0);
    const stutterTimeoutRef = useRef(null);

    useEffect(() => {
        const tipInterval = setInterval(() => {
            setCurrentTipIndex(prev => {
                let newIndex;
                do { newIndex = Math.floor(Math.random() * TIPS.length); } while (newIndex === prev && TIPS.length > 1);
                return newIndex;
            });
        }, 5000);
        return () => clearInterval(tipInterval);
    }, []);

    useEffect(() => {
        // Fake loading for simplicity without all the heavy assets
        let progress = 0;
        const interval = setInterval(() => {
            progress += 15;
            setTargetProgress(Math.min(progress, 100));
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    onFinishedLoading();
                    setIsReady(true);
                }, 500);
            }
        }, 300);
        return () => clearInterval(interval);
    }, [onFinishedLoading]);

    useEffect(() => {
        if (visualProgress < targetProgress) {
            if (stutterTimeoutRef.current) clearTimeout(stutterTimeoutRef.current);
            stutterTimeoutRef.current = setTimeout(() => {
                setVisualProgress(targetProgress);
            }, Math.random() * 250 + 50);
        }
        return () => clearTimeout(stutterTimeoutRef.current);
    }, [targetProgress]);

    return (
        <div className="h-[100dvh] flex flex-col items-center justify-center p-8 bg-slate-950 text-center relative overflow-hidden animate-fadeIn">
            <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                <div className="w-28 h-28 mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-brand-500/20 rounded-full animate-pulse-slow blur-xl"></div>
                    <img src="https://em-content.zobj.net/source/microsoft-teams/400/disguised-face_1f978.png" alt="Loading" className="w-24 h-24 animate-float" />
                </div>
                
                <Title />
                <p className="text-white/50 font-semibold text-lg mb-12">Encontre o espião antes do tempo acabar.</p>

                <div className="w-full h-24 flex flex-col items-center justify-center">
                    {isReady ? (
                        <button onClick={onStart} className="w-full max-w-xs bg-white text-slate-950 font-display font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 animate-slide-up">
                            <i className="fa-solid fa-play text-sm"></i> ENTRAR
                        </button>
                    ) : (
                        <div className="w-full max-w-xs animate-fadeIn">
                            <div className="w-full bg-slate-800/50 rounded-full h-2.5 mb-4 border border-white/5 overflow-hidden">
                                <div className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${visualProgress}%` }}></div>
                            </div>
                            <p key={currentTipIndex} className="text-white/60 font-medium text-sm animate-fadeIn h-10">
                                <i className="fa-solid fa-lightbulb text-brand-400 mr-2"></i> {TIPS[currentTipIndex]}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
