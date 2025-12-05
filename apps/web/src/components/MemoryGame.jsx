import { createSignal, createEffect, onMount } from "solid-js";

const cardsData = [
  { title: "Collectivités", url: "https://nird.forge.apps.education.fr/collectivites/", logo: "🏛️" },
  { title: "Boite à outils", url: "https://nird.forge.apps.education.fr/tools/", logo: "🧰" },
  { title: "Démarche", url: "https://nird.forge.apps.education.fr/demarche/", logo: "🚸" },
  { title: "Pourquoi", url: "https://nird.forge.apps.education.fr/pourquoi/", logo: "❓" },
  { title: "Linux", url: "https://nird.forge.apps.education.fr/linux/", logo: "🐧" },
  { title: "Reconditionnement", url: "https://nird.forge.apps.education.fr/reconditionnement/", logo: "♻️" },
];

const team = [ 
    { name: "Alice", role: "Dev Front"}, 
    { name: "Bob", role: "Dev Back"}, 
    { name: "Charlie", role: "Designer"}, 
    { name: "David", role: "QA"}, 
    { name: "Eve", role: "PM"}, 
    { name: "Frank", role: "DevOps"}, 
    { name: "Grace", role: "UX"}, 
    { name: "Hugo", role: "Dev Front"}, 
    { name: "Ivy", role: "Marketing"}, 
    { name: "Jack", role: "Support"}, 
    { name: "Kate", role: "Community"}, 
    { name: "Leo", role: "Designer"}, 
];

function shuffle(array) {
  return array.concat(array).sort(() => Math.random() - 0.5); // dupliquer pour créer des paires
}

const BEST_MOVES = 8; // meilleur score possible

function calculateScore(moves) {
  if (moves <= BEST_MOVES) return 100; // parfait
  const score = Math.max(0, Math.round((BEST_MOVES / moves) * 100));
  return score;
}

async function sendScoreToBackend(moves) {
  try {
    const response = await fetch("https://ton-backend.com/api/nird-memory-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player: "NomDuJoueur", // tu peux remplacer par le vrai nom ou ID
        score: calculateScore(moves),
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Error score");
      return
    }

    const data = await response.json();
    console.log("Score envoyé avec succès :", data);
  } catch (error) {
    console.error("Impossible d'envoyer le score :", error);
  }
}

export default function NirdMemoryGame() {
  const [cards, setCards] = createSignal(shuffle(cardsData));
  const [flipped, setFlipped] = createSignal([]);
  const [matched, setMatched] = createSignal([]);
  const [lock, setLock] = createSignal(false);
  const [moves, setMoves] = createSignal(0);
  const [scoreSent, setScoreSent] = createSignal(false);
  const [previousScore, setPreviousScore] = createSignal(null);

  onMount(() => {
    (async () => {
        try {
        // 1. Récupération de l'utilisateur connecté
        const resUser = await fetch("http://localhost:3001/api/auth/me", {
            credentials: "include", // IMPORTANT pour cookies / sessions
        });

        if (!resUser.ok) throw new Error("Utilisateur non connecté");

        
        const userData = await resUser.json();
        console.log(userData)
        setUser(userData);

        // 2. Récupération du meilleur score du joueur
        const resScore = await fetch(
            `http://localhost:3001/api/nird-memory-score/${userData.id}`,
            {
            credentials: "include",
            }
        );

        if (resScore.ok) {
            const scoreData = await resScore.json();
            setPreviousScore(scoreData.bestScore);
        }

        } catch (error) {
        console.warn("Mode invité ou problème de connexion :", error);
        }
    })();
    const savedScore = localStorage.getItem("nird-memory-score");
    if (savedScore) {
      setPreviousScore(Number(savedScore));
    }
  });

  const flipCard = (index) => {
    if (lock() || flipped().includes(index) || matched().includes(index)) return;

    const newFlipped = [...flipped(), index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true);
      setMoves(moves() + 1);

      const [first, second] = newFlipped;
      if (cards()[first].title === cards()[second].title) {
        setMatched([...matched(), first, second]);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(shuffle(cardsData));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLock(false);
  };

  createEffect(() => {
    if (matched().length === cards().length && !scoreSent()) {
      const score = calculateScore(moves());
      const oldScore = Number(localStorage.getItem("nird-memory-score") || 0);
      // Sauvegarde locale
      if (oldScore < score){
        localStorage.setItem("nird-memory-score", score);
        setPreviousScore(score);
      }
      
      // Envoi backend (async, non bloquant)
      sendScoreToBackend(moves());

      setScoreSent(true);
    }
  });

  return (
    <div class="flex flex-col items-center p-6">
      {previousScore() !== null && (
        <p class="mb-4 text-secondary">
          🎯 Meilleur score : {previousScore()} / 100
        </p>
      )}

      <p class="mb-4 text-lg">Nombre de mouvements : {moves()}</p>

      <div class="grid grid-cols-4 gap-4">
        {cards().map((card, index) => {
          const isFlipped = flipped().includes(index) || matched().includes(index);
          return (
            <div
              class={`card card-compact w-48 h-32 cursor-pointer shadow-lg transition-transform duration-300 transform ${
                isFlipped ? "bg-base-100 scale-105" : "bg-neutral"
              } flex flex-col items-center justify-center p-2 text-center`}
              onClick={() => flipCard(index)}
            >
              {isFlipped ? (
                <>
                  <h4 class="font-bold">{card.title}</h4>
                  <span class="text-3xl">{card.logo}</span>
                  <a target="_blank" href={card.url} class="btn btn-sm p-2">Lien</a>
                </>
              ) : (
                <>
                    <span class="text-xl">{team[index].name}</span>
                    <p>{team[index].role}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {matched().length === cards().length && (
        <div class="alert alert-success mt-6 text-center">
          🎉 Bravo ! Terminé en {moves()} coups  
          <br />
          🏆 Score : {calculateScore(moves())}/100
        </div>
      )}

      <button class="btn btn-primary m-4" onClick={resetGame}>
        Recommencer
      </button>
    </div>
  );
}
