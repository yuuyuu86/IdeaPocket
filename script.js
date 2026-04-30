const STORAGE_KEY = "ideaPoketIdeas";
const THEME_KEY = "ideaPoketTheme";

let ideas = [];
let currentDetailIdeaId = null;
let isSpecEditing = false;

const ideaList = document.getElementById("ideaList");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const progressFilter = document.getElementById("progressFilter");
const priorityFilter = document.getElementById("priorityFilter");
const archiveFilter = document.getElementById("archiveFilter");
const sortSelect = document.getElementById("sortSelect");
const detailFilterButton = document.getElementById("detailFilterButton");
const detailFilters = document.getElementById("detailFilters");

const toggleGrowSectionButton = document.getElementById("toggleGrowSectionButton");
const growSectionContent = document.getElementById("growSectionContent");
const toggleSearchSectionButton = document.getElementById("toggleSearchSectionButton");
const searchSectionContent = document.getElementById("searchSectionContent");

const randomIdeaButton = document.getElementById("randomIdeaButton");
const combineIdeasButton = document.getElementById("combineIdeasButton");

const openSettingsButton = document.getElementById("openSettingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const lightModeButton = document.getElementById("lightModeButton");
const darkModeButton = document.getElementById("darkModeButton");
const toggleArchiveSectionButton = document.getElementById("toggleArchiveSectionButton");
const archiveSectionContent = document.getElementById("archiveSectionContent");
const archiveList = document.getElementById("archiveList");
const refreshArchiveListButton = document.getElementById("refreshArchiveListButton");
const exportJsonButton = document.getElementById("exportJsonButton");
const importJsonButton = document.getElementById("importJsonButton");
const importJsonInput = document.getElementById("importJsonInput");

const ideaModal = document.getElementById("ideaModal");
const openAddModalButton = document.getElementById("openAddModalButton");
const closeModalButton = document.getElementById("closeModalButton");
const cancelModalButton = document.getElementById("cancelModalButton");
const modalTitle = document.getElementById("modalTitle");
const ideaForm = document.getElementById("ideaForm");

const editingIdeaId = document.getElementById("editingIdeaId");
const ideaTitleInput = document.getElementById("ideaTitleInput");
const ideaDescriptionInput = document.getElementById("ideaDescriptionInput");
const ideaCategoryInput = document.getElementById("ideaCategoryInput");
const ideaProgressInput = document.getElementById("ideaProgressInput");
const ideaPriorityInput = document.getElementById("ideaPriorityInput");
const ideaNextActionInput = document.getElementById("ideaNextActionInput");
const ideaTagsInput = document.getElementById("ideaTagsInput");
const ideaTargetUserInput = document.getElementById("ideaTargetUserInput");
const ideaMemoInput = document.getElementById("ideaMemoInput");
const funRatingInput = document.getElementById("funRatingInput");
const usefulRatingInput = document.getElementById("usefulRatingInput");
const easyRatingInput = document.getElementById("easyRatingInput");

const detailModal = document.getElementById("detailModal");
const closeDetailButton = document.getElementById("closeDetailButton");
const detailTitle = document.getElementById("detailTitle");
const detailCategory = document.getElementById("detailCategory");
const detailProgress = document.getElementById("detailProgress");
const detailPriority = document.getElementById("detailPriority");
const detailArchiveStatus = document.getElementById("detailArchiveStatus");
const detailCreatedAt = document.getElementById("detailCreatedAt");
const detailDescription = document.getElementById("detailDescription");
const detailNextAction = document.getElementById("detailNextAction");
const detailTags = document.getElementById("detailTags");
const detailFunRating = document.getElementById("detailFunRating");
const detailUsefulRating = document.getElementById("detailUsefulRating");
const detailEasyRating = document.getElementById("detailEasyRating");
const detailTotalRating = document.getElementById("detailTotalRating");
const detailTargetUser = document.getElementById("detailTargetUser");
const detailMemo = document.getElementById("detailMemo");

const openChatGptButton = document.getElementById("openChatGptButton");
const copyPromptButton = document.getElementById("copyPromptButton");

const savedSpec = document.getElementById("savedSpec");
const editSpecButton = document.getElementById("editSpecButton");
const specEditSection = document.getElementById("specEditSection");
const specEditTitle = document.getElementById("specEditTitle");
const specTextarea = document.getElementById("specTextarea");
const saveSpecButton = document.getElementById("saveSpecButton");
const cancelSpecEditButton = document.getElementById("cancelSpecEditButton");

const editIdeaButton = document.getElementById("editIdeaButton");
const toggleFavoriteButton = document.getElementById("toggleFavoriteButton");
const toggleArchiveButton = document.getElementById("toggleArchiveButton");
const exportTxtButton = document.getElementById("exportTxtButton");
const exportMdButton = document.getElementById("exportMdButton");
const deleteIdeaButton = document.getElementById("deleteIdeaButton");

const resultModal = document.getElementById("resultModal");
const resultTitle = document.getElementById("resultTitle");
const resultContent = document.getElementById("resultContent");
const closeResultButton = document.getElementById("closeResultButton");

const toast = document.getElementById("toast");

function loadIdeas() {
  const savedIdeas = localStorage.getItem(STORAGE_KEY);

  if (!savedIdeas) {
    ideas = [];
    return;
  }

  try {
    const parsedIdeas = JSON.parse(savedIdeas);

    if (!Array.isArray(parsedIdeas)) {
      ideas = [];
      return;
    }

    ideas = parsedIdeas.map(normalizeIdea);
    saveIdeas();
  } catch (error) {
    console.error("保存データの読み込みに失敗しました", error);
    ideas = [];
  }
}

function normalizeIdea(idea) {
  return {
    id: idea.id || createId(),
    title: idea.title || "無題のアイデア",
    description: idea.description || "",
    category: idea.category || "その他",
    progress: idea.progress || "思いつき",
    priority: idea.priority || "中",
    nextAction: idea.nextAction || "",
    isArchived: Boolean(idea.isArchived),
    tags: Array.isArray(idea.tags) ? idea.tags : [],
    targetUser: idea.targetUser || "",
    memo: idea.memo || "",
    funRating: Number(idea.funRating || 3),
    usefulRating: Number(idea.usefulRating || 3),
    easyRating: Number(idea.easyRating || 3),
    isFavorite: Boolean(idea.isFavorite),
    spec: idea.spec || "",
    createdAt: idea.createdAt || new Date().toISOString(),
    updatedAt: idea.updatedAt || new Date().toISOString()
  };
}

function saveIdeas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function createId() {
  return `idea_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.replace(/^#/, ""));
}

function tagsToInputValue(tags) {
  return (tags || []).join(", ");
}

function getTotalRating(idea) {
  return Number(idea.funRating) + Number(idea.usefulRating) + Number(idea.easyRating);
}

function getPriorityScore(priority) {
  if (priority === "高") return 3;
  if (priority === "中") return 2;
  if (priority === "低") return 1;
  return 0;
}

function getPriorityClass(priority) {
  if (priority === "高") return "priority-high";
  if (priority === "低") return "priority-low";
  return "priority-middle";
}

function formatStars(value) {
  const number = Number(value || 0);
  return "★".repeat(number) + "☆".repeat(5 - number);
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shortenText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

function createSafeFileName(name) {
  return String(name || "idea")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 60);
}

function getFilteredIdeas() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStatus = statusFilter.value;
  const selectedProgress = progressFilter.value;
  const selectedPriority = priorityFilter.value;
  const selectedArchive = archiveFilter.value;

  const filteredIdeas = ideas.filter((idea) => {
    const keywordTarget = [
      idea.title,
      idea.description,
      idea.category,
      idea.progress,
      idea.priority,
      idea.nextAction,
      idea.targetUser,
      idea.memo,
      idea.spec,
      ...(idea.tags || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesKeyword = keywordTarget.includes(keyword);
    const matchesCategory = selectedCategory === "all" || idea.category === selectedCategory;
    const matchesProgress = selectedProgress === "all" || idea.progress === selectedProgress;
    const matchesPriority = selectedPriority === "all" || idea.priority === selectedPriority;

    let matchesArchive = true;
    if (selectedArchive === "active") matchesArchive = !idea.isArchived;
    if (selectedArchive === "archived") matchesArchive = idea.isArchived;

    let matchesStatus = true;
    if (selectedStatus === "favorite") matchesStatus = idea.isFavorite;
    if (selectedStatus === "hasSpec") matchesStatus = Boolean(idea.spec && idea.spec.trim());
    if (selectedStatus === "noSpec") matchesStatus = !idea.spec || !idea.spec.trim();

    return (
      matchesKeyword &&
      matchesCategory &&
      matchesProgress &&
      matchesPriority &&
      matchesArchive &&
      matchesStatus
    );
  });

  return sortIdeas(filteredIdeas);
}

function sortIdeas(targetIdeas) {
  const sortValue = sortSelect.value;
  const copiedIdeas = [...targetIdeas];

  copiedIdeas.sort((a, b) => {
    if (sortValue === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortValue === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortValue === "favorite") return Number(b.isFavorite) - Number(a.isFavorite);
    if (sortValue === "priorityHigh") return getPriorityScore(b.priority) - getPriorityScore(a.priority);

    if (sortValue === "hasSpec") {
      return Number(Boolean(b.spec && b.spec.trim())) - Number(Boolean(a.spec && a.spec.trim()));
    }

    if (sortValue === "scoreHigh") return getTotalRating(b) - getTotalRating(a);
    if (sortValue === "easyHigh") return Number(b.easyRating) - Number(a.easyRating);

    return 0;
  });

  return copiedIdeas;
}

function renderIdeas() {
  const filteredIdeas = getFilteredIdeas();

  ideaList.innerHTML = "";

  if (filteredIdeas.length === 0) {
    emptyMessage.classList.remove("hidden");

    if (ideas.length > 0) {
      emptyMessage.innerHTML = "条件に合うアイデアがありません。";
    } else {
      emptyMessage.innerHTML =
        "まだアイデアがありません。<br />右下の「＋ アイデア追加」から最初のアイデアを登録してください。";
    }

    return;
  }

  emptyMessage.classList.add("hidden");

  filteredIdeas.forEach((idea) => {
    const card = document.createElement("article");
    card.className = idea.isArchived ? "idea-card archived-card" : "idea-card";
    card.dataset.id = idea.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const specBadgeClass = idea.spec && idea.spec.trim() ? "spec-badge" : "no-spec-badge";
    const specBadgeText = idea.spec && idea.spec.trim() ? "仕様書あり" : "仕様書なし";

    const archiveBadge = idea.isArchived
      ? '<span class="badge archive-badge">アーカイブ済み</span>'
      : "";

    card.innerHTML = `
      <div class="idea-card-header">
        <div>
          <h2>${escapeHtml(idea.title)}</h2>
          <div class="card-top-meta">
            <span class="badge progress-badge">${escapeHtml(idea.progress)}</span>
            <span class="badge priority-badge ${getPriorityClass(idea.priority)}">優先度：${escapeHtml(idea.priority)}</span>
            <span class="badge ${specBadgeClass}">${specBadgeText}</span>
            ${archiveBadge}
          </div>
        </div>

        <button class="favorite-button" data-action="favorite" data-id="${idea.id}" aria-label="お気に入り切り替え">
          ${idea.isFavorite ? "★" : "☆"}
        </button>
      </div>

      <p class="card-description">${escapeHtml(shortenText(idea.description, 90))}</p>

      <div class="next-action-card">
        次にやること：${escapeHtml(idea.nextAction || "未設定")}
      </div>
    `;

    ideaList.appendChild(card);
  });
}

function renderArchiveList() {
  const archivedIdeas = ideas
    .filter((idea) => idea.isArchived)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  archiveList.innerHTML = "";

  if (archivedIdeas.length === 0) {
    archiveList.innerHTML = `
      <div class="archive-empty">
        アーカイブされたアイデアはありません。
      </div>
    `;
    return;
  }

  archivedIdeas.forEach((idea) => {
    const archiveItem = document.createElement("div");
    archiveItem.className = "archive-item";

    archiveItem.innerHTML = `
      <div>
        <p class="archive-item-title">${escapeHtml(idea.title)}</p>
        <p class="archive-item-description">
          ${escapeHtml(shortenText(idea.description, 80))}
        </p>
      </div>

      <button
        class="sub-button restore-button"
        type="button"
        data-restore-id="${idea.id}"
      >
        復元
      </button>
    `;

    archiveList.appendChild(archiveItem);
  });
}

function restoreArchivedIdea(ideaId) {
  const idea = findIdeaById(ideaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  ideas = ideas.map((item) => {
    if (item.id !== ideaId) return item;

    return {
      ...item,
      isArchived: false,
      updatedAt: new Date().toISOString()
    };
  });

  saveIdeas();
  renderIdeas();
  renderArchiveList();

  showToast("アーカイブから復元しました");
}

function openAddModal() {
  modalTitle.textContent = "アイデア追加";
  editingIdeaId.value = "";
  ideaForm.reset();
  ideaCategoryInput.value = "Webアプリ";
  ideaProgressInput.value = "";
  ideaPriorityInput.value = "中";
  funRatingInput.value = "3";
  usefulRatingInput.value = "3";
  easyRatingInput.value = "3";
  ideaModal.classList.remove("hidden");
  ideaTitleInput.focus();
}

function openEditModal(ideaId) {
  const idea = findIdeaById(ideaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  modalTitle.textContent = "アイデア編集";
  editingIdeaId.value = idea.id;
  ideaTitleInput.value = idea.title;
  ideaDescriptionInput.value = idea.description;
  ideaCategoryInput.value = idea.category;
  ideaProgressInput.value = idea.progress || "";
  ideaPriorityInput.value = idea.priority || "中";
  ideaNextActionInput.value = idea.nextAction || "";
  ideaTagsInput.value = tagsToInputValue(idea.tags);
  ideaTargetUserInput.value = idea.targetUser || "";
  ideaMemoInput.value = idea.memo || "";
  funRatingInput.value = String(idea.funRating || 3);
  usefulRatingInput.value = String(idea.usefulRating || 3);
  easyRatingInput.value = String(idea.easyRating || 3);

  detailModal.classList.add("hidden");
  ideaModal.classList.remove("hidden");
  ideaTitleInput.focus();
}

function closeIdeaModal() {
  ideaModal.classList.add("hidden");
}

function handleIdeaFormSubmit(event) {
  event.preventDefault();

  const title = ideaTitleInput.value.trim();
  const description = ideaDescriptionInput.value.trim();
  const category = ideaCategoryInput.value;
  const progress = ideaProgressInput.value || "思いつき";
  const priority = ideaPriorityInput.value;
  const nextAction = ideaNextActionInput.value.trim();
  const tags = parseTags(ideaTagsInput.value);
  const targetUser = ideaTargetUserInput.value.trim();
  const memo = ideaMemoInput.value.trim();
  const funRating = Number(funRatingInput.value);
  const usefulRating = Number(usefulRatingInput.value);
  const easyRating = Number(easyRatingInput.value);

  if (!title || !description || !category || !targetUser) {
    showToast("必須項目をすべて入力してください");
    return;
  }

  const now = new Date().toISOString();
  const editId = editingIdeaId.value;

  if (editId) {
    ideas = ideas.map((idea) => {
      if (idea.id !== editId) return idea;

      return {
        ...idea,
        title,
        description,
        category,
        progress,
        priority,
        nextAction,
        tags,
        targetUser,
        memo,
        funRating,
        usefulRating,
        easyRating,
        updatedAt: now
      };
    });

    showToast("アイデアを更新しました");
  } else {
    const newIdea = {
      id: createId(),
      title,
      description,
      category,
      progress,
      priority,
      nextAction,
      tags,
      targetUser,
      memo,
      funRating,
      usefulRating,
      easyRating,
      isFavorite: false,
      isArchived: false,
      spec: "",
      createdAt: now,
      updatedAt: now
    };

    ideas.unshift(newIdea);
    showToast("アイデアを追加しました");
  }

  saveIdeas();
  renderIdeas();
  renderArchiveList();
  closeIdeaModal();
}

function findIdeaById(ideaId) {
  return ideas.find((idea) => idea.id === ideaId);
}

function openDetailModal(ideaId) {
  const idea = findIdeaById(ideaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  currentDetailIdeaId = ideaId;
  isSpecEditing = false;

  detailTitle.textContent = idea.title;
  detailCategory.textContent = idea.category;
  detailProgress.textContent = idea.progress;
  detailPriority.textContent = `優先度：${idea.priority}`;
  detailPriority.className = `badge priority-badge ${getPriorityClass(idea.priority)}`;
  detailCreatedAt.textContent = `作成日：${formatDate(idea.createdAt)}`;

  if (idea.isArchived) {
    detailArchiveStatus.textContent = "アーカイブ済み";
    detailArchiveStatus.classList.remove("hidden");
  } else {
    detailArchiveStatus.textContent = "";
    detailArchiveStatus.classList.add("hidden");
  }

  detailDescription.textContent = idea.description;
  detailNextAction.textContent = idea.nextAction || "未設定";
  detailTargetUser.textContent = idea.targetUser || "未入力";
  detailMemo.textContent = idea.memo || "未入力";

  detailTags.innerHTML = "";
  if (idea.tags && idea.tags.length > 0) {
    idea.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = `#${tag}`;
      detailTags.appendChild(tagElement);
    });
  } else {
    detailTags.textContent = "タグなし";
  }

  detailFunRating.textContent = `${idea.funRating}/5 ${formatStars(idea.funRating)}`;
  detailUsefulRating.textContent = `${idea.usefulRating}/5 ${formatStars(idea.usefulRating)}`;
  detailEasyRating.textContent = `${idea.easyRating}/5 ${formatStars(idea.easyRating)}`;
  detailTotalRating.textContent = `${getTotalRating(idea)}/15`;

  toggleFavoriteButton.textContent = idea.isFavorite ? "★" : "☆";
  toggleFavoriteButton.title = idea.isFavorite ? "お気に入り解除" : "お気に入り登録";

  toggleArchiveButton.textContent = idea.isArchived
    ? "アーカイブ解除"
    : "アーカイブ";

  renderSpecArea(idea);

  detailModal.classList.remove("hidden");
}

