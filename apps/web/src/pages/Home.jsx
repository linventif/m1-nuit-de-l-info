import { createSignal} from "solid-js";
import MemoryGame from "../components/MemoryGame";
import { A } from '@solidjs/router';

function Home() {
  const [showModal, setShowModal] = createSignal(false);

  return (
    <div class="min-h-[80vh] flex flex-col items-center justify-center text-base-content font-mono pb-5 pt-0">
      <div class="text-center space-y-8 animate-fade-in max-w-7xl w-full">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-neutral drop-shadow-lg">
          ENTREZ DANS L'ÈRE NIRD
        </h1>
        <p class="text-lg md:text-xl lg:text-2xl text-base-content/80 tracking-widest uppercase">
          Selectionne ton mini-jeu
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 justify-items-center">
          {/* Game Card 1 */}
          <div class="card w-80 bg-base-300 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-primary hover:border-secondary group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-neutral to-primary flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                🐍
              </div>
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title text-primary font-bold text-2xl">Retro Snake</h2>
              <p class="text-base-content/60 text-sm">Classic snake gameplay. Eat and grow!</p>
              <div class="card-actions mt-4">
                <a href="/games/snake" class="btn btn-primary btn-wide border-none hover:brightness-110">
                  PLAY NOW
                </a>
              </div>
            </div>
          </div>

          {/* Game Card 2 */}
          <div class="card w-80 bg-base-300 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-primary hover:border-secondary group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                ✅
              </div>
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl text-yellow-400 font-bold">Quizz NIRD</h2>
              <p class="text-gray-400 text-sm">Teste tes connaissances sur les démarches NIRD.</p>
              <div class="card-actions mt-4">
                <a href="/games/quizz" class="btn btn-primary btn-wide bg-gradient-to-r from-yellow-500 to-red-500 border-none text-white font-bold hover:brightness-110">
                  PLAY NOW
                </a>
              </div>
            </div>
          </div>

          {/* Game Card 3 */}
          <div class="card w-80 bg-base-300 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-primary hover:border-secondary group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                👾
              </div>
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl text-pink-400 font-bold">Laser Game</h2>
              <p class="text-gray-400 text-sm">Teste tes réflexes avec ce jeu de laser.</p>
              <div class="card-actions mt-4">
                <a href="/games/laser" class="btn btn-primary btn-wide bg-gradient-to-r from-pink-500 to-purple-600 border-none text-white font-bold hover:brightness-110">
                  PLAY NOW
                </a>
              </div>
            </div>
          </div>
          
                    {/* Game Card 3 */}
          <div class="card w-80 bg-gray-800 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-purple-500 hover:border-pink-500 group cursor-pointer relative overflow-hidden">
             {/* Petit effet visuel pour le mettre en avant */}
             <div class="absolute inset-0 bg-yellow-400/10 animate-pulse pointer-events-none"></div>
             
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                🔫
              </div>
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl text-yellow-400 font-bold">Neon Laser Pong</h2>
              {/* Description mise à jour pour le défi */}
              <p class="text-gray-400 text-sm">Transformez votre souris en laser. Détruisez le DOM !</p>
              <div class="card-actions mt-4">
                {/* Lien vers notre route LaserGame */}
                <A href="/laser-game" class="btn btn-primary btn-wide bg-gradient-to-r from-yellow-500 to-red-500 border-none text-white font-bold hover:brightness-110 shadow-[0_0_15px_rgba(255,165,0,0.5)]">
                  PLAY NOW
                </A>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div class="mt-16 flex flex-col md:flex-row gap-4 justify-center">
          <div class="stats shadow bg-base-300 border border-base-300 w-full md:w-auto">
            <div class="stat place-items-center">
              <div class="stat-title text-base-content/60">High Score</div>
              <div class="stat-value text-primary">4,200</div>
              <div class="stat-desc text-primary">↗︎ 400 (22%)</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-base-content/60">New Registers</div>
              <div class="stat-value text-base-content">1,200</div>
              <div class="stat-desc text-base-content/60">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer class="mt-12 text-center text-sm text-base-content/60">
        <button
          class="underline hover:text-primary"
          onClick={() => setShowModal(true)}
        >
          View Credentials
        </button>
      </footer>

      {/* Modal */}
      {showModal() && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4"
          onClick={() => setShowModal(false)} // Clique sur le fond pour fermer
        >
          <div
            className="bg-base-300 p-6 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l'intérieur
          >
            {/* Bouton Fermer en haut à droite */}
            <button
              className="absolute top-4 right-4 btn btn-circle btn-sm btn-primary hover:bg-primary-focus"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h3 className="text-2xl md:text-3xl font-bold text-primary text-center mb-8">
              La team NIRD (Jeu des pairs)
            </h3>
            {/* Jeu ici */}
            <MemoryGame />
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
