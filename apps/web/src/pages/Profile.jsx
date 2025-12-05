import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal('');
  
  // États pour les mots de passe
  const [classicPassword, setClassicPassword] = createSignal('');
  const [patternPassword, setPatternPassword] = createSignal('');
  const [imageHash, setImageHash] = createSignal('');
  const [imagePreview, setImagePreview] = createSignal('');
  const [saving, setSaving] = createSignal({});
  
  // États pour le pattern de cercles
  const [clickedOrder, setClickedOrder] = createSignal([]);
  const [activeClick, setActiveClick] = createSignal(null);
  
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
      setTimeout(() => setActiveClick(null), 100);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Récupérer le token depuis localStorage
  const getToken = () => localStorage.getItem('token');

  // Charger les informations de l'utilisateur
  const loadUser = async () => {
    try {
      setLoading(true);
      setError('');
      const token = getToken();
      
      if (!token) {
        console.log('No token found, redirecting to login');
        setLoading(false);
        navigate('/login');
        return;
      }

      console.log('Loading user profile...', { 
        token: token.substring(0, 20) + '...', 
        url: `${API_BASE_URL}/api/auth/me` 
      });
      
      // Ajouter un timeout à la requête
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timeout');
        controller.abort();
      }, 10000); // 10 secondes
      
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('La requête a pris trop de temps. Vérifiez votre connexion.');
        }
        throw fetchError;
      }

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Error response:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setLoading(false);
          navigate('/login');
          return;
        }
        throw new Error(errorData.error || 'Erreur lors du chargement du profil');
      }

      const userData = await response.json();
      console.log('User data loaded:', userData);
      setUser(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading user:', err);
      setLoading(false);
      if (err.name === 'AbortError' || err.message.includes('temps')) {
        setError('La requête a pris trop de temps. Vérifiez votre connexion et que le serveur API est démarré.');
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Impossible de se connecter au serveur. Vérifiez que l\'API est démarrée sur http://localhost:3001');
      } else {
        setError(err.message || 'Erreur lors du chargement du profil');
      }
    }
  };

  // Sauvegarder un mot de passe pour un type de jeu
  const savePassword = async (gameType, password) => {
    try {
      setSaving({ ...saving(), [gameType]: true });
      setError('');
      setSuccess('');

      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register/${gameType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const data = await response.json();
      setSuccess(`Mot de passe ${gameType} ${data.message.includes('updated') ? 'modifié' : 'ajouté'} avec succès !`);
      
      // Réinitialiser les champs
      if (gameType === 'classic') setClassicPassword('');
      if (gameType === 'pattern') setPatternPassword('');
      if (gameType === 'image') {
        setImageHash('');
        setImagePreview('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving({ ...saving(), [gameType]: false });
    }
  };

  // Gérer l'upload d'image pour le mot de passe image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    setError('');
    setImageHash('');
    setImagePreview('');

    if (!file) return;

    // Vérifications
    const maxSize = 2 * 1024 * 1024; // 2 Mo
    if (file.size > maxSize) {
      setError('Le fichier doit faire moins de 2 Mo');
      e.target.value = '';
      return;
    }

    if (!file.type.match(/^image\/(jpeg|jpg)$/)) {
      setError('Seuls les fichiers JPG sont autorisés');
      e.target.value = '';
      return;
    }

    // Créer l'aperçu
    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    // Hasher l'image
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setImageHash(hashHex);
    } catch (error) {
      setError("Erreur lors du hash de l'image");
      console.error(error);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        // Appeler l'endpoint logout (optionnel)
        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (err) {
          console.error('Logout API error:', err);
        }
      }
      
      // Supprimer le token du localStorage
      localStorage.removeItem('token');
      
      // Déclencher un événement pour notifier la Navbar
      window.dispatchEvent(new Event('tokenChanged'));
      
      // Rediriger vers la page de login
      navigate('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      // Même en cas d'erreur, supprimer le token et rediriger
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  onMount(() => {
    loadUser();
  });

  return (
    <Show
      when={!loading()}
      fallback={
        <div class="flex justify-center items-center min-h-screen">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <Show
        when={user()}
        fallback={
          <div class="flex justify-center items-center min-h-screen">
            <div class="alert alert-error">
              <span>Erreur lors du chargement du profil</span>
              {error() && <p class="mt-2">{error()}</p>}
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold mb-6 text-purple-600">Mon Profil</h1>

      {/* Informations utilisateur */}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <div class="flex justify-between items-center mb-4">
            <h2 class="card-title text-2xl">Informations</h2>
            <button
              class="btn btn-error btn-outline"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
          <div class="space-y-2">
            <p><strong>Nom :</strong> {user()?.name}</p>
            <p><strong>Email :</strong> {user()?.email}</p>
            <p><strong>Rôle :</strong> {user()?.role}</p>
          </div>
        </div>
      </div>

      {/* Section Mots de passe */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Mots de passe</h2>
          <p class="text-sm text-gray-500 mb-6">
            Définissez vos mots de passe pour les différents modes de connexion
          </p>

          {/* Messages d'erreur et succès */}
          {error() && (
            <div class="alert alert-error mb-4">
              <span>{error()}</span>
            </div>
          )}
          {success() && (
            <div class="alert alert-success mb-4">
              <span>{success()}</span>
            </div>
          )}

          <div class="space-y-6">
            {/* Mot de passe classique */}
            <div class="border rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3">🔐 Mot de passe classique</h3>
              <p class="text-sm text-gray-500 mb-3">
                Mot de passe texte traditionnel
              </p>
              <div class="flex gap-2">
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  class="input input-bordered flex-1"
                  value={classicPassword()}
                  onInput={(e) => setClassicPassword(e.target.value)}
                />
                <button
                  class="btn btn-primary"
                  onClick={() => {
                    if (!classicPassword() || classicPassword().length < 6) {
                      setError('Le mot de passe doit contenir au moins 6 caractères');
                      return;
                    }
                    savePassword('classic', classicPassword());
                  }}
                  disabled={saving().classic || !classicPassword()}
                >
                  {saving().classic ? (
                    <span class="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </div>

            {/* Mot de passe pattern (cercles) */}
            <div class="border rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3">🎨 Mot de passe pattern</h3>
              <p class="text-sm text-gray-500 mb-3">
                Sélectionnez une séquence de cercles (au moins 10 cercles)
              </p>
              <div class="flex flex-col items-center gap-4">
                <div class="mb-2 font-bold text-purple-700">
                  Cercles sélectionnés: {clickedOrder().length} / 10
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
                
                <div class="flex gap-2 mt-4">
                  <button
                    class="btn btn-secondary"
                    onClick={() => {
                      setClickedOrder([]);
                      setError('');
                    }}
                    disabled={clickedOrder().length === 0}
                  >
                    Réinitialiser
                  </button>
                  <button
                    class="btn btn-primary"
                    onClick={() => {
                      const order = clickedOrder();
                      if (order.length < 10) {
                        setError('Veuillez sélectionner au moins 10 cercles pour le motif de connexion.');
                        return;
                      }
                      const patternString = order.join('');
                      savePassword('pattern', patternString);
                      setClickedOrder([]);
                    }}
                    disabled={saving().pattern || clickedOrder().length < 10}
                  >
                    {saving().pattern ? (
                      <span class="loading loading-spinner loading-sm"></span>
                    ) : (
                      'Enregistrer le pattern'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mot de passe image */}
            <div class="border rounded-lg p-4">
              <h3 class="text-lg font-semibold mb-3">🖼️ Mot de passe image</h3>
              <p class="text-sm text-gray-500 mb-3">
                Utilisez une image JPG comme mot de passe
              </p>
              <div class="space-y-3">
                <input
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg"
                  class="file-input file-input-bordered w-full"
                  onChange={handleImageUpload}
                />
                {imagePreview() && (
                  <div class="flex flex-col items-center gap-2 mt-4">
                    <div class="text-sm font-semibold text-purple-700">
                      🔑 Cette image sera votre clé de connexion
                    </div>
                    <img
                      src={imagePreview()}
                      alt="Clé de connexion"
                      class="max-w-xs max-h-48 rounded-lg shadow-lg border-2 border-purple-400"
                    />
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
                    <button
                      class="btn btn-primary mt-2"
                      onClick={() => {
                        if (!imageHash()) {
                          setError('Veuillez sélectionner une image valide');
                          return;
                        }
                        savePassword('image', imageHash());
                      }}
                      disabled={saving().image || !imageHash()}
                    >
                      {saving().image ? (
                        <span class="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Enregistrer l\'image comme mot de passe'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </Show>
    </Show>
  );
}

export default Profile;

