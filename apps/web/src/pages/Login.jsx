import { createSignal } from "solid-js";

function Login() {
  const [isGame1Active, setIsGame1Active] = createSignal(false);
  const [isGame2Active, setIsGame2Active] = createSignal(false);
  const [clickedOrder, setClickedOrder] = createSignal([]);
  const [activeClick, setActiveClick] = createSignal(null);
  const [fileError, setFileError] = createSignal("");
  const [imageHash, setImageHash] = createSignal("");
  const [imagePreview, setImagePreview] = createSignal("");

  const toggleGame1 = () => {
    setIsGame1Active(!isGame1Active());
    setIsGame2Active(false);
    setClickedOrder([]);
  };    

  const toggleGame2 = () => {
    setIsGame2Active(!isGame2Active());
    setIsGame1Active(false);
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
    const email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let gameType = "classic";

    // Si le jeu 2 (image) est actif, utiliser le hash de l'image comme mot de passe
    if (isGame2Active()) {
      if (!imageHash()) {
        alert("Veuillez sélectionner une image.");
        return;
      }
      password = imageHash();
      gameType = "image";
    } 
    // Si le jeu 1 (cercles) est actif, vérifier le pattern
    else if (isGame1Active()) {
      if (clickedOrder().length <= 6) {
        alert("Veuillez sélectionner au moins 7 cercles pour le motif de connexion.");
        return;
      }
      const patternString = clickedOrder().join("");
      password = patternString;
      gameType = "pattern";
    }

    const loginData = { email, password, gameType };

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
          console.log("Login failed:", data.message);
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
              class="w-10 h-10 bg-purple-400 cursor-pointer rounded"
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

        <div class="flex justify-center mb-4">
            <div
              class="w-10 h-10 bg-purple-400 cursor-pointer rounded"
              onClick={toggleGame2}
            >
                <img src="/public/biometric_image.png" alt="Image" class="w-10 h-10" />
            </div>
          </div>
          {isGame2Active() && (
            <div class="flex flex-col items-center">
              <div class="mb-2 font-bold text-purple-700">
              </div>
              <div class="flex flex-col items-center gap-2">
                <input
                  type="file"
                  class="file-input file-input-ghost"
                  accept=".jpg,.jpeg,image/jpeg"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    setFileError("");
                    setImageHash("");
                    setImagePreview("");
                    
                    if (!file) return;
                    
                    // Vérifications de base
                    const maxSize = 2 * 1024 * 1024; // 2 Mo
                    if (file.size > maxSize) {
                      setFileError("Le fichier doit faire moins de 2 Mo");
                      e.target.value = "";
                      return;
                    }
                    
                    if (!file.type.match(/^image\/(jpeg|jpg)$/)) {
                      setFileError("Seuls les fichiers JPG sont autorisés");
                      e.target.value = "";
                      return;
                    }
                    
                    // Créer l'aperçu de l'image
                    const imageUrl = URL.createObjectURL(file);
                    setImagePreview(imageUrl);
                    
                    // Hasher l'image
                    try {
                      const arrayBuffer = await file.arrayBuffer();
                      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                      const hashArray = Array.from(new Uint8Array(hashBuffer));
                      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                      setImageHash(hashHex);
                      console.log(hashHex);
                    } catch (error) {
                      setFileError("Erreur lors du hash de l'image");
                      console.error(error);
                    }
                  }}
                />
                {fileError() && (
                  <div class="text-red-500 text-sm mt-1">{fileError()}</div>
                )}
                {imagePreview() && (
                  <div class="flex flex-col items-center gap-2 mt-4">
                    <div class="text-sm font-semibold text-purple-700">
                      🔑 Cette image est votre clé de connexion
                    </div>
                    <img
                      src={imagePreview()}
                      alt="Clé de connexion"
                      class="max-w-xs max-h-48 rounded-lg shadow-lg border-2 border-purple-400"
                    />
                    <div class="text-xs text-gray-500">
                      Utilisez cette même image pour vous connecter
                    </div>
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-2 max-w-xs">
                      <div class="flex">
                        <div class="shrink-0">
                          <span class="text-yellow-400">⚠️</span>
                        </div>
                        <div class="ml-3">
                          <p class="text-xs text-yellow-700">
                            <strong>Attention :</strong> Certaines applications peuvent compresser votre image et donc détruire votre clé. 
                            <strong> Conservez toujours la copie originale</strong> sur clé USB, drive cloud ou autre support de sauvegarde.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
