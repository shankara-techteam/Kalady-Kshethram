/**
 * chat-widget.js
 * Shankara Sevak — official virtual assistant widget.
 * Self-contained: injects its own DOM on load, styled by chat-widget.css.
 * Talks to the real backend at /api/chat (Groq-powered, knowledge-base grounded).
 */

(function () {
  "use strict";

  const API_ENDPOINT = "/api/chat";
  const AVATAR_SRC = "/chatbot/avatar.svg";
  const MAX_CLIENT_HISTORY = 8; // messages kept client-side for context (backend trims further)

  // Conversation history sent to the backend: [{role:'user'|'assistant', content:'...'}]
  let conversationHistory = [];
  let isWaitingForReply = false;

  const QUICK_REPLIES = [
    { label: "🪷 Timings", question: "What are the temple timings?" },
    { label: "🕉️ Sevas", question: "What sevas and pujas can I sponsor?" },
    { label: "🏡 Lodging", question: "Is accommodation available for pilgrims?" },
    { label: "📖 History", question: "Tell me about the significance of Kalady." },
    { label: "📍 Contact", question: "How can I contact the temple office?" },
  ];

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[tag] || tag));
  }

  // Converts plain-text bot reply (possibly with newlines) into safe paragraph HTML.
  function formatBotText(text) {
    return text
      .split(/\n{2,}/)
      .map((para) => `<p>${escapeHTML(para.trim()).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function buildWidgetMarkup() {
    return `
      <button id="ss-toggle-btn" class="ss-toggle-btn" aria-label="Open Shankara Sevak chat" aria-expanded="false">
        <img src="${AVATAR_SRC}" alt="" class="ss-toggle-avatar" />
        <span class="ss-toggle-label">Ask Shankara Sevak</span>
        <span class="ss-toggle-pulse" aria-hidden="true"></span>
      </button>

      <div id="ss-window" class="ss-window" role="dialog" aria-label="Shankara Sevak chat window">
        <div class="ss-header">
          <div class="ss-header-left">
            <div id="ss-header-avatar-wrap" class="ss-header-avatar-wrap">
              <img src="${AVATAR_SRC}" alt="" class="ss-header-avatar" />
            </div>
            <div>
              <div class="ss-header-title">Shankara Sevak</div>
              <div class="ss-header-subtitle">
                <span class="ss-status-dot"></span>
                Official Virtual Assistant
              </div>
            </div>
          </div>
          <button id="ss-close-btn" class="ss-close-btn" aria-label="Close chat">&times;</button>
        </div>

        <div id="ss-messages" class="ss-messages"></div>

        <form id="ss-input-form" class="ss-input-area">
          <input
            id="ss-input"
            class="ss-input"
            type="text"
            placeholder="Ask about timings, sevas, history..."
            autocomplete="off"
            aria-label="Type your question"
          />
          <button id="ss-send-btn" class="ss-send-btn" type="submit" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    `;
  }

  function renderBotMessage(html, { withChips = false } = {}) {
    const container = document.getElementById("ss-messages");
    const row = document.createElement("div");
    row.className = "ss-msg-row ss-bot";

    let chipsHTML = "";
    if (withChips) {
      chipsHTML = `<div class="ss-chips">${QUICK_REPLIES.map(
        (q, i) => `<button type="button" class="ss-chip" data-quick-index="${i}">${q.label}</button>`
      ).join("")}</div>`;
    }

    row.innerHTML = `
      <img src="${AVATAR_SRC}" alt="" class="ss-msg-avatar" />
      <div class="ss-bubble">${html}${chipsHTML}</div>
    `;
    container.appendChild(row);

    // Wire up chip clicks (only present on the greeting message)
    if (withChips) {
      row.querySelectorAll("[data-quick-index]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const q = QUICK_REPLIES[Number(btn.dataset.quickIndex)].question;
          sendMessage(q);
        });
      });
    }

    container.scrollTop = container.scrollHeight;
  }

  function renderUserMessage(text) {
    const container = document.getElementById("ss-messages");
    const row = document.createElement("div");
    row.className = "ss-msg-row ss-user";
    row.innerHTML = `<div class="ss-bubble">${escapeHTML(text)}</div>`;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;
  }

  function showTypingIndicator() {
    const container = document.getElementById("ss-messages");
    const row = document.createElement("div");
    row.id = "ss-typing-row";
    row.className = "ss-msg-row ss-bot";
    row.innerHTML = `
      <img src="${AVATAR_SRC}" alt="" class="ss-msg-avatar" />
      <div class="ss-bubble">
        <div class="ss-typing-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    container.appendChild(row);
    container.scrollTop = container.scrollHeight;

    const avatarWrap = document.getElementById("ss-header-avatar-wrap");
    if (avatarWrap) avatarWrap.classList.add("ss-thinking");
  }

  function hideTypingIndicator() {
    const row = document.getElementById("ss-typing-row");
    if (row) row.remove();

    const avatarWrap = document.getElementById("ss-header-avatar-wrap");
    if (avatarWrap) avatarWrap.classList.remove("ss-thinking");
  }

  async function sendMessage(text) {
    if (isWaitingForReply || !text || !text.trim()) return;
    isWaitingForReply = true;

    const sendBtn = document.getElementById("ss-send-btn");
    if (sendBtn) sendBtn.disabled = true;

    renderUserMessage(text);
    showTypingIndicator();

    const historyToSend = conversationHistory.slice(-MAX_CLIENT_HISTORY);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyToSend }),
      });

      const data = await response.json();
      hideTypingIndicator();

      if (!response.ok) {
        // Server already returns a calm, user-facing message for rate limits etc.
        renderBotMessage(formatBotText(data.error || "Something went wrong. Please try again shortly."));
      } else {
        renderBotMessage(formatBotText(data.reply));
        conversationHistory.push({ role: "user", content: text });
        conversationHistory.push({ role: "assistant", content: data.reply });
        conversationHistory = conversationHistory.slice(-MAX_CLIENT_HISTORY);
      }
    } catch (err) {
      hideTypingIndicator();
      console.error("Shankara Sevak widget error:", err);
      renderBotMessage(
        formatBotText(
          "I'm having trouble connecting right now. Please check your internet connection and try again."
        )
      );
    } finally {
      isWaitingForReply = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function showGreeting() {
    const greetingHTML = `
      <span class="ss-greeting-name">🙏 Namaste.</span>
      <p>Welcome to Adi Shankara Janmabhoomi Kshethram, Kalady. I am here to help answer questions based on the official knowledge base of the Kshethram.</p>
      <p>If the requested information is unavailable, I'll let you know and guide you to the appropriate official contact. How may I assist you today?</p>
    `;
    renderBotMessage(greetingHTML, { withChips: true });
  }

  function toggleWindow(forceState) {
    const win = document.getElementById("ss-window");
    const toggleBtn = document.getElementById("ss-toggle-btn");
    const isOpen = win.classList.contains("ss-open");
    const shouldOpen = forceState !== undefined ? forceState : !isOpen;

    win.classList.toggle("ss-open", shouldOpen);
    toggleBtn.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      document.getElementById("ss-input").focus();
    }
  }

  function init() {
    // Defensive guard: if this script is accidentally included twice on a
    // page, don't mount the widget (and its listeners/greeting) twice.
    if (window.__shankaraSevakInitialized) return;
    window.__shankaraSevakInitialized = true;

    const mount = document.createElement("div");
    mount.id = "ss-widget-root";
    mount.innerHTML = buildWidgetMarkup();
    document.body.appendChild(mount);

    document.getElementById("ss-toggle-btn").addEventListener("click", () => toggleWindow());
    document.getElementById("ss-close-btn").addEventListener("click", () => toggleWindow(false));

    document.getElementById("ss-input-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("ss-input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";
      sendMessage(text);
    });

    // Close on Escape for accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleWindow(false);
    });

    showGreeting();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
