/**
 * ÖMÜR // MINIMALIST MONOLITH (E-INK & BRUTALIST TERMINAL)
 * High-Precision 60FPS 9-Decimal Age Engine, Subtasks Tracker & Dynamic Categories
 * Manifest V3 - Local-First - Zero Telemetry
 */

(function () {
  'use strict';

  // --- Storage Adapter (chrome.storage.local with localStorage fallback) ---
  const Storage = {
    async get(key, defaultValue) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          return new Promise((resolve) => {
            chrome.storage.local.get([key], (res) => {
              if (chrome.runtime.lastError) {
                resolve(defaultValue);
              } else {
                resolve(res[key] !== undefined ? res[key] : defaultValue);
              }
            });
          });
        } else {
          const val = localStorage.getItem(key);
          return val !== null ? JSON.parse(val) : defaultValue;
        }
      } catch (err) {
        console.warn('Storage read error, using default:', err);
        return defaultValue;
      }
    },
    async set(key, value) {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, resolve);
          });
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (err) {
        console.warn('Storage write error:', err);
      }
    }
  };

  // --- Default Categories & Goals ---
  const DEFAULT_CATEGORIES = ['KARİYER', 'YAŞAM', 'GELİŞİM', 'SAĞLIK'];

  const DEFAULT_GOALS = [
    {
      id: 'g-1',
      title: 'QUARTERLY TARGET: ALPHA RELEASE',
      category: 'KARİYER',
      deadline: '2026-10-30',
      image: null,
      archived: false,
      archivedAt: null,
      subtasks: [
        { id: 'st-1', title: 'Mimari ve şema tasarımı', completed: true },
        { id: 'st-2', title: 'Prototip ve API entegrasyonu', completed: true },
        { id: 'st-3', title: 'Performans testleri & QA', completed: false },
        { id: 'st-4', title: 'İlk 50 kullanıcıya dağıtım', completed: false }
      ]
    },
    {
      id: 'g-2',
      title: 'GÜNLÜK YAŞAM & DİSİPLİN RİTÜELİ',
      category: 'YAŞAM',
      deadline: '2026-12-31',
      image: null,
      archived: false,
      archivedAt: null,
      subtasks: [
        { id: 'st-21', title: 'Her sabah öncelikleri belirle', completed: true },
        { id: 'st-22', title: 'Haftalık değerlendirme defteri tut', completed: true },
        { id: 'st-23', title: 'Gereksiz dikkat dağıtıcıları ele', completed: true }
      ]
    },
    {
      id: 'g-3',
      title: 'RUST & DÜŞÜK SEVİYE SİSTEMLER',
      category: 'GELİŞİM',
      deadline: '2026-11-15',
      image: null,
      archived: false,
      archivedAt: null,
      subtasks: [
        { id: 'st-31', title: 'Rust Book ilk 10 bölüm', completed: true },
        { id: 'st-32', title: 'Memory & Concurrency egzersizleri', completed: false },
        { id: 'st-33', title: 'Terminal CLI aracı geliştir', completed: false }
      ]
    },
    {
      id: 'g-4',
      title: 'MARATON 42KM HAZIRLIĞI',
      category: 'SAĞLIK',
      deadline: '2026-11-08',
      image: null,
      archived: false,
      archivedAt: null,
      subtasks: [
        { id: 'st-41', title: 'Ayakkabı & nabız bandı temin et', completed: true },
        { id: 'st-42', title: 'Haftalık 30km koşu hacmi', completed: false },
        { id: 'st-43', title: '21km yarı maraton denemesi', completed: false }
      ]
    }
  ];

  // Default birthdate: 24.184920612 years ago
  const defaultBirthDate = new Date(Date.now() - (24.184920612 * 365.2425 * 24 * 3600 * 1000)).toISOString().split('T')[0];

  let state = {
    birthDate: defaultBirthDate,
    showLifeExpectancy: false, // Default off per user preference!
    lifeExpectancy: 80,
    theme: 'light',
    activeCategory: 'ALL',
    currentView: 'active', // 'active' | 'archive'
    categories: [...DEFAULT_CATEGORIES],
    goals: []
  };

  // Temporary state for Goal Modal editing
  let currentEditingGoalId = null;
  let currentModalSubtasks = [];
  let currentUploadedImage = null;

  // --- DOM Elements ---
  const ageIntEl = document.getElementById('ageInt');
  const ageDecEl = document.getElementById('ageDec');
  const counterHero = document.getElementById('counterHero');
  const lifeRatioDisplay = document.getElementById('lifeRatioDisplay');
  const metaDays = document.getElementById('metaDays');
  const metaClock = document.getElementById('metaClock');
  const metaYearProgress = document.getElementById('metaYearProgress');
  const tickerRuler = document.getElementById('tickerRuler');
  const tickerSweepNeedle = document.getElementById('tickerSweepNeedle');

  const categoryPillsEl = document.getElementById('categoryPills');
  const btnNewCategory = document.getElementById('btnNewCategory');
  const goalsGrid = document.getElementById('goalsGrid');
  const btnAddGoal = document.getElementById('btnAddGoal');
  const btnBottomAdd = document.getElementById('btnBottomAdd');
  const btnSettings = document.getElementById('btnSettings');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');

  // Workspace Tabs Elements
  const tabActiveGoals = document.getElementById('tabActiveGoals');
  const tabArchivedGoals = document.getElementById('tabArchivedGoals');
  const activeCountEl = document.getElementById('activeCount');
  const archiveCountEl = document.getElementById('archiveCount');

  // Goal Modal Elements
  const goalModal = document.getElementById('goalModal');
  const goalForm = document.getElementById('goalForm');
  const goalIdInput = document.getElementById('goalId');
  const goalTitleInput = document.getElementById('goalTitleInput');
  const goalCategoryInput = document.getElementById('goalCategoryInput');
  const inlineCategoryInput = document.getElementById('inlineCategoryInput');
  const goalDeadlineInput = document.getElementById('goalDeadlineInput');
  const subtasksContainer = document.getElementById('subtasksContainer');
  const newSubtaskInput = document.getElementById('newSubtaskInput');
  const btnAddSubtask = document.getElementById('btnAddSubtask');
  const subtaskSummaryBadge = document.getElementById('subtaskSummaryBadge');
  const goalImageInput = document.getElementById('goalImageInput');
  const imageUploadTriggerArea = document.getElementById('imageUploadTriggerArea');
  const btnSelectImage = document.getElementById('btnSelectImage');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const imagePreviewEl = document.getElementById('imagePreviewEl');
  const btnChangeImage = document.getElementById('btnChangeImage');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnDeleteGoal = document.getElementById('btnDeleteGoal');
  const btnToggleArchiveModal = document.getElementById('btnToggleArchiveModal');
  const modalTitle = document.getElementById('modalTitle');

  // Settings Modal Elements
  const settingsModal = document.getElementById('settingsModal');
  const settingsForm = document.getElementById('settingsForm');
  const birthDateInput = document.getElementById('birthDateInput');
  const quickAgeInput = document.getElementById('quickAgeInput');
  const btnApplyQuickAge = document.getElementById('btnApplyQuickAge');
  const enableLifeExpToggle = document.getElementById('enableLifeExpToggle');
  const lifeExpSliderContainer = document.getElementById('lifeExpSliderContainer');
  const lifeExpectancyInput = document.getElementById('lifeExpectancyInput');
  const lifeExpVal = document.getElementById('lifeExpVal');
  const btnCloseSettings = document.getElementById('btnCloseSettings');
  const btnCancelSettings = document.getElementById('btnCancelSettings');
  const settingsCatList = document.getElementById('settingsCatList');

  const TICK_COUNT = 60;
  let tickElements = [];

  // --- Initialize Continuous Micro-Ticker Ruler ---
  function buildTickerRuler() {
    if (!tickerRuler) return;
    tickerRuler.innerHTML = '';
    tickElements = [];

    for (let i = 0; i < TICK_COUNT; i++) {
      const tick = document.createElement('div');
      const isMajor = (i % 5 === 0);
      tick.className = `ticker-tick ${isMajor ? 'major' : 'minor'}`;
      tickerRuler.appendChild(tick);
      tickElements.push(tick);
    }
  }

  // --- High-Precision 60FPS Engine with FIXED 9 DECIMALS ---
  function runEngine() {
    if (!state.birthDate) {
      requestAnimationFrame(runEngine);
      return;
    }

    const now = Date.now() + (performance.now() % 1);
    const birthTime = new Date(state.birthDate).getTime();
    const diffMs = now - birthTime;

    if (diffMs > 0) {
      const ageInYears = diffMs / (1000 * 60 * 60 * 24 * 365.2425);
      const intPart = Math.floor(ageInYears);
      
      // Fixed 9 decimals as requested: (e.g. 24.184920612)
      const decPart = (ageInYears - intPart).toFixed(9).substring(2);

      if (ageIntEl) ageIntEl.textContent = intPart;
      if (ageDecEl) ageDecEl.textContent = decPart;

      // Estimated Lifespan / Life Consumed (only shown if user enabled)
      if (state.showLifeExpectancy && lifeRatioDisplay && state.lifeExpectancy > 0) {
        const lifeRatio = Math.min(100, Math.max(0, (ageInYears / state.lifeExpectancy) * 100));
        lifeRatioDisplay.textContent = `ÖMÜR: %${lifeRatio.toFixed(3)}`;
        lifeRatioDisplay.hidden = false;
      } else if (lifeRatioDisplay) {
        lifeRatioDisplay.hidden = true;
      }

      // Total days lived
      if (metaDays) {
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        metaDays.textContent = `GÜN: ${totalDays.toLocaleString('tr-TR')}`;
      }

      // Live clock without tacky '60 fps' text
      if (metaClock) {
        const d = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        metaClock.textContent = `${hh}:${mm}:${ss}`;
      }

      // Continuous 60Hz Needle Sweep (sweeps across ruler smoothly)
      const secondFraction = (now % 1000) / 1000;
      if (tickerSweepNeedle) {
        tickerSweepNeedle.style.left = `${(secondFraction * 100).toFixed(2)}%`;
      }

      // Active tick illumination
      const activeIndex = Math.floor(secondFraction * TICK_COUNT);
      for (let i = 0; i < TICK_COUNT; i++) {
        if (i <= activeIndex) {
          tickElements[i]?.classList.add('active');
        } else {
          tickElements[i]?.classList.remove('active');
        }
      }

      // Year elapsed progress
      if (metaYearProgress) {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1).getTime();
        const endOfYear = new Date(currentYear + 1, 0, 1).getTime();
        const yearPct = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
        metaYearProgress.textContent = `YILIN %${yearPct.toFixed(1)}'İ BİTTİ`;
      }
    }

    requestAnimationFrame(runEngine);
  }

  // --- Calculate Goal Progress from Subtasks (NO SLIDER) ---
  function calculateProgress(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(s => s.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  }

  // --- Switch Workspace View (Active vs Archive) ---
  function switchView(view) {
    if (state.currentView === view) return;
    state.currentView = view;

    if (tabActiveGoals && tabArchivedGoals) {
      const isActive = (view === 'active');
      tabActiveGoals.classList.toggle('active', isActive);
      tabActiveGoals.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tabArchivedGoals.classList.toggle('active', !isActive);
      tabArchivedGoals.setAttribute('aria-selected', !isActive ? 'true' : 'false');
    }

    renderCategoryPills();
    renderGoals();
  }

  // --- Render Category Filter Pills ---
  function renderCategoryPills() {
    if (!categoryPillsEl) return;
    categoryPillsEl.innerHTML = '';

    const isArchiveView = (state.currentView === 'archive');
    const viewGoals = state.goals.filter(g => isArchiveView ? Boolean(g.archived) : !g.archived);

    // "TÜMÜ" master pill
    const totalCount = viewGoals.length;
    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.className = `category-pill ${state.activeCategory === 'ALL' ? 'active' : ''}`;
    allPill.textContent = `TÜMÜ (${totalCount})`;
    allPill.title = 'Tüm hedefleri göster';
    allPill.addEventListener('click', () => {
      state.activeCategory = 'ALL';
      renderCategoryPills();
      renderGoals();
    });
    categoryPillsEl.appendChild(allPill);

    // Each dynamic category with filter button & delete trigger
    state.categories.forEach(cat => {
      const count = viewGoals.filter(g => (g.category || 'GENEL') === cat).length;
      const isActive = state.activeCategory === cat;

      const group = document.createElement('div');
      group.className = `category-pill-group ${isActive ? 'active' : ''}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'category-pill-btn';
      btn.textContent = `${cat} (${count})`;
      btn.title = `"${cat}" kategorisine göre filtrele`;
      btn.addEventListener('click', () => {
        state.activeCategory = cat;
        renderCategoryPills();
        renderGoals();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'category-pill-del';
      delBtn.innerHTML = '&times;';
      delBtn.title = `"${cat}" kategorisini sil`;
      delBtn.setAttribute('aria-label', `"${cat}" kategorisini sil`);
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCategory(cat);
      });

      group.appendChild(btn);
      group.appendChild(delBtn);
      categoryPillsEl.appendChild(group);
    });
  }

  // --- Delete Category Action ---
  async function deleteCategory(cat) {
    const affectedGoals = state.goals.filter(g => (g.category || 'GENEL') === cat);
    let confirmMsg = `"${cat}" kategorisini silmek istediğinize emin misiniz?`;
    if (affectedGoals.length > 0) {
      confirmMsg += `\n\nBu kategoriye bağlı ${affectedGoals.length} hedef "GENEL" kategorisine taşınacaktır.`;
    }

    if (!confirm(confirmMsg)) return;

    // Reassign affected goals to 'GENEL'
    if (affectedGoals.length > 0) {
      state.goals = state.goals.map(g => {
        if ((g.category || 'GENEL') === cat) {
          return { ...g, category: 'GENEL' };
        }
        return g;
      });
      if (!state.categories.includes('GENEL') && cat !== 'GENEL') {
        state.categories.push('GENEL');
      }
      await Storage.set('omur_goals', state.goals);
    }

    // Remove category from state
    state.categories = state.categories.filter(c => c !== cat);
    await Storage.set('omur_categories', state.categories);

    // If active category was the deleted one, reset to ALL
    if (state.activeCategory === cat) {
      state.activeCategory = 'ALL';
    }

    renderCategoryPills();
    renderGoals();
    populateCategoryDropdown();
    renderSettingsCategories();
  }

  // --- Render Categories List inside Settings Modal ---
  function renderSettingsCategories() {
    if (!settingsCatList) return;
    settingsCatList.innerHTML = '';
    if (state.categories.length === 0) {
      settingsCatList.innerHTML = '<span class="field-hint">Henüz tanımlı kategori bulunmuyor.</span>';
      return;
    }
    state.categories.forEach(cat => {
      const count = state.goals.filter(g => (g.category || 'GENEL') === cat).length;
      const tag = document.createElement('div');
      tag.className = 'settings-cat-tag';
      tag.innerHTML = `
        <span class="settings-cat-name">${escapeHTML(cat)} (${count})</span>
        <button type="button" class="settings-cat-del" title="&quot;${escapeHTML(cat)}&quot; kategorisini sil" aria-label="Kategoriyi Sil">&times;</button>
      `;
      const delBtn = tag.querySelector('.settings-cat-del');
      delBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteCategory(cat);
      });
      settingsCatList.appendChild(tag);
    });
  }

  // Add New Category Action
  btnNewCategory.addEventListener('click', async () => {
    const name = prompt('Eklemek istediğiniz yeni kategori adını yazın:');
    if (!name) return;
    const cleanName = name.trim().toUpperCase();
    if (!cleanName) return;

    if (!state.categories.includes(cleanName)) {
      state.categories.push(cleanName);
      await Storage.set('omur_categories', state.categories);
      state.activeCategory = cleanName;
      renderCategoryPills();
      renderGoals();
      populateCategoryDropdown();
      renderSettingsCategories();
    }
  });

  // --- Populate Category Dropdown in Goal Modal ---
  function populateCategoryDropdown(selectedCat) {
    if (!goalCategoryInput) return;
    goalCategoryInput.innerHTML = '';

    state.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === selectedCat) opt.selected = true;
      goalCategoryInput.appendChild(opt);
    });

    // Option to create new category inline
    const newOpt = document.createElement('option');
    newOpt.value = '__NEW__';
    newOpt.textContent = '+ Yeni Kategori Ekle...';
    goalCategoryInput.appendChild(newOpt);

    inlineCategoryInput.hidden = true;
    inlineCategoryInput.value = '';
  }

  goalCategoryInput.addEventListener('change', () => {
    if (goalCategoryInput.value === '__NEW__') {
      inlineCategoryInput.hidden = false;
      inlineCategoryInput.focus();
    } else {
      inlineCategoryInput.hidden = true;
    }
  });

  // --- Render Goals Grid (With On-Card Interactive Subtasks) ---
  function renderGoals() {
    if (!goalsGrid) return;
    goalsGrid.innerHTML = '';

    // Update Counts on Workspace Tabs
    const activeCount = state.goals.filter(g => !g.archived).length;
    const archiveCount = state.goals.filter(g => Boolean(g.archived)).length;
    if (activeCountEl) activeCountEl.textContent = activeCount;
    if (archiveCountEl) archiveCountEl.textContent = archiveCount;

    const isArchiveView = (state.currentView === 'archive');
    const viewGoals = state.goals.filter(g => isArchiveView ? Boolean(g.archived) : !g.archived);

    // Filter by active category
    let filteredGoals = viewGoals;
    if (state.activeCategory !== 'ALL') {
      filteredGoals = viewGoals.filter(g => (g.category || 'GENEL') === state.activeCategory);
    }

    // Empty State
    if (!filteredGoals || filteredGoals.length === 0) {
      if (isArchiveView) {
        const emptyBoard = document.createElement('div');
        emptyBoard.className = 'empty-board';
        const isFiltered = state.activeCategory !== 'ALL';
        emptyBoard.innerHTML = `
          <div class="empty-bracket">[ ARŞİV BOŞ ]</div>
          <h3 class="empty-title">${isFiltered ? `"${escapeHTML(state.activeCategory)}" Kategorisinde Arşiv Yok` : 'Henüz Arşivlenmiş Bir Hedef Yok'}</h3>
          <p class="empty-desc">${isFiltered ? 'Bu kategoriye ait arşivlenmiş bir hedef bulunmuyor.' : 'Tamamlanan veya odak dışı kalan hedefleri arşivleyerek ana panonuzu sade tutabilirsiniz.'}</p>
        `;
        goalsGrid.appendChild(emptyBoard);
        return;
      }

      // Active View Empty State
      const emptyCard = document.createElement('div');
      emptyCard.className = 'empty-state-card';
      const isFiltered = state.activeCategory !== 'ALL';
      emptyCard.innerHTML = `
        <h3 class="empty-title">${isFiltered ? `"${escapeHTML(state.activeCategory)}" Kategorisinde Hedef Yok` : 'Henüz Bir Hedef Belirlemediniz'}</h3>
        <p class="empty-desc">Zaman akıp gidiyor. Hayatınızı odaklayacak ve her yeni sekmede yüzleşeceğiniz ilk hedefinizi oluşturun.</p>
        <button type="button" class="btn-empty-add" id="btnEmptyAddGoal">
          + İLK HEDEFİNİZİ EKLEYİN
        </button>
      `;

      emptyCard.querySelector('#btnEmptyAddGoal').addEventListener('click', () => {
        openGoalModal(null);
      });

      goalsGrid.appendChild(emptyCard);
      return;
    }

    // Render Goal Cards
    filteredGoals.forEach((goal) => {
      const card = document.createElement('article');
      card.className = `goal-card ${goal.archived ? 'is-archived' : ''}`;
      card.dataset.id = goal.id;

      const safeTitle = escapeHTML(goal.title);
      const safeCat = escapeHTML(goal.category || 'GENEL');
      const subtasks = goal.subtasks || [];
      const progress = calculateProgress(subtasks);
      const completedCount = subtasks.filter(s => s.completed).length;

      // Deadline calculation
      let deadlineText = 'SÜRESİZ';
      if (goal.deadline) {
        try {
          const d = new Date(goal.deadline);
          const formatted = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
          const diffDays = Math.ceil((d.getTime() - Date.now()) / (1000 * 3600 * 24));
          if (diffDays < 0) {
            deadlineText = `${formatted} (Süre Doldu)`;
          } else if (diffDays === 0) {
            deadlineText = `${formatted} (Bugün!)`;
          } else {
            deadlineText = `${formatted} (${diffDays} gün kaldı)`;
          }
        } catch (e) {
          deadlineText = escapeHTML(goal.deadline);
        }
      }

      // Optional Image
      let imageHtml = '';
      if (goal.image) {
        imageHtml = `
          <div class="goal-image-frame" data-action="edit">
            <img src="${goal.image}" alt="${safeTitle}" class="goal-thumb-img">
            <button type="button" class="btn-card-remove-img" data-remove-img="${goal.id}" title="Görseli Kaldır">&times; Görseli Kaldır</button>
          </div>
        `;
      }

      // Subtasks Preview (Interactive Checklist Directly on Card!)
      let subtasksHtml = '';
      if (subtasks.length > 0) {
        const previewItems = subtasks.slice(0, 4).map((st) => `
          <label class="subtask-card-item ${st.completed ? 'completed' : ''}">
            <input type="checkbox" data-st-id="${st.id}" ${st.completed ? 'checked' : ''}>
            <span>${escapeHTML(st.title)}</span>
          </label>
        `).join('');

        const moreCount = subtasks.length > 4 ? `<div class="subtask-more-count">+ ${subtasks.length - 4} alt hedef daha...</div>` : '';

        subtasksHtml = `
          <div class="card-subtasks-preview">
            ${previewItems}
            ${moreCount}
          </div>
        `;
      }

      // Header with optional [ ARŞİV ] badge
      const archiveBadgeHtml = goal.archived ? `<span class="badge-archived">[ ARŞİV ]</span>` : '';

      // Card action button: "ARŞİVLE" in active view, "PANOMA GERİ TAŞI (UNARCHIVE)" in archive view
      const archiveActionBtnHtml = goal.archived
        ? `<button type="button" class="btn-archive-action btn-unarchive-action" data-action="unarchive" data-goal-id="${goal.id}" title="Panoma Geri Taşı">PANOMA GERİ TAŞI (UNARCHIVE)</button>`
        : `<button type="button" class="btn-archive-action btn-archive-goal" data-action="archive" data-goal-id="${goal.id}" title="Hedefi Arşivle">ARŞİVLE</button>`;

      card.innerHTML = `
        <div class="goal-card-header">
          <div class="goal-header-left">
            <span class="goal-cat-tag">// ${safeCat}</span>
            ${archiveBadgeHtml}
          </div>
          <span class="goal-status-badge">[ %${progress} ]</span>
        </div>
        
        <h4 class="goal-card-title" data-action="edit">${safeTitle}</h4>
        
        ${imageHtml}
        
        <div class="progress-container" data-action="edit">
          <div class="progress-header-row">
            <span>ALT HEDEFLER: ${completedCount}/${subtasks.length}</span>
            <span>%${progress}</span>
          </div>
          <div class="progress-track-outer">
            <div class="progress-fill-bar" style="width: ${progress}%"></div>
          </div>
        </div>

        ${subtasksHtml}

        <div class="goal-meta-footer">
          <span class="goal-deadline-label">HEDEF: ${deadlineText}</span>
          <div class="goal-actions-group">
            ${archiveActionBtnHtml}
            <button type="button" class="goal-edit-btn" data-action="edit">DÜZENLE ↵</button>
          </div>
        </div>
      `;

      // On-card interactive subtask checkbox toggling!
      card.querySelectorAll('input[type="checkbox"][data-st-id]').forEach(chk => {
        chk.addEventListener('click', (e) => e.stopPropagation());
        chk.addEventListener('change', async (e) => {
          e.stopPropagation();
          const stId = chk.dataset.stId;
          const targetGoal = state.goals.find(g => g.id === goal.id);
          if (targetGoal && targetGoal.subtasks) {
            const st = targetGoal.subtasks.find(s => s.id === stId);
            if (st) {
              st.completed = chk.checked;
              await Storage.set('omur_goals', state.goals);
              renderGoals();
              renderCategoryPills();
            }
          }
        });
      });

      // Direct click on card's "Görseli Kaldır" button
      const btnCardRemove = card.querySelector('[data-remove-img]');
      if (btnCardRemove) {
        btnCardRemove.addEventListener('click', async (e) => {
          e.stopPropagation();
          const targetGoal = state.goals.find(g => g.id === goal.id);
          if (targetGoal) {
            targetGoal.image = null;
            await Storage.set('omur_goals', state.goals);
            renderGoals();
          }
        });
      }

      // Card Archive action button
      const btnArchive = card.querySelector('[data-action="archive"]');
      if (btnArchive) {
        btnArchive.addEventListener('click', async (e) => {
          e.stopPropagation();
          const targetGoal = state.goals.find(g => g.id === goal.id);
          if (targetGoal) {
            targetGoal.archived = true;
            targetGoal.archivedAt = new Date().toISOString();
            await Storage.set('omur_goals', state.goals);
            renderCategoryPills();
            renderGoals();
          }
        });
      }

      // Card Unarchive action button
      const btnUnarchive = card.querySelector('[data-action="unarchive"]');
      if (btnUnarchive) {
        btnUnarchive.addEventListener('click', async (e) => {
          e.stopPropagation();
          const targetGoal = state.goals.find(g => g.id === goal.id);
          if (targetGoal) {
            targetGoal.archived = false;
            targetGoal.archivedAt = null;
            await Storage.set('omur_goals', state.goals);
            renderCategoryPills();
            renderGoals();
          }
        });
      }

      // Clicking title, image, or edit button opens modal
      card.querySelectorAll('[data-action="edit"]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          openGoalModal(goal);
        });
      });

      goalsGrid.appendChild(card);
    });
  }

  // --- Goal Modal Subtasks List Management ---
  function renderModalSubtasks() {
    if (!subtasksContainer) return;
    subtasksContainer.innerHTML = '';

    const completed = currentModalSubtasks.filter(s => s.completed).length;
    const total = currentModalSubtasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    subtaskSummaryBadge.textContent = `%${pct} (${completed}/${total})`;

    if (currentModalSubtasks.length === 0) {
      subtasksContainer.innerHTML = `
        <div style="font-size: 0.78rem; color: var(--ink-muted); padding: 0.25rem 0;">
          Henüz alt hedef eklenmedi. Aşağıdan adımları ekledikçe ilerleme oranı otomatik hesaplanır.
        </div>
      `;
      return;
    }

    currentModalSubtasks.forEach((st, idx) => {
      const row = document.createElement('div');
      row.className = 'subtask-item-row';
      row.innerHTML = `
        <input type="checkbox" ${st.completed ? 'checked' : ''} title="Tamamlandı olarak işaretle">
        <input type="text" class="subtask-item-title ${st.completed ? 'done' : ''}" value="${escapeHTML(st.title)}" maxlength="60" placeholder="Alt hedef başlığı">
        <button type="button" class="btn-delete-subtask" title="Sil">&times;</button>
      `;

      // Checkbox toggle
      const chk = row.querySelector('input[type="checkbox"]');
      const txt = row.querySelector('.subtask-item-title');
      chk.addEventListener('change', () => {
        st.completed = chk.checked;
        txt.classList.toggle('done', chk.checked);
        renderModalSubtasks();
      });

      // Title edit
      txt.addEventListener('input', (e) => {
        st.title = e.target.value;
      });

      // Delete subtask
      row.querySelector('.btn-delete-subtask').addEventListener('click', () => {
        currentModalSubtasks.splice(idx, 1);
        renderModalSubtasks();
      });

      subtasksContainer.appendChild(row);
    });
  }

  function addSubtaskFromInput() {
    const val = newSubtaskInput.value.trim();
    if (!val) return;

    currentModalSubtasks.push({
      id: 'st-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      title: val,
      completed: false
    });

    newSubtaskInput.value = '';
    renderModalSubtasks();
    newSubtaskInput.focus();
  }

  btnAddSubtask.addEventListener('click', addSubtaskFromInput);
  newSubtaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtaskFromInput();
    }
  });

  // Helper to scale & optimize image to max 800px JPEG to prevent storage quota issues
  function processImageFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const optimized = canvas.toDataURL('image/jpeg', 0.85);
        callback(optimized);
      };
      img.onerror = () => {
        alert('Görsel dosyası işlenemedi.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // --- Open Goal Modal ---
  function openGoalModal(goal) {
    currentUploadedImage = null;
    currentEditingGoalId = goal ? goal.id : null;
    goalForm.reset();
    if (goalImageInput) goalImageInput.value = '';

    if (goal) {
      modalTitle.textContent = goal.archived ? 'HEDEFİ DÜZENLE [ARŞİV]' : 'HEDEFİ DÜZENLE';
      goalIdInput.value = goal.id;
      goalTitleInput.value = goal.title || '';
      goalDeadlineInput.value = goal.deadline || '';
      populateCategoryDropdown(goal.category || 'KARİYER');

      currentModalSubtasks = goal.subtasks ? JSON.parse(JSON.stringify(goal.subtasks)) : [];
      btnDeleteGoal.hidden = false;

      if (btnToggleArchiveModal) {
        btnToggleArchiveModal.hidden = false;
        if (goal.archived) {
          btnToggleArchiveModal.textContent = 'Arşivden Çıkar';
          btnToggleArchiveModal.title = 'Hedefi arşivden çıkarıp aktif panoya geri taşır';
        } else {
          btnToggleArchiveModal.textContent = 'Arşive Taşı';
          btnToggleArchiveModal.title = 'Hedefi arşivler';
        }
      }

      if (goal.image) {
        currentUploadedImage = goal.image;
        imagePreviewEl.src = goal.image;
        imagePreviewContainer.hidden = false;
        if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = true;
      } else {
        currentUploadedImage = null;
        imagePreviewEl.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E';
        imagePreviewContainer.hidden = true;
        if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = false;
      }
    } else {
      modalTitle.textContent = 'YENİ HEDEF OLUŞTUR';
      goalIdInput.value = '';
      goalDeadlineInput.value = '';
      const defaultCat = state.activeCategory !== 'ALL' ? state.activeCategory : (state.categories[0] || 'GENEL');
      populateCategoryDropdown(defaultCat);

      currentModalSubtasks = [];
      currentUploadedImage = null;
      imagePreviewEl.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E';
      imagePreviewContainer.hidden = true;
      if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = false;
      btnDeleteGoal.hidden = true;

      if (btnToggleArchiveModal) {
        btnToggleArchiveModal.hidden = true;
      }
    }

    renderModalSubtasks();
    goalModal.hidden = false;
    goalTitleInput.focus();
  }

  function closeGoalModal() {
    currentUploadedImage = null;
    if (goalImageInput) goalImageInput.value = '';
    if (imagePreviewEl) imagePreviewEl.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E';
    if (imagePreviewContainer) imagePreviewContainer.hidden = true;
    if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = false;
    goalModal.hidden = true;
  }

  // --- Save Goal Form ---
  goalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = goalIdInput.value;
    const title = goalTitleInput.value.trim();
    let category = goalCategoryInput.value;
    const deadline = goalDeadlineInput.value;

    if (!title) return;

    // If user chose to create a new category inline
    if (category === '__NEW__') {
      const inlineCat = inlineCategoryInput.value.trim().toUpperCase();
      if (inlineCat) {
        category = inlineCat;
        if (!state.categories.includes(category)) {
          state.categories.push(category);
          await Storage.set('omur_categories', state.categories);
        }
      } else {
        category = state.categories[0] || 'GENEL';
      }
    }

    // Clean subtasks
    const finalSubtasks = currentModalSubtasks
      .map(s => ({ ...s, title: s.title.trim() }))
      .filter(s => s.title.length > 0);

    if (id) {
      // Update existing
      const idx = state.goals.findIndex(g => g.id === id);
      if (idx !== -1) {
        state.goals[idx] = {
          ...state.goals[idx],
          title,
          category,
          deadline,
          subtasks: finalSubtasks,
          image: currentUploadedImage
        };
      }
    } else {
      // Create new
      const newGoal = {
        id: 'g-' + Date.now(),
        title,
        category,
        deadline,
        subtasks: finalSubtasks,
        image: currentUploadedImage,
        archived: false,
        archivedAt: null
      };
      state.goals.push(newGoal);

      // Switch to active view if created while in archive view
      if (state.currentView !== 'active') {
        switchView('active');
      }
    }

    await Storage.set('omur_goals', state.goals);
    renderCategoryPills();
    renderGoals();
    closeGoalModal();
  });

  // Archive / Unarchive Toggle from Modal
  if (btnToggleArchiveModal) {
    btnToggleArchiveModal.addEventListener('click', async () => {
      const id = goalIdInput.value;
      if (!id) return;
      const targetGoal = state.goals.find(g => g.id === id);
      if (!targetGoal) return;

      const willArchive = !targetGoal.archived;
      targetGoal.archived = willArchive;
      targetGoal.archivedAt = willArchive ? new Date().toISOString() : null;

      // Also persist form values if user modified them before toggling archive
      const formTitle = goalTitleInput.value.trim();
      if (formTitle) targetGoal.title = formTitle;

      let category = goalCategoryInput.value;
      if (category === '__NEW__') {
        const inlineCat = inlineCategoryInput.value.trim().toUpperCase();
        if (inlineCat) {
          targetGoal.category = inlineCat;
          if (!state.categories.includes(inlineCat)) {
            state.categories.push(inlineCat);
            await Storage.set('omur_categories', state.categories);
          }
        }
      } else if (category) {
        targetGoal.category = category;
      }

      targetGoal.deadline = goalDeadlineInput.value;
      targetGoal.subtasks = currentModalSubtasks
        .map(s => ({ ...s, title: s.title.trim() }))
        .filter(s => s.title.length > 0);
      targetGoal.image = currentUploadedImage;

      await Storage.set('omur_goals', state.goals);
      renderCategoryPills();
      renderGoals();
      closeGoalModal();
    });
  }

  // Delete Goal
  btnDeleteGoal.addEventListener('click', async () => {
    const id = goalIdInput.value;
    if (!id) return;

    state.goals = state.goals.filter(g => g.id !== id);
    await Storage.set('omur_goals', state.goals);
    renderCategoryPills();
    renderGoals();
    closeGoalModal();
  });

  // Trigger file chooser from custom button or change button
  if (btnSelectImage) {
    btnSelectImage.addEventListener('click', () => {
      goalImageInput.click();
    });
  }
  if (btnChangeImage) {
    btnChangeImage.addEventListener('click', () => {
      goalImageInput.click();
    });
  }

  // Image Upload Handler with Canvas Optimization
  goalImageInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    processImageFile(file, (optimizedBase64) => {
      currentUploadedImage = optimizedBase64;
      imagePreviewEl.src = optimizedBase64;
      imagePreviewContainer.hidden = false;
      if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = true;
    });
  });

  btnRemoveImage.addEventListener('click', () => {
    currentUploadedImage = null;
    goalImageInput.value = '';
    imagePreviewEl.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E';
    imagePreviewContainer.hidden = true;
    if (imageUploadTriggerArea) imageUploadTriggerArea.hidden = false;
  });

  btnCloseModal.addEventListener('click', closeGoalModal);
  btnCancelModal.addEventListener('click', closeGoalModal);
  goalModal.addEventListener('click', (e) => {
    if (e.target === goalModal) closeGoalModal();
  });

  // --- Settings Modal Logic ---
  function openSettingsModal() {
    birthDateInput.value = state.birthDate || '';
    quickAgeInput.value = '';
    enableLifeExpToggle.checked = state.showLifeExpectancy;
    lifeExpSliderContainer.hidden = !state.showLifeExpectancy;
    lifeExpectancyInput.value = state.lifeExpectancy || 80;
    lifeExpVal.textContent = state.lifeExpectancy || 80;
    renderSettingsCategories();
    settingsModal.hidden = false;
    birthDateInput.focus();
  }

  function closeSettingsModal() {
    settingsModal.hidden = true;
  }

  // Toggle estimated life expectancy visibility in settings
  enableLifeExpToggle.addEventListener('change', () => {
    lifeExpSliderContainer.hidden = !enableLifeExpToggle.checked;
  });

  // Quick Age Helper
  function applyAge(ageNum) {
    const age = parseFloat(ageNum);
    if (isNaN(age) || age <= 0 || age > 120) {
      alert('Lütfen 1 ile 120 arasında geçerli bir yaş girin.');
      return;
    }
    const msAgo = age * 365.2425 * 24 * 3600 * 1000;
    const calcDate = new Date(Date.now() - msAgo).toISOString().split('T')[0];
    birthDateInput.value = calcDate;
  }

  btnApplyQuickAge.addEventListener('click', () => {
    applyAge(quickAgeInput.value);
  });

  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAge(btn.dataset.age);
    });
  });

  lifeExpectancyInput.addEventListener('input', (e) => {
    lifeExpVal.textContent = e.target.value;
  });

  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newBirthDate = birthDateInput.value;
    const newShowLifeExp = enableLifeExpToggle.checked;
    const newLifeExp = parseInt(lifeExpectancyInput.value, 10) || 80;

    if (!newBirthDate) return;

    state.birthDate = newBirthDate;
    state.showLifeExpectancy = newShowLifeExp;
    state.lifeExpectancy = newLifeExp;

    await Storage.set('omur_birth_date', state.birthDate);
    await Storage.set('omur_show_life_exp', state.showLifeExpectancy);
    await Storage.set('omur_life_expectancy', state.lifeExpectancy);

    closeSettingsModal();
  });

  btnCloseSettings.addEventListener('click', closeSettingsModal);
  btnCancelSettings.addEventListener('click', closeSettingsModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  // Direct Click on Counter Horizon Opens Settings Modal!
  counterHero.addEventListener('click', openSettingsModal);
  counterHero.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openSettingsModal();
    }
  });

  // Workspace Tabs & Persistent Add Buttons
  if (tabActiveGoals) {
    tabActiveGoals.addEventListener('click', () => switchView('active'));
  }
  if (tabArchivedGoals) {
    tabArchivedGoals.addEventListener('click', () => switchView('archive'));
  }

  btnAddGoal.addEventListener('click', () => openGoalModal(null));
  btnBottomAdd.addEventListener('click', () => openGoalModal(null));
  btnSettings.addEventListener('click', openSettingsModal);

  // Theme Toggle
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☾ GECE' : '☼ E-INK';
    }
  }

  btnThemeToggle.addEventListener('click', async () => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    await Storage.set('omur_theme', nextTheme);
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!goalModal.hidden) closeGoalModal();
      if (!settingsModal.hidden) closeSettingsModal();
    }
  });

  // HTML Escape Helper
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // --- Bootstrap Extension ---
  async function init() {
    buildTickerRuler();

    // Load persisted data
    const savedBirthDate = await Storage.get('omur_birth_date', null);
    const savedShowLifeExp = await Storage.get('omur_show_life_exp', false);
    const savedLifeExp = await Storage.get('omur_life_expectancy', 80);
    const savedTheme = await Storage.get('omur_theme', 'light');
    const savedCategories = await Storage.get('omur_categories', null);
    const savedGoals = await Storage.get('omur_goals', null);

    state.birthDate = savedBirthDate || defaultBirthDate;
    state.showLifeExpectancy = savedShowLifeExp;
    state.lifeExpectancy = savedLifeExp;
    state.categories = (savedCategories !== null && Array.isArray(savedCategories)) ? savedCategories : DEFAULT_CATEGORIES;
    
    // Normalize loaded goals to ensure archived fields exist
    const rawGoals = (savedGoals !== null && Array.isArray(savedGoals)) ? savedGoals : DEFAULT_GOALS;
    state.goals = rawGoals.map(g => ({
      ...g,
      archived: Boolean(g.archived),
      archivedAt: g.archivedAt || null
    }));

    // Seed defaults if fresh installation
    if (savedGoals === null) {
      await Storage.set('omur_goals', state.goals);
    }
    if (savedCategories === null) {
      await Storage.set('omur_categories', DEFAULT_CATEGORIES);
    }
    if (savedBirthDate === null) {
      await Storage.set('omur_birth_date', defaultBirthDate);
    }

    applyTheme(savedTheme);
    renderCategoryPills();
    renderGoals();
    runEngine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
