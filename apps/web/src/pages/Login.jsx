import { createSignal } from "solid-js";

function Login() {
  const [isGame1Active, setIsGame1Active] = createSignal(false);
  const [clickedOrder, setClickedOrder] = createSignal([]);
  const [activeClick, setActiveClick] = createSignal(null);

  const toggleGame1 = () => {
    setIsGame1Active(!isGame1Active());
    setClickedOrder([]);
  };

  const circleColors = [
    { color: "red", value: 1 },
    { color: "green", value: 2 },
    { color: "blue", value: 3 },
    { color: "yellow", value: 4 },
    { color: "purple", value: 5 },
    { color: "orange", value: 6 },
    { color: "pink", value: 7 },
    { color: "cyan", value: 8 },
    { color: "lime", value: 9 },
  ];

  const handleCircleClick = (index) => {
    if (clickedOrder().length < 15) {
      setClickedOrder([...clickedOrder(), circleColors[index].value]);
      setActiveClick(index);

      setTimeout(() => setActiveClick(null), 100); // 100ms
    }
  };

  const handleSignIn = () => {
    if (isGame1Active() && clickedOrder().length <= 6){
        alert("Veuillez sélectionner au moins 7 cercles pour le motif de connexion.");
        location.reload();

    }
    const patternString = clickedOrder().join("");

    const email = document.getElementById("email").value;
    if (!email) {
        alert("Veuillez entrer une adresse e-mail.");
        return;
    }
    let password = "";
    if (patternString.length === 0){ 
        password = document.getElementById("password").value;
    } else{
        password = patternString;
    }
    const loginData = { email, password };

    console.log("Données de connexion:", loginData);

    fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/";
        } else {
          window.alert("Échec de la connexion: " + data.message);
          window.location.reload();
        }
      });
  };

  return (
    <div>
      <h1 class="text-4xl font-bold text-center mt-10 text-purple-600">Page de connexion</h1>
      <div class="flex justify-center mt-8">
        <form class="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input
              class="shadow border rounded w-full py-2 px-3 text-gray-700"
              id="email"
              type="text"
              placeholder="Email"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Mot de passe
            </label>
            <input
              class="shadow border rounded w-full py-2 px-3 text-gray-700"
              id="password"
              type="password"
              placeholder="******************"
            />
          </div>
          <hr class="my-4 border-gray-300" />
          <div class="flex justify-center mb-4">
            <div
              class="w-6 h-6 bg-purple-400 cursor-pointer rounded"
              onClick={toggleGame1}
            ></div>
          </div>

          {isGame1Active() && (
            <div class="flex flex-col items-center">
              <div class="mb-2 font-bold text-purple-700">
                Cercles sélectionnés: {clickedOrder().length}
              </div>

              <div class="grid grid-cols-3 gap-4 mt-2 w-max mx-auto">
                {circleColors.map((c, index) => (
                  <div
                    class={`w-16 h-16 rounded-full cursor-pointer transform transition duration-150 hover:scale-110`}
                    style={{
                      "background-color": c.color,
                      opacity: activeClick() === index ? 0.5 : 1,
                    }}
                    onClick={() => handleCircleClick(index)}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <div class="flex justify-center mt-4">
            <button
              class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
