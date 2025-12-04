import { createSignal } from 'solid-js';

function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="hero min-h-[80vh]">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome to Nuit de l'Info!</h1>
          <p class="py-6" >
            This is a mokefuhreyfkuerhfknorepo project built with Turbo, Bun, SolidJS, and
            Express. Click the button to test SolidJS reactivity!
          </p>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Counter Demo</h2>
              <p class="text-2xl font-bold">{count()}</p>
              <div class="card-actions justify-center">
                <button
                  class="btn btn-primary"
                  onClick={() => setCount(count() + 1)}
                >
                  Increment
                </button>
                <button
                  class="btn btn-secondary"
                  onClick={() => setCount(0)}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
