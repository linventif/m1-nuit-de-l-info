import { Navigate } from "@solidjs/router";

function Login() {
    const toggleGame1 = () => {
        console.log("Game 1 toggled");
    }

    const toggleGame2 = () => {
        console.log("Game 2 toggled");
    }

    const login = async () => {
        console.log("Login attempted");
        const loginData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        const res = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await res.json();
        
        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = '/';
        } else {
            console.log("Login failed:", data.message);
        }
    }
    return (
        <div>
            <h1 class="text-4xl font-bold text-center mt-10 text-purple-600">Login Page</h1>
            <div class="flex justify-center mt-8">
                <form class="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                            Email
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" />
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Password
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                    </div>
                    <hr className="my-4 border-gray-300" />
                    <div className="flex justify-center mb-4">
                        <div className="w-6 h-6 bg-purple-400 cursor-pointer rounded" onclick={() => toggleGame1()}></div>
                    </div>
                    <div className="flex justify-center mb-4">
                        <div className="w-6 h-6 bg-purple-400 cursor-pointer rounded" onclick={() => toggleGame2()}></div>
                    </div>
                    <div className="flex items justify-center">
                        <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onclick={() => login()}>
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;