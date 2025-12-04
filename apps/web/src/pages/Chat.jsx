import { createSignal, For, onMount, onCleanup } from 'solid-js';

function Chat() {
  const [messages, setMessages] = createSignal([
    { id: 1, role: 'assistant', text: '你好，我是 Nuit Assistant，有什么可以帮你？' },
  ]);
  const [text, setText] = createSignal('');
  let inputRef;
  let scrollRef;

  const scrollToBottom = () => {
    queueMicrotask(() => {
      if (scrollRef) scrollRef.scrollTop = scrollRef.scrollHeight;
    });
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
    if (inputRef) inputRef.focus();
    scrollToBottom();
  });

  onCleanup(() => {});

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <img
          src="/assistant.png"
          alt="assistant"
          class="w-10 h-10 rounded-full"
          onError={(e) => {
            e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=='
          }}
        />
        <h1 class="text-3xl font-bold">Nuit Assistant</h1>
      </div>

      <div
        class="card bg-base-100 shadow-xl"
      >
        <div
          ref={scrollRef}
          class="card-body overflow-y-auto space-y-4"
          style={{ height: '60vh' }}
        >
          <For each={messages()}>
            {(msg) => (
              <div class={msg.role === 'assistant' ? 'chat chat-start' : 'chat chat-end'}>
                <div class="chat-image avatar">
                  <div class="w-8 rounded-full">
                    <img
                      src={msg.role === 'assistant' ? '/assistant.png' : 'https://api.dicebear.com/9.x/initials/svg?seed=U'}
                      alt="avatar"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=='
                      }}
                    />
                  </div>
                </div>
                <div class="chat-header">
                  {msg.role === 'assistant' ? 'Assistant' : 'You'}
                </div>
                <div class="chat-bubble">
                  {msg.text}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          class="input input-bordered flex-1"
          placeholder="输入消息，按 Enter 发送"
          value={text()}
          onInput={(e) => setText(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        <button class="btn btn-primary" onClick={sendMessage}>发送</button>
      </div>
    </div>
  );
}

export default Chat;