function closeDetailModal() {
  detailModal.classList.add("hidden");
  currentDetailIdeaId = null;
  isSpecEditing = false;
}

function renderSpecArea(idea) {
  const hasSpec = Boolean(idea.spec && idea.spec.trim());

  if (hasSpec) {
    savedSpec.textContent = idea.spec;
    editSpecButton.classList.remove("hidden");
    specEditSection.classList.add("hidden");
    specTextarea.value = idea.spec;
    specEditTitle.textContent = "仕様書を編集";
    saveSpecButton.textContent = "仕様書を更新";
    cancelSpecEditButton.classList.add("hidden");
    return;
  }

  savedSpec.textContent = "まだ仕様書は保存されていません。";
  editSpecButton.classList.add("hidden");
  specEditSection.classList.remove("hidden");
  specTextarea.value = "";
  specEditTitle.textContent = "仕様書を保存";
  saveSpecButton.textContent = "仕様書を保存";
  cancelSpecEditButton.classList.add("hidden");
}

function startSpecEdit() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  isSpecEditing = true;

  specEditSection.classList.remove("hidden");
  specTextarea.value = idea.spec || "";
  specEditTitle.textContent = "仕様書を編集";
  saveSpecButton.textContent = "仕様書を更新";
  cancelSpecEditButton.classList.remove("hidden");

  specTextarea.focus();
}

