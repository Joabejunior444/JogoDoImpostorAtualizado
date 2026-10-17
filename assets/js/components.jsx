const Title = () => {
    return <h1 className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 mb-2 drop-shadow-lg tracking-tight">IMPOSTOR</h1>;
};

const PlayerAvatar = ({ name, className = "" }) => {
    if (!name) return null;
    const avatarUrl = `https://api.dicebear.com/9.x/croodles-neutral/svg?seed=${encodeURIComponent(name)}`;
    const monochromeFilter = { filter: 'invert(1)' };

    return (
        <img src={avatarUrl} alt={`${name}'s avatar`} className={`flex-shrink-0 ${className}`} style={monochromeFilter} draggable="false" onError={(e) => { e.target.style.display = 'none'; }} />
    );
};

// Modal "Como Jogar" Traduzido
const HowToPlayModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-lg h-[80vh] glass-panel rounded-3xl border border-white/10 shadow-2xl animate-slide-up flex flex-col">
                <div className="flex-shrink-0 p-6 flex items-center justify-between border-b border-white/10">
                    <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                        <i className="fa-solid fa-book-open text-brand-400"></i>
                        Como Jogar
                    </h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/50 hover:bg-white/10 active:scale-90 transition">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h3 className="font-bold text-lg text-brand-400 mb-2">Objetivo Principal</h3>
                        <p>Uma batalha de inteligência e decepção. Os <span className="text-teal-400 font-semibold">Agentes</span> devem identificar o <span className="text-red-400 font-semibold">Impostor</span>. No modo "Palavra Falsa", devem encontrar quem recebeu uma palavra diferente.</p>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-brand-400 mb-2">A Configuração</h3>
                        <p>Cada jogador recebe um papel secreto. Os <span className="text-teal-400 font-semibold">Agentes</span> recebem a mesma palavra secreta.</p>
                        <div className="mt-3 space-y-2 text-sm pl-4">
                            <p>• <strong>Modo Clássico:</strong> O <span className="text-red-400 font-semibold">Impostor</span> não recebe nenhuma palavra e deve deduzi-la pelas dicas.</p>
                            <p>• <strong>Modo Palavra Falsa:</strong> Um jogador recebe uma <span className="text-yellow-400 font-semibold">palavra diferente</span> da mesma categoria e não sabe que é a palavra falsa!</p>
                        </div>
                    </section>
                    
                    <section>
                        <h3 className="font-bold text-lg text-brand-400 mb-2">A Jogabilidade</h3>
                        <p>Os jogadores se revezam falando sobre a palavra secreta sem dizê-la diretamente. O objetivo é provar que você sabe a palavra enquanto tenta descobrir quem não sabe.</p>
                        <div className="mt-3 space-y-2">
                            <p>• <strong>Afirme um Fato:</strong> Cada um diz uma característica da palavra.</p>
                            <p>• <strong>Faça uma Pergunta:</strong> Os jogadores fazem perguntas ao próximo jogador na ordem do turno.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-brand-400 mb-2">A Votação Final</h3>
                        <p>Após a discussão, todos votam.
                        <br/> • Se o Impostor for identificado corretamente, os <span className="text-teal-400 font-semibold">Agentes vencem</span>.
                        <br/> • Se um Agente for votado ou houver empate, o <span className="text-red-400 font-semibold">Impostor vence!</span></p>
                    </section>
                </div>
            </div>
        </div>
    );
};
const FaIcon = ({ name, sizeClass = "text-xl", className = "" }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        if (Array.isArray(name) && name.length > 1) {
            const interval = setInterval(() => setCurrentImageIndex(prev => (prev + 1) % name.length), 5000);
            return () => clearInterval(interval);
        }
    }, [name]);

    if (Array.isArray(name)) {
        return (
            <div className={`relative w-8 h-8 inline-block ${className}`}>
                {name.map((url, index) => (
                     <img key={url} src={url} alt="icon" draggable="false" className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} />
                ))}
            </div>
        );
    }
    if (name.startsWith('http')) {
        return <img src={name} alt="icon" draggable="false" className={`w-8 h-8 object-contain ${className}`} />;
    }
    return <i className={`fa-solid ${name} ${sizeClass} ${className}`}></i>;
};

const CategoryInfoModal = ({ category, onClose }) => {
    if (!category) return null;
    const categoryWords = WORD_BANK[category];
    const examples = categoryWords.slice(0, 8).join(", ");
    const remainingCount = categoryWords.length - 8;
    const icon = CATEGORY_ICONS[category];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fadeIn">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl animate-slide-up transform transition-all">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-white/50 hover:bg-white/10">
                    <i className="fa-solid fa-xmark"></i>
                </button>
                
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-brand-500/20 ring-1 ring-white/10`}>
                        <FaIcon name={icon} sizeClass="text-3xl" className={`text-brand-400 w-11 h-11`} />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">{category}</h2>
                    <p className="text-white/40 text-xs font-bold tracking-widest uppercase mt-1">Info da Categoria</p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <h3 className="text-white/70 text-sm font-semibold mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-list-ul text-brand-400 text-xs"></i> Exemplos
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                        {examples}{remainingCount > 0 ? `, e mais ${Math.floor(remainingCount / 10) * 10}+` : ''}
                    </p>
                </div>
                
                <div className="mt-6 text-center text-white/30 text-xs">Toque em qualquer lugar para fechar</div>
            </div>
        </div>
    );
};
const TurnOrderReviewModal = ({ players, onClose }) => {
    if (!players || players.length === 0) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fadeIn">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl animate-slide-up flex flex-col max-h-[80vh]">
                <h2 className="flex-shrink-0 text-xl font-display font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                    <i className="fa-solid fa-list-ol text-brand-400"></i> Ordem dos Turnos
                </h2>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                    {players.map((player, index) => (
                        <div key={player.id || index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-sky-900/50 text-sky-400 font-mono font-bold text-sm rounded-md border border-sky-400/20">{index + 1}</div>
                            <PlayerAvatar name={player.name} className="w-6 h-6 rounded-full" />
                            <div className="font-semibold text-white/90 truncate">{player.name}</div>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="flex-shrink-0 w-full mt-6 bg-white/10 hover:bg-white/20 text-white/80 py-3 rounded-xl font-display font-bold text-base active:scale-95 transition-all">
                    FECHAR
                </button>
            </div>
        </div>
    );
};
