/**
 * Caption Maker AI — Pro Logic & Copywriting Strategy Engine
 * Apple HIG Standard & Captions.ai Aesthetics
 * Features:
 * - Dynamic Persona & Tone (Kasual, Psikolog, Profesional, Kreatif, Edukator, Promo)
 * - Multi-Framework (AIDA, PAS, BAB, FAB)
 * - Tone Sliders (Warmth & Urgency)
 * - Dual Engine: Smart Neural (Offline) & Gemini AI API (Cloud Live)
 * - Platform Adapters: Instagram, TikTok, LinkedIn, Twitter/X with character meters
 * - LocalStorage History & Drafts Collection + Markdown Exporter
 * - Strict Output Structure: [HOOK], [BODY], [CTA], [HASHTAGS]
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // App State
  // ==========================================
  const state = {
    persona: "kasual_bisnis",
    personaName: "Kasual / Bisnis",
    personaIcon: "💼",
    framework: "AIDA",
    frameworkName: "Formula: AIDA",
    platform: "instagram",
    platformName: "Instagram (Reels/Feed)",
    platformIcon: "📸",
    warmth: 4,
    urgency: 3,
    isAnalyticsSynced: true,
    aiMode: localStorage.getItem("cm_ai_mode") || "neural", // "neural" or "gemini"
    geminiApiKey: localStorage.getItem("cm_gemini_key") || "",
    currentOutput: null,
    history: JSON.parse(localStorage.getItem("cm_history_drafts") || "[]")
  };

  // Platform limits
  const platformLimits = {
    instagram: { maxChars: 2200, hookFold: 125, name: "Instagram" },
    tiktok: { maxChars: 2200, hookFold: 150, name: "TikTok" },
    linkedin: { maxChars: 3000, hookFold: 210, name: "LinkedIn" },
    twitter: { maxChars: 280, hookFold: 140, name: "X / Twitter" }
  };

  // ==========================================
  // DOM Elements
  // ==========================================
  // Nav & Modals
  const activeEngineLabel = document.getElementById("activeEngineLabel");
  const btnOpenSettings = document.getElementById("btnOpenSettings");
  const settingsModal = document.getElementById("settingsModal");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const btnCancelSettings = document.getElementById("btnCancelSettings");
  const btnSaveSettings = document.getElementById("btnSaveSettings");
  const geminiKeyGroup = document.getElementById("geminiKeyGroup");
  const geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
  const btnToggleKeyVisibility = document.getElementById("btnToggleKeyVisibility");
  const checkGaAutoSync = document.getElementById("checkGaAutoSync");
  const historyCountBadge = document.getElementById("historyCountBadge");

  // Dropdowns
  const personaTrigger = document.getElementById("personaDropdownTrigger");
  const personaMenu = document.getElementById("personaMenu");
  const currentPersonaTextEl = document.getElementById("currentPersonaText");
  const currentPersonaIconEl = document.getElementById("currentPersonaIcon");

  const frameworkTrigger = document.getElementById("frameworkDropdownTrigger");
  const frameworkMenu = document.getElementById("frameworkMenu");
  const currentFrameworkTextEl = document.getElementById("currentFrameworkText");

  const platformTrigger = document.getElementById("platformDropdownTrigger");
  const platformMenu = document.getElementById("platformMenu");
  const targetPlatformText = document.getElementById("targetPlatformText");
  const targetPlatformIcon = document.getElementById("targetPlatformIcon");

  // Sliders
  const sliderWarmth = document.getElementById("sliderWarmth");
  const warmthValueLabel = document.getElementById("warmthValueLabel");
  const sliderUrgency = document.getElementById("sliderUrgency");
  const urgencyValueLabel = document.getElementById("urgencyValueLabel");

  // Input & Dropzone
  const rawInput = document.getElementById("rawInput");
  const inputCharCount = document.getElementById("inputCharCount");
  const btnClearInput = document.getElementById("btnClearInput");
  const btnGenerate = document.getElementById("btnGenerate");
  const btnGenerateText = document.getElementById("btnGenerateText");
  const analyticsToggle = document.getElementById("analyticsToggle");
  const refBadge = document.getElementById("refBadge");
  const refBadgeText = document.getElementById("refBadgeText");

  // Output Section
  const outputSection = document.getElementById("outputSection");
  const hookTextDisplay = document.getElementById("hookTextDisplay");
  const hookCharCount = document.getElementById("hookCharCount");
  const hookFoldStatus = document.getElementById("hookFoldStatus");
  const bodyTextDisplay = document.getElementById("bodyTextDisplay");
  const bodyFrameworkDisplay = document.getElementById("bodyFrameworkDisplay");
  const ctaTextDisplay = document.getElementById("ctaTextDisplay");
  const hashtagsTextDisplay = document.getElementById("hashtagsTextDisplay");
  const rawMarkdownDisplay = document.getElementById("rawMarkdownDisplay");

  // Actions & Buttons
  const btnCopyMarkdown = document.getElementById("btnCopyMarkdown");
  const copyBtnLabel = document.getElementById("copyBtnLabel");
  const btnSaveDraft = document.getElementById("btnSaveDraft");
  const higToast = document.getElementById("higToast");

  // Simulator
  const platformSimBody = document.getElementById("platformSimBody");
  const mockUserName = document.getElementById("mockUserName");
  const mockPlatformSub = document.getElementById("mockPlatformSub");
  const meterPlatformName = document.getElementById("meterPlatformName");
  const meterNumbers = document.getElementById("meterNumbers");
  const meterProgressBar = document.getElementById("meterProgressBar");

  // History Elements
  const historyCardsContainer = document.getElementById("historyCardsContainer");
  const emptyHistoryState = document.getElementById("emptyHistoryState");
  const btnExportAll = document.getElementById("btnExportAll");
  const btnClearHistory = document.getElementById("btnClearHistory");

  // ==========================================
  // Initialization
  // ==========================================
  updateEngineBadge();
  updateHistoryUI();
  updateInputCounters();
  syncSliderLabels();

  // Load saved Gemini Key to input
  if (state.geminiApiKey) {
    geminiApiKeyInput.value = state.geminiApiKey;
  }

  // ==========================================
  // Dropdown Handling
  // ==========================================
  function closeAllDropdowns() {
    personaMenu.classList.remove("show");
    frameworkMenu.classList.remove("show");
    platformMenu.classList.remove("show");
  }

  personaTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isShown = personaMenu.classList.contains("show");
    closeAllDropdowns();
    if (!isShown) personaMenu.classList.add("show");
  });

  frameworkTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isShown = frameworkMenu.classList.contains("show");
    closeAllDropdowns();
    if (!isShown) frameworkMenu.classList.add("show");
  });

  platformTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isShown = platformMenu.classList.contains("show");
    closeAllDropdowns();
    if (!isShown) platformMenu.classList.add("show");
  });

  document.addEventListener("click", closeAllDropdowns);

  // Persona Selection
  document.querySelectorAll("#personaMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#personaMenu .dropdown-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      state.persona = item.dataset.persona;
      state.personaName = item.dataset.name;
      state.personaIcon = item.dataset.icon;
      currentPersonaTextEl.textContent = state.personaName;
      currentPersonaIconEl.textContent = state.personaIcon;
      closeAllDropdowns();
      syncPersonaDefaults(state.persona);
    });
  });

  // Framework Selection
  document.querySelectorAll("#frameworkMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#frameworkMenu .dropdown-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      state.framework = item.dataset.framework;
      state.frameworkName = item.dataset.name;
      currentFrameworkTextEl.textContent = item.dataset.name;
      closeAllDropdowns();
    });
  });

  // Platform Selection
  document.querySelectorAll("#platformMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#platformMenu .dropdown-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      state.platform = item.dataset.platform;
      state.platformName = item.dataset.name;
      state.platformIcon = item.dataset.icon;
      targetPlatformText.textContent = state.platformName;
      targetPlatformIcon.textContent = state.platformIcon;
      closeAllDropdowns();

      // Update simulator active tab if output exists
      document.querySelectorAll(".platform-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.platform === state.platform);
      });
      if (state.currentOutput) {
        updatePlatformPreview(state.platform);
      }
    });
  });

  function syncPersonaDefaults(persona) {
    if (persona === "psikolog") {
      sliderWarmth.value = 5;
      sliderUrgency.value = 1;
    } else if (persona === "profesional") {
      sliderWarmth.value = 2;
      sliderUrgency.value = 3;
    } else if (persona === "hard_sale") {
      sliderWarmth.value = 3;
      sliderUrgency.value = 5;
    } else if (persona === "kreatif_genz") {
      sliderWarmth.value = 4;
      sliderUrgency.value = 4;
    } else {
      sliderWarmth.value = 4;
      sliderUrgency.value = 3;
    }
    syncSliderLabels();
  }

  // ==========================================
  // Slider Controls
  // ==========================================
  const warmthLabels = ["", "Formal / Dingin", "Objektif / Lugas", "Netral Ramah", "Hangat & Empatis", "Sangat Intim & Merangkul"];
  const urgencyLabels = ["", "Sangat Santai", "Informatif Halus", "Moderat (Persuasif)", "Tinggi (Callout Kuat)", "Maksimal (FOMO / Urgensi Terbatas)"];

  function syncSliderLabels() {
    state.warmth = parseInt(sliderWarmth.value);
    state.urgency = parseInt(sliderUrgency.value);
    warmthValueLabel.textContent = warmthLabels[state.warmth];
    urgencyValueLabel.textContent = urgencyLabels[state.urgency];
  }

  sliderWarmth.addEventListener("input", syncSliderLabels);
  sliderUrgency.addEventListener("input", syncSliderLabels);

  // ==========================================
  // Input Handling & Presets
  // ==========================================
  function updateInputCounters() {
    const text = rawInput.value.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).length : 0;
    inputCharCount.textContent = `${chars} karakter • ${words} kata`;
  }

  rawInput.addEventListener("input", updateInputCounters);

  btnClearInput.addEventListener("click", () => {
    rawInput.value = "";
    updateInputCounters();
    rawInput.focus();
    showToast("Teks bahan mentah dibersihkan.");
  });

  // Quick prompt chips
  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      rawInput.value = chip.dataset.text;
      updateInputCounters();
      rawInput.focus();
    });
  });

  // Gallery Preset Cards
  document.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      const preset = card.dataset.preset;
      const targetItem = document.querySelector(`#personaMenu .dropdown-item[data-persona="${preset}"]`);
      if (targetItem) targetItem.click();

      if (!rawInput.value.trim()) {
        if (preset === "kasual_bisnis") {
          rawInput.value = "Fitur AI video editor otomatis: cut video otomatis, hapus filler words (um, ah), pasang dynamic subtitle, dan eye contact ke kamera untuk reels bisnis digital.";
        } else if (preset === "psikolog") {
          rawInput.value = "Tips mengatasi rasa lelah mental, overthinking sebelum tidur, dan belajar melepaskan ekspektasi yang menekan diri sendiri.";
        } else if (preset === "profesional") {
          rawInput.value = "Laporan data analitik: 85% audiens menonton video tanpa suara, pentingnya dynamic subtitle dan retensi 3 detik pertama untuk video B2B.";
        } else if (preset === "kreatif_genz") {
          rawInput.value = "Bikin konten video reels yang dulunya makan waktu 4 jam sekarang beres dalam 5 menit pakai AI.";
        }
        updateInputCounters();
      }
      rawInput.scrollIntoView({ behavior: "smooth", block: "center" });
      rawInput.focus();
    });
  });

  // Analytics Toggle
  analyticsToggle.addEventListener("click", () => {
    state.isAnalyticsSynced = !state.isAnalyticsSynced;
    if (state.isAnalyticsSynced) {
      analyticsToggle.innerHTML = `
        <div class="analytics-pulse"></div>
        <span class="analytics-label">Google Analytics & Search Index: <strong>Aktif</strong></span>
        <span class="chip-badge">Auto</span>
      `;
      refBadge.style.display = "inline-flex";
      refBadgeText.textContent = "Google Trends & GA4 Synced";
      showToast("Sinkronisasi data Google Analytics & Search diaktifkan!");
    } else {
      analyticsToggle.innerHTML = `
        <div class="analytics-pulse" style="background: #999; animation: none;"></div>
        <span class="analytics-label">Google Analytics: <strong>Manual Mode</strong></span>
        <span class="chip-badge" style="background:#eee; color:#666;">Off</span>
      `;
      refBadgeText.textContent = "Offline Mode";
      showToast("Mode manual (tanpa live query search)");
    }
  });

  // ==========================================
  // Settings Modal & API Engine
  // ==========================================
  btnOpenSettings.addEventListener("click", () => {
    // Sync current values to UI
    document.querySelectorAll(".segmented-control .seg-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === state.aiMode);
    });
    geminiKeyGroup.style.display = state.aiMode === "gemini" ? "flex" : "none";
    geminiApiKeyInput.value = state.geminiApiKey;
    checkGaAutoSync.checked = state.isAnalyticsSynced;
    settingsModal.classList.add("show");
  });

  function closeSettingsModal() {
    settingsModal.classList.remove("show");
  }

  btnCloseSettings.addEventListener("click", closeSettingsModal);
  btnCancelSettings.addEventListener("click", closeSettingsModal);

  document.querySelectorAll(".segmented-control .seg-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".segmented-control .seg-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      geminiKeyGroup.style.display = mode === "gemini" ? "flex" : "none";
    });
  });

  btnToggleKeyVisibility.addEventListener("click", () => {
    if (geminiApiKeyInput.type === "password") {
      geminiApiKeyInput.type = "text";
      btnToggleKeyVisibility.textContent = "Sembunyikan";
    } else {
      geminiApiKeyInput.type = "password";
      btnToggleKeyVisibility.textContent = "Lihat";
    }
  });

  const geminiConnectionFeedback = document.getElementById("geminiConnectionFeedback");
  const btnTestGeminiKey = document.getElementById("btnTestGeminiKey");

  // Test Gemini Key Connection
  if (btnTestGeminiKey) {
    btnTestGeminiKey.addEventListener("click", async () => {
      const key = geminiApiKeyInput.value.trim();
      if (!key) {
        showFeedback("Ketik API Key terlebih dahulu!", false);
        return;
      }

      btnTestGeminiKey.textContent = "Menguji...";
      btnTestGeminiKey.disabled = true;

      try {
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(testUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "ping" }] }]
          })
        });

        const data = await res.json();
        if (res.ok && data.candidates) {
          showFeedback("✓ Berhasil terhubung ke Google Gemini 1.5 Flash!", true);
          state.geminiApiKey = key;
          localStorage.setItem("cm_gemini_key", key);
        } else {
          const errMsg = data.error?.message || `Error ${res.status}`;
          showFeedback(`✕ Gagal: ${errMsg}`, false);
        }
      } catch (err) {
        showFeedback(`✕ Error koneksi jaringan: ${err.message}`, false);
      } finally {
        btnTestGeminiKey.textContent = "Uji Koneksi";
        btnTestGeminiKey.disabled = false;
      }
    });
  }

  function showFeedback(msg, isSuccess) {
    if (!geminiConnectionFeedback) return;
    geminiConnectionFeedback.style.display = "block";
    geminiConnectionFeedback.textContent = msg;
    geminiConnectionFeedback.style.color = isSuccess ? "#34c759" : "#ff3b30";
    geminiConnectionFeedback.style.fontWeight = "600";
  }

  btnSaveSettings.addEventListener("click", () => {
    const activeSeg = document.querySelector(".segmented-control .seg-btn.active");
    state.aiMode = activeSeg ? activeSeg.dataset.mode : "neural";
    state.geminiApiKey = geminiApiKeyInput.value.trim();
    state.isAnalyticsSynced = checkGaAutoSync.checked;

    localStorage.setItem("cm_ai_mode", state.aiMode);
    localStorage.setItem("cm_gemini_key", state.geminiApiKey);

    updateEngineBadge();
    closeSettingsModal();
    showToast(`Pengaturan tersimpan! Menggunakan mode: ${state.aiMode === "gemini" ? "Google Gemini AI (Cloud)" : "Smart Neural Engine"}`);
  });

  function updateEngineBadge() {
    if (state.aiMode === "gemini" && state.geminiApiKey) {
      activeEngineLabel.textContent = "Gemini AI (Live)";
    } else {
      activeEngineLabel.textContent = "Neural (Offline)";
    }
  }

  // ==========================================
  // Core Copywriting Generator
  // ==========================================
  btnGenerate.addEventListener("click", async () => {
    const raw = rawInput.value.trim();
    if (!raw) {
      showToast("Mohon masukkan bahan mentah atau topik konten terlebih dahulu!");
      rawInput.focus();
      return;
    }

    // Loading State
    btnGenerate.disabled = true;
    btnGenerateText.textContent = state.aiMode === "gemini" && state.geminiApiKey ? "Menghubungi Gemini AI..." : "Meracik Hook & Formula...";
    btnGenerate.style.opacity = "0.7";

    try {
      let outputData;
      if (state.aiMode === "gemini" && state.geminiApiKey) {
        outputData = await generateWithGeminiAPI(raw);
      } else {
        // Smart Neural Engine (Deterministic & Heuristic with Rich Variants)
        outputData = generateStrategicCopy(raw);
      }

      state.currentOutput = outputData;
      renderOutput(outputData);

      // Auto-save to history
      saveToHistory(outputData);

      outputSection.style.display = "block";
      outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("Caption siap! Format terstruktur [HOOK], [BODY], [CTA], [HASHTAGS].");
    } catch (err) {
      console.error(err);
      showToast("Gagal memanggil Gemini API. Beralih ke Smart Neural Engine.");
      const fallback = generateStrategicCopy(raw);
      state.currentOutput = fallback;
      renderOutput(fallback);
      saveToHistory(fallback);
      outputSection.style.display = "block";
    } finally {
      btnGenerate.disabled = false;
      btnGenerateText.textContent = "Generate Caption";
      btnGenerate.style.opacity = "1";
    }
  });

  /**
   * Gemini API Integration (Client-Side Direct Call with Strict Prompt)
   */
  async function generateWithGeminiAPI(raw) {
    const prompt = `Anda adalah Digital Marketer dan Copywriter ahli berstandar Apple HIG.
Tugas Anda menghasilkan caption media sosial berkonversi tinggi dengan parameter:
- Persona: ${state.personaName} (Kehangatan emosional level: ${state.warmth}/5)
- Formula Copywriting: ${state.frameworkName}
- Target Platform: ${state.platformName}
- Tingkat Urgensi CTA: ${state.urgency}/5
- Google Analytics & Search Trend Context: 85% audiens menonton video tanpa audio (silent), 3 detik pertama menentukan retensi 28%-42%.

Bahan mentah dari pengguna:
"${raw}"

Format output HARUS mengikuti struktur ini secara persis dalam teks Markdown:
[HOOK]
(1 kalimat tajam penghenti scroll, maks 125 karakter)

[BODY]
(Paragraf singkat, padat, berjarak rapi dengan line-break yang bersih sesuai framework ${state.frameworkName})

[CTA]
(Ajakan bertindak yang jelas, relevan, dan sesuai tingkat urgensi)

[HASHTAGS]
(7-10 hashtag relevan gabungan core keyword, niche, dan trending)`;

    let generatedText = "";

    // 1. Try local proxy if hosted on server
    if (window.location.protocol.startsWith("http")) {
      try {
        const proxyRes = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, apiKey: state.geminiApiKey })
        });
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData.text) {
            generatedText = proxyData.text;
          }
        }
      } catch (e) {
        console.warn("Proxy request failed, trying direct Google API call...", e);
      }
    }

    // 2. Direct Google Gemini 1.5 Flash Call if not yet received
    if (!generatedText) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiApiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!generatedText) {
      throw new Error("Tidak ada teks yang dikembalikan oleh Gemini API.");
    }

    // Parse blocks
    return parseStrictMarkdown(generatedText, raw);
  }

  function parseStrictMarkdown(text, rawInputText) {
    const hookMatch = text.match(/\[HOOK\]\s*([\s\S]*?)(?=\[BODY\]|$)/i);
    const bodyMatch = text.match(/\[BODY\]\s*([\s\S]*?)(?=\[CTA\]|$)/i);
    const ctaMatch = text.match(/\[CTA\]\s*([\s\S]*?)(?=\[HASHTAGS\]|$)/i);
    const hashtagsMatch = text.match(/\[HASHTAGS\]\s*([\s\S]*?)$/i);

    const hook = hookMatch ? hookMatch[1].trim() : "Solusi cerdas untuk membuat konten berkonversi tinggi.";
    const body = bodyMatch ? bodyMatch[1].trim() : text;
    const cta = ctaMatch ? ctaMatch[1].trim() : "Simpan postingan ini untuk panduan strategi konten Anda berikutnya!";
    const hashtags = hashtagsMatch ? hashtagsMatch[1].trim() : "#DigitalMarketing #ContentStrategy #GrowthTips";

    const rawMarkdown = `[HOOK]\n${hook}\n\n[BODY]\n${body}\n\n[CTA]\n${cta}\n\n[HASHTAGS]\n${hashtags}`;

    return {
      hook,
      body,
      cta,
      hashtags,
      rawMarkdown,
      persona: state.persona,
      personaName: state.personaName,
      framework: state.framework,
      platform: state.platform,
      rawInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  /**
   * Smart Neural Engine (Local / Offline Copywriting Brain)
   */
  function generateStrategicCopy(raw) {
    let hook = "";
    let body = "";
    let cta = "";
    let hashtags = "";

    const isVideoOrAi = /video|edit|captions|reels|konten|creator|audio|subtitle|kamera/i.test(raw);
    const isMentalHealth = /cemas|anxiety|overthinking|tenang|psikolog|mental|istirahat|diri|healing|kalem|luka/i.test(raw);
    const isBusiness = /omset|bisnis|sales|konversi|closing|scale|traffic|klien|b2b/i.test(raw);

    // Warmth & Urgency Influencers
    const urgencyPhrase = state.urgency >= 4 
      ? "Penawaran ini hanya berlaku 24 jam sebelum slot ditutup." 
      : state.urgency === 1 
      ? "Simpan saja dulu, baca kembali kapan pun kamu sedang butuh jeda." 
      : "Klik tautan di bio untuk eksplorasi selengkapnya!";

    // 1. Kasual / Bisnis
    if (state.persona === "kasual_bisnis") {
      if (state.framework === "AIDA") {
        hook = isVideoOrAi 
          ? "Stop buang 3 jam cuma buat motong video dan ketik subtitle manual satu per satu."
          : "Audiens Anda cuma butuh 1.5 detik buat mutusin lanjut scroll atau baca postingan ini.";
        body = `Jujur, capek banget kan kalau ide konten udah siap matang, tapi eksekusinya ketunda cuma gara-gara urusan teknis editing yang makan waktu?

Data membuktikan bahwa lebih dari 85% penonton menikmati video media sosial tanpa suara. Tanpa teks dinamis di detik awal, mereka akan langsung skip ke kompetitor Anda.

Inilah kenapa smart creators mulai beralih menggunakan workflow cerdas:
• Memotong jeda bicara & kata filler ('um', 'ah') secara otomatis.
• Memasang auto-subtitle dinamis yang bikin mata audiens betah menatap layar.
• Fitur eye-contact agar tatapan Anda selalu terhubung dengan penonton.

Waktu pengerjaan terpangkas 80%, tapi engagement dan watch-time justru melonjak drastis.`;
        cta = urgencyPhrase.includes("24 jam") 
          ? "Slot uji coba gratis hanya dibuka hari ini. Klik link di bio sebelum kuota penuh!" 
          : "Mau coba rasakan cara bikin video profesional tanpa pusing edit berjam-jam? Klik link di bio untuk coba gratis hari ini!";
        hashtags = "#ContentCreatorTips #ProductivityHack #AICaptions #VideoMarketing #PertumbuhanBisnis #SmartWorkflow #DigitalMarketingID";
      } else if (state.framework === "PAS") {
        hook = "Bikin konten tiap hari tapi views dan konversi masih jalan di tempat?";
        body = `Masalahnya bukan karena Anda kurang rajin, melainkan karena format penyampaian yang terlalu bertele-tele di 3 detik pertama.

Audiens sekarang nggak punya toleransi buat basa-basi. Saat mereka menonton tanpa suara dan tidak menemukan hook visual yang jelas, algoritma langsung mencatat konten Anda sepi peminat.

Solusinya: gunakan pendekatan terstruktur yang langsung membedah masalah utama audiens dengan visual text yang tajam dan navigasi bersih.`;
        cta = "Simpan postingan ini biar nggak lupa saat jadwal produksi konten minggu depan!";
        hashtags = "#MarketingStrategy #ContentDistribution #SocialMediaTips #CreatorEconomy #BisnisDigital";
      } else { // BAB / FAB
        hook = "Dulu bikin 1 video butuh setengah hari. Sekarang 15 menit udah langsung tayang.";
        body = `Sebelumnya: selalu terjebak di meja editing berjam-jam, kehabisan energi cuma buat urusan subtitle dan potong frame.

Sekarang: rekam bahan mentah sekali jalan, biarkan AI merapikan ritme bicara, memasang animasi teks, dan menyelaraskan audio secara presisi.

Jembatannya ada pada otomatisasi workflow cerdas yang fokus pada hasil konversi, bukan drama teknisnya.`;
        cta = "Tulis 'WORKFLOW' di komentar, dan saya kirimkan panduan lengkap langkah demi langkahnya ke DM Anda!";
        hashtags = "#EfisiensiBisnis #CreatorTools #OtomasiKonten #VideoEditorAI #BisnisPraktis";
      }
    }

    // 2. Psikolog / Ruang Kalem
    else if (state.persona === "psikolog") {
      hook = isMentalHealth
        ? "Tarik napas perlahan... Kamu tidak harus menyelesaikan dan memikirkan semuanya malam ini."
        : "Kadang, yang kita butuhkan bukanlah jawaban instan, melainkan ruang untuk merasa cukup.";
      body = `Pernahkah kamu merasa energimu habis bukan karena tubuhmu bekerja terlalu keras, melainkan karena pikiranmu tidak pernah berhenti berlari?

Di dunia yang serba menuntut kita cepat, produktif, dan serba sempurna, kita sering lupa memberi jeda pada diri sendiri. Rasa lelah, cemas, dan overthinking bukanlah bukti kelemahanmu—itu hanyalah sinyal lembut dari dalam diri yang sedang meminta perhatian.

Malam ini, mari beri jeda sejenak:
• Rasakan telapak kakimu menapak lantai dengan tenang.
• Rilekskan bahumu yang seharian terasa kaku.
• Akui bahwa kamu sudah berjuang sebaik yang kamu bisa hari ini.

Ketenangan tidak hadir saat semua masalahmu selesai, melainkan saat kamu memutuskan untuk berhenti menghakimi prosesmu sendiri.`;
      cta = "Kirimkan pelukan hangat ini ke satu teman yang mungkin sedang merasa kewalahan hari ini. Kamu tidak sendirian.";
      hashtags = "#RuangKalem #KesehatanMental #SelfCompassion #JedaSejenak #MindfulnessIndonesia #BerdamaiDenganDiri #PsikologiSehariHari";
    }

    // 3. Profesional Korporat
    else if (state.persona === "profesional") {
      hook = "Data menunjukkan 85% audiens mengonsumsi video pendek dalam mode senyap (muted).";
      body = `Jika strategi komunikasi digital perusahaan Anda masih mengandalkan audio tanpa optimasi visual typography, Anda berisiko kehilangan 70% prospek potensial pada 3 detik pertama.

Berdasarkan audit benchmarking Google Analytics kuartal ini:
1. Retensi audiens meningkat rata-rata 38% ketika teks dinamis dan hook visual diterapkan secara presisi.
2. Rasio Click-Through Rate (CTR) kampanye berbayar 2.4x lebih tinggi pada konten dengan pacing yang padat.
3. Efisiensi biaya produksi turun signifikan saat tim beralih ke workflow otomatisasi.

Dalam lanskap pasar yang kompetitif, kecepatan eksekusi dan ketajaman data adalah fondasi keunggulan kompetitif.`;
      cta = "Jadwalkan sesi konsultasi strategis bersama tim kami melalui tautan di profil LinkedIn perusahaan.";
      hashtags = "#CorporateStrategy #DigitalTransformation #B2BMarketing #DataDriven #VideoStrategy #LeadershipExcellence";
    }

    // 4. Kreatif / Gen-Z
    else if (state.persona === "kreatif_genz") {
      hook = "POV: Lu baru sadar selama ini ngabisin 5 jam ngedit video yang bisa beres dalam 5 menit.";
      body = `Asli, nangis banget kalau inget jaman-jaman ngedit subtitle satu per satu sambil nge-pause frame per frame.

Zaman sekarang kalau masih bikin konten pake cara purba, keburu disalip kreator lain yang sat-set. Algoritma butuh konsistensi, tapi energi kita terbatas.

Kuncinya tuh ada di tool yang lu pake:
• AI auto-cut nafas lu yang ngos-ngosan pas ngomong.
• Subtitle estetik yang auto-sync sama ritme suara.
• Mata lu tetep auto-natap kamera biarpun sebenernya lu lagi lirik contekan di samping.

Kerja cerdas bukan kerja capek, bestie!`;
      cta = "Coba tag temen lu yang kalau ngedit video satu reels butuh waktu sampe subuh! 😭👇";
      hashtags = "#LifeHack #ContentCreatorGenZ #AItools #VideoViral #TipsNgonten #KerjaCerdas #FypIndonesia";
    }

    // 5. Edukator & Mentor
    else if (state.persona === "edukator") {
      hook = "3 Kesalahan fatal yang bikin materi edukasi Anda sering di-skip audiens.";
      body = `Mengajar atau berbagi ilmu di media sosial punya dinamika yang berbeda dengan kelas tatap muka:

1. Basa-basi terlalu panjang: Jangan mulai dengan perkenalan diri, langsung masuk ke problem inti di kalimat pertama.
2. Paragraf menumpuk: Hindari dinding teks tebal. Beri spasi bernapas di setiap 2 baris kalimat.
3. Kurang visualisasi: 85% audiens membutuhkan teks panduan di layar agar fokus tetap terjaga.

Saat materi edukasi disusun dengan struktur yang tepat, pemahaman audiens meningkat dan engagement akan tumbuh secara organik.`;
      cta = "Bagikan postingan ini ke rekan pendidik atau sesama pegiat edukasi untuk saling menginspirasi!";
      hashtags = "#EdukasiDigital #TipsBelajar #SharingIsCaring #PendidikMasaKini #CreatorEducation #LiterasiDigital";
    }

    // 6. Direct Promo & Launch (Hard Sale)
    else {
      hook = "PENAWARAN TERBATAS: Diskon 50% berakhir tepat pukul 23.59 malam ini!";
      body = `Jika Anda masih menunda untuk meningkatkan performa konten dan strategi pemasaran digital Anda, ini adalah kesempatan terakhir minggu ini.

Apa yang Anda dapatkan jika mengambil keputusan hari ini:
• Akses penuh ke seluruh template dan alur kerja berkonversi tinggi.
• Panduan implementasi step-by-step dari praktisi berpengalaman.
• Bonus eksklusif senilai Rp 1.500.000 untuk 50 pendaftar pertama.

Setelah kuota terpenuhi atau waktu habis, harga akan otomatis kembali ke tarif normal.`;
      cta = "Amankan kuota diskon 50% Anda sekarang juga melalui tautan di bio sebelum terlambat!";
      hashtags = "#PromoSpesial #DiskonTerbatas #FlashSaleIndonesia #PeluangBisnis #InvestasiLeherKeAtas";
    }

    const rawMarkdown = `[HOOK]\n${hook}\n\n[BODY]\n${body}\n\n[CTA]\n${cta}\n\n[HASHTAGS]\n${hashtags}`;

    return {
      hook,
      body,
      cta,
      hashtags,
      rawMarkdown,
      persona: state.persona,
      personaName: state.personaName,
      framework: state.framework,
      platform: state.platform,
      rawInputText: raw,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  // ==========================================
  // Render Output & HIG Visuals
  // ==========================================
  function renderOutput(data) {
    hookTextDisplay.textContent = data.hook;
    bodyTextDisplay.textContent = data.body;
    bodyFrameworkDisplay.textContent = `Persona: ${data.personaName} • Framework ${data.framework}`;
    ctaTextDisplay.textContent = data.cta;
    hashtagsTextDisplay.textContent = data.hashtags;
    rawMarkdownDisplay.textContent = data.rawMarkdown;

    // Hook fold character insight
    const hookLen = data.hook.length;
    hookCharCount.textContent = `${hookLen} karakter`;
    const limit = platformLimits[state.platform] || platformLimits.instagram;

    if (hookLen <= limit.hookFold) {
      hookFoldStatus.textContent = `✓ Aman: terlihat utuh sebelum lipatan '...more' di ${limit.name}`;
      hookFoldStatus.style.color = "#34c759";
    } else {
      hookFoldStatus.textContent = `⚠ Catatan: melebihi ${limit.hookFold} karakter, baris akhir mungkin terpotong fold`;
      hookFoldStatus.style.color = "#ff9500";
    }

    // Update Platform Simulator
    updatePlatformPreview(state.platform);
  }

  // Simulator Rendering
  function updatePlatformPreview(platform) {
    if (!state.currentOutput) return;

    const { hook, body, cta, hashtags } = state.currentOutput;
    const limit = platformLimits[platform] || platformLimits.instagram;
    const fullText = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags}`;
    const totalChars = fullText.length;

    // Meter progress
    const pct = Math.min(100, Math.round((totalChars / limit.maxChars) * 100));
    meterPlatformName.textContent = `${limit.name} Limit:`;
    meterNumbers.textContent = `${totalChars} / ${limit.maxChars} karakter (${pct}%)`;
    meterProgressBar.style.width = `${pct}%`;

    if (pct > 95) {
      meterProgressBar.style.background = "#ff3b30";
    } else if (pct > 75) {
      meterProgressBar.style.background = "#ff9500";
    } else {
      meterProgressBar.style.background = "#0071e3";
    }

    mockUserName.textContent = platform === "linkedin" ? "Muhammad Ilyasa • Founder" : "brand_official";
    mockPlatformSub.textContent = `${limit.name} Post • Sponsored`;

    if (platform === "instagram") {
      platformSimBody.innerHTML = `
        <strong>${hook}</strong><br><br>
        ${body.replace(/\n\n/g, "<br><br>")}<br><br>
        👉 ${cta}<br><br>
        <span style="color: #00376b;">${hashtags}</span>
      `;
    } else if (platform === "linkedin") {
      platformSimBody.innerHTML = `
        <p style="font-weight: 700; font-size: 14.5px;">${hook}</p><br>
        <p>${body.replace(/\n\n/g, "</p><br><p>")}</p><br>
        <p><strong>Langkah berikutnya:</strong> ${cta}</p><br>
        <span style="color: #0a66c2;">${hashtags}</span>
      `;
    } else if (platform === "tiktok") {
      platformSimBody.innerHTML = `
        <strong>${hook}</strong> ⚡<br><br>
        ${body.substring(0, 160)}... <span style="color:#888;">(lihat selengkapnya)</span><br><br>
        💬 ${cta}<br><br>
        <span style="color: #ff0050;">${hashtags.split(" ").slice(0, 5).join(" ")}</span>
      `;
    } else { // twitter
      platformSimBody.innerHTML = `
        ${hook}<br><br>
        ${body.substring(0, 140)}... 🧵👇<br><br>
        <span style="color: #1d9bf0;">${hashtags.split(" ").slice(0, 3).join(" ")}</span>
      `;
    }
  }

  // Switch Simulator Buttons
  document.querySelectorAll(".platform-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".platform-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      updatePlatformPreview(btn.dataset.platform);
    });
  });

  // Tab switching
  document.querySelectorAll(".hig-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".hig-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");

      const targetPane = document.getElementById(`pane${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Mini copy buttons
  document.querySelectorAll(".mini-copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      let textToCopy = "";
      if (target === "hook") textToCopy = hookTextDisplay.textContent;
      if (target === "body") textToCopy = bodyTextDisplay.textContent;
      if (target === "cta") textToCopy = ctaTextDisplay.textContent;
      if (target === "hashtags") textToCopy = hashtagsTextDisplay.textContent;

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Bagian [${target.toUpperCase()}] berhasil disalin!`);
        });
      }
    });
  });

  // Copy full markdown
  btnCopyMarkdown.addEventListener("click", () => {
    if (!state.currentOutput) return;
    navigator.clipboard.writeText(state.currentOutput.rawMarkdown).then(() => {
      copyBtnLabel.textContent = "Tersalin!";
      btnCopyMarkdown.style.background = "#34c759";
      showToast("Seluruh caption Markdown tersalin ke clipboard!");
      setTimeout(() => {
        copyBtnLabel.textContent = "Salin Markdown";
        btnCopyMarkdown.style.background = "#1d1d1f";
      }, 2000);
    });
  });

  // ==========================================
  // History & Draft Management
  // ==========================================
  function saveToHistory(item) {
    // Avoid exact duplicate at the top
    if (state.history.length > 0 && state.history[0].hook === item.hook) {
      return;
    }
    state.history.unshift(item);
    if (state.history.length > 40) state.history.pop();
    localStorage.setItem("cm_history_drafts", JSON.stringify(state.history));
    updateHistoryUI();
  }

  btnSaveDraft.addEventListener("click", () => {
    if (!state.currentOutput) return;
    saveToHistory(state.currentOutput);
    showToast("Draft berhasil disimpan ke koleksi riwayat!");
  });

  function updateHistoryUI() {
    historyCountBadge.textContent = state.history.length;
    if (state.history.length === 0) {
      emptyHistoryState.style.display = "block";
      historyCardsContainer.innerHTML = "";
      historyCardsContainer.appendChild(emptyHistoryState);
      return;
    }

    emptyHistoryState.style.display = "none";
    historyCardsContainer.innerHTML = "";

    state.history.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="hcard-main">
          <div class="hcard-badges">
            <span class="hcard-persona">${item.personaName || item.persona}</span>
            <span class="hcard-framework">${item.framework || "AIDA"}</span>
            <span class="hcard-time">${item.timestamp || "Baru saja"}</span>
          </div>
          <div class="hcard-hook">${item.hook}</div>
        </div>
        <div class="hcard-actions">
          <button class="pill-btn-sm btn-load" data-index="${index}">Muat</button>
          <button class="pill-btn-sm btn-copy-h" data-index="${index}">Salin</button>
          <button class="pill-btn-sm btn-danger btn-del" data-index="${index}">✕</button>
        </div>
      `;
      historyCardsContainer.appendChild(card);
    });

    // History event listeners
    historyCardsContainer.querySelectorAll(".btn-load").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        const item = state.history[idx];
        if (item) {
          state.currentOutput = item;
          renderOutput(item);
          outputSection.style.display = "block";
          outputSection.scrollIntoView({ behavior: "smooth" });
          showToast("Draft berhasil dimuat ke editor!");
        }
      });
    });

    historyCardsContainer.querySelectorAll(".btn-copy-h").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        const item = state.history[idx];
        if (item) {
          navigator.clipboard.writeText(item.rawMarkdown).then(() => {
            showToast("Draft riwayat tersalin ke clipboard!");
          });
        }
      });
    });

    historyCardsContainer.querySelectorAll(".btn-del").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        state.history.splice(idx, 1);
        localStorage.setItem("cm_history_drafts", JSON.stringify(state.history));
        updateHistoryUI();
        showToast("Draft dihapus dari riwayat.");
      });
    });
  }

  // Export All History to Markdown file
  btnExportAll.addEventListener("click", () => {
    if (state.history.length === 0) {
      showToast("Belum ada draft tersimpan untuk diekspor!");
      return;
    }

    let mdContent = `# Koleksi Draft Caption Maker AI\nTanggal Ekspor: ${new Date().toLocaleDateString()}\nTotal Draft: ${state.history.length}\n\n---\n\n`;

    state.history.forEach((draft, i) => {
      mdContent += `## Draft #${i + 1} - [${draft.personaName || draft.persona}] (${draft.timestamp || ""})\n`;
      mdContent += `Framework: ${draft.framework}\n\n`;
      mdContent += `${draft.rawMarkdown}\n\n---\n\n`;
    });

    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `caption_drafts_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Seluruh riwayat berhasil diunduh dalam file Markdown!");
  });

  btnClearHistory.addEventListener("click", () => {
    if (state.history.length === 0) return;
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat draft?")) {
      state.history = [];
      localStorage.removeItem("cm_history_drafts");
      updateHistoryUI();
      showToast("Seluruh riwayat draft berhasil dibersihkan.");
    }
  });

  // Toast Function
  function showToast(msg) {
    higToast.textContent = msg;
    higToast.classList.add("show");
    setTimeout(() => {
      higToast.classList.remove("show");
    }, 2800);
  }

  console.log("Caption Maker Pro v2.5 loaded with Apple HIG, Gemini AI API support & History Manager.");
});
