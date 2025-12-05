import { createSignal, For, onMount, onCleanup, Show } from 'solid-js';

function ChatWidget() {
    const [isOpen, setIsOpen] = createSignal(false);
    const [messages, setMessages] = createSignal([
        { id: 1, role: 'assistant', text: 'Bon-bOn-boN-Bonjour ! Je suis Nuit Assistant, comment puis-je vous aider ? 🥳🤡👻' },
    ]);
    const [text, setText] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false); // L'IA est en train de charger
    const [isTyping, setIsTyping] = createSignal(false); // L'IA est en train d'écrire
    const [isReturning, setIsReturning] = createSignal(false); // L'avatar revient à sa position
    const [typingText, setTypingText] = createSignal(''); // Texte en cours de frappe (séparé pour éviter le clignotement)
    const [typingMsgId, setTypingMsgId] = createSignal(null); // ID du message en cours de frappe
    let inputRef;
    let scrollRef;
    let typingInterval; // Intervalle pour l'effet machine à écrire

    const scrollToBottom = () => {
        queueMicrotask(() => {
            if (scrollRef) scrollRef.scrollTop = scrollRef.scrollHeight;
        });
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen());
        if (!isOpen()) {
            // Quand ouvert, focus sur le champ de saisie
            queueMicrotask(() => {
                if (inputRef) inputRef.focus();
                scrollToBottom();
            });
        }
    };

    // Fonction pour l'effet machine à écrire
    const typeMessage = (fullText, messageId) => {
        let currentIndex = 0;
        setIsTyping(true);
        setTypingMsgId(messageId);
        setTypingText('');

        typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                // Met à jour seulement le signal typingText, pas le tableau messages
                setTypingText(fullText.slice(0, currentIndex));
                currentIndex++;
                scrollToBottom();
            } else {
                clearInterval(typingInterval);
                // Une fois terminé, met à jour le message final dans le tableau
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === messageId
                            ? { ...msg, text: fullText }
                            : msg
                    )
                );
                setIsTyping(false);
                setTypingMsgId(null);
                setTypingText('');
                queueMicrotask(() => {
                    if (inputRef) inputRef.focus();
                });
            }
        }, 25); // Affiche un caractère toutes les 25ms
    };

    const sendMessage = async () => {
        const value = text().trim();
        if (!value || isLoading() || isTyping()) return; // Empêche l'envoi pendant le chargement ou l'écriture

        const history = messages()
            .slice(-15)
            .map((m) => ({ role: m.role, text: m.text }));

        const userMsg = { id: Date.now(), role: 'user', text: value };
        setMessages((prev) => [...prev, userMsg]);
        setText('');
        scrollToBottom();

        setIsLoading(true); // Début du chargement

        try {
            const res = await fetch('https://AdamGotAnApple-chen-n8n.hf.space/webhook/chatbotXXX_history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history, message: value }),
            });
            const replyTextRaw = await res.text().catch(() => '');
            const replyText = replyTextRaw || 'L\'assistant n\'a pas retourné de contenu';

            // Déclenche l'animation de retour de l'avatar
            setIsReturning(true);
            setIsLoading(false);

            // Attend que l'avatar revienne à sa position avant de commencer à taper
            await new Promise(resolve => setTimeout(resolve, 600));
            setIsReturning(false);

            // Ajoute un message vide, puis affiche avec l'effet machine à écrire
            const assistantMsgId = Date.now() + 1;
            const assistantMsg = { id: assistantMsgId, role: 'assistant', text: '' };
            setMessages((prev) => [...prev, assistantMsg]);
            scrollToBottom();

            // Démarre l'effet machine à écrire
            typeMessage(replyText, assistantMsgId);

        } catch (err) {
            setIsReturning(true);
            setIsLoading(false);
            await new Promise(resolve => setTimeout(resolve, 600));
            setIsReturning(false);

            const errorText = `Échec de la requête : ${err?.message || 'Erreur inconnue'}`;
            const assistantMsgId = Date.now() + 2;
            const assistantMsg = { id: assistantMsgId, role: 'assistant', text: '' };
            setMessages((prev) => [...prev, assistantMsg]);
            scrollToBottom();

            typeMessage(errorText, assistantMsgId);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Nettoyer l'intervalle
    onCleanup(() => {
        if (typingInterval) clearInterval(typingInterval);
    });

    onMount(() => {
        scrollToBottom();
    });

    // Fonction helper pour obtenir le texte affiché d'un message
    const getDisplayText = (msg) => {
        // Si ce message est en train d'être tapé, utilise typingText
        if (msg.id === typingMsgId()) {
            return typingText();
        }
        return msg.text;
    };

    return (
        <>
            {/* Bouton flottant */}
            <button
                class="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg cursor-pointer z-50 
               hover:scale-110 transition-transform duration-300 overflow-hidden
               border-4 border-gray-800 hover:border-fuchsia-500"
                onClick={toggleOpen}
                aria-label="Ouvrir l'assistant"
            >
                <img
                    src="/assistant.png"
                    alt="Chat Assistant"
                    class="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '💬';
                    }}
                />
            </button>

            {/* Boîte de dialogue */}
            <div
                class={`chat-widget-popup fixed bottom-24 right-6 w-80 sm:w-96 z-50 
                rounded-2xl shadow-2xl overflow-hidden flex flex-col
                ${isOpen() ? '' : 'hidden-popup'}`}
                style={{ height: '480px', 'max-height': 'calc(100vh - 120px)' }}
            >
                {/* Barre de titre */}
                <div class="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white px-4 py-3 flex items-center justify-between">
                    <span class="font-semibold">Nuit Assistant</span>
                    <button
                        onClick={toggleOpen}
                        class="text-white hover:bg-white/20 p-1 rounded transition-colors"
                        aria-label="Minimiser"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                </div>

                {/* Zone de messages */}
                <div
                    ref={scrollRef}
                    class="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100"
                >
                    <For each={messages()}>
                        {(msg) => (
                            <div class={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                {msg.role === 'assistant' && (
                                    <div class="flex-shrink-0 mr-2">
                                        <img
                                            src="/assistant.png"
                                            alt="Assistant"
                                            class="w-8 h-8 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23a855f7"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="white">🤖</text></svg>';
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    class={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                          ${msg.role === 'assistant'
                                            ? 'bg-base-300 rounded-tl-none'
                                            : 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-tr-none'}`}
                                >
                                    {getDisplayText(msg)}
                                    {/* Curseur de frappe */}
                                    <Show when={msg.role === 'assistant' && msg.id === typingMsgId()}>
                                        <span class="typing-cursor">|</span>
                                    </Show>
                                </div>
                            </div>
                        )}
                    </For>

                    {/* Indicateur de saisie de l'IA */}
                    <Show when={isLoading() || isReturning()}>
                        <div class="flex justify-start">
                            <div class="loading-avatar-container">
                                {/* Avatar roulant comme une roue */}
                                <img
                                    src="/assistant.png"
                                    alt="Assistant"
                                    class={`w-8 h-8 rounded-full object-cover spinning-avatar ${isReturning() ? 'returning-avatar' : 'rolling-avatar'}`}
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23a855f7"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="white">🤖</text></svg>';
                                    }}
                                />
                            </div>
                            <div class="bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl rounded-tl-none text-sm loading-text-box">
                                <span class="loading-text-scroll">AI est en train de réfléchir...</span>
                            </div>
                        </div>
                    </Show>
                </div>

                {/* Zone de saisie */}
                <div class="p-3 bg-base-300">
                    <div class="flex items-center gap-2 bg-base-100 rounded-full px-4 py-2">
                        <input
                            ref={inputRef}
                            type="text"
                            class="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
                            placeholder="Entrez votre message..."
                            value={text()}
                            onInput={(e) => setText(e.currentTarget.value)}
                            onKeyDown={onKeyDown}
                        />
                        <button
                            onClick={sendMessage}
                            class="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                            aria-label="Envoyer"
                        >
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatWidget;
