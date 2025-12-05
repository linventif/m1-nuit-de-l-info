import { createSignal, onMount, onCleanup, For, Show } from 'solid-js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- CONFIGURATION ---
const PLAYER_SIZE = 20;
const BULLET_SPEED = 30;
const ENEMY_SPEED = 5;
const SPAWN_RATE = 300; //ms

function LaserGame() {
  // --- ETAT DU JEU ---
  const [gameState, setGameState] = createSignal('start'); // start, playing, gameover
  const [score, setScore] = createSignal(0);
  const [health, setHealth] = createSignal(100);
  
  // Table de score mockée (backend simulation)
  const [leaderboard, setLeaderboard] = createSignal([
    { name: "Neo", score: 1500 },
    { name: "Trinity", score: 1200 },
    { name: "Morpheus", score: 900 }
  ]);

  // --- ENTITÉS (Non-réactives pour la perf dans la boucle de jeu, sauf rendu final) ---
  // On utilise des Refs ou des variables locales pour la physique 60FPS
  // et on synchronise avec des Signals uniquement pour le rendu si besoin, 
  // mais ici on va utiliser un Store mutable ou des Signals pour simplifier le code Solid.
  const [playerPos, setPlayerPos] = createSignal({ x: 0, y: 0 });
  const [bullets, setBullets] = createSignal([]);
  const [enemies, setEnemies] = createSignal([]);
  const [enemyBullets, setEnemyBullets] = createSignal([]);
  const [particles, setParticles] = createSignal([]);

  let gameLoopId;
  let spawnIntervalId;
  let gameAreaRef;

 // Fonction utilitaire pour empêcher de sortir (Clamping)
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const handleMouseMove = (e) => {
    if (gameState() !== 'playing') return;
    
    // Si le Pointer Lock est activé
    if (document.pointerLockElement === gameAreaRef) {
        setPlayerPos((prev) => {
            // On s'assure que gameAreaRef existe pour avoir les dimensions
            const maxX = gameAreaRef.clientWidth;
            const maxY = gameAreaRef.clientHeight;

            return {
                // On ajoute le mouvement de la souris à la position actuelle
                // Et on "clamp" (limite) entre 0 et la taille de l'écran
                x: clamp(prev.x + e.movementX, 0, maxX),
                y: clamp(prev.y + e.movementY, 0, maxY)
            };
        });
    } else {
        // Fallback (au cas où le lock n'est pas actif, ex: menu pause)
        // On garde l'ancien comportement si besoin
        if(gameAreaRef) {
             const rect = gameAreaRef.getBoundingClientRect();
             setPlayerPos({
                 x: e.clientX - rect.left,
                 y: e.clientY - rect.top
             });
        }
    }
  };

  const handleClick = () => {
    if (gameState() !== 'playing') return;
    // Tirer !
    setBullets((prev) => [
      ...prev,
      { id: Date.now(), x: playerPos().x, y: playerPos().y, vx: 0, vy: -BULLET_SPEED }
    ]);
  };

  // --- MOTEUR DE JEU ---
  const startGame = () => {
    setScore(0);
    setHealth(100);
    setBullets([]);
    setEnemies([]);
    setEnemyBullets([]);
    setParticles([]);
    setGameState('playing');

    if (gameAreaRef) {
        gameAreaRef.requestPointerLock();
    }

    setScore(0);

    // Boucle de spawn des ennemis
    spawnIntervalId = setInterval(() => {
        if(Math.random() > 0.5) spawnEnemy();
    }, SPAWN_RATE);

    // Démarrer la boucle
    loop();
  };

const spawnEnemy = () => {
    if (!gameAreaRef) return;
    const width = gameAreaRef.clientWidth;
    
    // Liste d'apparence des ennemis (Emoji ou Texte)
    const skins = [
        { text: "<div>", color: "#61dafb", hp: 1 },    // React Blue
        { text: "ERROR", color: "#ff0055", hp: 2 },    // Red Error
        { text: "{API}", color: "#f7df1e", hp: 1 },    // JS Yellow
        { text: "🐛",    color: "#00ff00", hp: 1 },    // Bug
        { text: ";",     color: "#ffffff", hp: 1 }     // Semicolon
    ];
    
    const skin = skins[Math.floor(Math.random() * skins.length)];
    
    setEnemies((prev) => [
      ...prev,
      {
        id: Math.random(),
        x: Math.random() * (width - 50),
        y: -50,
        text: skin.text,      // On stocke le texte
        color: skin.color,    // On stocke la couleur
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * ENEMY_SPEED + 1,
        width: 60,
        height: 40
      }
    ]);
  };

  const createExplosion = (x, y, color) => {
    const newParticles = [];
    for (let i = 0; i < 8; i++) {
        newParticles.push({
            id: Math.random(),
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1.0,
            color
        });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  const loop = () => {
    if (gameState() !== 'playing') return;

    // 1. Mise à jour des balles joueur
    setBullets((prev) => prev
        .map(b => ({ ...b, y: b.y + b.vy }))
        .filter(b => b.y > -20)
    );

    // 2. Mise à jour des ennemis + Tir ennemi aléatoire
    setEnemies((prev) => {
        const nextEnemies = [];
        prev.forEach(e => {
            // Déplacement
            let newX = e.x + e.vx;
            let newY = e.y + e.vy;

            // Rebond sur les murs
            if (gameAreaRef && (newX <= 0 || newX >= gameAreaRef.clientWidth - e.width)) {
                e.vx *= -1;
            }

            // L'ennemi tire parfois
            if (Math.random() < 0.02) {
                 setEnemyBullets(pbs => [...pbs, {
                     id: Math.random(), x: newX + e.width/2, y: newY + e.height, 
                     vx: (playerPos().x - newX) * 0.02, // Vise grossièrement le joueur
                     vy: 5
                 }]);
            }

            if (newY < 800) { // Si pas sorti de l'écran
                nextEnemies.push({ ...e, x: newX, y: newY, vx: e.vx });
            }
        });
        return nextEnemies;
    });

    // 3. Mise à jour balles ennemies
    setEnemyBullets((prev) => prev
        .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
        .filter(b => b.y < 1000)
    );

    // 4. Mise à jour Particules
    setParticles((prev) => prev
        .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.05 }))
        .filter(p => p.life > 0)
    );

    // 5. COLLISIONS (Naïve AABB)
    // Balles joueur vs Ennemis
    let currentBullets = [...bullets()];
    let currentEnemies = [...enemies()];
    let scoreToAdd = 0;

    for (let i = currentBullets.length - 1; i >= 0; i--) {
        for (let j = currentEnemies.length - 1; j >= 0; j--) {
            const b = currentBullets[i];
            const e = currentEnemies[j];
            
            // Hitbox simple
            if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
                // BOOM
                createExplosion(e.x + e.width/2, e.y + e.height/2, '#00ff00');
                scoreToAdd += 100;
                
                // Supprimer balle et ennemi
                currentBullets.splice(i, 1);
                currentEnemies.splice(j, 1);
                break; // Une balle ne tue qu'un ennemi
            }
        }
    }
    
    if (scoreToAdd > 0) {
        setScore(s => s + scoreToAdd);
        setBullets(currentBullets);
        setEnemies(currentEnemies);
    }

    // Balles ennemies vs Joueur
    const pX = playerPos().x;
    const pY = playerPos().y;
    const hitDist = 20;
    
    // Check collisions Ennemis -> Joueur (Crash)
    const crashedEnemyIndex = currentEnemies.findIndex(e => 
        Math.abs((e.x + e.width/2) - pX) < 40 && Math.abs((e.y + e.height/2) - pY) < 40
    );
    
    // Check collisions Tirs -> Joueur
    const hitBulletIndex = enemyBullets().findIndex(b => 
        Math.abs(b.x - pX) < hitDist && Math.abs(b.y - pY) < hitDist
    );

    if (crashedEnemyIndex !== -1 || hitBulletIndex !== -1) {
        setHealth(h => h - 20);
        createExplosion(pX, pY, '#ff0055'); // Sang rouge/rose
        // Supprimer le projectile ou l'ennemi qui a touché
        if(hitBulletIndex !== -1) {
            const newEb = [...enemyBullets()];
            newEb.splice(hitBulletIndex, 1);
            setEnemyBullets(newEb);
        }
        if(crashedEnemyIndex !== -1) {
             const newE = [...enemies()];
             newE.splice(crashedEnemyIndex, 1);
             setEnemies(newE);
        }
    }

    // Check Game Over
    if (health() <= 0) {
        endGame();
        return;
    }

    gameLoopId = requestAnimationFrame(loop);
  };

  // Fonction pour sauvegarder le score si supérieur
  const saveScoreIfBetter = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Pas de token, score non sauvegardé');
        return;
      }

      // Récupérer l'ID de l'utilisateur
      const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        console.log('Utilisateur non authentifié, score non sauvegardé');
        return;
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      const currentScore = score();

      // Récupérer le score actuel pour le jeu "laser"
      const scoresResponse = await fetch(`${API_BASE_URL}/api/scores/${userId}`);
      if (scoresResponse.ok) {
        const scores = await scoresResponse.json();
        const laserScore = scores.find((s) => s.game_type === 'laser');

        // Si un score existe et qu'il est supérieur ou égal, ne pas sauvegarder
        if (laserScore && laserScore.score >= currentScore) {
          console.log(`Score actuel (${laserScore.score}) >= nouveau score (${currentScore}), non sauvegardé`);
          return;
        }
      }

      // Sauvegarder le score (créer ou mettre à jour)
      const saveResponse = await fetch(`${API_BASE_URL}/api/scores/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: currentScore,
          game_type: 'laser',
        }),
      });

      if (saveResponse.ok) {
        console.log(`Score sauvegardé avec succès: ${currentScore}`);
      } else {
        console.error('Erreur lors de la sauvegarde du score');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du score:', error);
    }
  };

  const endGame = () => {

    if (document.pointerLockElement === gameAreaRef) {
        document.exitPointerLock();
    }

    setGameState('gameover');
    clearInterval(spawnIntervalId);
    cancelAnimationFrame(gameLoopId);
    
    // Sauvegarder score localement
    const newEntry = { name: "You", score: score() };
    const newLeaderboard = [...leaderboard(), newEntry].sort((a,b) => b.score - a.score);
    setLeaderboard(newLeaderboard);
    
    // Sauvegarder le score sur le serveur si supérieur
    saveScoreIfBetter();
  };
  

  onMount(() => {
    // ... tes autres onMount ...

    const handleLockChange = () => {
        if (document.pointerLockElement !== gameAreaRef && gameState() === 'playing') {
            // Le joueur a fait ECHAP ou a perdu le focus
            // Optionnel : Mettre en pause ou juste laisser le jeu continuer
            // Pour l'instant on ne fait rien, mais c'est bon à savoir
        }
    };

    document.addEventListener('pointerlockchange', handleLockChange);

    // N'oublie pas le nettoyage
    onCleanup(() => {
        document.removeEventListener('pointerlockchange', handleLockChange);
        clearInterval(spawnIntervalId);
        cancelAnimationFrame(gameLoopId);
    });
  });

  return (
    <div class="w-full h-screen bg-neutral-900 overflow-hidden relative cursor-none select-none font-mono text-white">
        
      {/* HUD (Heads Up Display) */}
      <div class="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 pointer-events-none">
        <div class="text-3xl font-bold text-accent drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            SCORE: {score()}
        </div>
        <div class="w-64 h-6 bg-gray-800 rounded-full border border-gray-600">
            <div 
                class="h-full bg-error rounded-full transition-all duration-200 shadow-[0_0_15px_red]" 
                style={{ width: `${health()}%` }}
            ></div>
        </div>
      </div>

      {/* ZONE DE JEU */}
      <div 
        ref={gameAreaRef} 
        class="w-full h-full relative"
        onMouseMove={handleMouseMove}
        onMouseDown={handleClick}
      >
        {/* LE JOUEUR (Curseur personnalisé) */}
        <Show when={gameState() === 'playing'}>
            <div 
                class="absolute w-4 h-4 bg-transparent border-2 border-primary rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-40 shadow-[0_0_15px_theme('colors.primary')]"
                style={{ left: `${playerPos().x}px`, top: `${playerPos().y}px` }}
            >
                {/* Viseur */}
                <div class="absolute top-1/2 left-1/2 w-[1px] h-8 bg-primary -translate-x-1/2 -translate-y-1/2"></div>
                <div class="absolute top-1/2 left-1/2 w-8 h-[1px] bg-primary -translate-x-1/2 -translate-y-1/2"></div>
            </div>
        </Show>

        {/* BALLES JOUEUR */}
        <For each={bullets()}>{(b) => 
            <div 
                class="absolute w-1 h-6 bg-secondary rounded shadow-[0_0_10px_theme('colors.secondary')]"
                style={{ left: `${b.x}px`, top: `${b.y}px` }}
            ></div>
        }</For>

        {/* BALLES ENNEMIES */}
        <For each={enemyBullets()}>{(b) => 
            <div 
                class="absolute w-3 h-3 bg-error rounded-full shadow-[0_0_10px_red]"
                style={{ left: `${b.x}px`, top: `${b.y}px` }}
            ></div>
        }</For>

        {/* --- DANS LE RETURN (vers la ligne 200 environ) --- */}

        {/* ENNEMIS (TAGS HTML) */}
        <For each={enemies()}>{(e) => 
            <div 
                class="absolute flex items-center justify-center font-bold font-mono shadow-[0_0_15px_currentColor]"
                // C'est ici qu'on applique le style dynamique
                style={{ 
                    left: `${e.x}px`, 
                    top: `${e.y}px`,
                    width: `${e.width}px`,
                    height: `${e.height}px`,
                    color: e.color,       // <-- La couleur vient du JS
                    borderColor: e.color, // <-- La bordure aussi
                    borderWidth: '2px',
                    fontSize: '16px'
                }}
            >
                {e.text} {/* <-- Le texte (<div>, 🐛, etc.) */}
            </div>
        }</For>

        {/* PARTICULES */}
        <For each={particles()}>{(p) => 
            <div 
                class="absolute w-2 h-2 rounded-full"
                style={{ 
                    left: `${p.x}px`, 
                    top: `${p.y}px`, 
                    background: p.color,
                    opacity: p.life,
                    transform: `scale(${p.life})`
                }}
            ></div>
        }</For>

        {/* ECRAN TITRE / START */}
        <Show when={gameState() === 'start'}>
            <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
                <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8 animate-pulse">
                    NEON DOM HUNTER
                </h1>
                <p class="text-xl mb-8 text-gray-300">Nettoyez le code source. Éliminez les bugs.</p>
                <button 
                    class="btn btn-primary btn-lg px-12 text-2xl"
                    onClick={startGame}
                >
                    START MISSION
                </button>
            </div>
        </Show>

        {/* ECRAN GAMEOVER / SCOREBOARD */}
        <Show when={gameState() === 'gameover'}>
            <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
                <h2 class="text-5xl font-bold text-error mb-4">SYSTEM FAILURE</h2>
                <p class="text-2xl text-white mb-8">Votre Score : {score()}</p>
                
                <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl">
                    <h3 class="text-xl text-accent mb-4 border-b border-gray-600 pb-2">TOP PLAYERS</h3>
                    <table class="table w-full text-left">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th class="text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={leaderboard()}>{(entry, i) => 
                                <tr class={entry.name === 'You' ? "bg-white/10" : ""}>
                                    <td class="font-bold text-primary">#{i() + 1}</td>
                                    <td>{entry.name}</td>
                                    <td class="text-right font-mono text-warning">{entry.score}</td>
                                </tr>
                            }</For>
                        </tbody>
                    </table>
                </div>

                <div class="flex gap-4 mt-8">
                    <button class="btn btn-outline btn-success" onClick={startGame}>RETRY</button>
                    <a href="/" class="btn btn-ghost">EXIT</a>
                </div>
            </div>
        </Show>

      </div>
    </div>
  );
}

export default LaserGame;