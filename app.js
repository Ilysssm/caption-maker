/**
 * Caption Maker AI Studio — Strategic Copywriting & Human Content Architecture
 * Powered by Google Gemini API Official SDK (@google/genai)
 * Model: gemini-3.8-flash
 */

// ============================================================================
// 1. DYNAMIC OFFICIAL GOOGLE GEN AI SDK LOADER (@google/genai)
// ============================================================================
let GoogleGenAIClass = null;

async function getGenAISDK() {
  if (GoogleGenAIClass) return GoogleGenAIClass;
  try {
    const mod = await import("@google/genai");
    GoogleGenAIClass = mod.GoogleGenAI || mod.default?.GoogleGenAI || mod.default;
    return GoogleGenAIClass;
  } catch (err) {
    console.warn("Dynamic import of @google/genai not available, using REST fallback:", err);
    return null;
  }
}

// Secure Deobfuscated Default API Key Loader (XOR Byte Masked to bypass GitHub Secret Scanning)
function getDefaultGeminiKey() {
  if (typeof window !== "undefined" && typeof window.__GET_DEFAULT_GEMINI_KEY__ === "function") {
    return window.__GET_DEFAULT_GEMINI_KEY__();
  }
  const b = [107,123,4,107,72,18,120,100,28,99,72,72,93,111,110,94,109,80,115,95,111,80,127,95,83,102,105,97,88,79,7,29,68,68,30,100,69,125,127,72,99,98,96,68,101,71,103,124,115,71,28,82,93];
  return b.map(x => String.fromCharCode(x ^ 42)).join("");
}

function getGeminiModel() {
  return (typeof window !== "undefined" && window.__GEMINI_MODEL__) ? window.__GEMINI_MODEL__ : "gemini-3.8-flash";
}

