const SetupScreen = ({ onStartGame, audioManager, onBack }) => {
    const DEFAULT_PLAYERS = [{ name: 'Jogador 1', audioData: null }, { name: 'Jogador 2', audioData: null }, { name: 'Jogador 3', audioData: null }];
    const MIN_PLAYERS = 3;

    const [players, setPlayers] = useState(() => {
        try {
            const saved = localStorage.getItem('imposter_players_pt');
            if (saved) {
                let parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            return DEFAULT_PLAYERS;
        } catch { return DEFAULT_PLAYERS; }
    });

    const [selectedCategory, setSelectedCategory] = useState(() => {
        try {
            const savedCategory = JSON.parse(localStorage.getItem('imposter_category_pt'));
            return WORD_BANK[savedCategory] ? savedCategory : 'Filmes';
        } catch { return 'Filmes'; }
    });

    const [isRandomMode, setIsRandomMode] = useState(() => {
        try { return JSON.parse(localStorage.getItem('imposter_random_mode_pt')) || false; } catch { return false; }
    });
    
    const [speakCategory, setSpeakCategory] = useState(() => {
        try { return JSON.parse(localStorage.getItem('imposter_speak_category_pt')) || false; } catch { return false; }
    });

    const [isFakeWordMode, setIsFakeWordMode] = useState(() => {
        try { return JSON.parse(localStorage.getItem('imposter_fake_word_mode_pt')) || false; } catch { return false; }
    });

    const [imposterHintEnabled, setImposterHintEnabled] = useState(() => {
        try { return JSON.parse(localStorage.getItem('imposter_hint_mode_pt')) || false; } catch { return false; }
    });

    const [newPlayerName, setNewPlayerName] = useState('');
    const [timerMinutes, setTimerMinutes] = useState(3);
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [inspectedCategory, setInspectedCategory] = useState(null);
    const [enableTwoImposters, setEnableTwoImposters] = useState(false);
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudioData, setRecordedAudioData] = useState(null);
    const [showMicTooltip, setShowMicTooltip] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const micTooltipTimer = useRef(null);

    const categoryLongPressTimerRef = useRef(null);
    const playerPressTimerRef = useRef(null);
    
    useEffect(() => { localStorage.setItem('imposter_players_pt', JSON.stringify(players)); }, [players]);
    useEffect(() => { localStorage.setItem('imposter_category_pt', JSON.stringify(selectedCategory)); }, [selectedCategory]);
    useEffect(() => { localStorage.setItem('imposter_random_mode_pt', JSON.stringify(isRandomMode)); }, [isRandomMode]);
    useEffect(() => { localStorage.setItem('imposter_speak_category_pt', JSON.stringify(speakCategory)); }, [speakCategory]);
    useEffect(() => { localStorage.setItem('imposter_fake_word_mode_pt', JSON.stringify(isFakeWordMode)); }, [isFakeWordMode]);
    useEffect(() => { localStorage.setItem('imposter_hint_mode_pt', JSON.stringify(imposterHintEnabled)); }, [imposterHintEnabled]);

    useEffect(() => { if (players.length < 10) setEnableTwoImposters(false); }, [players]);

    const handleMicClick = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioChunksRef.current = [];
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = event => audioChunksRef.current.push(event.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => setRecordedAudioData(reader.result);
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                setIsRecording(true);
                setRecordedAudioData(null);
            } catch (err) {
                alert("Acesso ao microfone negado.");
            }
        }
    };
    
    const addPlayer = () => {
        if (newPlayerName.trim()) {
            audioManager.playSound('uiClick');
            setPlayers([...players, { name: newPlayerName.trim(), audioData: recordedAudioData }]);
            setNewPlayerName('');
            setRecordedAudioData(null);
            if (navigator.vibrate) navigator.vibrate(10);
        }
    };

    const removePlayer = (index) => {
        if (players.length > MIN_PLAYERS) {
            audioManager.playSound('uiClick');
            setPlayers(players.filter((_, i) => i !== index));
            if (navigator.vibrate) navigator.vibrate(10);
        }
    };

    const handleCategorySelect = (cat) => {
        if (selectedCategory !== cat) audioManager.playSound('selectCategory');
        setSelectedCategory(cat);
        if (navigator.vibrate) navigator.vibrate(5);
    };
    
    const handleCategoryTouchStart = (cat) => {
        categoryLongPressTimerRef.current = setTimeout(() => {
            setInspectedCategory(cat);
            audioManager.playSound('openInfo');
            if (navigator.vibrate) navigator.vibrate(30);
        }, 600);
    };

    const handleCategoryTouchEnd = () => {
        if (categoryLongPressTimerRef.current) {
            clearTimeout(categoryLongPressTimerRef.current);
            categoryLongPressTimerRef.current = null;
        }
    };
    
    const handlePlayerPress = (player) => {
        if (player.audioData) {
            playerPressTimerRef.current = setTimeout(() => {
                const audio = new Audio(player.audioData);
                audio.play().catch(e => console.error(e));
                if (navigator.vibrate) navigator.vibrate(20);
            }, 300);
        }
    };

    const handlePlayerRelease = () => {
        if (playerPressTimerRef.current) clearTimeout(playerPressTimerRef.current);
    };

    const handleMicPress = () => micTooltipTimer.current = setTimeout(() => setShowMicTooltip(true), 500);
    const handleMicRelease = () => { clearTimeout(micTooltipTimer.current); setShowMicTooltip(false); };

    const handleStartClick = () => {
        if (players.length >= MIN_PLAYERS) {
            if (navigator.vibrate) navigator.vibrate(30);
            audioManager.playSound(isRandomMode ? 'startRandomMission' : 'startMission');
            onStartGame(players, isRandomMode ? [] : [selectedCategory], timerEnabled ? timerMinutes * 60 : null, isRandomMode, speakCategory, enableTwoImposters, isFakeWordMode, imposterHintEnabled && !isFakeWordMode);
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] relative z-10">
            <div className="absolute top-6 left-6 z-20">
                 <button onClick={onBack} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full text-white/50 hover:bg-white/10 active:scale-90 transition-transform">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
            </div>
            <CategoryInfoModal category={inspectedCategory} onClose={() => setInspectedCategory(null)} />

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                <div className="max-w-lg mx-auto p-6 pt-28">
                    <div className="mb-10 text-center">
                        <Title />
                        <div className="subtle-shine-container inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-white/60 text-[10px] font-bold tracking-[0.3em] uppercase">Jogo Local</span>
                        </div>
                    </div>

                    <section className="mb-6 glass-panel rounded-[2rem] p-6">
                        <h2 className="text-sm font-bold tracking-widest text-brand-400 mb-4 flex items-center gap-2 uppercase">
                            <i className="fa-solid fa-users"></i> Agentes
                            <span className="ml-auto text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/50">{players.length} / {MIN_PLAYERS}+</span>
                        </h2>
                        <div className="flex flex-col gap-3 mb-4">
                            <div className="flex items-center gap-3 bg-slate-950/50 rounded-xl border border-white/5 focus-within:border-brand-500/50 focus-within:bg-slate-950/80 transition-all pr-4">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                    placeholder="Digite o codinome..."
                                    className="flex-1 bg-transparent px-5 py-4 outline-none placeholder:text-white/20 font-medium text-sm text-white min-w-0"
                                />
                                {newPlayerName.trim() && <PlayerAvatar name={newPlayerName.trim()} className="w-8 h-8 rounded-full" />}
                            </div>
                            <div className="flex gap-3 relative">
                                <button 
                                    onClick={handleMicClick} onMouseDown={handleMicPress} onMouseUp={handleMicRelease} onMouseLeave={handleMicRelease} onTouchStart={handleMicPress} onTouchEnd={handleMicRelease}
                                    className={`flex-1 flex items-center justify-center rounded-xl font-bold transition-all shadow-lg active:scale-95 border border-white/10 h-14 ${isRecording ? 'bg-red-500 animate-pulse' : (recordedAudioData ? 'bg-green-500' : 'bg-white/10 hover:bg-white/20')}`}
                                >
                                    <i className={`fa-solid ${recordedAudioData && !isRecording ? 'fa-check' : 'fa-microphone'} text-white text-lg ${isRecording ? '' : 'opacity-70'}`}></i>
                                </button>
                                
                                {showMicTooltip && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-slate-800 text-white text-xs rounded-md px-3 py-2 shadow-lg animate-fadeIn z-20">
                                        Grave um áudio de "É sua vez!"
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={addPlayer}
                                    className="bg-brand-600 hover:bg-brand-500 flex-1 flex items-center justify-center rounded-xl font-bold transition shadow-lg shadow-brand-900/20 active:scale-95 border border-white/10 h-14"
                                >
                                    <i className="fa-solid fa-plus text-white text-lg"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {players.map((p, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-center gap-2 bg-white/5 border border-white/5 pl-2 pr-1.5 py-1.5 rounded-full animate-fadeIn group hover:bg-white/10 transition-colors cursor-pointer"
                                    onMouseDown={() => handlePlayerPress(p)} onMouseUp={handlePlayerRelease} onMouseLeave={handlePlayerRelease} onTouchStart={() => handlePlayerPress(p)} onTouchEnd={handlePlayerRelease}
                                >
                                    <PlayerAvatar name={p.name} className="w-5 h-5 rounded-full" />
                                    {p.audioData && <i className="fa-solid fa-microphone text-brand-400/50 text-xs"></i>}
                                    <span className="truncate max-w-28 text-xs font-bold text-slate-300 pr-1">{p.name}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removePlayer(i); }}
                                        disabled={players.length <= MIN_PLAYERS}
                                        className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] transition-colors 
                                            ${players.length > MIN_PLAYERS ? 'bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400' : 'opacity-20 cursor-not-allowed'}`}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-6 glass-panel rounded-[2rem] p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="pr-4">
                                <h3 className="font-bold text-white/90 text-base flex items-center gap-3">
                                    <i className="fa-solid fa-masks-theater text-yellow-400/80 w-5 text-center"></i>
                                    <span>Modo Palavra Falsa</span>
                                </h3>
                                <p className="text-white/40 text-xs mt-1 pl-8">Um agente recebe uma palavra diferente e não sabe.</p>
                            </div>
                            <button 
                                onClick={() => { setIsFakeWordMode(!isFakeWordMode); audioManager.playSound(!isFakeWordMode ? 'switchOn' : 'switchOff'); if(navigator.vibrate) navigator.vibrate(10); }}
                                className={`flex-shrink-0 w-12 h-7 rounded-full p-1 transition-all duration-300 ${isFakeWordMode ? 'bg-yellow-500/80' : 'bg-white/10'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isFakeWordMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        
                        <div className="h-px bg-white/10"></div>

                        <div className={`flex items-center justify-between transition-opacity duration-300 ${players.length < 10 ? 'opacity-50' : ''}`}>
                            <div className="pr-4">
                                <h3 className="font-bold text-white/90 text-base flex items-center gap-3">
                                    <i className="fa-solid fa-user-secret text-orange-400/80 w-5 text-center"></i>
                                    <span>{isFakeWordMode ? 'Segunda Palavra Falsa' : 'Segundo Impostor'}</span>
                                </h3>
                                <p className="text-white/40 text-xs mt-1 pl-8">Adiciona um segundo espião para 10+ jogadores.</p>
                            </div>
                            <button 
                                onClick={() => { if (players.length >= 10) { setEnableTwoImposters(!enableTwoImposters); audioManager.playSound(!enableTwoImposters ? 'switchOn' : 'switchOff'); if(navigator.vibrate) navigator.vibrate(10); } }}
                                disabled={players.length < 10}
                                className={`flex-shrink-0 w-12 h-7 rounded-full p-1 transition-all duration-300 ${enableTwoImposters ? 'bg-orange-500/80' : 'bg-white/10'} ${players.length < 10 ? 'cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enableTwoImposters ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="h-px bg-white/10"></div>

                        <div className={`flex items-center justify-between transition-opacity duration-300 ${isFakeWordMode ? 'opacity-45' : ''}`}>
                            <div className="pr-4">
                                <h3 className="font-bold text-white/90 text-base flex items-center gap-3">
                                    <i className="fa-solid fa-lightbulb text-sky-400/90 w-5 text-center"></i>
                                    <span>Dica para o impostor</span>
                                </h3>
                                <p className="text-white/40 text-xs mt-1 pl-8">
                                    {isFakeWordMode
                                        ? 'Disponível quando o modo Palavra Falsa estiver desligado.'
                                        : 'Revela apenas a categoria da palavra secreta.'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (!isFakeWordMode) {
                                        setImposterHintEnabled(!imposterHintEnabled);
                                        audioManager.playSound(!imposterHintEnabled ? 'switchOn' : 'switchOff');
                                        if (navigator.vibrate) navigator.vibrate(10);
                                    }
                                }}
                                disabled={isFakeWordMode}
                                aria-pressed={imposterHintEnabled && !isFakeWordMode}
                                className={`flex-shrink-0 w-12 h-7 rounded-full p-1 transition-all duration-300 ${imposterHintEnabled && !isFakeWordMode ? 'bg-sky-500/80' : 'bg-white/10'} ${isFakeWordMode ? 'cursor-not-allowed' : ''}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${imposterHintEnabled && !isFakeWordMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="h-px bg-white/10"></div>

                        <div className={`flex items-center justify-between transition-all duration-300`}>
                             <div className="pr-4">
                                <h3 className="font-bold text-white/90 text-base flex items-center gap-3">
                                    <i className="fa-solid fa-stopwatch text-sky-400/80 w-5 text-center"></i>
                                    <span>Temporizador</span>
                                </h3>
                                <p className="text-white/40 text-xs mt-1 pl-8">Define o limite de tempo. Desativado = sem tempo.</p>
                            </div>
                            <button 
                                onClick={() => { setTimerEnabled(!timerEnabled); audioManager.playSound(!timerEnabled ? 'switchOn' : 'switchOff'); if(navigator.vibrate) navigator.vibrate(10); }}
                                className={`flex-shrink-0 w-12 h-7 rounded-full p-1 transition-all duration-300 ${timerEnabled ? 'bg-sky-500/80' : 'bg-white/10'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${timerEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        <div className={`transition-all duration-300 overflow-hidden ${timerEnabled ? 'opacity-100 max-h-40 pt-4' : 'opacity-0 max-h-0'}`}>
                            <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-white/40 text-[10px] font-bold uppercase">Duração</span>
                                <span className="font-mono text-xl font-bold text-white">{timerMinutes} <span className="text-sm text-white/50">min</span></span>
                            </div>
                            <input
                                type="range" min="1" max="15" value={timerMinutes} onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                                className="w-full h-7 appearance-none cursor-pointer timer-slider bg-transparent"
                            />
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h2 className="text-sm font-bold tracking-widest text-teal-400 flex items-center gap-2 uppercase">
                                <i className="fa-solid fa-layer-group"></i> Missão
                            </h2>
                            <div className="flex bg-slate-950/50 p-1 rounded-lg border border-white/5">
                                <button 
                                    onClick={() => { if(isRandomMode) { audioManager.playSound('toggleMode'); setIsRandomMode(false); } }}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${!isRandomMode ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    Escolher
                                </button>
                                <button 
                                    onClick={() => { if(!isRandomMode) { audioManager.playSound('toggleMode'); setIsRandomMode(true); } }}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all ${isRandomMode ? 'bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
                                >
                                    Aleatório
                                </button>
                            </div>
                        </div>

                        {isRandomMode ? (
                            <div className="glass-panel rounded-[2rem] p-8 text-center animate-fadeIn border border-brand-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-fuchsia-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative z-10 py-8">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-500 to-fuchsia-600 rounded-3xl rotate-12 flex items-center justify-center shadow-lg shadow-brand-900/40 mb-6 group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-500">
                                        <i className="fa-solid fa-dice text-4xl text-white drop-shadow-md"></i>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-white mb-2">Modo Mistério</h3>
                                    <p className="text-white/50 text-sm max-w-[200px] mx-auto leading-relaxed">
                                        O sistema escolherá uma categoria aleatória para a sua missão.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fadeIn">
                                {DISPLAY_CATEGORIES.map(cat => {
                                    const iconSource = CATEGORY_ICONS[cat] || "fa-question";
                                    const isSelected = selectedCategory === cat;
                                    
                                    let cardClasses = `relative overflow-hidden flex flex-col items-center justify-center gap-3 p-4 rounded-[1.5rem] border transition-all duration-300 active:scale-95 group min-h-[110px] `;
                                    let checkmarkBg = 'bg-teal-500 text-slate-900';

                                    if (isSelected) {
                                        cardClasses += 'glass-panel bg-teal-500/10 border-teal-500/40 text-teal-100 shadow-[0_0_20px_rgba(20,184,166,0.1)]';
                                    } else {
                                        cardClasses += 'glass-panel-lighter border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10';
                                    }

                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategorySelect(cat)}
                                            onMouseDown={() => handleCategoryTouchStart(cat)}
                                            onMouseUp={handleCategoryTouchEnd}
                                            onMouseLeave={handleCategoryTouchEnd}
                                            onTouchStart={() => handleCategoryTouchStart(cat)}
                                            onTouchEnd={handleCategoryTouchEnd}
                                            onTouchMove={handleCategoryTouchEnd}
                                            className={cardClasses}
                                        >
                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                <FaIcon name={iconSource} sizeClass="text-2xl" className={`transition-all duration-300 ${isSelected ? "text-teal-400 scale-110" : "text-white/40 group-hover:text-white/70"}`} />
                                                <span className={`text-xs font-bold tracking-wide transition-colors`}>{cat}</span>
                                            </div>
                                            {isSelected && (
                                                <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm ${checkmarkBg}`}>
                                                    <i className="fa-solid fa-check"></i>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-50">
                <div className="max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
                    <button
                        onClick={handleStartClick}
                        disabled={players.length < MIN_PLAYERS}
                        className="w-full bg-white text-slate-950 font-display font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            <i className="fa-solid fa-play text-sm"></i> INICIAR MISSÃO
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