function cancelSpecEdit() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  isSpecEditing = false;
  renderSpecArea(idea);
  showToast("編集をキャンセルしました");
}

function createSpecPrompt(idea) {
  return `以下のアイデアをもとに、Webアプリの仕様書を作ってください。

【アイデア名】
${idea.title}

【アイデア内容】
${idea.description}

【カテゴリ】
${idea.category}

【状態】
${idea.progress}

【優先度】
${idea.priority}

【次にやること】
${idea.nextAction || "未設定"}

【タグ】
${idea.tags && idea.tags.length > 0 ? idea.tags.map((tag) => `#${tag}`).join(" ") : "なし"}

【ターゲット】
${idea.targetUser}

【メモ】
${idea.memo || "未入力"}

【評価】
面白さ：${idea.funRating}/5
役立ち度：${idea.usefulRating}/5
斬新さ：${idea.easyRating}/5
合計：${getTotalRating(idea)}/15

【出力してほしい内容】
# 仕様書

## 1. アプリ概要
このアプリが何をするものなのかをわかりやすく説明してください。

## 2. 解決する課題
誰がどんなことで困っていて、このアプリがどう解決するのかを書いてください。

## 3. ターゲットユーザー
主に使う人を具体的に書いてください。

## 4. 主な機能
必要な機能を箇条書きで整理してください。

## 5. 画面構成
必要な画面を一覧にして、それぞれの役割を書いてください。

## 6. データ設計
保存するデータ項目をテーブルのように整理してください。

## 7. MVP
最初に作る最低限の完成形を教えてください。

## 8. 追加機能案
あとから追加すると良い機能を提案してください。

## 9. 開発手順
初心者でも進められるように、作る順番をステップごとに書いてください。

## 10. 発表用説明文
このアプリを人に紹介するときの短い説明文を書いてください。

条件：
- 初心者がWebアプリとして作れる内容にしてください。
- 難しすぎる機能はMVPから外してください。
- 画面構成とデータ設計は具体的にしてください。
- 日本語でわかりやすく書いてください。`;
}

function hasRequiredSpecInfo(idea) {
  return Boolean(
    idea.title &&
    idea.title.trim() &&
    idea.description &&
    idea.description.trim() &&
    idea.category &&
    idea.targetUser &&
    idea.targetUser.trim()
  );
}

function openChatGptWithPrompt() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  if (!hasRequiredSpecInfo(idea)) {
    showToast("仕様書作成に必要な項目が不足しています");
    return;
  }

  const prompt = createSpecPrompt(idea);
  const encodedPrompt = encodeURIComponent(prompt);
  const aiUrl = `https://chatgpt.com/?prompt=${encodedPrompt}`;

  window.open(aiUrl, "_blank");
}

