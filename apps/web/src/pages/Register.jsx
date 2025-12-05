import { createSignal } from "solid-js";

function Register() {
    const [nom, setNom] = createSignal("");
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    const handleSignUp = () => {
        if (!nom() || !email() || !password()) {
            alert("Veuillez entrer un nom d'utilisateur, une adresse e-mail et un mot de passe.");
            return;
        }

        const signupData = { name: nom(), email: email(), password: password() };
        fetch("http://localhost:3001/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signupData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "/";
                } else {
                    window.alert("Échec de l'inscription : " + data.message);
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Une erreur s'est produite lors de l'inscription.");
            });
    };

    return (
        <div>
            <h1 class="text-4xl font-bold text-center mt-10 text-purple-600">
                Créer un compte
            </h1>

            <div class="flex justify-center mt-8">
                <form class="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Nom d'utilisateur
                        </label>
                        <input
                            class="shadow border rounded w-full py-2 px-3 text-gray-700"
                            type="text"
                            value={nom()}
                            onInput={(e) => setNom(e.target.value)}
                            placeholder="Nom d'utilisateur"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            E-mail
                        </label>
                        <input
                            class="shadow border rounded w-full py-2 px-3 text-gray-700"
                            type="text"
                            value={email()}
                            onInput={(e) => setEmail(e.target.value)}
                            placeholder="Adresse e-mail"
                        />
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                            Mot de passe
                        </label>
                        <input
                            class="shadow border rounded w-full py-2 px-3 text-gray-700"
                            type="password"
                            value={password()}
                            onInput={(e) => setPassword(e.target.value)}
                            placeholder="******************"
                        />
                    </div>

                    <div class="flex justify-center mt-4">
                        <button
                            type="button"
                            class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSignUp}
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
