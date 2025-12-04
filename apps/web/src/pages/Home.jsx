

function Home() {
  return (
    <div class="min-h-[80vh] flex flex-col items-center justify-center bg-gray-900 text-white font-mono">
      <div class="text-center space-y-8 animate-fade-in">
        <h1 class="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
          ENTREZ DANS L'ÈRE NIRD
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 tracking-widest uppercase">
          Selectionne ton mini-jeu
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Game Card 1 */}
          <div class="card w-80 bg-gray-800 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-purple-500 hover:border-pink-500 group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                🐍
              </div>
            </figure>
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl text-green-400 font-bold">Retro Snake</h2>
              <p class="text-gray-400 text-sm">Un magnifique jeu de snake</p>
              <div class="card-actions mt-4">
                <a href="/games/snake" class="btn btn-primary btn-wide bg-gradient-to-r from-green-500 to-blue-500 border-none text-white font-bold hover:brightness-110">
                  PLAY NOW
                </a>
              </div>
            </div>
          </div>

          {/* Game Card 2 */}
          <div class="card w-80 bg-gray-800 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-purple-500 hover:border-pink-500 group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
                🏓
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
          <div class="card w-80 bg-gray-800 shadow-xl hover:scale-105 transition-transform duration-300 border-2 border-purple-500 hover:border-pink-500 group cursor-pointer">
            <figure class="px-10 pt-10">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-4xl shadow-lg group-hover:animate-bounce">
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
        </div>

        <div class="mt-16">
          <div class="stats shadow bg-gray-800 border border-gray-700">
            {/* <div class="stat place-items-center">
              <div class="stat-title text-gray-400">Total Players</div>
              <div class="stat-value text-purple-400">31K</div>
              <div class="stat-desc text-gray-500">From Jan 1st to Feb 1st</div>
            </div> */}

            <div class="stat place-items-center">
              <div class="stat-title text-gray-400">High Score</div>
              <div class="stat-value text-secondary">4,200</div>
              <div class="stat-desc text-secondary">↗︎ 400 (22%)</div>
            </div>

            <div class="stat place-items-center">
              <div class="stat-title text-gray-400">New Registers</div>
              <div class="stat-value text-gray-200">1,200</div>
              <div class="stat-desc text-gray-500">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