async function copyPrompt() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  if (!hasRequiredSpecInfo(idea)) {
    showToast("仕様書作成に必要な項目が不足しています");
    return;
  }

  const prompt = createSpecPrompt(idea);

  try {
    await navigator.clipboard.writeText(prompt);
    showToast("プロンプトをコピーしました");
  } catch (error) {
    console.error("コピーに失敗しました", error);
    showToast("コピーに失敗しました");
  }
}

function saveSpec() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  const spec = specTextarea.value.trim();

  if (!spec) {
    showToast("仕様書を入力してください");
    return;
  }

  ideas = ideas.map((item) => {
    if (item.id !== idea.id) return item;

    return {
      ...item,
      spec,
      progress: item.progress === "思いつき" || item.progress === "調査中"
        ? "仕様書作成済み"
        : item.progress,
      updatedAt: new Date().toISOString()
    };
  });

  saveIdeas();
  renderIdeas();

  const updatedIdea = findIdeaById(idea.id);

  isSpecEditing = false;
  renderSpecArea(updatedIdea);
  openDetailModal(updatedIdea.id);

  showToast("仕様書を保存しました");
}

function toggleFavorite(ideaId) {
  ideas = ideas.map((idea) => {
    if (idea.id !== ideaId) return idea;

    return {
      ...idea,
      isFavorite: !idea.isFavorite,
      updatedAt: new Date().toISOString()
    };
  });

  saveIdeas();
  renderIdeas();

  if (currentDetailIdeaId === ideaId) {
    openDetailModal(ideaId);
  }
}

