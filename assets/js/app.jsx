const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [appReady, setAppReady] = useState(false);
    const [gameState, setGameState] = useState('home'); // home, setup, pass, turnOrder, active, result
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    const [gameData, setGameData] = useState({
        players: [], imposterIndices: [], fakeWordPlayerIndices: [], secretWord: '', fakeWord: '', isFakeWordMode: false,
        imposterHintEnabled: false, imposterHint: '',
        duration: null, firstPlayer: '', category: '', speakCategory: false, turnOrder: []
    });
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const rogueRoleCountsRef = useRef(new Map());
    const lastRogueIdsRef = useRef(new Set());
    const usedWordsByCategoryRef = useRef(new Map());

    const audioManagerRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => {
        try { return JSON.parse(localStorage.getItem('imposter_isMuted_pt')) || false; } catch { return false; }
    });

    useEffect(() => {
        if (audioManagerRef.current) return;
        const manager = {
            sounds: {}, music: {}, isMuted: isMuted, isUnlocked: false, currentMusicTrack: null,
            unlockAudio: function() {
                if (this.isUnlocked) return;
                this.isUnlocked = true;
                const silentSound = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
                silentSound.play().catch(() => {});
            },
            initSound: function(name, url, options = {}) {
                try {
                    const audio = new Audio(url);
                    audio.loop = options.loop || false; audio.volume = options.volume || 1.0; audio.preload = 'auto';
                    if (options.isMusic) this.music[name] = audio;
                    else this.sounds[name] = audio;
                } catch (e) { console.error(`Failed to init sound: ${name}`, e); }
            },
            playSound: function(name, category = null) {
                if (!this.isUnlocked) return;
                let soundToPlay = (name === 'category' && category && this.sounds.categories && this.sounds.categories[category]) ? this.sounds.categories[category] : this.sounds[name];
                if (soundToPlay) { soundToPlay.currentTime = 0; soundToPlay.play().catch(() => {}); }
            },
            playMusic: function(name) {
                if (!this.isUnlocked || (this.currentMusicTrack === name && this.music[name] && !this.music[name].paused)) return;
                this.stopMusic();
                const track = this.music[name];
                if (track) { this.currentMusicTrack = name; track.muted = this.isMuted; track.play().catch(() => {}); }
            },
            stopMusic: function() {
                if (this.currentMusicTrack && this.music[this.currentMusicTrack]) {
                    const track = this.music[this.currentMusicTrack];
                    if (!track.paused) { track.pause(); track.currentTime = 0; }
                }
                this.currentMusicTrack = null;
            },
            stopSound: function(name) {
                if (!this.isUnlocked) return;
                const sound = this.sounds[name];
                if (sound && !sound.paused) { sound.pause(); sound.currentTime = 0; }
            },
            setMuted: function(muted) {
                this.isMuted = muted;
                Object.values(this.music).forEach(track => { track.muted = muted; });
            },
            pauseAllMusic: function() { if (this.currentMusicTrack && this.music[this.currentMusicTrack]) this.music[this.currentMusicTrack].pause(); },
            resumeAllMusic: function() { if (this.isUnlocked && this.currentMusicTrack && this.music[this.currentMusicTrack]) this.music[this.currentMusicTrack].play().catch(() => {}); },
            getSound: function(name) { return this.sounds[name]; }
        };
        
        const musicTracks = ['mainMenuMusic', 'categorySelectionMusic', 'timerMusic'];
        Object.entries(AUDIO_URLS).forEach(([key, value]) => {
            if (typeof value === 'string') {
                const isMusic = musicTracks.includes(key);
                let options = { isMusic, loop: isMusic };
                if (key === 'categorySelectionMusic') options.volume = 0.7;
                if (key === 'timerMusic') options.volume = 0.5;
                if (key === 'turnOrderReveal') options.volume = 0.6;
                manager.initSound(key, value, options);
            }
        });
        audioManagerRef.current = manager;
    }, []);
    
    useEffect(() => { if (audioManagerRef.current) audioManagerRef.current.setMuted(isMuted); }, [isMuted]);

    const handleMuteToggle = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        localStorage.setItem('imposter_isMuted_pt', JSON.stringify(newMutedState));
    };

    useEffect(() => {
        if (isLoading || !audioManagerRef.current || !audioManagerRef.current.isUnlocked) return;
        let targetMusic = null;
        if (gameState === 'home') targetMusic = 'mainMenuMusic';
        else if (gameState === 'setup') targetMusic = 'categorySelectionMusic';
        else if (gameState === 'active') targetMusic = 'timerMusic';

        if (targetMusic) audioManagerRef.current.playMusic(targetMusic);
        else audioManagerRef.current.stopMusic();
    }, [isLoading, gameState, audioManagerRef.current?.isUnlocked]);

    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const selectWeightedRogue = (candidates) => {
        const minRoleCount = Math.min(...candidates.map(player =>
            rogueRoleCountsRef.current.get(player.roundPlayerId) || 0
        ));
        const weightedCandidates = candidates.map(player => ({
            player,
            weight: Math.pow(
                0.8,
                (rogueRoleCountsRef.current.get(player.roundPlayerId) || 0) - minRoleCount
            )
        }));
        const totalWeight = weightedCandidates.reduce((sum, candidate) => sum + candidate.weight, 0);
        let randomWeight = Math.random() * totalWeight;

        for (const candidate of weightedCandidates) {
            randomWeight -= candidate.weight;
            if (randomWeight < 0) return candidate.player;
        }

        return weightedCandidates[weightedCandidates.length - 1].player;
    };

    const startLocalGame = (players, selectedCategories, duration, isRandomMode, speakCategory, enableTwoImposters, isFakeWordMode, imposterHintEnabled = false, keepRoleHistory = false) => {
        const playersWithRoleIds = players.map((player, index) => ({
            ...player,
            roundPlayerId: keepRoleHistory && player.roundPlayerId
                ? player.roundPlayerId
                : `round_player_${Date.now()}_${Math.random().toString(36).slice(2)}_${index}`
        }));

        if (!keepRoleHistory) {
            rogueRoleCountsRef.current = new Map(playersWithRoleIds.map(player => [player.roundPlayerId, 0]));
            lastRogueIdsRef.current = new Set();
            usedWordsByCategoryRef.current = new Map();
        } else {
            rogueRoleCountsRef.current = new Map(playersWithRoleIds.map(player => [
                player.roundPlayerId,
                rogueRoleCountsRef.current.get(player.roundPlayerId) || 0
            ]));
        }

        const shuffledPlayers = shuffleArray(playersWithRoleIds);
        const useRandom = isRandomMode || (selectedCategories && selectedCategories.length === 0);
        const validCategories = DISPLAY_CATEGORIES;
        
        let finalCategory = useRandom ? validCategories[Math.floor(Math.random() * validCategories.length)] : selectedCategories[0];
        if (!WORD_BANK[finalCategory]) finalCategory = 'Filmes';
        
        const words = WORD_BANK[finalCategory];
        const wordsNeeded = isFakeWordMode ? 2 : 1;
        let usedWords = usedWordsByCategoryRef.current.get(finalCategory) || [];
        let availableWords = words.filter(word => !usedWords.includes(word));

        if (availableWords.length < wordsNeeded) {
            const previousRoundWords = new Set(usedWords.slice(-wordsNeeded));
            usedWords = [];
            availableWords = words.filter(word => !previousRoundWords.has(word));
            if (availableWords.length < wordsNeeded) availableWords = [...words];
        }

        const takeRandomWord = () => availableWords.splice(
            Math.floor(Math.random() * availableWords.length),
            1
        )[0];
        const secretWord = takeRandomWord();
        const fakeWord = isFakeWordMode ? takeRandomWord() : '';
        usedWordsByCategoryRef.current.set(finalCategory, [
            ...usedWords,
            secretWord,
            ...(fakeWord ? [fakeWord] : [])
        ]);
        const imposterHint = imposterHintEnabled && !isFakeWordMode
            ? `Categoria: ${finalCategory}.`
            : '';
        const numRoguePlayers = enableTwoImposters && shuffledPlayers.length >= 10 ? 2 : 1;
        
        const selectedRogueIds = new Set();
        const playersNotImpostorLastRound = shuffledPlayers.filter(player =>
            !lastRogueIdsRef.current.has(player.roundPlayerId)
        );
        let roleCandidates = playersNotImpostorLastRound.length >= numRoguePlayers
            ? playersNotImpostorLastRound
            : shuffledPlayers;

        while (selectedRogueIds.size < numRoguePlayers) {
            const selectedPlayer = selectWeightedRogue(roleCandidates);
            selectedRogueIds.add(selectedPlayer.roundPlayerId);
            roleCandidates = roleCandidates.filter(player =>
                player.roundPlayerId !== selectedPlayer.roundPlayerId
            );
        }

        selectedRogueIds.forEach(playerId => {
            rogueRoleCountsRef.current.set(playerId, rogueRoleCountsRef.current.get(playerId) + 1);
        });
        lastRogueIdsRef.current = new Set(selectedRogueIds);
        const roguePlayerIndices = shuffledPlayers.reduce((indices, player, index) => {
            if (selectedRogueIds.has(player.roundPlayerId)) indices.push(index);
            return indices;
        }, []);

        setGameData({ 
            players: shuffledPlayers, imposterIndices: isFakeWordMode ? [] : roguePlayerIndices, fakeWordPlayerIndices: isFakeWordMode ? roguePlayerIndices : [],
            secretWord, fakeWord, isFakeWordMode, imposterHintEnabled: Boolean(imposterHint), imposterHint, duration, firstPlayer: shuffledPlayers[0].name, category: finalCategory, speakCategory,
            turnOrder: shuffledPlayers.map((p, i) => ({ name: p.name, id: `local_${i}` }))
        });
        setCurrentPlayerIndex(0);
        setGameState('pass');
    };

    const handleNextPlayer = () => {
        if (currentPlayerIndex < gameData.players.length - 1) setCurrentPlayerIndex(prev => prev + 1);
        else setGameState('turnOrder');
    };

    const handleStartActiveGame = () => {
        audioManagerRef.current.playSound('uiClick');
        setGameData(prev => ({ ...prev, missionStartTime: new Date() }));
        setGameState('active');
    };

    const handleEndGame = () => setGameState('result');
    
    const handleRestart = () => {
        audioManagerRef.current.playSound('playAgain');
        
        // Resgata se o modo aleatório estava ativo
        const isRandomMode = JSON.parse(localStorage.getItem('imposter_random_mode_pt')) || false;
        const enableTwoImposters = gameData.imposterIndices.length > 1 || gameData.fakeWordPlayerIndices.length > 1;

        // Inicia a partida imediatamente pulando a tela de setup
        startLocalGame(
            gameData.players, 
            [gameData.category], 
            gameData.duration, 
            isRandomMode, 
            gameData.speakCategory, 
            enableTwoImposters, 
            gameData.isFakeWordMode,
            gameData.imposterHintEnabled,
            true
        );
    };

    const handleBackToSetup = () => {
        if (audioManagerRef.current.isUnlocked) audioManagerRef.current.playSound('uiClick');
        setGameState('setup');
    };

    const handleBackToHome = () => {
        if (audioManagerRef.current.isUnlocked) audioManagerRef.current.playSound('uiClick');
        setGameState('home');
    };

    const handleStart = () => {
        if (audioManagerRef.current) { audioManagerRef.current.unlockAudio(); audioManagerRef.current.playSound('uiClick'); }
        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) return <LoadingScreen onStart={handleStart} onFinishedLoading={() => setAppReady(true)} />;
        if (gameState === 'home') return <HomeScreen onStartLocal={() => setGameState('setup')} onShowHowToPlay={() => setShowHowToPlay(true)} audioManager={audioManagerRef.current} onMuteToggle={handleMuteToggle} isMuted={isMuted} />;
        if (gameState === 'setup') return <SetupScreen onStartGame={startLocalGame} audioManager={audioManagerRef.current} onBack={handleBackToHome} />;
        if (gameState === 'pass') {
            const isFakeWordPlayer = gameData.isFakeWordMode && gameData.fakeWordPlayerIndices.includes(currentPlayerIndex);
            const isImposter = !gameData.isFakeWordMode && gameData.imposterIndices.includes(currentPlayerIndex);
            const wordToShow = isImposter ? "IMPOSTER" : (isFakeWordPlayer ? gameData.fakeWord : gameData.secretWord);
            const hintForPlayer = isImposter ? gameData.imposterHint : '';
            return <CardRevealScreen key={currentPlayerIndex} player={gameData.players[currentPlayerIndex]} word={wordToShow} hint={hintForPlayer} onNext={handleNextPlayer} isLastPlayer={currentPlayerIndex === gameData.players.length - 1} audioManager={audioManagerRef.current} />;
        }
        if (gameState === 'turnOrder') return <TurnOrderScreen players={gameData.turnOrder} onStartMission={handleStartActiveGame} audioManager={audioManagerRef.current} />;
        if (gameState === 'active') return <GameTimerScreen lobbyData={gameData} onEndGame={handleEndGame} firstPlayer={gameData.firstPlayer} audioManager={audioManagerRef.current} />;
        if (gameState === 'result') return <ResultScreen lobbyData={gameData} onRestart={handleRestart} onBackToHome={handleBackToSetup} audioManager={audioManagerRef.current} />;
    };
    
    return (
        <div className="w-full h-full text-slate-200 font-sans selection:bg-brand-500/30">
            <div className="fixed inset-0 bg-[#020617] -z-10"></div>
            {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
            {renderContent()}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
