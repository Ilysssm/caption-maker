/**
 * Caption Maker AI — Pro Logic & Copywriting Strategy Engine
 * Apple HIG Standard & Captions.ai Aesthetics
 * Powered by Google Gemini API Official SDK (@google/genai)
 */

// Helper: Asynchronous Safe Loader for @google/genai SDK
let GoogleGenAIClass = null;
async function getGenAISDK() {
  if (GoogleGenAIClass) return GoogleGenAIClass;
  try {
    const mod = await import("@google/genai");
    GoogleGenAIClass = mod.GoogleGenAI || mod.default?.GoogleGenAI || mod.default;
    return GoogleGenAIClass;
  } catch (err) {
    console.warn("Dynamic import of @google/genai failed, falling back to direct REST API:", err);
    return null;
  }
}

function initializeCaptionMaker() {
  console.log("Initializing Caption Maker AI Studio...");

  // ==========================================
  // App State & Secure LocalStorage Management
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
    geminiApiKey: localStorage.getItem("gemini_api_key") || localStorage.getItem("cm_gemini_key") || "",
    currentOutput: null,
    attachedFile: null,
    attachedImageBase64: null,
    history: JSON.parse(localStorage.getItem("cm_history_drafts") || "[]")
  };

  // Platform limits (including YouTube Shorts & Video)
  const platformLimits = {
    instagram: { maxChars: 2200, hookFold: 125, name: "Instagram" },
    tiktok: { maxChars: 2200, hookFold: 150, name: "TikTok" },
    youtube: { maxChars: 5000, hookFold: 150, name: "YouTube" },
    linkedin: { maxChars: 3000, hookFold: 210, name: "LinkedIn" },
    twitter: { maxChars: 280, hookFold: 140, name: "X / Twitter" }
  };

  // ==========================================
  // DOM Elements Retrieval
  // ==========================================
  const activeEngineLabel = document.getElementById("activeEngineLabel");
  const btnOpenSettings = document.getElementById("btnOpenSettings");
  const settingsModal = document.getElementById("settingsModal");
  const btnCloseSettings = document.getElementById("btnCloseSettings");
  const btnCancelSettings = document.getElementById("btnCancelSettings");
  const btnSaveSettings = document.getElementById("btnSaveSettings");
  const geminiKeyGroup = document.getElementById("geminiKeyGroup");
  const geminiApiKeyInput = document.getElementById("geminiApiKeyInput");
  const btnToggleKeyVisibility = document.getElementById("btnToggleKeyVisibility");
  const btnTestGeminiKey = document.getElementById("btnTestGeminiKey");
  const geminiConnectionFeedback = document.getElementById("geminiConnectionFeedback");
  const checkGaAutoSync = document.getElementById("checkGaAutoSync");
  const historyCountBadge = document.getElementById("historyCountBadge");

  // API Status Bar
  const apiStatusDot = document.getElementById("apiStatusDot");
  const apiStatusText = document.getElementById("apiStatusText");
  const btnConnectApiKey = document.getElementById("btnConnectApiKey");

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

  // Dropzone & File Input
  const dropzoneBox = document.getElementById("dropzoneBox");
  const fileInput = document.getElementById("fileInput");
  const btnAttach = document.getElementById("btnAttach");
  const attachmentPreviewBar = document.getElementById("attachmentPreviewBar");
  const attachmentIcon = document.getElementById("attachmentIcon");
  const attachmentName = document.getElementById("attachmentName");
  const attachmentSize = document.getElementById("attachmentSize");
  const btnRemoveAttachment = document.getElementById("btnRemoveAttachment");

  // Text Inputs
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
  // Immediate UI Synchronization
  // ==========================================
  updateApiKeyStatusUI();
  updateHistoryUI();
  updateInputCounters();
  syncSliderLabels();

  if (state.geminiApiKey && geminiApiKeyInput) {
    geminiApiKeyInput.value = state.geminiApiKey;
  }

  function updateApiKeyStatusUI() {
    const key = localStorage.getItem("gemini_api_key") || state.geminiApiKey;
    if (key) {
      if (apiStatusDot) apiStatusDot.classList.add("connected");
      if (apiStatusText) apiStatusText.innerHTML = "Google Gemini 2.5 Flash SDK: <strong>Terhubung (Aktif)</strong>";
      if (btnConnectApiKey) btnConnectApiKey.textContent = "Ubah API Key";
      if (activeEngineLabel) activeEngineLabel.textContent = "Gemini 2.5 Flash";
    } else {
      if (apiStatusDot) apiStatusDot.classList.remove("connected");
      if (apiStatusText) apiStatusText.textContent = "Google Gemini 2.5 Flash SDK: Belum Terhubung";
      if (btnConnectApiKey) btnConnectApiKey.textContent = "Koneksikan API Key";
      if (activeEngineLabel) activeEngineLabel.textContent = "Set API Key";
    }
  }

  // ==========================================
  // File Attachment & Drag-and-Drop Handler
  // ==========================================
  if (btnAttach && fileInput) {
    btnAttach.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        processUploadedFile(e.target.files[0]);
      }
    });
  }

  // Drag and drop onto dashed dropzone
  if (dropzoneBox) {
    ["dragenter", "dragover"].forEach((eventName) => {
      dropzoneBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneBox.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzoneBox.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneBox.classList.remove("dragover");
      });
    });

    dropzoneBox.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
        processUploadedFile(e.dataTransfer.files[0]);
      }
    });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  function processUploadedFile(file) {
    state.attachedFile = file;

    // Show preview bar
    if (attachmentPreviewBar) {
      attachmentPreviewBar.style.display = "flex";
      if (attachmentName) attachmentName.textContent = file.name;
      if (attachmentSize) attachmentSize.textContent = `(${formatBytes(file.size)})`;

      if (file.type.startsWith("image/")) {
        if (attachmentIcon) attachmentIcon.textContent = "🖼️";
        // Convert to base64 for Multimodal Vision AI
        const reader = new FileReader();
        reader.onload = (e) => {
          state.attachedImageBase64 = e.target.result;
          showToast(`Gambar "${file.name}" siap dianalisis oleh AI!`);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        if (attachmentIcon) attachmentIcon.textContent = "🎬";
        showToast(`Video "${file.name}" dilampirkan sebagai referensi konten!`);
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.type.includes("text")) {
        if (attachmentIcon) attachmentIcon.textContent = "📄";
        // Auto-read text file into textarea
        const reader = new FileReader();
        reader.onload = (e) => {
          rawInput.value = e.target.result;
          updateInputCounters();
          showToast(`Teks dari "${file.name}" berhasil dimuat ke editor!`);
        };
        reader.readAsText(file);
      } else {
        if (attachmentIcon) attachmentIcon.textContent = "📎";
        showToast(`File "${file.name}" dilampirkan.`);
      }
    }
  }

  if (btnRemoveAttachment) {
    btnRemoveAttachment.addEventListener("click", () => {
      state.attachedFile = null;
      state.attachedImageBase64 = null;
      if (fileInput) fileInput.value = "";
      if (attachmentPreviewBar) attachmentPreviewBar.style.display = "none";
      showToast("Lampiran dibatalkan.");
    });
  }

  // ==========================================
  // Dropdown Handling (Bulletproof & Immediate)
  // ==========================================
  function closeAllDropdowns() {
    if (personaMenu) personaMenu.classList.remove("show");
    if (frameworkMenu) frameworkMenu.classList.remove("show");
    if (platformMenu) platformMenu.classList.remove("show");
  }

  if (personaTrigger) {
    personaTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isShown = personaMenu.classList.contains("show");
      closeAllDropdowns();
      if (!isShown) personaMenu.classList.add("show");
    });
  }

  if (frameworkTrigger) {
    frameworkTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isShown = frameworkMenu.classList.contains("show");
      closeAllDropdowns();
      if (!isShown) frameworkMenu.classList.add("show");
    });
  }

  if (platformTrigger) {
    platformTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isShown = platformMenu.classList.contains("show");
      closeAllDropdowns();
      if (!isShown) platformMenu.classList.add("show");
    });
  }

  document.addEventListener("click", closeAllDropdowns);

  // Persona Selection
  document.querySelectorAll("#personaMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#personaMenu .dropdown-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      state.persona = item.dataset.persona;
      state.personaName = item.dataset.name;
      state.personaIcon = item.dataset.icon;
      if (currentPersonaTextEl) currentPersonaTextEl.textContent = state.personaName;
      if (currentPersonaIconEl) currentPersonaIconEl.textContent = state.personaIcon;
      closeAllDropdowns();
      syncPersonaDefaults(state.persona);
      showToast(`Persona aktif: ${state.personaName}`);
    });
  });

  // Framework Selection
  document.querySelectorAll("#frameworkMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#frameworkMenu .dropdown-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      state.framework = item.dataset.framework;
      state.frameworkName = item.dataset.name;
      if (currentFrameworkTextEl) currentFrameworkTextEl.textContent = item.dataset.name;
      closeAllDropdowns();
      showToast(`Framework aktif: ${state.frameworkName}`);
    });
  });

  // Platform Selection
  document.querySelectorAll("#platformMenu .dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#platformMenu .dropdown-item").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      state.platform = item.dataset.platform;
      state.platformName = item.dataset.name;
      state.platformIcon = item.dataset.icon;
      if (targetPlatformText) targetPlatformText.textContent = state.platformName;
      if (targetPlatformIcon) targetPlatformIcon.textContent = state.platformIcon;
      closeAllDropdowns();

      document.querySelectorAll(".platform-btn").forEach((b) => {
        b.classList.toggle("active", b.dataset.platform === state.platform);
      });
      if (state.currentOutput) {
        updatePlatformPreview(state.platform);
      }
      showToast(`Platform target: ${state.platformName}`);
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
  const urgencyLabels = ["", "Sangat Santai", "Informatif Halus", "Moderat (Persuasif)", "Tinggi (Callout Kuat)", "Maksimal (FOMO / Penawaran Terbatas)"];

  function syncSliderLabels() {
    if (sliderWarmth) state.warmth = parseInt(sliderWarmth.value);
    if (sliderUrgency) state.urgency = parseInt(sliderUrgency.value);
    if (warmthValueLabel) warmthValueLabel.textContent = warmthLabels[state.warmth];
    if (urgencyValueLabel) urgencyValueLabel.textContent = urgencyLabels[state.urgency];
  }

  if (sliderWarmth) sliderWarmth.addEventListener("input", syncSliderLabels);
  if (sliderUrgency) sliderUrgency.addEventListener("input", syncSliderLabels);

  // ==========================================
  // Textarea & Quick Idea Prompts
  // ==========================================
  function updateInputCounters() {
    if (!rawInput) return;
    const text = rawInput.value.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).length : 0;
    if (inputCharCount) inputCharCount.textContent = `${chars} karakter • ${words} kata`;
  }

  if (rawInput) rawInput.addEventListener("input", updateInputCounters);

  if (btnClearInput) {
    btnClearInput.addEventListener("click", () => {
      rawInput.value = "";
      updateInputCounters();
      rawInput.focus();
      showToast("Teks dibersihkan.");
    });
  }

  document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      rawInput.value = chip.dataset.text;
      updateInputCounters();
      rawInput.focus();
      showToast("Topik berhasil dimuat ke editor!");
    });
  });

  // Gallery Card Presets
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

  // Analytics Hub Toggle
  if (analyticsToggle) {
    analyticsToggle.addEventListener("click", () => {
      state.isAnalyticsSynced = !state.isAnalyticsSynced;
      if (state.isAnalyticsSynced) {
        analyticsToggle.innerHTML = `
          <div class="analytics-pulse"></div>
          <span class="analytics-label">Google Analytics & Search Index: <strong>Aktif</strong></span>
          <span class="chip-badge">Auto</span>
        `;
        if (refBadge) refBadge.style.display = "inline-flex";
        if (refBadgeText) refBadgeText.textContent = "Google Trends & GA4 Synced";
        showToast("Sinkronisasi data Google Analytics & Search diaktifkan!");
      } else {
        analyticsToggle.innerHTML = `
          <div class="analytics-pulse" style="background: #999; animation: none;"></div>
          <span class="analytics-label">Google Analytics: <strong>Manual Mode</strong></span>
          <span class="chip-badge" style="background:#eee; color:#666;">Off</span>
        `;
        if (refBadgeText) refBadgeText.textContent = "Offline Mode";
        showToast("Mode manual (tanpa query tren)");
      }
    });
  }

  // ==========================================
  // Settings Modal & API Key Management
  // ==========================================
  function openSettingsModal() {
    if (geminiKeyGroup) geminiKeyGroup.style.display = "flex";
    if (geminiApiKeyInput) {
      geminiApiKeyInput.value = localStorage.getItem("gemini_api_key") || state.geminiApiKey || "";
    }
    if (checkGaAutoSync) checkGaAutoSync.checked = state.isAnalyticsSynced;
    if (settingsModal) settingsModal.classList.add("show");
  }

  function closeSettingsModal() {
    if (settingsModal) settingsModal.classList.remove("show");
  }

  if (btnOpenSettings) btnOpenSettings.addEventListener("click", openSettingsModal);
  if (btnConnectApiKey) btnConnectApiKey.addEventListener("click", openSettingsModal);
  if (btnCloseSettings) btnCloseSettings.addEventListener("click", closeSettingsModal);
  if (btnCancelSettings) btnCancelSettings.addEventListener("click", closeSettingsModal);

  if (btnToggleKeyVisibility && geminiApiKeyInput) {
    btnToggleKeyVisibility.addEventListener("click", () => {
      if (geminiApiKeyInput.type === "password") {
        geminiApiKeyInput.type = "text";
        btnToggleKeyVisibility.textContent = "Sembunyikan";
      } else {
        geminiApiKeyInput.type = "password";
        btnToggleKeyVisibility.textContent = "Lihat";
      }
    });
  }

  // Test Gemini Key Connection with SDK or direct test
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
        const GenAI = await getGenAISDK();
        if (GenAI) {
          const ai = new GenAI({ apiKey: key });
          await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "ping"
          });
          showFeedback("✓ Berhasil terhubung ke Google Gemini 2.5 Flash SDK!", true);
        } else {
          // Direct REST API verification
          const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
          const res = await fetch(testUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] })
          });
          const data = await res.json();
          if (res.ok && data.candidates) {
            showFeedback("✓ Berhasil terhubung ke Google Gemini API (Key Valid)!", true);
          } else {
            throw new Error(data.error?.message || `HTTP ${res.status}`);
          }
        }

        state.geminiApiKey = key;
        localStorage.setItem("gemini_api_key", key);
        updateApiKeyStatusUI();
      } catch (err) {
        console.warn("Test ping error:", err);
        showFeedback(`✕ Gagal: ${err.message || "Kunci API tidak valid"}`, false);
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

  if (btnSaveSettings) {
    btnSaveSettings.addEventListener("click", () => {
      const key = geminiApiKeyInput.value.trim();
      state.geminiApiKey = key;
      if (checkGaAutoSync) state.isAnalyticsSynced = checkGaAutoSync.checked;

      // Save securely into LocalStorage as specified
      localStorage.setItem("gemini_api_key", key);
      localStorage.setItem("cm_gemini_key", key);

      updateApiKeyStatusUI();
      closeSettingsModal();

      if (key) {
        showToast("✓ Pengaturan & Google Gemini API Key berhasil tersimpan di browser!");
      } else {
        showToast("Pengaturan tersimpan (API Key kosong).");
      }
    });
  }

  // ==========================================
  // Core Copywriting Generator via Official SDK
  // ==========================================
  if (btnGenerate) {
    btnGenerate.addEventListener("click", async () => {
      const raw = rawInput.value.trim();
      if (!raw && !state.attachedFile) {
        showToast("Mohon masukkan bahan mentah atau lampirkan file terlebih dahulu!");
        rawInput.focus();
        return;
      }

      // 1. Verifikasi Keberadaan API Key di LocalStorage
      const apiKey = localStorage.getItem("gemini_api_key") || state.geminiApiKey;
      if (!apiKey) {
        showToast("⚠️ Silakan masukkan Google Gemini API Key Anda terlebih dahulu!");
        openSettingsModal();
        if (geminiApiKeyInput) geminiApiKeyInput.focus();
        return;
      }

      // 2. Indikator Visual saat AI Sedang Bekerja (Teks & Disable)
      btnGenerate.disabled = true;
      if (btnGenerateText) btnGenerateText.textContent = "Sedang meracik konten dengan AI...";
      btnGenerate.style.opacity = "0.75";
      btnGenerate.style.cursor = "not-allowed";

      try {
        // Panggilan AI dengan model gemini-2.5-flash
        const outputData = await generateWithGemini(raw, apiKey);

        state.currentOutput = outputData;
        renderOutput(outputData);

        // Simpan ke riwayat lokal
        saveToHistory(outputData);

        if (outputSection) {
          outputSection.style.display = "block";
          outputSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        showToast("✓ Caption berhasil diracik oleh Gemini 2.5 Flash!");
      } catch (err) {
        console.error("Gemini API Error:", err);
        let userFriendlyMsg = "Terjadi kesalahan saat memproses konten dengan AI.";
        const errMsg = err.message || "";

        if (errMsg.includes("API_KEY_INVALID") || errMsg.includes("API key not valid")) {
          userFriendlyMsg = "Kunci API Google Gemini tidak valid. Mohon periksa kembali API Key Anda dari Google AI Studio.";
        } else if (errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
          userFriendlyMsg = "Batas kuota gratis Gemini tercapai sementara. Tunggu beberapa saat lalu coba lagi.";
        } else if (errMsg.includes("Failed to fetch") || errMsg.includes("network")) {
          userFriendlyMsg = "Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.";
        } else {
          userFriendlyMsg = `Error: ${errMsg}`;
        }

        showToast(`✕ ${userFriendlyMsg}`);
      } finally {
        btnGenerate.disabled = false;
        if (btnGenerateText) btnGenerateText.textContent = "Generate Caption";
        btnGenerate.style.opacity = "1";
        btnGenerate.style.cursor = "pointer";
      }
    });
  }

  /**
   * Gemini API Integration: Official SDK (@google/genai) with model gemini-2.5-flash
   */
  async function generateWithGemini(raw, apiKey) {
    let contextNote = raw;
    if (state.attachedFile) {
      contextNote += `\n[File Lampiran: ${state.attachedFile.name} (${state.attachedFile.type})]`;
    }

    const frameworkGuides = {
      AIDA: "Attention (Hook penghenti scroll tajam), Interest (Fakta/pain point menarik), Desire (Manfaat nyata yang didambakan), Action (Ajakan bertindak jelas).",
      PAS: "Problem (Soroti keluhan/masalah utama), Agitate (Perparah dampak jika masalah dibiarkan), Solution (Tawarkan solusi praktis melalui konten).",
      BAB: "Before (Kondisi frustrasi masa lalu), After (Kondisi ideal setelah solusi), Bridge (Jembatan solusi/alat yang menghubungkan keduanya).",
      FAB: "Features (Fitur/fakta teknis), Advantages (Keunggulan dibanding alternatif), Benefits (Keuntungan langsung bagi hidup/bisnis pembaca)."
    };

    const platformGuides = {
      instagram: "Format khusus Instagram: Hook tajam di bawah 125 karakter (sebelum fold '...more'), jarak baris bersih dengan emoji terpilih, CTA interaktif (simpan/share/komen), 7-10 hashtag terkurasi.",
      tiktok: "Format khusus TikTok: Sangat ringkas, punchy, search-optimized untuk algoritma TikTok, kalimat to-the-point, CTA ajak komentar atau tag teman.",
      youtube: "Format khusus YouTube (Video Description & Shorts): [HOOK] 2 baris awal sangat tajam dan kaya kata kunci pencarian (muncul di hasil pencarian & sebelum tombol Show More). [BODY] Deskripsi SEO-friendly lengkap dengan simulasi Timestamps / Chapters (0:00 - Intro, 0:45 - Inti Materi, 2:15 - Tips Praktis, dst). [CTA] Ajakan Subscribe, Like, dan klik link pendukung di deskripsi. [HASHTAGS] 3-5 hashtag utama + rekomendasi kata kunci penelusuran YouTube.",
      linkedin: "Format khusus LinkedIn: Sudut pandang profesional B2B/karier, spasi bersih tanpa emoji berlebihan, memancing diskusi bermutu di kolom komentar.",
      twitter: "Format khusus X / Twitter: Singkat, tajam, padat, di bawah 280 karakter, memancing quote atau retweet."
    };

    const warmthDescriptions = ["", "Formal & Dingin", "Objektif & Lugas", "Netral Ramah", "Hangat & Empatis", "Sangat Intim & Merangkul"];
    const urgencyDescriptions = ["", "Sangat Santai", "Informatif Halus", "Moderat (Persuasif)", "Tinggi (Callout Kuat)", "Maksimal (FOMO / Penawaran Terbatas)"];

    const prompt = `Anda adalah seorang Digital Marketer, Copywriter, dan Strategis Media Sosial ahli yang beroperasi dengan standar Apple HIG.
Tugas Anda: Hasilkan caption media sosial dan metadata dengan konversi tinggi berdasarkan input bahan mentah berikut.

SPESIFIKASI & STRATEGI AKTIF:
- Persona / Tone of Voice: ${state.personaName}
- Tingkat Kehangatan Emosi (Warmth): Level ${state.warmth}/5 (${warmthDescriptions[state.warmth]})
- Tingkat Urgensi CTA: Level ${state.urgency}/5 (${urgencyDescriptions[state.urgency]})
- Framework Copywriting: ${state.frameworkName}
  Panduan Framework: ${frameworkGuides[state.framework] || ""}
- Target Platform Sosial Media: ${state.platformName}
  Panduan Khusus Platform: ${platformGuides[state.platform] || ""}
- Benchmark Data Analitik: 85% audiens menonton video tanpa audio (silent mode), target retensi 3 detik awal 28%-42%.

Bahan mentah dari pengguna:
"${contextNote}"

Format output HARUS mengikuti struktur ini secara persis dalam bentuk teks Markdown murni tanpa basa-basi pembuka atau penutup:
[HOOK]
(1-2 kalimat pembuka tajam penghenti scroll pada 3 detik awal sesuai platform ${state.platformName}, padat memikat, maks 125 karakter kecuali YouTube 150 karakter)

[BODY]
(Paragraf singkat, padat, dan terstruktur rapi dengan spasi baris yang bersih dan bernapas sesuai formula ${state.frameworkName} dan panduan platform ${state.platformName})

[CTA]
(Ajakan bertindak yang jelas, relevan dengan persona dan tingkat urgensi yang dipilih)

[HASHTAGS]
(Hashtag terkurasi dan teroptimasi algoritma pencarian sesuai platform ${state.platformName})`;

    let generatedText = "";

    // 1. Coba pemanggilan menggunakan Official SDK @google/genai
    try {
      const GenAI = await getGenAISDK();
      if (GenAI) {
        const ai = new GenAI({ apiKey: apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        generatedText = response.text || "";
      }
    } catch (sdkError) {
      console.warn("Panggilan model gemini-2.5-flash via SDK gagal, mencoba fallback...", sdkError);
    }

    // 2. Fallback REST API jika SDK modul belum terunduh atau model gemini-2.5-flash meminta fallback
    if (!generatedText) {
      const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
      let lastErr = null;

      for (const m of modelsToTry) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1400
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (generatedText) break;
          } else {
            const errJson = await response.json().catch(() => ({}));
            lastErr = new Error(errJson.error?.message || `HTTP ${response.status}`);
          }
        } catch (fetchErr) {
          lastErr = fetchErr;
        }
      }

      if (!generatedText && lastErr) {
        throw lastErr;
      }
    }

    if (!generatedText) {
      throw new Error("Model Gemini tidak mengembalikan respons teks.");
    }

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

  // ==========================================
  // Render Output & HIG Visuals
  // ==========================================
  function renderOutput(data) {
    if (hookTextDisplay) hookTextDisplay.textContent = data.hook;
    if (bodyTextDisplay) bodyTextDisplay.textContent = data.body;
    if (bodyFrameworkDisplay) bodyFrameworkDisplay.textContent = `Persona: ${data.personaName} • Framework ${data.framework}`;
    if (ctaTextDisplay) ctaTextDisplay.textContent = data.cta;
    if (hashtagsTextDisplay) hashtagsTextDisplay.textContent = data.hashtags;
    if (rawMarkdownDisplay) rawMarkdownDisplay.textContent = data.rawMarkdown;

    const hookLen = data.hook.length;
    if (hookCharCount) hookCharCount.textContent = `${hookLen} karakter`;
    const limit = platformLimits[state.platform] || platformLimits.instagram;

    if (hookFoldStatus) {
      if (hookLen <= limit.hookFold) {
        hookFoldStatus.textContent = `✓ Aman: terlihat utuh sebelum lipatan '...more' di ${limit.name}`;
        hookFoldStatus.style.color = "#34c759";
      } else {
        hookFoldStatus.textContent = `⚠ Catatan: melebihi ${limit.hookFold} karakter, baris akhir mungkin terpotong fold`;
        hookFoldStatus.style.color = "#ff9500";
      }
    }

    updatePlatformPreview(state.platform);
  }

  // Platform Simulator Rendering
  function updatePlatformPreview(platform) {
    if (!state.currentOutput) return;

    const { hook, body, cta, hashtags } = state.currentOutput;
    const limit = platformLimits[platform] || platformLimits.instagram;
    const fullText = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags}`;
    const totalChars = fullText.length;

    const pct = Math.min(100, Math.round((totalChars / limit.maxChars) * 100));
    if (meterPlatformName) meterPlatformName.textContent = `${limit.name} Limit:`;
    if (meterNumbers) meterNumbers.textContent = `${totalChars} / ${limit.maxChars} karakter (${pct}%)`;
    if (meterProgressBar) {
      meterProgressBar.style.width = `${pct}%`;
      if (pct > 95) {
        meterProgressBar.style.background = "#ff3b30";
      } else if (pct > 75) {
        meterProgressBar.style.background = "#ff9500";
      } else {
        meterProgressBar.style.background = "#0071e3";
      }
    }

    if (mockUserName) {
      if (platform === "youtube") {
        mockUserName.textContent = "Brand Channel • 142K Subscribers";
        mockPlatformSub.textContent = "YouTube Video / Shorts • Published";
      } else if (platform === "linkedin") {
        mockUserName.textContent = "Muhammad Ilyasa • Founder";
        mockPlatformSub.textContent = "LinkedIn Post • Thought Leadership";
      } else {
        mockUserName.textContent = "brand_official";
        mockPlatformSub.textContent = `${limit.name} Post • Sponsored`;
      }
    }

    if (platformSimBody) {
      if (platform === "instagram") {
        platformSimBody.innerHTML = `
          <strong>${hook}</strong><br><br>
          ${body.replace(/\n\n/g, "<br><br>")}<br><br>
          👉 ${cta}<br><br>
          <span style="color: #00376b;">${hashtags}</span>
        `;
      } else if (platform === "youtube") {
        platformSimBody.innerHTML = `
          <div style="background:#fff5f5; border:1px solid #fed7d7; border-radius:10px; padding:10px 14px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
              <span style="color:#e53e3e; font-size:12px; font-weight:700;">▶ YOUTUBE DESCRIPTION & SEO</span>
              <span style="font-size:10px; background:#fff; padding:1px 6px; border-radius:4px; color:#666; border:1px solid #fed7d7;">High CTR</span>
            </div>
            <strong style="font-size:14px; color:#111; line-height:1.4;">${hook}</strong>
          </div>
          <div style="font-size:13px; line-height:1.6; white-space:pre-wrap; color:#222;">${body.replace(/\n\n/g, "<br><br>")}</div>
          <div style="margin-top:14px; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; font-size:11.5px; line-height:1.6;">
            <strong style="color:#0f172a;">⏱️ TIMESTAMPS / CHAPTERS:</strong><br>
            0:00 - Introduction & Hook<br>
            0:45 - Inti Pembahasan Video<br>
            2:15 - Solusi & Tips Praktis<br>
            3:40 - Kesimpulan & Rekomendasi<br><br>
            <strong style="color:#0f172a;">🔔 SUBSCRIBE & RESOURCES:</strong><br>
            👉 ${cta}<br><br>
            <span style="color:#065fd4; font-weight:600;">${hashtags} #YouTubeShorts #TutorialID</span>
          </div>
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
      } else {
        platformSimBody.innerHTML = `
          ${hook}<br><br>
          ${body.substring(0, 140)}... 🧵👇<br><br>
          <span style="color: #1d9bf0;">${hashtags.split(" ").slice(0, 3).join(" ")}</span>
        `;
      }
    }
  }

  // Switch Simulator Buttons
  document.querySelectorAll(".platform-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".platform-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updatePlatformPreview(btn.dataset.platform);
    });
  });

  // Tab switching
  document.querySelectorAll(".hig-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".hig-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");

      const targetPane = document.getElementById(`pane${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Mini copy buttons
  document.querySelectorAll(".mini-copy-btn").forEach((btn) => {
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
  if (btnCopyMarkdown) {
    btnCopyMarkdown.addEventListener("click", () => {
      if (!state.currentOutput) return;
      navigator.clipboard.writeText(state.currentOutput.rawMarkdown).then(() => {
        if (copyBtnLabel) copyBtnLabel.textContent = "Tersalin!";
        btnCopyMarkdown.style.background = "#34c759";
        showToast("Seluruh caption Markdown tersalin ke clipboard!");
        setTimeout(() => {
          if (copyBtnLabel) copyBtnLabel.textContent = "Salin Markdown";
          btnCopyMarkdown.style.background = "#1d1d1f";
        }, 2000);
      });
    });
  }

  // ==========================================
  // History & Draft Management
  // ==========================================
  function saveToHistory(item) {
    if (state.history.length > 0 && state.history[0].hook === item.hook) return;
    state.history.unshift(item);
    if (state.history.length > 40) state.history.pop();
    localStorage.setItem("cm_history_drafts", JSON.stringify(state.history));
    updateHistoryUI();
  }

  if (btnSaveDraft) {
    btnSaveDraft.addEventListener("click", () => {
      if (!state.currentOutput) return;
      saveToHistory(state.currentOutput);
      showToast("Draft berhasil disimpan ke koleksi riwayat!");
    });
  }

  function updateHistoryUI() {
    if (historyCountBadge) historyCountBadge.textContent = state.history.length;
    if (!historyCardsContainer) return;

    if (state.history.length === 0) {
      if (emptyHistoryState) emptyHistoryState.style.display = "block";
      historyCardsContainer.innerHTML = "";
      if (emptyHistoryState) historyCardsContainer.appendChild(emptyHistoryState);
      return;
    }

    if (emptyHistoryState) emptyHistoryState.style.display = "none";
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

    historyCardsContainer.querySelectorAll(".btn-load").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        const item = state.history[idx];
        if (item) {
          state.currentOutput = item;
          renderOutput(item);
          if (outputSection) {
            outputSection.style.display = "block";
            outputSection.scrollIntoView({ behavior: "smooth" });
          }
          showToast("Draft dimuat ke editor!");
        }
      });
    });

    historyCardsContainer.querySelectorAll(".btn-copy-h").forEach((btn) => {
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

    historyCardsContainer.querySelectorAll(".btn-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index);
        state.history.splice(idx, 1);
        localStorage.setItem("cm_history_drafts", JSON.stringify(state.history));
        updateHistoryUI();
        showToast("Draft dihapus dari riwayat.");
      });
    });
  }

  // Export All History to Markdown
  if (btnExportAll) {
    btnExportAll.addEventListener("click", () => {
      if (state.history.length === 0) {
        showToast("Belum ada draft tersimpan untuk diekspor!");
        return;
      }

      let mdContent = `# Koleksi Draft Caption Maker AI\nTanggal: ${new Date().toLocaleDateString()}\nTotal: ${state.history.length}\n\n---\n\n`;
      state.history.forEach((draft, i) => {
        mdContent += `## Draft #${i + 1} - [${draft.personaName || draft.persona}] (${draft.timestamp || ""})\n`;
        mdContent += `Framework: ${draft.framework}\n\n${draft.rawMarkdown}\n\n---\n\n`;
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
  }

  if (btnClearHistory) {
    btnClearHistory.addEventListener("click", () => {
      if (state.history.length === 0) return;
      if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat draft?")) {
        state.history = [];
        localStorage.removeItem("cm_history_drafts");
        updateHistoryUI();
        showToast("Seluruh riwayat draft dibersihkan.");
      }
    });
  }

  // Toast Function
  function showToast(msg) {
    if (!higToast) return;
    higToast.textContent = msg;
    higToast.classList.add("show");
    setTimeout(() => {
      higToast.classList.remove("show");
    }, 2800);
  }

  console.log("Caption Maker AI Studio fully initialized with active event listeners & file upload support!");
}

// Ensure execution whether DOM is already loaded or still loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCaptionMaker);
} else {
  initializeCaptionMaker();
}