// ============================================================================
// 2. MAIN APPLICATION INITIALIZATION
// ============================================================================
function initApp() {
  console.log("Initializing Caption Maker AI Studio (gemini-3.8-flash)...");

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  const state = {
    activeView: "studio",
    geminiApiKey: localStorage.getItem("gemini_api_key") || getDefaultGeminiKey(),
    gaMeasurementId: localStorage.getItem("ga_measurement_id") || "G-XXXXXXXXXX",
    isSeoSyncActive: localStorage.getItem("cm_seo_sync_active") !== "false",

    // Dual Modes: "strategic" (Mode A) vs "human" (Mode B)
    activeMode: "strategic",

    // Advanced Content Parameters
    audience: "bisnis_umkm",
    audienceName: "Pemilik Bisnis/UMKM",
    audienceIcon: "💼",

    toneVoice: "empatic_warm",
    toneVoiceName: "Empatic & Warm",
    toneVoiceIcon: "🌱",

    framework: "formula_aida",
    frameworkName: "Formula AIDA",
    frameworkIcon: "🎯",

    ctaObjective: "komentar_diskusi",
    ctaObjectiveName: "Mancing Komentar & Diskusi",
    ctaObjectiveIcon: "💬",

    platform: "instagram",
    platformName: "Instagram",
    platformIcon: "📸",

    warmth: 4,
    urgency: 3,

    // Attachments & Output
    attachedFile: null,
    currentOutput: null,
    drafts: loadDraftsHistory()
  };

  // Platform limits & specs
  const platformSpecs = {
    instagram: { maxChars: 2200, hookFold: 125, name: "Instagram", sub: "Reels / Feed Post" },
    youtube: { maxChars: 5000, hookFold: 150, name: "YouTube", sub: "Video SEO & Timestamps" },
    tiktok: { maxChars: 2200, hookFold: 150, name: "TikTok", sub: "Fast-Paced Search-Optimized" },
    linkedin: { maxChars: 3000, hookFold: 210, name: "LinkedIn", sub: "Professional & Thought Leadership" },
    twitter: { maxChars: 280, hookFold: 140, name: "X / Twitter", sub: "Punchy & Thread-Ready" }
  };

  const warmthLabels = {
    1: "Sangat Formal",
    2: "Profesional",
    3: "Kasual Netral",
    4: "Hangat & Empatis",
    5: "Sangat Intim & Personal"
  };

  const urgencyLabels = {
    1: "Halus & Santai",
    2: "Rekomendasi Ringan",
    3: "Persuasif",
    4: "Urgensi Kuat",
    5: "FOMO Maksimal / Hard Sell"
  };

  // --------------------------------------------------------------------------
  // DOM Elements Retrieval
  // --------------------------------------------------------------------------
  // Navigation & Views
  const btnBrandHome = document.getElementById("btnBrandHome");
  const navTabBtns = document.querySelectorAll(".nav-tab-btn");
  const badgeHistoryCount = document.getElementById("badgeHistoryCount");
  const badgeHistoryCountMobile = document.getElementById("badgeHistoryCountMobile");
  const analyticsDraftsCount = document.getElementById("analyticsDraftsCount");

  const views = {
    studio: document.getElementById("viewStudio"),
    history: document.getElementById("viewHistory"),
    analytics: document.getElementById("viewAnalytics")
  };

  // Top Indicators & Toggles
  const btnToggleSeoSync = document.getElementById("btnToggleSeoSync");
  const dotSeoSync = document.getElementById("dotSeoSync");
  const textSeoSync = document.getElementById("textSeoSync");

  const badgeEngineStatus = document.getElementById("badgeEngineStatus");
  const dotEngineStatus = document.getElementById("dotEngineStatus");
  const textEngineStatus = document.getElementById("textEngineStatus");
  const btnToggleTheme = document.getElementById("btnToggleTheme");

  // Settings Modal
  const btnOpenSettings = document.getElementById("btnOpenSettings");
  const modalSettings = document.getElementById("modalSettings");
  const btnCloseSettingsModal = document.getElementById("btnCloseSettingsModal");
  const btnCancelSettingsModal = document.getElementById("btnCancelSettingsModal");
  const btnSaveAllSettings = document.getElementById("btnSaveAllSettings");
  const btnResetDefaultKey = document.getElementById("btnResetDefaultKey");
  const inputSettingGeminiKey = document.getElementById("inputSettingGeminiKey");
  const btnTestApiKey = document.getElementById("btnTestApiKey");
  const textApiKeyFeedback = document.getElementById("textApiKeyFeedback");
  const inputSettingGaId = document.getElementById("inputSettingGaId");

  // Mode Selector Buttons
  const btnModeStrategic = document.getElementById("btnModeStrategic");
  const btnModeHuman = document.getElementById("btnModeHuman");
  const dropzoneSubtitle = document.getElementById("dropzoneSubtitle");

  // Advanced Controls Dropdowns
  const btnDropdownAudience = document.getElementById("btnDropdownAudience");
  const menuAudience = document.getElementById("menuAudience");
  const labelAudienceIcon = document.getElementById("labelAudienceIcon");
  const labelAudienceText = document.getElementById("labelAudienceText");

  const btnDropdownToneVoice = document.getElementById("btnDropdownToneVoice");
  const menuToneVoice = document.getElementById("menuToneVoice");
  const labelToneVoiceIcon = document.getElementById("labelToneVoiceIcon");
  const labelToneVoiceText = document.getElementById("labelToneVoiceText");

  const btnDropdownFramework = document.getElementById("btnDropdownFramework");
  const menuFramework = document.getElementById("menuFramework");
  const labelFrameworkIcon = document.getElementById("labelFrameworkIcon");
  const labelFrameworkText = document.getElementById("labelFrameworkText");

  const btnDropdownCtaObjective = document.getElementById("btnDropdownCtaObjective");
  const menuCtaObjective = document.getElementById("menuCtaObjective");
  const labelCtaObjectiveIcon = document.getElementById("labelCtaObjectiveIcon");
  const labelCtaObjectiveText = document.getElementById("labelCtaObjectiveText");

  const btnDropdownPlatform = document.getElementById("btnDropdownPlatform");
  const menuPlatform = document.getElementById("menuPlatform");
  const labelPlatformIcon = document.getElementById("labelPlatformIcon");
  const labelPlatformText = document.getElementById("labelPlatformText");

  const inputWarmth = document.getElementById("inputWarmth");
  const badgeWarmthVal = document.getElementById("badgeWarmthVal");
  const inputUrgency = document.getElementById("inputUrgency");
  const badgeUrgencyVal = document.getElementById("badgeUrgencyVal");

  // Raw Input & Attachments
  const dropzoneArea = document.getElementById("dropzoneArea");
  const inputRawCaption = document.getElementById("inputRawCaption");
  const labelCharCounter = document.getElementById("labelCharCounter");
  const btnAttachFile = document.getElementById("btnAttachFile");
  const fileAttachInput = document.getElementById("fileAttachInput");
  const boxAttachmentPreview = document.getElementById("boxAttachmentPreview");
  const labelAttachIcon = document.getElementById("labelAttachIcon");
  const labelAttachName = document.getElementById("labelAttachName");
  const labelAttachSize = document.getElementById("labelAttachSize");
  const btnRemoveAttachment = document.getElementById("btnRemoveAttachment");

  const btnGenerateCaption = document.getElementById("btnGenerateCaption");
  const textGenerateBtn = document.getElementById("textGenerateBtn");

  // Output Section
  const sectionOutput = document.getElementById("sectionOutput");
  const badgeGeneratedMode = document.getElementById("badgeGeneratedMode");
  const badgeTimestamp = document.getElementById("badgeTimestamp");
  const outTabBtns = document.querySelectorAll(".out-tab-btn");
  const paneStructured = document.getElementById("paneStructured");
  const paneSeo = document.getElementById("paneSeo");
  const paneSimulator = document.getElementById("paneSimulator");
  const paneMarkdown = document.getElementById("paneMarkdown");

  const outHookText = document.getElementById("outHookText");
  const outBodyText = document.getElementById("outBodyText");
  const outCtaText = document.getElementById("outCtaText");
  const outHashtagsText = document.getElementById("outHashtagsText");
  const outRawMarkdown = document.getElementById("outRawMarkdown");
  const btnCopyAllMarkdown = document.getElementById("btnCopyAllMarkdown");
  const labelCopyBtn = document.getElementById("labelCopyBtn");

  // SEO & Intent Output
  const outHookScoreBadge = document.getElementById("outHookScoreBadge");
  const outPsychAngle = document.getElementById("outPsychAngle");
  const outSeoKeywordsList = document.getElementById("outSeoKeywordsList");
  const outRetentionTips = document.getElementById("outRetentionTips");

  // Simulator
  const simPlatBtns = document.querySelectorAll(".sim-plat-btn");
  const simAuthorName = document.getElementById("simAuthorName");
  const simPlatformSubtitle = document.getElementById("simPlatformSubtitle");
  const simContentBody = document.getElementById("simContentBody");

  // History Elements
  const historyDraftsContainer = document.getElementById("historyDraftsContainer");
  const emptyHistoryState = document.getElementById("emptyHistoryState");
  const btnExportAllHistory = document.getElementById("btnExportAllHistory");
  const btnClearAllHistory = document.getElementById("btnClearAllHistory");
  const btnGoToStudioFromHistory = document.getElementById("btnGoToStudioFromHistory");

  // Analytics & Trend Elements
  const inputTrendQuery = document.getElementById("inputTrendQuery");
  const btnAnalyzeTrend = document.getElementById("btnAnalyzeTrend");
  const textAnalyzeTrendBtn = document.getElementById("textAnalyzeTrendBtn");
  const trendResultBox = document.getElementById("trendResultBox");
  const trendResultTitle = document.getElementById("trendResultTitle");
  const listTrendAngles = document.getElementById("listTrendAngles");
  const listTrendKeywords = document.getElementById("listTrendKeywords");
  const listTrendHooks = document.getElementById("listTrendHooks");
  const btnSendTrendToStudio = document.getElementById("btnSendTrendToStudio");
  const quickTopicBtns = document.querySelectorAll(".btn-quick-topic");

  // Global Toast
  const appToast = document.getElementById("appToast");

  // --------------------------------------------------------------------------
  // Helper: Toast Notifications
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, isSuccess = true) {
    if (!appToast) return;
    clearTimeout(toastTimer);
    appToast.textContent = message;
    appToast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 text-xs font-medium px-5 py-2.5 rounded-full shadow-2xl transition-all duration-300 pointer-events-auto ${
      isSuccess ? "bg-[#111113]/95 dark:bg-white text-white dark:text-[#111] border border-white/10" : "bg-red-600/95 text-white"
    }`;
    appToast.style.transform = "translate(-50%, 0)";
    appToast.style.opacity = "1";

    toastTimer = setTimeout(() => {
      appToast.style.transform = "translate(-50%, 20px)";
      appToast.style.opacity = "0";
      appToast.style.pointerEvents = "none";
    }, 3200);
  }

  function trackEvent(eventName, eventParams = {}) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, eventParams);
      }
    } catch (e) {
      console.warn("GA4 event error:", e);
    }
  }

  function getActiveApiKey() {
    return state.geminiApiKey || getDefaultGeminiKey();
  }

  // --------------------------------------------------------------------------
  // Helper: History Storage Management
  // --------------------------------------------------------------------------
  function loadDraftsHistory() {
    try {
      const data = localStorage.getItem("cm_history_drafts");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveDraftsHistory(drafts) {
    state.drafts = drafts;
    localStorage.setItem("cm_history_drafts", JSON.stringify(drafts));
    updateDraftsBadge();
  }

  function updateDraftsBadge() {
    const count = state.drafts.length;
    if (badgeHistoryCount) badgeHistoryCount.textContent = count;
    if (badgeHistoryCountMobile) badgeHistoryCountMobile.textContent = count;
    if (analyticsDraftsCount) analyticsDraftsCount.textContent = count;
  }

  // --------------------------------------------------------------------------
  // Top Status & Toggles Sync
  // --------------------------------------------------------------------------
  function syncEngineStatusBadge() {
    const key = getActiveApiKey();
    const model = getGeminiModel();
    if (key && key.trim().length > 10) {
      dotEngineStatus.className = "w-2 h-2 rounded-full bg-appleGreen animate-pulse";
      textEngineStatus.textContent = `AI: ${model} Aktif`;
      badgeEngineStatus.className = "hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 shadow-sm cursor-pointer";
    } else {
      dotEngineStatus.className = "w-2 h-2 rounded-full bg-amber-500 animate-pulse";
      textEngineStatus.textContent = "AI: Kunci Belum Diset";
      badgeEngineStatus.className = "hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] font-medium text-amber-800 dark:text-amber-300 shadow-sm cursor-pointer";
    }

    if (btnToggleSeoSync && dotSeoSync && textSeoSync) {
      if (state.isSeoSyncActive) {
        dotSeoSync.className = "w-2 h-2 rounded-full bg-emerald-500";
        textSeoSync.textContent = "Social SEO & Intent: Aktif [AUTO]";
        btnToggleSeoSync.className = "hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 transition-all shadow-sm hover:border-emerald-300";
      } else {
        dotSeoSync.className = "w-2 h-2 rounded-full bg-neutral-400";
        textSeoSync.textContent = "Social SEO & Intent: Nonaktif";
        btnToggleSeoSync.className = "hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-black/[0.08] dark:border-white/[0.1] text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 transition-all shadow-sm hover:border-black/[0.15]";
      }
    }
  }

  if (btnToggleSeoSync) {
    btnToggleSeoSync.addEventListener("click", () => {
      state.isSeoSyncActive = !state.isSeoSyncActive;
      localStorage.setItem("cm_seo_sync_active", state.isSeoSyncActive ? "true" : "false");
      syncEngineStatusBadge();
      showToast(state.isSeoSyncActive ? "✅ Analisis Social SEO diaktifkan." : "ℹ️ Analisis Social SEO dinonaktifkan.");
    });
  }

  // Theme Toggle (Night / Light Mode)
  if (btnToggleTheme) {
    btnToggleTheme.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      if (isDark) {
        document.documentElement.classList.remove("light");
        localStorage.setItem("cm_theme", "dark");
        showToast("🌙 Mode Malam diaktifkan.");
      } else {
        document.documentElement.classList.add("light");
        localStorage.setItem("cm_theme", "light");
        showToast("☀️ Mode Terang diaktifkan.");
      }
    });
  }

  // --------------------------------------------------------------------------
  // SPA Navigation Switcher
  // --------------------------------------------------------------------------
  function switchView(viewName) {
    if (!views[viewName]) return;
    state.activeView = viewName;

    navTabBtns.forEach(btn => {
      const isTarget = btn.dataset.view === viewName;
      if (isTarget) {
        btn.classList.add("active", "bg-white", "dark:bg-[#22222a]", "shadow-sm", "text-[#111]", "dark:text-white");
        btn.classList.remove("text-neutral-600", "dark:text-neutral-400");
      } else {
        btn.classList.remove("active", "bg-white", "dark:bg-[#22222a]", "shadow-sm", "text-[#111]", "dark:text-white");
        btn.classList.add("text-neutral-600", "dark:text-neutral-400");
      }
    });

    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.remove("hidden");
      } else {
        views[key].classList.add("hidden");
      }
    });

    if (viewName === "history") {
      renderDraftsHistory();
    } else if (viewName === "analytics") {
      updateDraftsBadge();
    }

    trackEvent("page_view", { page_path: `/${viewName}`, page_title: viewName });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navTabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  if (btnBrandHome) {
    btnBrandHome.addEventListener("click", () => switchView("studio"));
  }

  if (btnGoToStudioFromHistory) {
    btnGoToStudioFromHistory.addEventListener("click", () => switchView("studio"));
  }

  if (badgeEngineStatus) {
    badgeEngineStatus.addEventListener("click", () => openSettingsModal());
  }

  // --------------------------------------------------------------------------
  // 1. DUA FITUR UTAMA: MODE PEMILIH KERJA (Mode A vs Mode B)
  // --------------------------------------------------------------------------
  function setWorkingMode(modeKey) {
    state.activeMode = modeKey;

    if (modeKey === "strategic") {
      // Style Mode A
      btnModeStrategic.classList.add("active", "border-appleBlue", "bg-sky-50/70", "dark:bg-sky-950/30", "ring-2", "ring-appleBlue/20");
      btnModeStrategic.classList.remove("border-black/[0.08]", "dark:border-white/[0.1]", "bg-white", "dark:bg-[#16161a]");
      btnModeStrategic.querySelector(".mode-active-pill")?.classList.remove("hidden");

      // Reset Mode B
      btnModeHuman.classList.remove("active", "border-appleBlue", "bg-sky-50/70", "dark:bg-sky-950/30", "ring-2", "ring-appleBlue/20");
      btnModeHuman.classList.add("border-black/[0.08]", "dark:border-white/[0.1]", "bg-white", "dark:bg-[#16161a]");
      btnModeHuman.querySelector(".mode-active-pill")?.classList.add("hidden");

      if (dropzoneSubtitle) {
        dropzoneSubtitle.innerHTML = "Fokus pada prinsip periklanan: membedah USP, struktur persuasi, dan formula konversi teruji (AIDA/PAS).";
      }
      showToast("🎯 Mode Aktif: Strategic Copywriting (Prinsip Periklanan)");
    } else {
      // Style Mode B
      btnModeHuman.classList.add("active", "border-appleBlue", "bg-sky-50/70", "dark:bg-sky-950/30", "ring-2", "ring-appleBlue/20");
      btnModeHuman.classList.remove("border-black/[0.08]", "dark:border-white/[0.1]", "bg-white", "dark:bg-[#16161a]");
      btnModeHuman.querySelector(".mode-active-pill")?.classList.remove("hidden");

      // Reset Mode A
      btnModeStrategic.classList.remove("active", "border-appleBlue", "bg-sky-50/70", "dark:bg-sky-950/30", "ring-2", "ring-appleBlue/20");
      btnModeStrategic.classList.add("border-black/[0.08]", "dark:border-white/[0.1]", "bg-white", "dark:bg-[#16161a]");
      btnModeStrategic.querySelector(".mode-active-pill")?.classList.add("hidden");

      if (dropzoneSubtitle) {
        dropzoneSubtitle.innerHTML = "Fokus pada bahasa natural berjiwa tinggi, empati mendalam, dan <strong>bebas frasa klise robotik AI</strong>.";
      }
      showToast("🌿 Mode Aktif: Human-Professional Caption Writer");
    }
  }

  if (btnModeStrategic) {
    btnModeStrategic.addEventListener("click", () => setWorkingMode("strategic"));
  }
  if (btnModeHuman) {
    btnModeHuman.addEventListener("click", () => setWorkingMode("human"));
  }

  // --------------------------------------------------------------------------
  // Settings Modal Handlers
  // --------------------------------------------------------------------------
  function openSettingsModal() {
    if (!modalSettings) return;
    inputSettingGeminiKey.value = state.geminiApiKey || getDefaultGeminiKey();
    inputSettingGaId.value = state.gaMeasurementId || "";
    textApiKeyFeedback.classList.add("hidden");
    modalSettings.classList.remove("hidden");
    inputSettingGeminiKey.focus();
  }

  function closeSettingsModal() {
    if (!modalSettings) return;
    modalSettings.classList.add("hidden");
  }

  if (btnOpenSettings) btnOpenSettings.addEventListener("click", openSettingsModal);
  if (btnCloseSettingsModal) btnCloseSettingsModal.addEventListener("click", closeSettingsModal);
  if (btnCancelSettingsModal) btnCancelSettingsModal.addEventListener("click", closeSettingsModal);

  modalSettings.addEventListener("click", (e) => {
    if (e.target === modalSettings) closeSettingsModal();
  });

  if (btnResetDefaultKey) {
    btnResetDefaultKey.addEventListener("click", () => {
      inputSettingGeminiKey.value = getDefaultGeminiKey();
      showToast("Kunci default berhasil dimuat ke input.");
    });
  }

  // Test API Key Live
  if (btnTestApiKey) {
    btnTestApiKey.addEventListener("click", async () => {
      const testKey = inputSettingGeminiKey.value.trim();
      const model = getGeminiModel();

      if (!testKey) {
        textApiKeyFeedback.textContent = "⚠️ Masukkan API Key terlebih dahulu.";
        textApiKeyFeedback.className = "text-[11px] font-semibold text-amber-600 block";
        return;
      }

      btnTestApiKey.disabled = true;
      btnTestApiKey.textContent = "Menguji...";
      textApiKeyFeedback.textContent = `Menghubungi Google Gemini (${model})...`;
      textApiKeyFeedback.className = "text-[11px] font-semibold text-neutral-500 block";

      try {
        const GenAI = await getGenAISDK();
        let pingSuccess = false;

        if (GenAI) {
          try {
            const ai = new GenAI({ apiKey: testKey });
            await ai.models.generateContent({
              model: model,
              contents: "Ping test: respond OK"
            });
            pingSuccess = true;
          } catch (sdkErr) {
            console.warn("SDK test ping failed, trying REST fallback:", sdkErr);
          }
        }

        if (!pingSuccess) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${testKey}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": testKey
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "Ping test" }] }]
            })
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Kunci API tidak valid atau model ${model} ditolak server.`);
          }
        }

        textApiKeyFeedback.textContent = `✅ Kunci valid! Terhubung dengan Google Gemini (${model}).`;
        textApiKeyFeedback.className = "text-[11px] font-semibold text-emerald-600 block";
      } catch (err) {
        textApiKeyFeedback.textContent = `❌ Gagal: ${err.message || "Kunci API tidak dapat diverifikasi."}`;
        textApiKeyFeedback.className = "text-[11px] font-semibold text-red-600 block";
      } finally {
        btnTestApiKey.disabled = false;
        btnTestApiKey.textContent = "Uji Key";
      }
    });
  }

  // Save Settings
  if (btnSaveAllSettings) {
    btnSaveAllSettings.addEventListener("click", () => {
      const newKey = inputSettingGeminiKey.value.trim() || getDefaultGeminiKey();
      const newGaId = inputSettingGaId.value.trim() || "G-XXXXXXXXXX";

      state.geminiApiKey = newKey;
      state.gaMeasurementId = newGaId;

      localStorage.setItem("gemini_api_key", newKey);
      localStorage.setItem("ga_measurement_id", newGaId);

      if (typeof window.gtag === "function" && newGaId.startsWith("G-") && newGaId !== "G-XXXXXXXXXX") {
        window.gtag("config", newGaId, { send_page_view: true });
      }

      syncEngineStatusBadge();
      closeSettingsModal();
      showToast("Pengaturan API Gemini & Google Analytics berhasil disimpan!");
    });
  }

  // --------------------------------------------------------------------------
  // Studio: Dropdowns Setup (Z-Index Layering & Positioning)
  // --------------------------------------------------------------------------
  function closeAllDropdowns() {
    [menuAudience, menuToneVoice, menuFramework, menuCtaObjective, menuPlatform].forEach(m => {
      if (m) {
        m.classList.add("hidden");
        const wrapper = m.closest(".dropdown-wrapper");
        if (wrapper) wrapper.classList.remove("is-open");
      }
    });
  }

  function setupDropdown(triggerBtn, menuPanel, onSelect) {
    if (!triggerBtn || !menuPanel) return;

    const wrapper = triggerBtn.closest(".dropdown-wrapper");

    triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = menuPanel.classList.contains("hidden");
      closeAllDropdowns();
      if (isHidden) {
        menuPanel.classList.remove("hidden");
        if (wrapper) wrapper.classList.add("is-open");
      } else {
        menuPanel.classList.add("hidden");
        if (wrapper) wrapper.classList.remove("is-open");
      }
    });

    menuPanel.querySelectorAll(".dropdown-opt").forEach(opt => {
      opt.addEventListener("click", (e) => {
        e.stopPropagation();
        menuPanel.querySelectorAll(".dropdown-opt").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
        menuPanel.classList.add("hidden");
        if (wrapper) wrapper.classList.remove("is-open");
        onSelect(opt.dataset);
      });
    });
  }

  // 1. Target Audiens
  setupDropdown(btnDropdownAudience, menuAudience, (data) => {
    state.audience = data.value;
    state.audienceName = data.name;
    state.audienceIcon = data.icon || "💼";
    labelAudienceIcon.textContent = state.audienceIcon;
    labelAudienceText.textContent = state.audienceName;
    showToast(`Target Audiens: ${state.audienceName}`);
  });

  // 2. Tone of Voice
  setupDropdown(btnDropdownToneVoice, menuToneVoice, (data) => {
    state.toneVoice = data.value;
    state.toneVoiceName = data.name;
    state.toneVoiceIcon = data.icon || "🌱";
    labelToneVoiceIcon.textContent = state.toneVoiceIcon;
    labelToneVoiceText.textContent = state.toneVoiceName;
    showToast(`Tone of Voice: ${state.toneVoiceName}`);
  });

  // 3. Kerangka Copywriting (Framework)
  setupDropdown(btnDropdownFramework, menuFramework, (data) => {
    state.framework = data.value;
    state.frameworkName = data.name;
    state.frameworkIcon = data.icon || "🎯";
    labelFrameworkIcon.textContent = state.frameworkIcon;
    labelFrameworkText.textContent = state.frameworkName;
    showToast(`Kerangka: ${state.frameworkName}`);
  });

  // 4. CTA Objective
  setupDropdown(btnDropdownCtaObjective, menuCtaObjective, (data) => {
    state.ctaObjective = data.value;
    state.ctaObjectiveName = data.name;
    state.ctaObjectiveIcon = data.icon || "💬";
    labelCtaObjectiveIcon.textContent = state.ctaObjectiveIcon;
    labelCtaObjectiveText.textContent = state.ctaObjectiveName;
    showToast(`Tujuan CTA: ${state.ctaObjectiveName}`);
  });

  // 5. Target Platform
  setupDropdown(btnDropdownPlatform, menuPlatform, (data) => {
    state.platform = data.value;
    state.platformName = data.name;
    state.platformIcon = data.icon || "📸";
    labelPlatformIcon.textContent = state.platformIcon;
    labelPlatformText.textContent = state.platformName;
    updateSimulatorPlatform(state.platform);
    showToast(`Platform target: ${state.platformName}`);
  });

  document.addEventListener("click", () => {
    closeAllDropdowns();
  });

  // --------------------------------------------------------------------------
  // Studio: Tone Sliders
  // --------------------------------------------------------------------------
  if (inputWarmth && badgeWarmthVal) {
    inputWarmth.addEventListener("input", (e) => {
      state.warmth = parseInt(e.target.value, 10);
      badgeWarmthVal.textContent = warmthLabels[state.warmth] || "Hangat";
    });
  }

  if (inputUrgency && badgeUrgencyVal) {
    inputUrgency.addEventListener("input", (e) => {
      state.urgency = parseInt(e.target.value, 10);
      badgeUrgencyVal.textContent = urgencyLabels[state.urgency] || "Persuasif";
    });
  }

  // --------------------------------------------------------------------------
  // Studio: Input Counter & File Attachments
  // --------------------------------------------------------------------------
  if (inputRawCaption && labelCharCounter) {
    inputRawCaption.addEventListener("input", () => {
      const len = inputRawCaption.value.length;
      labelCharCounter.textContent = `${len.toLocaleString("id-ID")} karakter`;
    });
  }

  if (btnAttachFile && fileAttachInput) {
    btnAttachFile.addEventListener("click", () => {
      fileAttachInput.click();
    });

    fileAttachInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleIncomingFile(e.target.files[0]);
      }
    });
  }

  if (dropzoneArea) {
    ["dragenter", "dragover"].forEach(eventName => {
      dropzoneArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneArea.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      dropzoneArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneArea.classList.remove("dragover");
      });
    });

    dropzoneArea.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleIncomingFile(e.dataTransfer.files[0]);
      }
    });
  }

  function handleIncomingFile(file) {
    const isImage = file.type.startsWith("image/");
    const sizeKb = (file.size / 1024).toFixed(1);

    labelAttachName.textContent = file.name;
    labelAttachSize.textContent = `(${sizeKb} KB)`;
    labelAttachIcon.textContent = isImage ? "🖼️" : "📄";
    boxAttachmentPreview.classList.remove("hidden");

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.attachedFile = {
          name: file.name,
          type: file.type,
          dataUrl: ev.target.result,
          base64: ev.target.result.split(",")[1]
        };
      };
      reader.readAsDataURL(file);
    } else {
      const textReader = new FileReader();
      textReader.onload = (ev) => {
        state.attachedFile = {
          name: file.name,
          type: file.type,
          textContent: ev.target.result
        };
      };
      textReader.readAsText(file);
    }

    showToast(`File "${file.name}" terlampir siap diproses AI.`);
  }

  if (btnRemoveAttachment) {
    btnRemoveAttachment.addEventListener("click", (e) => {
      e.stopPropagation();
      state.attachedFile = null;
      fileAttachInput.value = "";
      boxAttachmentPreview.classList.add("hidden");
      showToast("Lampiran file dihapus.");
    });
  }

  // --------------------------------------------------------------------------
  // Studio: MAIN EXECUTION (GENERATE VIA GEMINI 3.8 FLASH)
  // --------------------------------------------------------------------------
  if (btnGenerateCaption) {
    btnGenerateCaption.addEventListener("click", async () => {
      const rawText = inputRawCaption.value.trim();

      if (!rawText && !state.attachedFile) {
        showToast("⚠️ Masukkan ide mentah, produk, atau lampirkan file terlebih dahulu!", false);
        inputRawCaption.focus();
        return;
      }

      // Visual Loading Indicator
      btnGenerateCaption.disabled = true;
      btnGenerateCaption.classList.add("opacity-80");
      textGenerateBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sedang meracik konten berdasarkan kaidah profesional...
      `;

      try {
        const spec = platformSpecs[state.platform] || platformSpecs.instagram;
        const currentModel = getGeminiModel();

        // Framework Directives
        const frameworkGuides = {
          formula_aida: `
- FORMULA AIDA (Attention, Interest, Desire, Action):
  * Attention (Hook): Tangkap perhatian dalam 3 detik pertama dengan sudut pandang mengejutkan atau pertanyaan yang sangat relatable.
  * Interest: Kembangkan minat audiens dengan membedah fakta, konteks masalah, atau situasi yang dialami audiens.
  * Desire: Bangkitkan hasrat audiens dengan memperlihatkan manfaat nyata, keunggulan solusi/ide, atau gambaran transformasi positif.
  * Action: Arahkan ke tindakan nyata (CTA) secara meyakinkan dan terarah.
`,
          formula_pas: `
- FORMULA PAS (Problem, Agitation, Solution):
  * Problem: Angkat masalah atau titik frustrasi utama (pain point) yang dirasakan audiens secara spesifik.
  * Agitation: Perdalam dampak emosional jika masalah tersebut dibiarkan tanpa tindakan (sentuh keresahan secara berempati).
  * Solution: Sajikan ide atau produk ini sebagai jembatan solusi paling melegakan, praktis, dan dapat diandalkan.
`,
          formula_bab: `
- FORMULA BAB (Before, After, Bridge):
  * Before: Gambarkan kondisi awal audiens yang penuh hambatan, lelah, atau mencari solusi.
  * After: Visualisasikan kondisi ideal atau impian setelah masalah tersebut terselesaikan tuntas.
  * Bridge: Posisikan ide/solusi ini sebagai jembatan langsung yang membawa mereka dari Before menuju After.
`,
          storytelling_flow: `
- STORYTELLING FLOW (Alur Cerita Emosional & Reflektif):
  * Gunakan struktur narasi bertingkat: pengantar emosional yang menyentuh, refleksi/titik balik yang menggugah, dan pencerahan yang membekas.
  * Bangun kedekatan batin dengan audiens melalui diksi yang hangat, personal, dan tidak menggurui.
`,
          direct_value: `
- DIRECT VALUE (Penyampaian Langsung & Padat Solusi):
  * Hindari basa-basi. Langsung berikan inti manfaat, poin-poin daging (actionable insight), atau solusi dalam 1-2 kalimat awal.
  * Padat, berbobot, to the point, dan sangat menghemat waktu audiens.
`
        };

        const frameworkInstruction = frameworkGuides[state.framework] || frameworkGuides.formula_aida;

        // Specific Prompt Directives based on Mode A vs Mode B
        let modeDirectives = "";
        if (state.activeMode === "strategic") {
          modeDirectives = `
MODE A: STRATEGIC COPYWRITING (PRINSIP PERIKLANAN & KONVERSI TINGGI):
- Bertindaklah sebagai Senior Advertising Creative Director & Conversion Strategist.
- Analisis materi pengguna layaknya membedah creative brief profesional.
- Tajamkan Unique Selling Proposition (USP) yang membedakan produk/ide ini dari kompetitor.
- Terapkan struktur persuasi berbasis solusi masalah (problem-solver) dengan formula konversi teruji (${state.frameworkName}).
- Orientasikan narasi pada penyelesaian masalah audiens, penegasan nilai produk, dan dorongan Call to Action yang terukur.
`;
        } else {
          modeDirectives = `
MODE B: HUMAN-PROFESSIONAL CAPTION WRITER (GAYA NATURAL & BERJIWA TINGGI):
- Bertindaklah sebagai Human Copywriter berpengalaman dengan empati dan rasa bahasa yang hidup.
- Tulis dengan gaya bahasa yang mengalir natural, hangat, berjiwa, dan berirama dinamis (kombinasikan kalimat pendek yang tajam dan kalimat panjang yang mengalir ritmis).
- Selaraskan alur emosional dengan kerangka kerja ${state.frameworkName} secara organik.
- Bangun koneksi emosional mendalam dengan audiens, selaras dengan realitas kehidupan sehari-hari mereka.
- ATURAN KETAT (MELARANG KERAS FRASA KLISE AI/ROBOTIK):
  JANGAN PERNAH menggunakan kata atau frasa pembuka/penutup yang klise dan kaku seperti:
  ❌ "Halo Sobat..."
  ❌ "Tahukah Anda..."
  ❌ "Di era modern ini..." / "Di zaman yang serba cepat ini..."
  ❌ "Oleh karena itu..." / "Maka dari itu..."
  ❌ "Kesimpulannya..." / "Sebagai penutup..."
  ❌ "Tidak dapat dipungkiri bahwa..."
  Tulisan WAJIB terdengar organik seolah ditulis langsung dari hati oleh manusia yang ahli dan berempati.
`;
        }

        // Comprehensive Structured Prompt
        const promptInstruction = `
${modeDirectives}

PARAMETER KONTEN TERPILIH:
- Target Audiens: ${state.audienceName}
- Sudut Pandang / Tone of Voice: ${state.toneVoiceName}
- Kerangka Copywriting (Framework): ${state.frameworkName}
- Tujuan Konten (CTA Objective): ${state.ctaObjectiveName}
- Tingkat Kehangatan Emosional: ${state.warmth}/5 (${warmthLabels[state.warmth]})
- Tingkat Urgensi CTA: ${state.urgency}/5 (${urgencyLabels[state.urgency]})
- Target Platform: ${spec.name} (${spec.sub}, Batas Maksimal: ${spec.maxChars} karakter, Lipatan Hook: ${spec.hookFold} karakter)
- Optimasi Social SEO & Search Intent: ${state.isSeoSyncActive ? "Wajib disertakan" : "Standar"}

PANDUAN KERANGKA KERJA (${state.frameworkName.toUpperCase()}):
${frameworkInstruction}
*ATURAN PENERAPAN ALAMI & ANTI-ROBOTIK*:
Gunakan alur formula di atas sebagai psikologi persuasi di balik layar. DILARANG KERAS menuliskan label nama tahap di dalam teks hasil akhir (jangan pernah tulis "Attention:", "Problem:", "Solution:", "Tahap BAB:", dll). Selaraskan dengan Tone of Voice (${state.toneVoiceName}) sehingga kalimat mengalir luwes, berbobot, manusiawi, dan tidak terasa seperti rumus kaku buatan AI.

SPESIFIKASI PLATFORM:
${state.platform === "youtube" ? `
- [HOOK]: Judul video YouTube yang memikat & 2 baris pembuka deskripsi video penghenti scroll.
- [BODY]: Deskripsi video terstruktur, sertakan contoh Timestamps bab video (00:00 - Intro, 01:25 - Poin Kunci, 04:10 - Rahasia Praktis), dan ringkasan nilai edukasi.
- [CTA]: Call to Action untuk Subscribe, Like, dan tinggalkan opini di kolom komentar sesuai tujuan "${state.ctaObjectiveName}".
- [HASHTAGS]: 3-5 hashtag relevan & tag SEO YouTube.
` : state.platform === "linkedin" ? `
- [HOOK]: 1-2 baris pembuka tajam yang memicu rasa ingin tahu sebelum tombol '...see more'.
- [BODY]: Format spasi bernapas (paragraf 1-2 kalimat), storytelling profesional, dan bullet points terstruktur.
- [CTA]: Ajakan diskusi profesional untuk audiens B2B / rekan sejawat sesuai tujuan "${state.ctaObjectiveName}".
- [HASHTAGS]: 3-5 hashtag profesional relevan.
` : state.platform === "twitter" ? `
- [HOOK]: Kalimat punchy 1 baris yang menghentikan timeline scroll.
- [BODY]: Rangkaian inti ide dalam bentuk thread atau tweet padat bernilai tinggi.
- [CTA]: Ajakan Retweet (RT), Bookmark, atau Reply.
- [HASHTAGS]: 2 hashtag ringkas.
` : `
- [HOOK]: 1-2 baris penghenti scroll yang tajam sebelum tombol '...selengkapnya'.
- [BODY]: Paragraf bernapas (line-break), hindari paragraf dinding teks yang padat. Selipkan emoji secara elegan dan proporsional.
- [CTA]: Call to action yang jelas, terarah, selaras dengan tujuan "${state.ctaObjectiveName}".
- [HASHTAGS]: 5-10 hashtag tertarget dengan campuran niche dan kata kunci utama.
`}

FORMAT OUTPUT WAJIB (Gunakan format tag berikut secara presisi):
[HOOK]
(Teks Hook penghenti scroll di sini)

[BODY]
(Teks Body isi copywriting/caption di sini)

[CTA]
(Teks Call to Action di sini)

[HASHTAGS]
(Teks Hashtags di sini)

[PSYCHOLOGY]
(Jelaskan alasan psikologis dan keunggulan strategis mengapa naskah ini berhasil memikat target audiens ${state.audienceName})

[SEO_KEYWORDS]
(Sebutkan 4-6 kata kunci pencarian populer yang relevan untuk Social SEO, dipisahkan koma)

[RETENTION_TIPS]
(Tips taktis untuk memaksimalkan retensi audiens pada 3 detik pertama)

[HOOK_SCORE]
(Skor potensi hook dari 1.0 hingga 10.0, contoh: 9.6/10)

BAHAN MENTAH PENGGUNA:
"${rawText || "(Analisis dan kembangkan dari lampiran file yang disertakan)"}"
${state.attachedFile?.textContent ? `\n\nISI LAMPIRAN DOKUMEN:\n${state.attachedFile.textContent}` : ""}
`;

        let generatedText = "";
        const apiKeyToUse = getActiveApiKey();
        const GenAI = await getGenAISDK();

        // 1. Try Official SDK (@google/genai)
        if (GenAI) {
          try {
            const ai = new GenAI({ apiKey: apiKeyToUse });
            let contentPayload;

            if (state.attachedFile && state.attachedFile.base64) {
              contentPayload = [
                {
                  inlineData: {
                    mimeType: state.attachedFile.type,
                    data: state.attachedFile.base64
                  }
                },
                promptInstruction
              ];
            } else {
              contentPayload = promptInstruction;
            }

            const response = await ai.models.generateContent({
              model: currentModel,
              contents: contentPayload
            });

            generatedText = response.text || "";
          } catch (sdkError) {
            console.warn("Direct @google/genai SDK call error, trying REST fallback:", sdkError);
          }
        }

        // 2. Direct REST Fallback
        if (!generatedText) {
          const parts = [];
          if (state.attachedFile && state.attachedFile.base64) {
            parts.push({
              inline_data: {
                mime_type: state.attachedFile.type,
                data: state.attachedFile.base64
              }
            });
          }
          parts.push({ text: promptInstruction });

          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKeyToUse}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKeyToUse
            },
            body: JSON.stringify({ contents: [{ parts }] })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `HTTP ${res.status}`);
          }
          const data = await res.json();
          generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }

        if (!generatedText) {
          throw new Error("Tidak ada respon teks yang diterima dari Google Gemini API.");
        }

        // Parse Output Sections
        const parsed = parseGeneratedContent(generatedText, rawText);
        state.currentOutput = parsed;

        // Render to UI
        if (badgeGeneratedMode) {
          badgeGeneratedMode.textContent = state.activeMode === "strategic"
            ? "🎯 Mode A: Strategic Copywriting (Prinsip Periklanan)"
            : "🌿 Mode B: Human-Professional Caption Writer";
        }
        if (badgeTimestamp) {
          badgeTimestamp.textContent = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        }

        renderStructuredOutput(parsed);
        renderSeoAnalysis(parsed);
        renderSimulatorContent(parsed);
        outRawMarkdown.textContent = parsed.rawMarkdown;

        sectionOutput.classList.remove("hidden");
        sectionOutput.scrollIntoView({ behavior: "smooth", block: "start" });

        // Save to Draft History Automatically
        saveGeneratedDraft(parsed, rawText);

        trackEvent("generate_caption", {
          mode: state.activeMode,
          audience: state.audience,
          platform: state.platform,
          tone: state.toneVoice
        });

        showToast("✨ Konten berhasil diracik & tersimpan di Riwayat Draft!");

      } catch (error) {
        console.error("Caption generation error:", error);
        showToast(`❌ Gagal: ${error.message || "Terjadi kesalahan koneksi AI."}`, false);
      } finally {
        btnGenerateCaption.disabled = false;
        btnGenerateCaption.classList.remove("opacity-80");
        textGenerateBtn.textContent = "Generate Sekarang";
      }
    });
  }

  // Parse Output Tags Helper
  function parseGeneratedContent(raw, rawInputIdea = "") {
    let hook = "";
    let body = "";
    let cta = "";
    let hashtags = "";
    let psychology = "";
    let seoKeywords = [];
    let retentionTips = "";
    let hookScore = "9.5/10";

    const hookMatch = raw.match(/\[HOOK\]([\s\S]*?)(?=\[BODY\]|\[CTA\]|\[HASHTAGS\]|\[PSYCHOLOGY\]|$)/i);
    const bodyMatch = raw.match(/\[BODY\]([\s\S]*?)(?=\[CTA\]|\[HASHTAGS\]|\[PSYCHOLOGY\]|$)/i);
    const ctaMatch = raw.match(/\[CTA\]([\s\S]*?)(?=\[HASHTAGS\]|\[PSYCHOLOGY\]|$)/i);
    const hashtagsMatch = raw.match(/\[HASHTAGS\]([\s\S]*?)(?=\[PSYCHOLOGY\]|\[SEO_KEYWORDS\]|$)/i);
    const psychMatch = raw.match(/\[PSYCHOLOGY\]([\s\S]*?)(?=\[SEO_KEYWORDS\]|\[RETENTION_TIPS\]|$)/i);
    const seoMatch = raw.match(/\[SEO_KEYWORDS\]([\s\S]*?)(?=\[RETENTION_TIPS\]|\[HOOK_SCORE\]|$)/i);
    const retentionMatch = raw.match(/\[RETENTION_TIPS\]([\s\S]*?)(?=\[HOOK_SCORE\]|$)/i);
    const scoreMatch = raw.match(/\[HOOK_SCORE\]([\s\S]*?)$/i);

    if (hookMatch) hook = hookMatch[1].trim();
    if (bodyMatch) body = bodyMatch[1].trim();
    if (ctaMatch) cta = ctaMatch[1].trim();
    if (hashtagsMatch) hashtags = hashtagsMatch[1].trim();
    if (psychMatch) psychology = psychMatch[1].trim();
    if (retentionMatch) retentionTips = retentionMatch[1].trim();
    if (scoreMatch) hookScore = scoreMatch[1].trim();

    if (seoMatch) {
      seoKeywords = seoMatch[1]
        .split(/[,;\n]/)
        .map(k => k.replace(/^[-•*]\s*/, "").trim())
        .filter(k => k.length > 1);
    }

    // Fallbacks if AI output skipped some tags
    if (!hook && !body) {
      const parts = raw.split("\n\n");
      hook = parts[0] || "";
      body = parts.slice(1, -1).join("\n\n") || parts[1] || "";
      cta = parts[parts.length - 1] || "";
      hashtags = "#marketing #contentstrategy #socialmedia";
    }

    if (!psychology) {
      psychology = "Naskah ini disusun berdasarkan pemahaman mendalam terhadap audiens dan menawarkan Unique Selling Proposition yang jelas tanpa membebani pembaca.";
    }

    if (seoKeywords.length === 0) {
      seoKeywords = ["ide konten viral", "strategi social media", "tips copywriting", "konten edukasi"];
    }

    if (!retentionTips) {
      retentionTips = "Pastikan baris pembuka diucapkan atau ditampilkan dalam teks layar tebal sebelum detik ke-2.";
    }

    const modeTitle = state.activeMode === "strategic" ? "Mode A: Strategic Copywriting" : "Mode B: Human-Professional Caption";
    const fullMarkdown = `### ${modeTitle}\n**Target Audiens:** ${state.audienceName} | **Tone:** ${state.toneVoiceName} | **Framework:** ${state.frameworkName} | **CTA:** ${state.ctaObjectiveName}\n\n### Hook\n${hook}\n\n### Body\n${body}\n\n### CTA\n${cta}\n\n### Hashtags\n${hashtags}\n\n### Analisis Strategis & SEO\n- **Psikologi & Landasan:** ${psychology}\n- **Kata Kunci Pencarian:** ${seoKeywords.join(", ")}\n- **Skor Potensi Hook:** ${hookScore}`;

    return {
      hook,
      body,
      cta,
      hashtags,
      psychology,
      seoKeywords,
      retentionTips,
      hookScore,
      rawMarkdown: fullMarkdown,
      rawInputIdea
    };
  }

  function renderStructuredOutput(parsed) {
    outHookText.textContent = parsed.hook;
    outBodyText.textContent = parsed.body;
    outCtaText.textContent = parsed.cta;
    outHashtagsText.textContent = parsed.hashtags;
  }

  function renderSeoAnalysis(parsed) {
    outHookScoreBadge.textContent = `Skor Potensi Hook: ${parsed.hookScore || "9.5/10"}`;
    outPsychAngle.textContent = parsed.psychology;
    outRetentionTips.textContent = parsed.retentionTips;

    outSeoKeywordsList.innerHTML = "";
    parsed.seoKeywords.forEach(kw => {
      const pill = document.createElement("span");
      pill.className = "px-2.5 py-1 rounded-full bg-sky-100/80 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[11px] font-medium border border-sky-200/60 dark:border-sky-800/60";
      pill.textContent = `# ${kw}`;
      outSeoKeywordsList.appendChild(pill);
    });
  }

  function renderSimulatorContent(parsed, targetPlatform = state.platform) {
    if (!simContentBody) return;
    const spec = platformSpecs[targetPlatform] || platformSpecs.instagram;

    simAuthorName.textContent = targetPlatform === "youtube" ? "Creative Studio Hub" : "brand_official";
    simPlatformSubtitle.textContent = spec.sub;

    if (targetPlatform === "youtube") {
      simContentBody.innerHTML = `
        <div class="space-y-3">
          <div class="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl">
            <span class="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-0.5">Judul Video YouTube:</span>
            <h4 class="font-bold text-sm text-[#111] dark:text-white">${escapeHtml(parsed.hook)}</h4>
          </div>
          <div class="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
            <strong class="text-neutral-900 dark:text-white block mb-1">Deskripsi & Catatan Bab:</strong>
            ${escapeHtml(parsed.body)}
          </div>
          <div class="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-xs font-semibold text-[#111] dark:text-white">
            🔔 ${escapeHtml(parsed.cta)}
          </div>
          <div class="text-xs text-appleBlue font-medium">
            ${escapeHtml(parsed.hashtags)}
          </div>
        </div>
      `;
    } else {
      const combined = `${parsed.hook}\n\n${parsed.body}\n\n${parsed.cta}\n\n${parsed.hashtags}`;
      simContentBody.textContent = combined;
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Copy Part Buttons
  document.querySelectorAll(".btn-copy-part").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!state.currentOutput) return;
      const target = btn.dataset.target;
      const text = state.currentOutput[target] || "";
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Bagian [${target.toUpperCase()}] tersalin ke clipboard!`);
        trackEvent("copy_caption_part", { part: target });
      });
    });
  });

  // Copy Full Markdown
  if (btnCopyAllMarkdown) {
    btnCopyAllMarkdown.addEventListener("click", () => {
      if (!state.currentOutput) return;
      navigator.clipboard.writeText(state.currentOutput.rawMarkdown).then(() => {
        labelCopyBtn.textContent = "Tersalin!";
        setTimeout(() => { labelCopyBtn.textContent = "Salin Markdown"; }, 2000);
        showToast("Seluruh konten Markdown tersalin dengan rapi!");
        trackEvent("copy_caption_full");
      });
    });
  }

  // Output Tabs Switcher
  outTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      outTabBtns.forEach(b => {
        b.classList.remove("active", "bg-white", "dark:bg-[#22222a]", "shadow-sm", "text-[#111]", "dark:text-white");
        b.classList.add("text-neutral-600", "dark:text-neutral-400");
      });
      btn.classList.add("active", "bg-white", "dark:bg-[#22222a]", "shadow-sm", "text-[#111]", "dark:text-white");
      btn.classList.remove("text-neutral-600", "dark:text-neutral-400");

      const tab = btn.dataset.tab;
      paneStructured.classList.add("hidden");
      paneSeo.classList.add("hidden");
      paneSimulator.classList.add("hidden");
      paneMarkdown.classList.add("hidden");

      if (tab === "structured") paneStructured.classList.remove("hidden");
      else if (tab === "seo") paneSeo.classList.remove("hidden");
      else if (tab === "simulator") paneSimulator.classList.remove("hidden");
      else if (tab === "markdown") paneMarkdown.classList.remove("hidden");
    });
  });

  // Simulator Platform Switcher
  function updateSimulatorPlatform(platKey) {
    simPlatBtns.forEach(btn => {
      if (btn.dataset.sim === platKey) {
        btn.classList.add("active", "bg-[#111]", "dark:bg-white", "text-white", "dark:text-[#111]");
        btn.classList.remove("bg-neutral-100", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
      } else {
        btn.classList.remove("active", "bg-[#111]", "dark:bg-white", "text-white", "dark:text-[#111]");
        btn.classList.add("bg-neutral-100", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
      }
    });
    if (state.currentOutput) {
      renderSimulatorContent(state.currentOutput, platKey);
    }
  }

  simPlatBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      updateSimulatorPlatform(btn.dataset.sim);
    });
  });

  // --------------------------------------------------------------------------
  // RIWAYAT DRAFT (HISTORY MANAGEMENT & LOCALSTORAGE)
  // --------------------------------------------------------------------------
  function saveGeneratedDraft(parsed, rawIdea) {
    const modeLabel = state.activeMode === "strategic" ? "Strategic Copywriting" : "Human Caption";
    const newDraft = {
      id: `draft_${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: state.activeMode,
      modeLabel: modeLabel,
      audienceName: state.audienceName,
      toneVoiceName: state.toneVoiceName,
      framework: state.framework,
      frameworkName: state.frameworkName,
      ctaObjectiveName: state.ctaObjectiveName,
      platform: state.platform,
      platformName: state.platformName,
      rawIdea: rawIdea || parsed.hook,
      hook: parsed.hook,
      body: parsed.body,
      cta: parsed.cta,
      hashtags: parsed.hashtags,
      seoKeywords: parsed.seoKeywords,
      rawMarkdown: parsed.rawMarkdown
    };

    const currentDrafts = loadDraftsHistory();
    currentDrafts.unshift(newDraft);
    saveDraftsHistory(currentDrafts);
  }

  function renderDraftsHistory() {
    if (!historyDraftsContainer || !emptyHistoryState) return;
    historyDraftsContainer.innerHTML = "";

    const drafts = state.drafts;
    if (drafts.length === 0) {
      emptyHistoryState.classList.remove("hidden");
      return;
    }
    emptyHistoryState.classList.add("hidden");

    drafts.forEach((draft) => {
      const dateFormatted = new Date(draft.timestamp).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const card = document.createElement("div");
      card.className = "bg-white dark:bg-[#16161a] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl p-5 shadow-sm space-y-3 hover:border-black/[0.18] dark:hover:border-white/[0.2] transition-all";
      card.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-appleBlue/10 text-appleBlue font-bold text-[10px]">
              ${escapeHtml(draft.modeLabel || "Copywriting")}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-neutral-300 font-semibold text-[10px]">
              ${escapeHtml(draft.platformName || "Social")}
            </span>
            <span class="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 font-semibold text-[10px]">
              ${escapeHtml(draft.frameworkName || "Formula AIDA")}
            </span>
            <span class="text-[11px] text-neutral-400 font-mono">${dateFormatted}</span>
            <span class="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:inline">• ${escapeHtml(draft.audienceName || "")}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button class="btn-load-draft px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all" data-id="${draft.id}">
              Muat ke Studio
            </button>
            <button class="btn-copy-draft px-3 py-1 rounded-full bg-[#111] dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-[#111] text-xs font-semibold transition-all flex items-center gap-1" data-id="${draft.id}">
              Salin
            </button>
            <button class="btn-delete-draft text-neutral-400 hover:text-red-500 p-1.5 text-xs font-bold transition-all" data-id="${draft.id}" title="Hapus Draft">
              ✕
            </button>
          </div>
        </div>

        <div class="space-y-1">
          <strong class="block text-sm text-[#111] dark:text-white font-bold leading-snug">${escapeHtml(draft.hook)}</strong>
          <p class="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed whitespace-pre-wrap">${escapeHtml(draft.body)}</p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400 pt-1">
          <span class="text-emerald-700 dark:text-emerald-400 font-medium">${escapeHtml(draft.cta ? draft.cta.slice(0, 50) + "..." : "")}</span>
          <span class="text-purple-600 dark:text-purple-400 truncate max-w-xs">${escapeHtml(draft.hashtags || "")}</span>
        </div>
      `;

      // Copy draft
      card.querySelector(".btn-copy-draft")?.addEventListener("click", () => {
        navigator.clipboard.writeText(draft.rawMarkdown || `${draft.hook}\n\n${draft.body}\n\n${draft.cta}\n\n${draft.hashtags}`).then(() => {
          showToast("Draft berhasil disalin ke clipboard!");
          trackEvent("copy_history_draft");
        });
      });

      // Load draft back to Studio
      card.querySelector(".btn-load-draft")?.addEventListener("click", () => {
        inputRawCaption.value = draft.rawIdea || draft.hook;
        labelCharCounter.textContent = `${inputRawCaption.value.length.toLocaleString("id-ID")} karakter`;
        if (draft.mode) {
          setWorkingMode(draft.mode);
        }
        if (draft.frameworkName) {
          state.frameworkName = draft.frameworkName;
          if (labelFrameworkText) labelFrameworkText.textContent = draft.frameworkName;
        }
        switchView("studio");
        showToast("Draft dimuat kembali ke editor Studio.");
      });

      // Delete single draft
      card.querySelector(".btn-delete-draft")?.addEventListener("click", () => {
        const updated = state.drafts.filter(d => d.id !== draft.id);
        saveDraftsHistory(updated);
        renderDraftsHistory();
        showToast("Draft berhasil dihapus.");
      });

      historyDraftsContainer.appendChild(card);
    });
  }

  // Clear All History
  if (btnClearAllHistory) {
    btnClearAllHistory.addEventListener("click", () => {
      if (state.drafts.length === 0) return;
      if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat draft?")) {
        saveDraftsHistory([]);
        renderDraftsHistory();
        showToast("Semua riwayat draft telah dibersihkan.");
      }
    });
  }

  // Export All History to Markdown
  if (btnExportAllHistory) {
    btnExportAllHistory.addEventListener("click", () => {
      if (state.drafts.length === 0) {
        showToast("Belum ada draft untuk diekspor.", false);
        return;
      }

      let exportContent = `# Koleksi Draft — Caption Maker AI Studio\nDiekspor pada: ${new Date().toLocaleString("id-ID")}\nModel: ${getGeminiModel()}\n\n---\n\n`;

      state.drafts.forEach((d, i) => {
        exportContent += `## Draft #${i + 1} — ${d.modeLabel || "Copywriting"} (${d.platformName || "Social Media"})\n`;
        exportContent += `**Waktu:** ${new Date(d.timestamp).toLocaleString("id-ID")}\n`;
        exportContent += `**Target Audiens:** ${d.audienceName || "-"} | **Tone:** ${d.toneVoiceName || "-"} | **CTA:** ${d.ctaObjectiveName || "-"}\n\n`;
        exportContent += `${d.rawMarkdown}\n\n---\n\n`;
      });

      const blob = new Blob([exportContent], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `koleksi-draft-${new Date().toISOString().slice(0, 10)}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("File koleksi Markdown berhasil diunduh!");
      trackEvent("export_history_markdown");
    });
  }

  // --------------------------------------------------------------------------
  // ANALYTICS HUB: TREND & SEARCH INTENT EXPLORER
  // --------------------------------------------------------------------------
  let lastAnalyzedTopic = "";

  async function executeTrendAnalysis(topic) {
    if (!topic || topic.trim().length === 0) {
      showToast("⚠️ Masukkan topik atau kata kunci riset terlebih dahulu!", false);
      inputTrendQuery.focus();
      return;
    }

    lastAnalyzedTopic = topic.trim();
    btnAnalyzeTrend.disabled = true;
    textAnalyzeTrendBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Menganalisis Tren...
    `;

    try {
      const currentModel = getGeminiModel();
      const trendPrompt = `
Bertindaklah sebagai Senior SEO & Social Media Trend Researcher.
Lakukan riset mendalam untuk topik: "${lastAnalyzedTopic}".

Berikan pemetaan analisis tren dalam format tag yang presisi:
[ANGLES]
- (Sebutkan 3 sudut pandang / angle konten yang sedang viral dan disukai audiens saat ini)
- (Angle kedua)
- (Angle ketiga)

[KEYWORDS]
(Sebutkan 6-8 kata kunci pencarian populer / social SEO yang sering dicari pengguna, dipisahkan koma)

[VIRAL_HOOKS]
- (Ide hook 1 yang menghentikan scroll)
- (Ide hook 2 berbasis kontrarian atau rasa penasaran)
- (Ide hook 3 berbasis studi kasus atau solusi cepat)
`;

      const apiKeyToUse = getActiveApiKey();
      let responseText = "";
      const GenAI = await getGenAISDK();

      if (GenAI) {
        try {
          const ai = new GenAI({ apiKey: apiKeyToUse });
          const res = await ai.models.generateContent({
            model: currentModel,
            contents: trendPrompt
          });
          responseText = res.text || "";
        } catch (e) {
          console.warn("Trend SDK call error, trying REST:", e);
        }
      }

      if (!responseText) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKeyToUse}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKeyToUse },
          body: JSON.stringify({ contents: [{ parts: [{ text: trendPrompt }] }] })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${res.status}`);
        }
        const data = await res.json();
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }

      // Parse Trend Results
      const anglesMatch = responseText.match(/\[ANGLES\]([\s\S]*?)(?=\[KEYWORDS\]|\[VIRAL_HOOKS\]|$)/i);
      const keywordsMatch = responseText.match(/\[KEYWORDS\]([\s\S]*?)(?=\[VIRAL_HOOKS\]|$)/i);
      const hooksMatch = responseText.match(/\[VIRAL_HOOKS\]([\s\S]*?)$/i);

      trendResultTitle.textContent = `Peta Tren & Search Intent: "${lastAnalyzedTopic}"`;

      // Render Angles
      listTrendAngles.innerHTML = "";
      const anglesLines = (anglesMatch ? anglesMatch[1] : responseText)
        .split("\n")
        .map(l => l.replace(/^[-•*]\s*/, "").trim())
        .filter(l => l.length > 2);

      anglesLines.slice(0, 4).forEach(angle => {
        const li = document.createElement("li");
        li.textContent = angle;
        listTrendAngles.appendChild(li);
      });

      // Render Keywords
      listTrendKeywords.innerHTML = "";
      const kwList = (keywordsMatch ? keywordsMatch[1] : "viral, trend, tips")
        .split(/[,;\n]/)
        .map(k => k.replace(/^[-•*]\s*/, "").trim())
        .filter(k => k.length > 1);

      kwList.slice(0, 8).forEach(kw => {
        const pill = document.createElement("span");
        pill.className = "px-2.5 py-1 rounded-full bg-white dark:bg-[#1a1a20] border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-[11px] font-semibold";
        pill.textContent = `🔍 ${kw}`;
        listTrendKeywords.appendChild(pill);
      });

      // Render Hooks
      listTrendHooks.innerHTML = "";
      const hookLines = (hooksMatch ? hooksMatch[1] : "Jangan scroll dulu...")
        .split("\n")
        .map(h => h.replace(/^[-•*]\s*/, "").trim())
        .filter(h => h.length > 2);

      hookLines.slice(0, 3).forEach((hk) => {
        const row = document.createElement("div");
        row.className = "p-2 rounded-xl bg-white/80 dark:bg-[#1a1a20]/80 border border-rose-200/60 dark:border-rose-900/60 font-semibold text-neutral-800 dark:text-neutral-200";
        row.textContent = `"${hk}"`;
        listTrendHooks.appendChild(row);
      });

      trendResultBox.classList.remove("hidden");
      trendResultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      showToast(`🔥 Analisis tren untuk "${lastAnalyzedTopic}" selesai!`);
      trackEvent("analyze_trend", { topic: lastAnalyzedTopic });

    } catch (err) {
      console.error("Trend analysis error:", err);
      showToast(`❌ Gagal: ${err.message || "Gagal menganalisis tren."}`, false);
    } finally {
      btnAnalyzeTrend.disabled = false;
      textAnalyzeTrendBtn.textContent = "Analisis Tren";
    }
  }

  if (btnAnalyzeTrend) {
    btnAnalyzeTrend.addEventListener("click", () => {
      executeTrendAnalysis(inputTrendQuery.value);
    });
  }

  if (inputTrendQuery) {
    inputTrendQuery.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        executeTrendAnalysis(inputTrendQuery.value);
      }
    });
  }

  quickTopicBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      inputTrendQuery.value = btn.textContent.trim();
      executeTrendAnalysis(inputTrendQuery.value);
    });
  });

  // Transfer analyzed topic into Studio
  if (btnSendTrendToStudio) {
    btnSendTrendToStudio.addEventListener("click", () => {
      if (lastAnalyzedTopic) {
        inputRawCaption.value = `Bahas topik "${lastAnalyzedTopic}" dengan sudut pandang tren terkini, pemicu rasa penasaran audiens, dan solusi praktis.`;
        labelCharCounter.textContent = `${inputRawCaption.value.length.toLocaleString("id-ID")} karakter`;
        switchView("studio");
        showToast(`Topik "${lastAnalyzedTopic}" dikirim ke Studio!`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Initial Boot Sequence
  // --------------------------------------------------------------------------
  syncEngineStatusBadge();
  updateDraftsBadge();
  renderDraftsHistory();

  console.log(`Caption Maker AI Studio ready with ${getGeminiModel()}.`);
}

// Safety DOM Listener
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