function toggleArchive(ideaId) {
  const idea = findIdeaById(ideaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  ideas = ideas.map((item) => {
    if (item.id !== ideaId) return item;

    return {
      ...item,
      isArchived: !item.isArchived,
      updatedAt: new Date().toISOString()
    };
  });

  saveIdeas();
  renderIdeas();
  renderArchiveList();

  const updatedIdea = findIdeaById(ideaId);
  openDetailModal(ideaId);

  showToast(updatedIdea.isArchived ? "アーカイブしました" : "アーカイブを解除しました");
}

function deleteIdea() {
  const idea = findIdeaById(currentDetailIdeaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  const confirmed = confirm(`「${idea.title}」を削除しますか？`);

  if (!confirmed) return;

  ideas = ideas.filter((item) => item.id !== idea.id);

  saveIdeas();
  renderIdeas();
  renderArchiveList();
  closeDetailModal();
  showToast("アイデアを削除しました");
}

function showRandomIdea() {
  const activeIdeas = ideas.filter((idea) => !idea.isArchived);

  if (activeIdeas.length === 0) {
    showToast("通常表示のアイデアがありません");
    return;
  }

  const randomIndex = Math.floor(Math.random() * activeIdeas.length);
  const idea = activeIdeas[randomIndex];

  resultTitle.textContent = "今日育てるアイデア";
  resultContent.innerHTML = `
    <div class="result-card">
      <h3>${escapeHtml(idea.title)}</h3>
      <p>${escapeHtml(idea.description)}</p>
    </div>

    <div class="result-card">
      <h3>状態・優先度・評価</h3>
      <p>状態：${escapeHtml(idea.progress)}</p>
      <p>優先度：${escapeHtml(idea.priority)}</p>
      <p>次にやること：${escapeHtml(idea.nextAction || "未設定")}</p>
      <p>合計評価：${getTotalRating(idea)}/15</p>
      <p>タグ：${idea.tags && idea.tags.length > 0 ? idea.tags.map((tag) => `#${escapeHtml(tag)}`).join(" ") : "なし"}</p>
    </div>

    <div class="button-row">
      <button class="primary-button" onclick="openDetailFromResult('${idea.id}')">
        このアイデアを開く
      </button>
    </div>
  `;

  resultModal.classList.remove("hidden");
}

function combineIdeas() {
  const activeIdeas = ideas.filter((idea) => !idea.isArchived);

  if (activeIdeas.length < 2) {
    showToast("アイデア合体には通常表示のアイデアが2つ以上必要です");
    return;
  }

  const shuffled = [...activeIdeas].sort(() => Math.random() - 0.5);
  const firstIdea = shuffled[0];
  const secondIdea = shuffled[1];

  const prompt = createCombinePrompt(firstIdea, secondIdea);
  const aiUrl = `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`;

  resultTitle.textContent = "アイデア合体";
  resultContent.innerHTML = `
    <div class="result-card">
      <h3>1つ目のアイデア</h3>
      <p><strong>${escapeHtml(firstIdea.title)}</strong></p>
      <p>${escapeHtml(firstIdea.description)}</p>
    </div>

    <div class="result-card">
      <h3>2つ目のアイデア</h3>
      <p><strong>${escapeHtml(secondIdea.title)}</strong></p>
      <p>${escapeHtml(secondIdea.description)}</p>
    </div>

    <div class="result-card">
      <h3>AIに渡す内容</h3>
      <div class="result-prompt">${escapeHtml(prompt)}</div>
    </div>

    <div class="button-row">
      <button class="primary-button" onclick="window.open('${aiUrl}', '_blank')">
        AIで合体案を作る
      </button>

      <button class="sub-button" onclick="copyTextFromResult()">
        プロンプトをコピー
      </button>
    </div>
  `;

  resultContent.dataset.prompt = prompt;
  resultModal.classList.remove("hidden");
}

function createCombinePrompt(firstIdea, secondIdea) {
  return `以下の2つのアイデアを組み合わせて、新しいWebアプリ案を考えてください。

【アイデア1】
タイトル：${firstIdea.title}
内容：${firstIdea.description}
カテゴリ：${firstIdea.category}
状態：${firstIdea.progress}
優先度：${firstIdea.priority}
次にやること：${firstIdea.nextAction || "未設定"}
タグ：${firstIdea.tags && firstIdea.tags.length > 0 ? firstIdea.tags.map((tag) => `#${tag}`).join(" ") : "なし"}

【アイデア2】
タイトル：${secondIdea.title}
内容：${secondIdea.description}
カテゴリ：${secondIdea.category}
状態：${secondIdea.progress}
優先度：${secondIdea.priority}
次にやること：${secondIdea.nextAction || "未設定"}
タグ：${secondIdea.tags && secondIdea.tags.length > 0 ? secondIdea.tags.map((tag) => `#${tag}`).join(" ") : "なし"}

【出力してほしい内容】
1. 合体した新しいアプリ名
2. コンセプト
3. ターゲット
4. 解決できる課題
5. 主な機能
6. 最初に作るMVP
7. 面白くする追加機能
8. 発表用の説明文

条件：
- 初心者でも作れるWebアプリ案にしてください。
- 2つのアイデアの良いところを両方活かしてください。
- 日本語でわかりやすく書いてください。`;
}

function openDetailFromResult(ideaId) {
  resultModal.classList.add("hidden");
  openDetailModal(ideaId);
}

async function copyTextFromResult() {
  const prompt = resultContent.dataset.prompt || "";

  if (!prompt) {
    showToast("コピーする内容がありません");
    return;
  }

  try {
    await navigator.clipboard.writeText(prompt);
    showToast("プロンプトをコピーしました");
  } catch (error) {
    console.error("コピーに失敗しました", error);
    showToast("コピーに失敗しました");
  }
}

function closeResultModal() {
  resultModal.classList.add("hidden");
  resultContent.innerHTML = "";
  resultContent.dataset.prompt = "";
}

function createSingleIdeaExportText(idea, format) {
  if (format === "md") {
    return `# ${idea.title}

## 基本情報

- カテゴリ：${idea.category}
- 状態：${idea.progress}
- 優先度：${idea.priority}
- 次にやること：${idea.nextAction || "未設定"}
- アーカイブ：${idea.isArchived ? "はい" : "いいえ"}
- タグ：${idea.tags && idea.tags.length > 0 ? idea.tags.map((tag) => `#${tag}`).join(" ") : "なし"}
- 作成日：${formatDate(idea.createdAt)}
- 更新日：${formatDate(idea.updatedAt)}
- 面白さ：${idea.funRating}/5
- 役立ち度：${idea.usefulRating}/5
- 斬新さ：${idea.easyRating}/5
- 合計：${getTotalRating(idea)}/15
- お気に入り：${idea.isFavorite ? "はい" : "いいえ"}

## アイデア内容

${idea.description || "未入力"}

## ターゲット

${idea.targetUser || "未入力"}

## メモ

${idea.memo || "未入力"}

## 仕様書

${idea.spec || "未作成"}
`;
  }

  return `アイデア名：${idea.title}

カテゴリ：${idea.category}
状態：${idea.progress}
優先度：${idea.priority}
次にやること：${idea.nextAction || "未設定"}
アーカイブ：${idea.isArchived ? "はい" : "いいえ"}
タグ：${idea.tags && idea.tags.length > 0 ? idea.tags.map((tag) => `#${tag}`).join(" ") : "なし"}
作成日：${formatDate(idea.createdAt)}
更新日：${formatDate(idea.updatedAt)}
面白さ：${idea.funRating}/5
役立ち度：${idea.usefulRating}/5
斬新さ：${idea.easyRating}/5
合計：${getTotalRating(idea)}/15
お気に入り：${idea.isFavorite ? "はい" : "いいえ"}

アイデア内容：
${idea.description || "未入力"}

ターゲット：
${idea.targetUser || "未入力"}

メモ：
${idea.memo || "未入力"}

仕様書：
${idea.spec || "未作成"}
`;
}

function exportSingleIdea(ideaId, format) {
  const idea = findIdeaById(ideaId);

  if (!idea) {
    showToast("アイデアが見つかりません");
    return;
  }

  const content = createSingleIdeaExportText(idea, format);
  const extension = format === "md" ? "md" : "txt";
  const fileName = `${createSafeFileName(idea.title)}.${extension}`;

  downloadFile(content, fileName, "text/plain");

  showToast(`${idea.title} を${extension.toUpperCase()}出力しました`);
}

function exportJsonBackup() {
  if (ideas.length === 0) {
    showToast("バックアップするアイデアがありません");
    return;
  }

  const backupData = {
    appName: "IdeaPoket",
    version: 5,
    exportedAt: new Date().toISOString(),
    ideas
  };

  const content = JSON.stringify(backupData, null, 2);
  downloadFile(content, "IdeaPoket_backup.json", "application/json");

  showToast("JSONバックアップを出力しました");
}

function importJsonBackup(file) {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const text = event.target.result;
      const parsedData = JSON.parse(text);

      let importedIdeas = [];

      if (Array.isArray(parsedData)) {
        importedIdeas = parsedData;
      } else if (parsedData && Array.isArray(parsedData.ideas)) {
        importedIdeas = parsedData.ideas;
      } else {
        showToast("IdeaPoketのJSON形式ではありません");
        return;
      }

      const normalizedIdeas = importedIdeas.map(normalizeIdea);

      if (normalizedIdeas.length === 0) {
        showToast("インポートできるアイデアがありません");
        return;
      }

      const confirmed = confirm(
        `JSONから${normalizedIdeas.length}件のアイデアを読み込みます。\n現在のデータは上書きされます。よろしいですか？`
      );

      if (!confirmed) return;

      ideas = normalizedIdeas;
      saveIdeas();
      renderIdeas();
      renderArchiveList();

      closeSettingsModal();
      closeDetailModal();
      closeResultModal();

      showToast("JSONインポートが完了しました");
    } catch (error) {
      console.error("JSONインポートに失敗しました", error);
      showToast("JSONの読み込みに失敗しました");
    } finally {
      importJsonInput.value = "";
    }
  };

  reader.onerror = () => {
    showToast("ファイルの読み込みに失敗しました");
    importJsonInput.value = "";
  };

  reader.readAsText(file, "utf-8");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function toggleDetailFilters() {
  const isHidden = detailFilters.classList.contains("hidden");

  if (isHidden) {
    detailFilters.classList.remove("hidden");
    detailFilterButton.textContent = "詳細フィルターを閉じる";
  } else {
    detailFilters.classList.add("hidden");
    detailFilterButton.textContent = "詳細フィルターを開く";
  }
}

function toggleSection(contentElement, buttonElement) {
  const isClosed = contentElement.classList.contains("collapsed");

  if (isClosed) {
    contentElement.classList.remove("collapsed");
    buttonElement.textContent = "−";
    return true;
  }

  contentElement.classList.add("collapsed");
  buttonElement.textContent = "＋";
  return false;
}

function openSettingsModal() {
  renderArchiveList();
  settingsModal.classList.remove("hidden");
}

function closeSettingsModal() {
  settingsModal.classList.add("hidden");
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    lightModeButton.classList.remove("active-theme");
    darkModeButton.classList.add("active-theme");
  } else {
    document.body.classList.remove("dark-mode");
    darkModeButton.classList.remove("active-theme");
    lightModeButton.classList.add("active-theme");
  }

  localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

function handleIdeaListClick(event) {
  const favoriteButton = event.target.closest(".favorite-button");

  if (favoriteButton) {
    event.stopPropagation();
    const ideaId = favoriteButton.dataset.id;
    toggleFavorite(ideaId);
    return;
  }

  const card = event.target.closest(".idea-card");

  if (!card) return;

  const ideaId = card.dataset.id;
  openDetailModal(ideaId);
}

function handleIdeaListKeydown(event) {
  const card = event.target.closest(".idea-card");

  if (!card) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const ideaId = card.dataset.id;
    openDetailModal(ideaId);
  }
}

function registerEvents() {
  openAddModalButton.addEventListener("click", openAddModal);
  closeModalButton.addEventListener("click", closeIdeaModal);
  cancelModalButton.addEventListener("click", closeIdeaModal);
  ideaForm.addEventListener("submit", handleIdeaFormSubmit);

  openSettingsButton.addEventListener("click", openSettingsModal);
  closeSettingsButton.addEventListener("click", closeSettingsModal);

  toggleArchiveSectionButton.addEventListener("click", () => {
    const isOpened = toggleSection(archiveSectionContent, toggleArchiveSectionButton);

    if (isOpened) {
      renderArchiveList();
    }
  });

  refreshArchiveListButton.addEventListener("click", () => {
    renderArchiveList();
    showToast("アーカイブ一覧を更新しました");
  });

  archiveList.addEventListener("click", (event) => {
    const restoreButton = event.target.closest("[data-restore-id]");

    if (!restoreButton) return;

    const ideaId = restoreButton.dataset.restoreId;
    restoreArchivedIdea(ideaId);
  });

  lightModeButton.addEventListener("click", () => {
    applyTheme("light");
    showToast("ライトモードに変更しました");
  });

  darkModeButton.addEventListener("click", () => {
    applyTheme("dark");
    showToast("ダークモードに変更しました");
  });

  closeDetailButton.addEventListener("click", closeDetailModal);

  searchInput.addEventListener("input", renderIdeas);
  categoryFilter.addEventListener("change", renderIdeas);
  statusFilter.addEventListener("change", renderIdeas);
  progressFilter.addEventListener("change", renderIdeas);
  priorityFilter.addEventListener("change", renderIdeas);
  archiveFilter.addEventListener("change", renderIdeas);
  sortSelect.addEventListener("change", renderIdeas);
  detailFilterButton.addEventListener("click", toggleDetailFilters);

  toggleGrowSectionButton.addEventListener("click", () => {
    toggleSection(growSectionContent, toggleGrowSectionButton);
  });

  toggleSearchSectionButton.addEventListener("click", () => {
    toggleSection(searchSectionContent, toggleSearchSectionButton);
  });

  randomIdeaButton.addEventListener("click", showRandomIdea);
  combineIdeasButton.addEventListener("click", combineIdeas);

  exportJsonButton.addEventListener("click", exportJsonBackup);

  importJsonButton.addEventListener("click", () => {
    importJsonInput.click();
  });

  importJsonInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    importJsonBackup(file);
  });

  ideaList.addEventListener("click", handleIdeaListClick);
  ideaList.addEventListener("keydown", handleIdeaListKeydown);

  openChatGptButton.addEventListener("click", openChatGptWithPrompt);
  copyPromptButton.addEventListener("click", copyPrompt);

  editSpecButton.addEventListener("click", startSpecEdit);
  saveSpecButton.addEventListener("click", saveSpec);
  cancelSpecEditButton.addEventListener("click", cancelSpecEdit);

  editIdeaButton.addEventListener("click", () => {
    if (currentDetailIdeaId) {
      openEditModal(currentDetailIdeaId);
    }
  });

  toggleFavoriteButton.addEventListener("click", () => {
    if (currentDetailIdeaId) {
      toggleFavorite(currentDetailIdeaId);
    }
  });

  toggleArchiveButton.addEventListener("click", () => {
    if (currentDetailIdeaId) {
      toggleArchive(currentDetailIdeaId);
    }
  });

  exportTxtButton.addEventListener("click", () => {
    if (currentDetailIdeaId) {
      exportSingleIdea(currentDetailIdeaId, "txt");
    }
  });

  exportMdButton.addEventListener("click", () => {
    if (currentDetailIdeaId) {
      exportSingleIdea(currentDetailIdeaId, "md");
    }
  });

  deleteIdeaButton.addEventListener("click", deleteIdea);

  closeResultButton.addEventListener("click", closeResultModal);

  ideaModal.addEventListener("click", (event) => {
    if (event.target === ideaModal) {
      closeIdeaModal();
    }
  });

  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      closeSettingsModal();
    }
  });

  detailModal.addEventListener("click", (event) => {
    if (event.target === detailModal) {
      closeDetailModal();
    }
  });

  resultModal.addEventListener("click", (event) => {
    if (event.target === resultModal) {
      closeResultModal();
    }
  });
}

function initializeApp() {
  loadTheme();
  loadIdeas();
  registerEvents();
  renderIdeas();
  renderArchiveList();
}

window.openDetailFromResult = openDetailFromResult;
window.copyTextFromResult = copyTextFromResult;

initializeApp();