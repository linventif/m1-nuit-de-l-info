import { createSignal, For, onMount } from 'solid-js';

function ChatWidget() {
    const [isOpen, setIsOpen] = createSignal(false);
    const [messages, setMessages] = createSignal([
        { id: 1, role: 'assistant', text: '你好！我是 Nuit Assistant，有什么可以帮你？' },
    ]);
    const [text, setText] = createSignal('');
    let inputRef;
    let scrollRef;

    const scrollToBottom = () => {
        queueMicrotask(() => {
            if (scrollRef) scrollRef.scrollTop = scrollRef.scrollHeight;
        });
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen());
        if (!isOpen()) {
            // 当打开时，聚焦输入框
            queueMicrotask(() => {
                if (inputRef) inputRef.focus();
                scrollToBottom();
            });
        }
    };

    const sendMessage = async () => {
        const value = text().trim();
        if (!value) return;

        const userMsg = { id: Date.now(), role: 'user', text: value };
        setMessages((prev) => [...prev, userMsg]);
        setText('');
        scrollToBottom();

        try {
            const res = await fetch('https://YOUR_N8N_WEBHOOK_URL', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: value }),
            });
            const data = await res.json().catch(() => ({ reply: '解析响应失败' }));
            const replyText = data?.reply ?? '助手没有返回内容';
            const assistantMsg = { id: Date.now() + 1, role: 'assistant', text: replyText };
            setMessages((prev) => [...prev, assistantMsg]);
            scrollToBottom();
        } catch (err) {
            const assistantMsg = { id: Date.now() + 2, role: 'assistant', text: `请求失败：${err?.message || '未知错误'}` };
            setMessages((prev) => [...prev, assistantMsg]);
            scrollToBottom();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    onMount(() => {
        scrollToBottom();
    });

    return (
        <>
            {/* 悬浮球 */}
            <button
                class="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg cursor-pointer z-50 
               hover:scale-110 transition-transform duration-300 overflow-hidden
               border-4 border-white hover:border-emerald-300"
                onClick={toggleOpen}
                aria-label="打开聊天助手"
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

            {/* 对话框 */}
            <div
                class={`chat-widget-popup fixed bottom-24 right-6 w-80 sm:w-96 z-50 
                rounded-2xl shadow-2xl overflow-hidden flex flex-col
                ${isOpen() ? '' : 'hidden-popup'}`}
                style={{ height: '480px', 'max-height': 'calc(100vh - 120px)' }}
            >
                {/* 标题栏 */}
                <div class="bg-emerald-500 text-white px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button class="text-white hover:bg-emerald-600 p-1 rounded">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span class="font-semibold">Nuit Assistant</span>
                    </div>
                    <button
                        onClick={toggleOpen}
                        class="text-white hover:bg-emerald-600 p-1 rounded transition-colors"
                        aria-label="最小化"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                    </button>
                </div>

                {/* 消息区域 */}
                <div
                    ref={scrollRef}
                    class="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
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
                                                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%2310b981"/><text x="50" y="65" font-size="50" text-anchor="middle" fill="white">🤖</text></svg>';
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    class={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                          ${msg.role === 'assistant'
                                            ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                                            : 'bg-emerald-500 text-white rounded-tr-none'}`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        )}
                    </For>
                </div>

                {/* 输入区域 */}
                <div class="p-3 bg-white border-t border-gray-100">
                    <div class="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                        <input
                            ref={inputRef}
                            type="text"
                            class="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            placeholder="输入消息..."
                            value={text()}
                            onInput={(e) => setText(e.currentTarget.value)}
                            onKeyDown={onKeyDown}
                        />
                        <button
                            onClick={sendMessage}
                            class="text-emerald-500 hover:text-emerald-600 transition-colors"
                            aria-label="发送"
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
