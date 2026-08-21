"use strict";

const INDICATORS = [
  "N",
  "P",
  "K",
  "硝氮(N)",
  "有机质",
  "Mg(镁)",
  "Ca(钙)",
  "B(硼)",
  "Zn(锌)",
  "含水量",
  "氯离子",
  "PH值",
  "水溶磷",
  "水不溶物"
];

const STORAGE_KEY = "compound-fertilizer-tool-v2";
const NUTRIENT_PRIORITY_OPTIONS = [
  { value: "N", label: "氮" },
  { value: "P", label: "磷" },
  { value: "K", label: "钾" }
];

const SINGLE_NUTRIENT_STANDARD_TOLERANCE = 1.5;
const MIN_MATERIAL_KG = 50;
const MIN_MATERIAL_PERCENT = MIN_MATERIAL_KG / 10;
const CHLORIDE_GRADES = {
  sulfur: { label: "硫基", maxExclusive: 3 },
  low: { label: "低氯", minInclusive: 13, maxInclusive: 14.5 },
  medium: { label: "中氯", minInclusive: 27, maxInclusive: 29 },
  high: { label: "高氯", min: 30 }
};

const PROCESSING_FEE_OPTIONS = {
  转鼓: [280, 220, 0],
  挤压: [180, 120, 0]
};

const MATERIAL_CATEGORIES = ["氮源", "磷源", "钾源", "微量元素", "辅料(填充)", "返料"];
const PRIMARY_MATERIAL_INDICATORS = ["N", "P", "K", "硝氮(N)", "含水量", "氯离子", "水溶磷"];
const ADVANCED_MATERIAL_INDICATORS = ["Mg(镁)", "Ca(钙)", "有机质", "B(硼)", "Zn(锌)", "水不溶物", "PH值"];

const MATERIAL_SEEDS = [
  {
    name: "转鼓",
    target: { n: 18, p: 7, k: 10 },
    finishedMoisture: 2,
    processingFee: 280,
    materials: [
      ["ZG-D", "尿素", "氮源", 1850, 0, 0.99, true, [46.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 7, 0, 0]],
      ["ZG-E", "碳酸氢铵", "氮源", 750, 0, 0.2, true, [17, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0]],
      ["ZG-F", "氯化铵", "氮源", 680, 460, 0.99, true, [25.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 66, 4.5, 0, 0]],
      ["ZG-G", "细粉硫铵", "氮源", 500, 200, 0.99, true, [14, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 4, 0, 0]],
      ["ZG-H", "硫酸铵", "氮源", 800, 0, 0.99, true, [20.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4.6, 0, 0]],
      ["ZG-I", "46一铵", "磷源", 3650, 0, 0.99, true, [8, 39, 0, 0, 0, 0, 0, 0, 0, 2, 0, 6.5, 55, 0]],
      ["ZG-J", "55一铵", "磷源", 4300, 0, 0.99, true, [10, 45, 0, 0, 0, 0, 0, 0, 0, 2, 0, 6.5, 80, 0]],
      ["ZG-K", "60一铵", "磷源", 4900, 0, 0.99, true, [10, 50, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4.8, 90, 0]],
      ["ZG-L", "滤饼", "磷源", 1800, 160, 0.99, true, [7, 27, 0, 0, 0, 0, 0, 0, 0, 20, 0, 6.5, 30, 0]],
      ["ZG-M", "60%氯化钾（老挝）", "钾源", 3300, 80, 0.99, true, [0, 0, 60, 0, 0, 0, 0, 0, 0, 2, 47, 7, 0, 0]],
      ["ZG-N", "52%硫酸钾", "钾源", 4300, 0, 0.99, true, [0, 0, 52, 0, 0, 0, 0, 0, 0, 2, 1.5, 7, 0, 0]],
      ["ZG-O", "62%氯化钾（K+S）", "钾源", 3500, 0, 0.99, true, [0, 0, 62, 0, 0, 0, 0, 0, 0, 8, 47, 7, 0, 0]],
      ["ZG-U", "粘合剂", "微量元素", 1080, 0, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 98, 7, 0, 0]],
      ["ZG-V", "硫酸镁", "辅料(填充)", 200, 100, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 5.8, 0, 0]],
      ["ZG-W", "粘土", "辅料(填充)", 800, 0, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 8, 0, 0]],
      ["ZG-X", "腐殖酸", "辅料(填充)", 400, 0, 0.99, true, [0, 0, 0, 0, 85, 0, 4, 0, 0, 25, 0, 8, 0, 0]],
      ["ZG-Y", "返料", "返料", 2000, 0, 0.99, false, [18, 4, 4, 0, 0, 0, 0, 0, 0, 4, 28, 0, 0, 0]]
    ]
  },
  {
    name: "挤压",
    target: { n: 30, p: 10, k: 5 },
    finishedMoisture: 4,
    processingFee: 180,
    materials: [
      ["JY-D", "尿素", "氮源", 1850, 240, 0.99, true, [46.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 7, 0, 0]],
      ["JY-F", "氯化铵", "氮源", 680, 100, 0.99, true, [25.4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 66, 4.5, 0, 0]],
      ["JY-G", "硫酸铵（三等品）", "氮源", 600, 0, 0.99, true, [17, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0]],
      ["JY-H", "硫酸铵", "氮源", 800, 330, 0.99, true, [20.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 0]],
      ["JY-I", "白肥", "磷源", 900, 0, 0.99, true, [0, 25, 0, 0, 0, 0, 0, 0, 0, 6, 0, 5, 0, 0]],
      ["JY-J", "60%一铵", "磷源", 4900, 170, 0.99, true, [10, 50, 0, 0, 0, 0, 0, 0, 0, 3, 0, 6.5, 80, 8]],
      ["JY-K", "滤饼", "磷源", 1800, 0, 0.99, true, [7, 27, 0, 0, 0, 0, 0, 0, 0, 20, 0, 6, 30, 1]],
      ["JY-L", "60%氯化钾（老挝）", "钾源", 3300, 160, 0.99, true, [0, 0, 60, 0, 0, 0, 0, 0, 0, 3, 47, 6.5, 0, 2]],
      ["JY-M", "47%氯化钾", "钾源", 2310, 0, 0.99, true, [0, 0, 47, 0, 0, 0, 0, 0, 0, 6, 47, 5, 0, 0]],
      ["JY-N", "52%硫酸钾", "钾源", 4100, 0, 0.99, true, [0, 0, 52, 0, 0, 0, 0, 0, 0, 2, 0, 7, 0, 0]],
      ["JY-T", "粘合剂", "微量元素", 1100, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 99.7, 0, 99, 7, 0, 1.5]],
      ["JY-V", "钙粉/元明粉", "辅料(填充)", 200, 0, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 8, 0, 100]],
      ["JY-W", "腐殖酸", "辅料(填充)", 120, 0, 0.99, true, [5, 0, 0, 0, 85, 0, 4, 0, 0, 25, 0, 8, 0, 100]],
      ["CUSTOM-1787280904965", "55%一铵", "磷源", 4400, 0, 0.99, true, [10, 45, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 80, 0]]
    ]
  }
];

function seedMaterial(row) {
  const [id, name, category, price, defaultKg, lossFactor, enabled, values] = row;
  const props = {};
  INDICATORS.forEach((key, index) => {
    props[key] = values[index] || 0;
  });
  return {
    id,
    name,
    category,
    price,
    defaultKg,
    lossFactor,
    enabled,
    maxKg: 1000,
    props
  };
}

function buildInitialState() {
  const processes = MATERIAL_SEEDS.map((seed) => ({
    name: seed.name,
    finishedMoisture: seed.finishedMoisture,
    processingFee: seed.processingFee,
    materials: seed.materials.map(seedMaterial)
  }));

  const settings = {};
  MATERIAL_SEEDS.forEach((seed) => {
    const formulaText = "0-0-0";
    settings[seed.name] = {
      formulaText,
      totalNutrientsMin: 0,
      nutrientDrop: 1,
      nutrientReductionPriority: ["P", "K", "N"],
      chlorideGrade: "medium",
      waterSolublePMin: "60",
      targetN: 0,
      targetP: 0,
      targetK: 0,
      targetBasis: "folded",
      maxMaterialCount: 6,
      requiredMaterials: {
        磷源: [],
        氮源: [],
        钾源: []
      },
      finishedMoisture: seed.finishedMoisture,
      processingFee: seed.processingFee,
      constraints: defaultConstraints(seed.name)
    };
  });

  return {
    processName: processes[0].name,
    activeTab: "recommendations",
    activeMaterialCategory: "",
    processes,
    settings,
    recipes: []
  };
}

function defaultConstraints(processName) {
  const constraints = {};
  ["硝氮(N)", "有机质", "Mg(镁)", "Ca(钙)", "B(硼)", "Zn(锌)", "含水量", "氯离子", "PH值"].forEach((name) => {
    constraints[name] = { min: "", max: "" };
  });
  if (processName === "转鼓") {
    constraints["水溶磷"] = { min: "", max: "" };
  } else {
    constraints["水不溶物"] = { min: "", max: "" };
  }
  return constraints;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.processes) || !parsed.settings) return buildInitialState();
    parsed.recipes ||= [];
    return parsed;
  } catch (error) {
    return buildInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = typeof localStorage === "undefined" ? buildInitialState() : loadState();
state.recipes ||= [];
let latestCandidates = [];
let toastTimer = null;
let activeRecipeDraft = null;

const ui = {};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

function init() {
  [
    "processSelect",
    "runButton",
    "formulaN",
    "formulaP",
    "formulaK",
    "maxMaterialCount",
    "nutrientPriority1",
    "nutrientPriority2",
    "nutrientPriority3",
    "totalNutrientsMin",
    "nutrientDrop",
    "chlorideGrade",
    "waterSolublePMin",
    "finishedMoisture",
    "processingFee",
    "constraintsBody",
    "results",
    "resultMeta",
    "resultMaterialDialog",
    "resultMaterialTitle",
    "resultMaterialInfo",
    "resultMaterialId",
    "saveResultMaterialButton",
    "toast",
    "loadingOverlay",
    "materialsHead",
    "materialsBody",
    "materialCategoryTabs",
    "requiredMaterialsPanel",
    "requiredPhosphorusOptions",
    "requiredNitrogenOptions",
    "requiredPotassiumOptions",
    "requiredPhosphorusSummary",
    "requiredNitrogenSummary",
    "requiredPotassiumSummary",
    "recommendationsView",
    "materialsView",
    "recipesView",
    "newRecipeButton",
    "recipesList",
    "recipeSaveDialog",
    "recipeSaveCandidateIndex",
    "recipeSaveName",
    "recipeSaveNote",
    "recipeSaveSummary",
    "recipeEditButton",
    "recipeConfirmSaveButton",
    "recipeDialog",
    "recipeDialogTitle",
    "recipeDialogHint",
    "recipeEditId",
    "recipeSource",
    "recipeName",
    "recipeProcess",
    "recipeFormula",
    "recipeNote",
    "addRecipeMaterialButton",
    "recipeMaterialsEditor",
    "recipeEditorPreview",
    "saveRecipeButton",
    "recipeDetailDialog",
    "recipeDetailTitle",
    "recipeDetailMeta",
    "recipeDetailContent",
    "recipeDetailId",
    "recipeDetailReuseButton",
    "recipeDetailEditButton",
    "recipeDetailDeleteButton",
    "addMaterialButton",
    "exportButton",
    "importButton",
    "importFile",
    "resetButton",
    "materialDialog",
    "materialDialogTitle",
    "materialEditIndex",
    "materialName",
    "materialCategory",
    "materialPrice",
    "materialMaxKg",
    "materialLossFactor",
    "materialEnabled",
    "materialIndicators",
    "saveMaterialButton"
  ].forEach((id) => {
    ui[id] = document.getElementById(id);
  });
  ui.tabButtons = Array.from(document.querySelectorAll(".tab[data-tab]"));
  ui.nutrientPriorityInputs = [
    ui.nutrientPriority1,
    ui.nutrientPriority2,
    ui.nutrientPriority3
  ];

  renderProcessOptions();
  renderMaterialCategoryOptions();
  bindEvents();
  renderAll();
  clearRecommendationResults();
}

function bindEvents() {
  ui.tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  ui.runButton.addEventListener("click", runRecommendation);

  ui.nutrientPriorityInputs.forEach((input) => {
    input.addEventListener("change", () => {
      collectSettings();
      renderNutrientPriorityInputs();
      saveState();
    });
  });

  ui.results.addEventListener("click", (event) => {
    const saveButton = event.target.closest("button[data-action=\"save-recipe\"]");
    if (saveButton) {
      openRecipeSaveDialog(Number(saveButton.dataset.candidateIndex));
      return;
    }
    const button = event.target.closest("button[data-material-id]");
    if (!button) return;
    openResultMaterialInfo(Number(button.dataset.candidateIndex), button.dataset.materialId);
  });

  ui.saveResultMaterialButton.addEventListener("click", saveResultMaterialInfo);

  ui.newRecipeButton.addEventListener("click", () => openRecipeEditor());
  ui.recipesList.addEventListener("click", handleRecipeListAction);
  ui.recipeConfirmSaveButton.addEventListener("click", confirmRecommendedRecipeSave);
  ui.recipeEditButton.addEventListener("click", () => {
    const index = Number(ui.recipeSaveCandidateIndex.value);
    const candidate = latestCandidates[index];
    if (!candidate) return;
    const name = ui.recipeSaveName.value.trim();
    const note = ui.recipeSaveNote.value.trim();
    ui.recipeSaveDialog.close();
    openRecipeEditor(recipeDraftFromCandidate(candidate, name, note));
  });
  ui.addRecipeMaterialButton.addEventListener("click", () => {
    if (!activeRecipeDraft) return;
    activeRecipeDraft.items.push({ id: "", kg: 0 });
    renderRecipeMaterialsEditor();
  });
  ui.recipeMaterialsEditor.addEventListener("input", handleRecipeEditorInput);
  ui.recipeMaterialsEditor.addEventListener("change", handleRecipeEditorInput);
  ui.recipeProcess.addEventListener("change", () => {
    if (!activeRecipeDraft) return;
    activeRecipeDraft.processName = ui.recipeProcess.value;
    renderRecipeMaterialsEditor();
  });
  ui.recipeMaterialsEditor.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-recipe-remove]");
    if (!button || !activeRecipeDraft) return;
    activeRecipeDraft.items.splice(Number(button.dataset.recipeRemove), 1);
    renderRecipeMaterialsEditor();
  });
  ui.saveRecipeButton.addEventListener("click", saveRecipeEditor);
  ui.recipeDetailReuseButton.addEventListener("click", () => {
    const recipe = findRecipe(ui.recipeDetailId.value);
    if (!recipe) return;
    ui.recipeDetailDialog.close();
    openRecipeEditor(recipe);
  });
  ui.recipeDetailEditButton.addEventListener("click", () => {
    const recipe = findRecipe(ui.recipeDetailId.value);
    if (!recipe) return;
    ui.recipeDetailDialog.close();
    openRecipeEditor(recipe);
  });
  ui.recipeDetailDeleteButton.addEventListener("click", () => deleteRecipe(ui.recipeDetailId.value));

  ["formulaN", "formulaP", "formulaK", "maxMaterialCount", "nutrientDrop", "chlorideGrade", "waterSolublePMin", "finishedMoisture", "processingFee"].forEach((id) => {
    ui[id].addEventListener("input", () => {
      const previousMax = currentSettings().maxMaterialCount;
      if (["formulaN", "formulaP", "formulaK", "waterSolublePMin"].includes(id)) keepIntegerInput(ui[id]);
      collectSettings();
      if (id === "maxMaterialCount" && requiredMaterialIds(currentSettings()).length > currentSettings().maxMaterialCount) {
        currentSettings().maxMaterialCount = previousMax;
        ui.maxMaterialCount.value = String(previousMax);
        showToast("必选原料数量超过原料数量上限，请重新配置");
        return;
      }
      if (["formulaN", "formulaP", "formulaK"].includes(id)) syncTotalNutrientsFromFormula();
      saveState();
    });
  });

  ui.requiredMaterialsPanel.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-required-category]");
    if (!input) return;
    const category = input.dataset.requiredCategory;
    const settings = currentSettings();
    const selected = new Set(settings.requiredMaterials[category] || []);
    if (input.checked) selected.add(input.value);
    else selected.delete(input.value);
    if (requiredMaterialIds({ ...settings, requiredMaterials: { ...settings.requiredMaterials, [category]: [...selected] } }).length > settings.maxMaterialCount) {
      input.checked = false;
      showToast("必选原料数量超过原料数量上限，请重新配置");
      return;
    }
    settings.requiredMaterials[category] = [...selected];
    saveState();
    renderRequiredMaterialOptions();
  });

  ui.materialCategoryTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    state.activeMaterialCategory = button.dataset.category;
    saveState();
    renderMaterials();
  });

  document.addEventListener("click", (event) => {
    if (ui.toast.hidden || event.target.closest("#requiredMaterialsPanel") || event.target.closest("#toast") || event.target.closest("dialog")) return;
    hideToast();
  });

  ui.constraintsBody.addEventListener("input", (event) => {
    const input = event.target.closest("input");
    if (!input) return;
    const settings = currentSettings();
    const name = input.dataset.indicator;
    const bound = input.dataset.bound;
    settings.constraints[name] ||= { min: "", max: "" };
    settings.constraints[name][bound] = input.value;
    saveState();
  });

  ui.materialsBody.addEventListener("input", (event) => {
    const target = event.target;
    const row = target.closest("tr");
    if (!row) return;
    const material = currentProcess().materials[Number(row.dataset.index)];
    updateMaterialFromInput(material, target);
    saveState();
  });

  ui.materialsBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const index = Number(button.closest("tr").dataset.index);
    if (button.dataset.action === "edit") {
      openMaterialEditor(index);
    } else if (button.dataset.action === "delete") {
      currentProcess().materials.splice(index, 1);
      saveState();
      renderMaterials();
      renderRequiredMaterialOptions();
    }
  });

  ui.addMaterialButton.addEventListener("click", () => {
    const material = seedMaterial([
      `CUSTOM-${Date.now()}`,
      "新原料",
      "辅料(填充)",
      0,
      0,
      0.99,
      true,
      []
    ]);
    currentProcess().materials.push(material);
    saveState();
    renderMaterials();
    renderRequiredMaterialOptions();
    openMaterialEditor(currentProcess().materials.length - 1);
  });

  ui.saveMaterialButton.addEventListener("click", saveMaterialEditor);

  ui.materialDialog.addEventListener("input", (event) => clearMaterialFieldError(event));
  ui.materialDialog.addEventListener("change", (event) => clearMaterialFieldError(event));

  ui.exportButton.addEventListener("click", exportData);
  ui.importButton.addEventListener("click", () => ui.importFile.click());
  ui.importFile.addEventListener("change", importData);

  ui.resetButton.addEventListener("click", () => {
    if (!confirm("恢复初始原料、价格和目标设置？")) return;
    state = buildInitialState();
    saveState();
    renderProcessOptions();
    renderAll();
    clearRecommendationResults();
  });
}

function renderProcessOptions() {
  const options = state.processes
    .map((process) => `<option value="${escapeHtml(process.name)}">${escapeHtml(process.name)}</option>`)
    .join("");
  ui.processSelect.innerHTML = options;
  ui.processSelect.value = state.processName;
  if (ui.recipeProcess) ui.recipeProcess.innerHTML = options;
}

function renderMaterialCategoryOptions() {
  ui.materialCategory.innerHTML = `
    <option value="">请选择类别</option>
    ${MATERIAL_CATEGORIES.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}
  `;
}

function renderAll() {
  ui.processSelect.value = state.processName;
  renderTabState();
  renderProcessingFeeOptions();
  renderTargets();
  renderConstraints();
  renderMaterials();
  renderRecipes();
}

function switchTab(tabName) {
  state.activeTab = ["recommendations", "materials", "recipes"].includes(tabName) ? tabName : "recommendations";
  renderTabState();
  if (state.activeTab === "recipes") renderRecipes();
  saveState();
}

function renderTabState() {
  const activeTab = ["recommendations", "materials", "recipes"].includes(state.activeTab) ? state.activeTab : "recommendations";
  ui.tabButtons?.forEach((button) => {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  ui.recommendationsView.hidden = activeTab !== "recommendations";
  ui.materialsView.hidden = activeTab !== "materials";
  ui.recipesView.hidden = activeTab !== "recipes";
}

function renderProcessingFeeOptions() {
  const process = currentProcess();
  const options = PROCESSING_FEE_OPTIONS[process.name] || [process.processingFee];
  const currentValue = Number(currentSettings().processingFee);
  const selectedValue = options.includes(currentValue) ? currentValue : options[0];
  ui.processingFee.innerHTML = options
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
  ui.processingFee.value = String(selectedValue);
  currentSettings().processingFee = selectedValue;
}

function renderTargets() {
  const settings = currentSettings();
  setFormulaInputs(settings.formulaText);
  ui.maxMaterialCount.value = String(settings.maxMaterialCount);
  syncTotalNutrientsFromFormula();
  ui.nutrientDrop.value = settings.nutrientDrop;
  renderNutrientPriorityInputs();
  ui.chlorideGrade.value = settings.chlorideGrade;
  settings.waterSolublePMin = normalizeIntegerValue(settings.waterSolublePMin);
  ui.waterSolublePMin.value = settings.waterSolublePMin;
  ui.finishedMoisture.value = settings.finishedMoisture;
  ui.processingFee.value = settings.processingFee;
  renderRequiredMaterialOptions();
}

function renderNutrientPriorityInputs() {
  const settings = currentSettings();
  const priority = normalizeNutrientPriority(settings.nutrientReductionPriority);
  settings.nutrientReductionPriority = priority;
  ui.nutrientPriorityInputs.forEach((input, index) => {
    const selected = priority[index] || "";
    const usedByOtherInputs = new Set(priority.filter((value, priorityIndex) => priorityIndex !== index && value));
    input.innerHTML = `
      <option value="">未设置</option>
      ${NUTRIENT_PRIORITY_OPTIONS.map((option) => `
        <option value="${option.value}" ${usedByOtherInputs.has(option.value) ? "disabled" : ""}>${option.label}</option>
      `).join("")}
    `;
    input.value = selected;
  });
}

function renderConstraints() {
  const settings = currentSettings();
  const names = visibleConstraintNames(currentProcess());
  ui.constraintsBody.innerHTML = names
    .map((name) => {
      settings.constraints[name] ||= { min: "", max: "" };
      const item = settings.constraints[name];
      return `
        <tr>
          <td>${escapeHtml(name)}</td>
          <td><input type="number" step="0.01" data-indicator="${escapeHtml(name)}" data-bound="min" value="${escapeHtml(item.min)}"></td>
          <td><input type="number" step="0.01" data-indicator="${escapeHtml(name)}" data-bound="max" value="${escapeHtml(item.max)}"></td>
        </tr>
      `;
    })
    .join("");
}

function renderMaterials() {
  const categories = Array.from(new Set(currentProcess().materials.map((material) => material.category)));
  if (!categories.includes(state.activeMaterialCategory)) state.activeMaterialCategory = categories[0] || "";
  ui.materialCategoryTabs.innerHTML = categories.map((category) => `
    <button type="button" class="category-tab${category === state.activeMaterialCategory ? " is-active" : ""}" data-category="${escapeHtml(category)}" role="tab" aria-selected="${category === state.activeMaterialCategory}">${escapeHtml(category)}</button>
  `).join("");
  const headCells = [
    "启用",
    "原料",
    "类别",
    "价格 元/t",
    "上限 kg/t",
    "损耗系数",
    "操作"
  ];
  ui.materialsHead.innerHTML = `<tr>${headCells.map((name) => `<th>${escapeHtml(name)}</th>`).join("")}</tr>`;
  ui.materialsBody.innerHTML = currentProcess().materials
    .map((material, index) => ({ material, index }))
    .filter(({ material }) => material.category === state.activeMaterialCategory)
    .map(({ material, index }) => {
      return `
        <tr data-index="${index}">
          <td><input type="checkbox" data-field="enabled" ${material.enabled ? "checked" : ""}></td>
          <td class="material-name-cell"><strong>${escapeHtml(material.name)}</strong><small>${escapeHtml(material.id)}</small></td>
          <td>${escapeHtml(material.category)}</td>
          <td>${formatNumber(material.price, 0)}</td>
          <td>${formatNumber(material.maxKg, 0)}</td>
          <td>${formatNumber(material.lossFactor, 3)}</td>
          <td class="material-actions"><button type="button" data-action="edit">编辑</button><button type="button" data-action="delete" class="danger">删除</button></td>
        </tr>
      `;
    })
    .join("");
}

function renderRequiredMaterialOptions() {
  const settings = currentSettings();
  const groups = [
    { category: "磷源", options: ui.requiredPhosphorusOptions, summary: ui.requiredPhosphorusSummary },
    { category: "氮源", options: ui.requiredNitrogenOptions, summary: ui.requiredNitrogenSummary },
    { category: "钾源", options: ui.requiredPotassiumOptions, summary: ui.requiredPotassiumSummary }
  ];
  groups.forEach(({ category, options, summary }) => {
    const selected = new Set(settings.requiredMaterials[category] || []);
    const materials = currentProcess().materials.filter((material) => material.category === category);
    options.innerHTML = materials.length ? materials.map((material) => `
      <label class="required-option">
        <input type="checkbox" data-required-category="${escapeHtml(category)}" value="${escapeHtml(material.id)}" ${selected.has(material.id) ? "checked" : ""}>
        <span>${escapeHtml(material.name)}</span>
      </label>
    `).join("") : `<span class="muted">暂无${escapeHtml(category)}原料</span>`;
    const visibleSelectedCount = materials.filter((material) => selected.has(material.id)).length;
    summary.textContent = visibleSelectedCount ? `${visibleSelectedCount} 项已选` : "未选择";
  });
}

function openMaterialEditor(index) {
  const material = currentProcess().materials[index];
  if (!material) return;
  ui.materialEditIndex.value = String(index);
  ui.materialDialogTitle.textContent = `编辑原料：${material.name}`;
  ui.materialName.value = material.name;
  ui.materialCategory.value = MATERIAL_CATEGORIES.includes(material.category) ? material.category : "";
  ui.materialPrice.value = formatInput(material.price);
  ui.materialMaxKg.value = formatInput(material.maxKg);
  ui.materialLossFactor.value = formatInput(material.lossFactor);
  ui.materialEnabled.value = material.enabled === undefined ? "" : String(Boolean(material.enabled));
  clearMaterialEditorErrors();
  const renderIndicatorFields = (names) => names.map((name) => `
    <label class="field material-indicator-field">
      <span>${escapeHtml(name)}</span>
      <input type="number" step="0.01" data-indicator="${escapeHtml(name)}" value="${formatInput(material.props[name])}">
    </label>
  `).join("");
  ui.materialIndicators.innerHTML = `
    <div class="material-primary-indicators">${renderIndicatorFields(PRIMARY_MATERIAL_INDICATORS)}</div>
    <details class="advanced-material-params">
      <summary>高级参数 <small>镁、钙、有机质、硼、锌、水不溶物、PH值</small></summary>
      <div class="advanced-material-grid">${renderIndicatorFields(ADVANCED_MATERIAL_INDICATORS)}</div>
    </details>
  `;
  ui.materialDialog.showModal();
}

function saveMaterialEditor() {
  const index = Number(ui.materialEditIndex.value);
  const material = currentProcess().materials[index];
  if (!material) return;
  if (!validateMaterialEditor()) return;
  material.name = ui.materialName.value.trim();
  material.category = ui.materialCategory.value;
  material.price = toNumber(ui.materialPrice.value, 0);
  material.maxKg = toNumber(ui.materialMaxKg.value, 0);
  material.lossFactor = toNumber(ui.materialLossFactor.value, 0.99);
  material.enabled = ui.materialEnabled.value === "true";
  ui.materialIndicators.querySelectorAll("input[data-indicator]").forEach((input) => {
    material.props[input.dataset.indicator] = toNumber(input.value, 0);
  });
  saveState();
  renderMaterials();
  renderRequiredMaterialOptions();
  ui.materialDialog.close();
}

function validateMaterialEditor() {
  const requiredFields = [ui.materialName, ui.materialCategory, ui.materialPrice, ui.materialEnabled];
  let valid = true;
  requiredFields.forEach((input) => {
    const missing = !String(input.value ?? "").trim() || (input === ui.materialPrice && !Number.isFinite(Number(input.value)));
    input.classList.toggle("input-invalid", missing);
    if (missing) valid = false;
  });
  if (!valid) showToast("请输入必填项");
  return valid;
}

function clearMaterialFieldError(event) {
  if (event.target.matches("#materialName, #materialCategory, #materialPrice, #materialEnabled") && String(event.target.value ?? "").trim()) {
    event.target.classList.remove("input-invalid");
  }
}

function clearMaterialEditorErrors() {
  ui.materialDialog.querySelectorAll(".input-invalid").forEach((input) => input.classList.remove("input-invalid"));
}

function updateMaterialFromInput(material, input) {
  if (input.dataset.prop) {
    material.props[input.dataset.prop] = toNumber(input.value, 0);
    return;
  }

  const field = input.dataset.field;
  if (!field) return;

  if (field === "enabled") {
    material.enabled = input.checked;
  } else if (["price", "maxKg", "lossFactor"].includes(field)) {
    material[field] = toNumber(input.value, field === "lossFactor" ? 0.99 : 0);
  } else {
    material[field] = input.value;
  }
}

function runRecommendation() {
  if (ui.loadingOverlay && !ui.loadingOverlay.hidden) return;
  collectSettings();
  commitSelectedProcess();
  saveState();
  setRecommendationLoading(true);
  const calculate = () => {
    try {
      const process = currentProcess();
      const settings = currentSettings();
      const result = generateRecommendations(process, settings);
      latestCandidates = result.candidates;
      renderResults(result);
    } catch (error) {
      console.error(error);
      latestCandidates = [];
      renderResults({ candidates: [], error: "配方生成失败，请稍后重试。" });
    } finally {
      setRecommendationLoading(false);
    }
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => setTimeout(calculate, 0));
  } else {
    setTimeout(calculate, 50);
  }
}

function setRecommendationLoading(isLoading) {
  ui.loadingOverlay.hidden = !isLoading;
  ui.runButton.disabled = isLoading;
}

function commitSelectedProcess() {
  const nextProcessName = ui.processSelect.value;
  if (!nextProcessName || nextProcessName === state.processName) return;

  const previousSettings = clone(currentSettings());
  const nextSettings = state.settings[nextProcessName] || {};
  [
    "formulaText",
    "totalNutrientsMin",
    "nutrientDrop",
    "nutrientReductionPriority",
    "chlorideGrade",
    "waterSolublePMin",
    "maxMaterialCount"
  ].forEach((key) => {
    if (previousSettings[key] !== undefined) nextSettings[key] = clone(previousSettings[key]);
  });
  nextSettings.requiredMaterials = clone(previousSettings.requiredMaterials || {
    磷源: [],
    氮源: [],
    钾源: []
  });
  state.settings[nextProcessName] = nextSettings;
  state.processName = nextProcessName;
  state.activeMaterialCategory = "";
  renderProcessOptions();
  renderProcessingFeeOptions();
  renderTargets();
  renderConstraints();
  renderMaterials();
}

function renderResults(result) {
  ui.resultMeta.textContent = result.meta || "";

  if (result.error) {
    ui.results.innerHTML = `<div class="status warn">${escapeHtml(result.error)}</div>`;
    return;
  }

  if (!result.candidates.length) {
    ui.results.innerHTML = `<div class="status">没有找到满足条件的配方。</div>`;
    return;
  }

  const settings = currentSettings();
  ui.results.innerHTML = result.candidates.map((candidate, index) => renderCandidate(candidate, index, settings)).join("");
}

function clearRecommendationResults() {
  latestCandidates = [];
  ui.resultMeta.textContent = "";
  ui.results.innerHTML = `<div class="status">尚未生成推荐配方。</div>`;
}

function renderCandidate(candidate, index, settings) {
  const mainRows = candidate.items
    .filter((item) => item.kg > 0.05)
    .sort((a, b) => b.kg - a.kg)
    .map((item) => `
      <tr>
        <td><button type="button" class="material-info-trigger" data-candidate-index="${index}" data-material-id="${escapeHtml(item.id)}">${escapeHtml(item.name)}</button></td>
        <td>${formatNumber(item.kg, 0)}</td>
        <td>${formatNumber(item.kg / 10, 0)}%</td>
        <td>${formatCurrency(item.cost)}</td>
      </tr>
    `).join("");

  const process = currentProcess();
  const metricsToShow = metricDisplayList(candidate, process);
  const metricRows = metricsToShow.map((name) => `
    <tr>
      <td>${escapeHtml(name)}</td>
      <td>${formatMetric(name, candidate.metrics.folded[name])}</td>
    </tr>
  `).join("");

  const controlMetrics = activeControlMetricNames(settings, process).map((name) => `
    <div class="primary-metric control-metric">
      <span>${escapeHtml(name)}</span>
      <strong>${formatMetric(name, candidate.metrics.folded[name])}</strong>
    </div>
  `).join("");

  return `
    <article class="result-card">
      <div class="result-summary">
        <div class="result-title">
          <span>推荐方案</span>
          <strong>${index + 1}</strong>
        </div>
        <div class="primary-metric cost-metric"><span>实际成本</span><strong>${formatCurrency(candidate.actualCost)}</strong></div>
        <div class="primary-metric"><span>总养分</span><strong>${formatNumber(candidate.metrics.folded["总养分"], 2)}%</strong></div>
        ${controlMetrics}
      </div>
      <details class="result-details">
        <summary>
          <span class="details-toggle-label">
            <span class="details-label-closed">查看明细</span>
            <span class="details-label-open">收起明细</span>
          </span>
          <small>原料配比与全部指标</small>
        </summary>
        <div class="result-details-content">
          <div class="secondary-metrics">
            <div class="secondary-metric"><span>标准成本</span><strong>${formatCurrency(candidate.standardCost)}</strong></div>
            <div class="secondary-metric"><span>产出率</span><strong>${formatNumber(candidate.yieldRate, 2)}%</strong></div>
            <div class="secondary-metric"><span>PH值</span><strong>${formatMetric("PH值", candidate.metrics.folded["PH值"])}</strong></div>
          </div>
          <div class="result-body">
            <div class="subtable-wrap">
              <table class="data-table subtable">
                <thead><tr><th>原料</th><th>kg/t</th><th>配比</th><th>成本</th></tr></thead>
                <tbody>${mainRows}</tbody>
              </table>
            </div>
            <div class="subtable-wrap">
              <table class="data-table subtable">
                <thead><tr><th>指标</th><th>折算后</th></tr></thead>
                <tbody>${metricRows}</tbody>
              </table>
            </div>
          </div>
          <div class="result-card-actions">
            <button type="button" class="primary" data-action="save-recipe" data-candidate-index="${index}">保存配方</button>
          </div>
        </div>
      </details>
    </article>
  `;
}

function openResultMaterialInfo(candidateIndex, materialId) {
  const candidate = latestCandidates[candidateIndex];
  const item = candidate?.items.find((entry) => entry.id === materialId);
  const material = item?.material;
  if (!material) return;
  ui.resultMaterialTitle.textContent = material.name;
  ui.resultMaterialId.value = material.id;
  ui.resultMaterialInfo.innerHTML = `
    ${renderResultMaterialField("价格 元/t", "price", material.price, "0.01", false)}
    ${renderResultMaterialField("N", "N", prop(material, "N"), "1", true)}
    ${renderResultMaterialField("P", "P", prop(material, "P"), "1", true)}
    ${renderResultMaterialField("K", "K", prop(material, "K"), "1", true)}
    ${renderResultMaterialField("水分 %", "含水量", prop(material, "含水量"), "1", true)}
    ${renderResultMaterialField("氯离子 %", "氯离子", prop(material, "氯离子"), "0.01", false)}
  `;
  ui.resultMaterialDialog.showModal();
}

function renderResultMaterialField(label, field, value, step, integerDisplay) {
  const originalValue = formatInput(value);
  const displayValue = integerDisplay ? formatNumber(value, 0) : originalValue;
  return `
    <label class="field material-info-edit-field">
      <span>${escapeHtml(label)}</span>
      <input type="number" step="${step}" min="0" data-material-field="${escapeHtml(field)}" data-original-value="${escapeHtml(originalValue)}" data-display-value="${escapeHtml(displayValue)}" value="${escapeHtml(displayValue)}">
    </label>
  `;
}

function saveResultMaterialInfo() {
  const materialId = ui.resultMaterialId.value;
  const material = currentProcess().materials.find((item) => item.id === materialId);
  if (!material) return;
  ui.resultMaterialInfo.querySelectorAll("input[data-material-field]").forEach((input) => {
    const field = input.dataset.materialField;
    const value = input.value === input.dataset.displayValue
      ? toNumber(input.dataset.originalValue, 0)
      : toNumber(input.value, 0);
    if (["price"].includes(field)) material.price = value;
    else material.props[field] = value;
  });
  saveState();
  renderMaterials();
  ui.resultMaterialDialog.close();
}

function activeControlMetricNames(settings, process) {
  const names = ["氯离子"];
  if (supportsWaterSoluble(process) && String(settings.waterSolublePMin ?? "").trim() !== "") names.push("水溶磷");
  Object.entries(settings.constraints || {}).forEach(([name, bounds]) => {
    if (name === "PH值") return;
    if (String(bounds.min ?? "").trim() !== "" || String(bounds.max ?? "").trim() !== "") names.push(name);
  });
  return Array.from(new Set(names));
}

function collectSettings() {
  if (!ui.formulaN) return;
  const settings = currentSettings();
  settings.formulaText = readFormulaTextFromInputs();
  const parsed = parseFormula(settings.formulaText);
  settings.totalNutrientsMin = parsed ? parsed.N + parsed.P + parsed.K : "";
  settings.maxMaterialCount = Math.min(Math.max(Math.round(toNumber(ui.maxMaterialCount.value, 4)), 1), 6);
  settings.nutrientDrop = ui.nutrientDrop.value;
  settings.chlorideGrade = ui.chlorideGrade.value;
  settings.waterSolublePMin = ui.waterSolublePMin.value;
  settings.finishedMoisture = ui.finishedMoisture.value;
  settings.processingFee = ui.processingFee.value;
  settings.nutrientReductionPriority = normalizeNutrientPriority(
    ui.nutrientPriorityInputs.map((input) => input.value)
  );
}

function readFormulaTextFromInputs() {
  return [ui.formulaN.value, ui.formulaP.value, ui.formulaK.value].join("-");
}

function syncTotalNutrientsFromFormula() {
  const settings = currentSettings();
  const formulaText = readFormulaTextFromInputs();
  const parsed = parseFormula(formulaText);
  const total = parsed ? parsed.N + parsed.P + parsed.K : "";
  settings.formulaText = formulaText;
  settings.totalNutrientsMin = total;
  ui.totalNutrientsMin.value = total;
}

function keepIntegerInput(input) {
  if (input.value === "") return;
  const number = Number(input.value);
  input.value = Number.isFinite(number) ? String(Math.max(0, Math.trunc(number))) : "";
}

function normalizeIntegerValue(value) {
  if (String(value ?? "").trim() === "") return "";
  const number = Number(value);
  return Number.isFinite(number) ? String(Math.max(0, Math.trunc(number))) : "";
}

function normalizeNutrientPriority(value) {
  const allowed = new Set(NUTRIENT_PRIORITY_OPTIONS.map((option) => option.value));
  const source = Array.isArray(value) ? value : [];
  return source
    .map((item) => String(item || "").trim().toUpperCase())
    .filter((item, index, list) => allowed.has(item) && list.indexOf(item) === index)
    .slice(0, 3);
}

function setFormulaInputs(formulaText) {
  const parsed = parseFormula(formulaText);
  ui.formulaN.value = parsed ? Math.trunc(parsed.N) : "";
  ui.formulaP.value = parsed ? Math.trunc(parsed.P) : "";
  ui.formulaK.value = parsed ? Math.trunc(parsed.K) : "";
}

function currentProcess() {
  return state.processes.find((process) => process.name === state.processName) || state.processes[0];
}

function currentSettings() {
  const process = currentProcess();
  state.settings[process.name] ||= {
    formulaText: "0-0-0",
    totalNutrientsMin: 0,
    nutrientDrop: 1,
    nutrientReductionPriority: ["P", "K", "N"],
    chlorideGrade: "medium",
    waterSolublePMin: "60",
    maxMaterialCount: 6,
    requiredMaterials: {
      磷源: [],
      氮源: [],
      钾源: []
    },
    targetBasis: "folded",
    finishedMoisture: process.finishedMoisture,
    processingFee: process.processingFee,
    constraints: defaultConstraints(process.name)
  };
  const settings = state.settings[process.name];
  if (!settings.formulaText && settings.targetN !== undefined) {
    settings.formulaText = `${settings.targetN || ""}-${settings.targetP || ""}-${settings.targetK || ""}`;
  }
  if (settings.totalNutrientsMin === undefined || settings.totalNutrientsMin === "") {
    const parsed = parseFormula(settings.formulaText);
    settings.totalNutrientsMin = parsed ? parsed.N + parsed.P + parsed.K : "";
  }
  settings.nutrientDrop ??= 1;
  settings.nutrientReductionPriority = normalizeNutrientPriority(settings.nutrientReductionPriority);
  settings.chlorideGrade ||= process.name === "转鼓" ? "medium" : "low";
  settings.waterSolublePMin ??= "";
  settings.maxMaterialCount = Math.min(Math.max(Math.round(toNumber(settings.maxMaterialCount, 4)), 1), 6);
  settings.requiredMaterials ||= {};
  ["磷源", "氮源", "钾源"].forEach((category) => {
    if (!Array.isArray(settings.requiredMaterials[category])) settings.requiredMaterials[category] = [];
  });
  if (normalizeRequiredMaterials(settings) && typeof localStorage !== "undefined") saveState();
  settings.targetBasis = "folded";
  state.settings[process.name].constraints ||= defaultConstraints(process.name);
  return state.settings[process.name];
}

function normalizeRequiredMaterials(settings) {
  const process = currentProcess();
  let changed = false;
  ["磷源", "氮源", "钾源"].forEach((category) => {
    const validIds = new Set(
      process.materials
        .filter((material) => material.category === category)
        .map((material) => material.id)
    );
    const normalized = Array.from(new Set(settings.requiredMaterials[category]))
      .filter((id) => validIds.has(id));
    if (normalized.length !== settings.requiredMaterials[category].length ||
        normalized.some((id, index) => id !== settings.requiredMaterials[category][index])) {
      settings.requiredMaterials[category] = normalized;
      changed = true;
    }
  });
  return changed;
}

function requiredMaterialIds(settings) {
  return Array.from(new Set(["磷源", "氮源", "钾源"].flatMap((category) => settings.requiredMaterials?.[category] || [])));
}

function showToast(message) {
  clearTimeout(toastTimer);
  ui.toast.textContent = message;
  ui.toast.hidden = false;
  toastTimer = setTimeout(hideToast, 3000);
}

function hideToast() {
  clearTimeout(toastTimer);
  toastTimer = null;
  if (ui.toast) ui.toast.hidden = true;
}

function visibleConstraintNames(process) {
  return INDICATORS.filter((name) => {
    if (["N", "P", "K", "水溶磷", "氯离子"].includes(name)) return false;
    return process.materials.some((material) => prop(material, name) !== 0) || ["含水量", "PH值"].includes(name);
  });
}

function supportsWaterSoluble(process) {
  return ["转鼓", "挤压"].includes(process?.name);
}

function generateRecommendations(process, settings) {
  const targets = parseFormula(settings.formulaText);
  if (!targets) {
    return { candidates: [], error: "配合式三个数字都必须填写。" };
  }

  const maxMaterialCount = Math.min(Math.max(Math.round(toNumber(settings.maxMaterialCount, 4)), 1), 6);
  const requiredIds = requiredMaterialIds(settings);
  if (requiredIds.length > maxMaterialCount) {
    return { candidates: [], error: "必选原料数量超过原料数量上限，请重新配置" };
  }
  const finishedMoisture = toNumber(settings.finishedMoisture, process.finishedMoisture);
  const processingFee = toNumber(settings.processingFee, process.processingFee);
  const nutrientDrop = Math.min(Math.max(toNumber(settings.nutrientDrop, 1), 0), SINGLE_NUTRIENT_STANDARD_TOLERANCE);
  const nutrientPriority = normalizeNutrientPriority(settings.nutrientReductionPriority);
  const ranges = buildNutrientRanges(targets, nutrientDrop, nutrientPriority);
  const totalNutrientsMin = toNumber(settings.totalNutrientsMin, targets.N + targets.P + targets.K);
  const waterSolubleTarget = supportsWaterSoluble(process) ? optionalNumber(settings.waterSolublePMin) : NaN;
  const chlorideGrade = CHLORIDE_GRADES[settings.chlorideGrade] || CHLORIDE_GRADES.medium;
  const materials = process.materials.filter((material) => (
    material.enabled &&
    material.maxKg >= MIN_MATERIAL_KG &&
    (!Number.isFinite(waterSolubleTarget) || prop(material, "N") > 0 || prop(material, "P") > 0 || prop(material, "K") > 0)
  ));
  if (!materials.length) {
    return { candidates: [], error: "至少需要启用 1 个原料。" };
  }
  if (maxMaterialCount < 4 || materials.length < 4) {
    return generateLowMaterialRecommendations(process, settings, {
      materials,
      maxMaterialCount,
      targets,
      ranges,
      totalNutrientsMin,
      waterSolubleTarget,
      chlorideGrade,
      finishedMoisture,
      processingFee,
      requiredIds,
      nutrientPriority
    });
  }

  const lowMaterialResult = generateLowMaterialRecommendations(process, settings, {
    materials,
    maxMaterialCount: Math.min(maxMaterialCount, 3),
    targets,
    ranges,
    totalNutrientsMin,
    waterSolubleTarget,
    chlorideGrade,
    finishedMoisture,
    processingFee,
    requiredIds,
    nutrientPriority,
    searchBudget: 12000
  });
  const candidates = [...lowMaterialResult.candidates];
  const materialCounts = [];
  for (let count = Number.isFinite(waterSolubleTarget) ? maxMaterialCount : 4;
    Number.isFinite(waterSolubleTarget) ? count >= 4 : count <= maxMaterialCount;
    count += Number.isFinite(waterSolubleTarget) ? -1 : 1) materialCounts.push(count);
  const targetGrid = Number.isFinite(waterSolubleTarget)
    ? nutrientTargetGridForWater(ranges, totalNutrientsMin, nutrientPriority, targets)
    : nutrientTargetGrid(ranges, totalNutrientsMin, nutrientPriority, targets);
  const searchTargetGrid = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget)
      ? closestSearchTargets(targetGrid, 1, targets)
      : limitSearchTargetGrid(targetGrid, 24, targets))
    : targetGrid;
  const waterTargetLevels = [Number.isFinite(waterSolubleTarget) ? waterSolubleTarget : null];
  const chlorideTargetLevels = chlorideSolveTargets(chlorideGrade);
  const candidateLimit = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 24 : 48)
    : (Number.isFinite(waterSolubleTarget) ? 8 : 12);
  const searchBudget = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 2400 : 8000)
    : (Number.isFinite(waterSolubleTarget) ? 5000 : 12000);
  let searchSteps = 0;
  let stopSearch = false;
  for (const solveWaterTarget of waterTargetLevels) {
    for (const materialCount of materialCounts) {
      const combos = combinations(materials.length, materialCount).filter((combo) => {
        const selected = combo.map((index) => materials[index]);
        return requiredIds.every((id) => selected.some((material) => material.id === id)) &&
          comboCanContribute(selected, targets) &&
          (!Number.isFinite(solveWaterTarget) || comboCanReachWaterTarget(selected, solveWaterTarget)) &&
          comboCanReachChlorideRange(selected, chlorideGrade, finishedMoisture);
      });
      combos.sort((left, right) => materialComboPrice(left, materials) - materialComboPrice(right, materials));
      for (const combo of combos) {
        const selected = combo.map((index) => materials[index]);

        for (const solveChlorideTarget of chlorideTargetLevels) {
          for (const gridTarget of searchTargetGrid) {
            if (searchSteps >= searchBudget) {
              stopSearch = true;
              break;
            }
            searchSteps += 1;
            const solved = Number.isFinite(solveWaterTarget)
              ? solveForMaterialsWithWaterTarget(selected, gridTarget, finishedMoisture, solveWaterTarget, solveChlorideTarget)
              : solveForMaterials(selected, gridTarget, "folded", finishedMoisture, solveChlorideTarget);
            const solvedOptions = Array.isArray(solved?.[0]) ? solved : [solved];

            for (const solvedOption of solvedOptions) {
              if (!solvedOption) continue;
              const quantities = roundedQuantityMap(selected, solvedOption);
              if (!quantities) continue;

              const candidate = calculateFormula(process, quantities, finishedMoisture, processingFee);
              if (!candidate) continue;
              if (!meetsMaterialRatioLowerBound(candidate)) continue;
              const usedItems = candidate.items;
              if (usedItems.length > maxMaterialCount) continue;
              if (!requiredIds.every((id) => usedItems.some((item) => item.id === id))) continue;
              if (!targetsMatch(candidate, ranges, totalNutrientsMin, "folded")) continue;
              if (!passesConstraints(candidate, settings.constraints)) continue;
              if (!passesStandardSettings(candidate, settings)) continue;
              if (!passesWaterSolubleTarget(candidate, waterSolubleTarget)) continue;
              addCandidateToPool(candidates, candidate, candidateLimit, settings, nutrientPriority);
            }
          }
          if (stopSearch) break;
        }
        if (stopSearch) break;
      }
      if (stopSearch) break;
    }
    if (stopSearch) break;
  }

  const deduped = dedupeCandidates(candidates);
  deduped.sort((left, right) => compareCandidates(left, right, settings, nutrientPriority));
  const selected = deduped.slice(0, 3);
  return {
    candidates: selected,
    meta: Number.isFinite(waterSolubleTarget)
      ? `已按水溶磷 ${formatNumber(waterSolubleTarget, 0)}% 目标计算，得到 ${deduped.length} 个整数配比组合`
      : `已筛选 ${deduped.length} 个整数配比组合`
  };
}

function generateLowMaterialRecommendations(process, settings, options) {
  const {
    materials,
    maxMaterialCount,
    targets,
    ranges,
    totalNutrientsMin,
    waterSolubleTarget,
    chlorideGrade,
    finishedMoisture,
    processingFee,
    requiredIds,
    nutrientPriority,
    searchBudget: requestedSearchBudget
  } = options;
  const candidateLimit = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 24 : 48)
    : (Number.isFinite(waterSolubleTarget) ? 8 : 12);
  const defaultSearchBudget = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 150000 : 250000)
    : (Number.isFinite(waterSolubleTarget) ? 200000 : 300000);
  const searchBudget = Number.isFinite(requestedSearchBudget) ? requestedSearchBudget : defaultSearchBudget;
  const chlorideTargetLevels = chlorideSolveTargets(chlorideGrade);
  const candidates = [];
  let searchSteps = 0;
  let stopSearch = false;

  for (let count = 1; count <= maxMaterialCount && !stopSearch; count += 1) {
    const combos = combinations(materials.length, count)
      .filter((combo) => {
        const selected = combo.map((index) => materials[index]);
        return requiredIds.every((id) => selected.some((material) => material.id === id)) &&
          comboCanContribute(selected, targets) &&
          (!Number.isFinite(waterSolubleTarget) || comboCanMeetWaterSolubleTarget(selected, waterSolubleTarget)) &&
          comboCanReachChlorideRange(selected, chlorideGrade, finishedMoisture);
      })
      .sort((left, right) => materialComboPrice(left, materials) - materialComboPrice(right, materials));

    for (const combo of combos) {
      const selected = combo.map((index) => materials[index]);
      const quantityMaps = enumerateLowMaterialQuantityMaps(selected);
      for (const quantities of quantityMaps) {
        if (searchSteps >= searchBudget) {
          stopSearch = true;
          break;
        }
        searchSteps += 1;
        const candidate = calculateFormula(process, quantities, finishedMoisture, processingFee);
        if (!candidate) continue;
        if (!meetsMaterialRatioLowerBound(candidate)) continue;
        const usedItems = candidate.items;
        if (usedItems.length > maxMaterialCount) continue;
        if (!requiredIds.every((id) => usedItems.some((item) => item.id === id))) continue;
        if (!targetsMatch(candidate, ranges, totalNutrientsMin, "folded")) continue;
        if (!passesConstraints(candidate, settings.constraints)) continue;
        if (!passesStandardSettings(candidate, settings)) continue;
        if (!passesWaterSolubleTarget(candidate, waterSolubleTarget)) continue;
        addCandidateToPool(candidates, candidate, candidateLimit, settings, nutrientPriority);
      }
      if (stopSearch) break;
    }
  }

  const deduped = dedupeCandidates(candidates);
  deduped.sort((left, right) => compareCandidates(left, right, settings, nutrientPriority));
  return {
    candidates: deduped.slice(0, 3),
    meta: Number.isFinite(waterSolubleTarget)
      ? `已按水溶磷 ${formatNumber(waterSolubleTarget, 0)}% 目标计算，得到 ${deduped.length} 个整数配比组合`
      : `已筛选 ${deduped.length} 个整数配比组合`
  };
}

function* enumerateLowMaterialQuantityMaps(materials) {
  const maxPercents = materials.map((material) => Math.floor(toNumber(material.maxKg, 0) / 10));
  if (maxPercents.some((maxPercent) => maxPercent < MIN_MATERIAL_PERCENT)) return;
  const searchOrder = materials
    .map((material, index) => ({ index, price: toNumber(material.price, 0) }))
    .sort((left, right) => right.price - left.price)
    .map((item) => item.index);
  const percents = Array(materials.length).fill(0);

  function* visit(index, remaining) {
    const materialIndex = searchOrder[index];
    if (index === materials.length - 1) {
      if (remaining < MIN_MATERIAL_PERCENT || remaining > maxPercents[materialIndex]) return;
      percents[materialIndex] = remaining;
      const quantities = new Map();
      materials.forEach((material, materialIndex) => {
        quantities.set(material.id, percents[materialIndex] * 10);
      });
      yield quantities;
      return;
    }

    const remainingMaterials = materials.length - index - 1;
    const minimumRemaining = remainingMaterials * MIN_MATERIAL_PERCENT;
    const maximumRemaining = searchOrder
      .slice(index + 1)
      .reduce((sum, materialIndex) => sum + maxPercents[materialIndex], 0);
    const minimum = Math.max(MIN_MATERIAL_PERCENT, remaining - maximumRemaining);
    const maximum = Math.min(maxPercents[materialIndex], remaining - minimumRemaining);
    for (let percent = minimum; percent <= maximum; percent += 1) {
      percents[materialIndex] = percent;
      yield* visit(index + 1, remaining - percent);
    }
  }

  yield* visit(0, 100);
}

function meetsMaterialRatioLowerBound(candidate) {
  return candidate.items.every((item) => item.kg + 0.0001 >= MIN_MATERIAL_KG);
}

function compareCandidates(left, right, settings, nutrientPriority) {
  const costDiff = left.actualCost - right.actualCost;
  if (Math.abs(costDiff) > 0.0001) return costDiff;

  const waterDiff = waterSolubleExcess(left, settings) - waterSolubleExcess(right, settings);
  if (Math.abs(waterDiff) > 0.0001) return waterDiff;

  return compareNutrientReduction(left, right, nutrientPriority);
}

function addCandidateToPool(pool, candidate, limit, settings, nutrientPriority) {
  pool.push(candidate);
  pool.sort((left, right) => compareCandidates(left, right, settings, nutrientPriority));
  if (pool.length > limit) pool.pop();
}

function materialComboPrice(combo, materials) {
  return combo.reduce((sum, index) => sum + toNumber(materials[index].price, 0), 0);
}

function parseFormula(value) {
  const parts = String(value || "")
    .trim()
    .replace(/[：:]/g, "-")
    .split(/[-/\\\s]+/)
    .filter(Boolean)
    .map(Number)
    .map((item) => Math.trunc(item));
  if (parts.length !== 3 || parts.some((item) => !Number.isFinite(item) || item < 0)) return null;
  return { N: parts[0], P: parts[1], K: parts[2] };
}

function buildNutrientRanges(targets, nutrientDrop, nutrientPriority = []) {
  const ranges = {
    N: { min: Math.max(0, targets.N - nutrientDrop), max: targets.N + SINGLE_NUTRIENT_STANDARD_TOLERANCE },
    P: { min: Math.max(0, targets.P - nutrientDrop), max: targets.P + SINGLE_NUTRIENT_STANDARD_TOLERANCE },
    K: { min: Math.max(0, targets.K - nutrientDrop), max: targets.K + SINGLE_NUTRIENT_STANDARD_TOLERANCE }
  };
  if (nutrientPriority.length) {
    const totalPriorityReduction = nutrientPriority.reduce(
      (sum, name) => sum + Math.min(nutrientDrop, targets[name]),
      0
    );
    Object.keys(ranges).forEach((name) => {
      const priorityIndex = nutrientPriority.indexOf(name);
      const precedingReduction = priorityIndex < 0
        ? totalPriorityReduction
        : nutrientPriority
          .slice(0, priorityIndex)
          .reduce((sum, nutrient) => sum + Math.min(nutrientDrop, targets[nutrient]), 0);
      ranges[name].max = targets[name] + Math.max(SINGLE_NUTRIENT_STANDARD_TOLERANCE, precedingReduction);
    });
  }
  return ranges;
}

function nutrientTargetGrid(ranges, totalMin, nutrientPriority = [], targets = {}) {
  const values = {};
  ["N", "P", "K"].forEach((name) => {
    values[name] = [];
    for (let value = ranges[name].min; value <= ranges[name].max + 0.0001; value += 0.5) {
      values[name].push(Number(value.toFixed(2)));
    }
    if (!values[name].includes(ranges[name].max)) values[name].push(Number(ranges[name].max.toFixed(2)));
  });

  const grid = [];
  for (const n of values.N) {
    for (const p of values.P) {
      for (const k of values.K) {
        if (n + p + k + 0.0001 >= totalMin) grid.push({ N: n, P: p, K: k });
      }
    }
  }
  sortNutrientTargetsByPriority(grid, nutrientPriority, targets);
  return grid;
}

function nutrientTargetGridForWater(ranges, totalMin, nutrientPriority = [], targets = {}) {
  const grid = [];
  for (let n = ranges.N.min; n <= ranges.N.max + 0.0001; n += 0.5) {
    for (let p = ranges.P.min; p <= ranges.P.max + 0.0001; p += 0.5) {
      const minimumK = Math.max(ranges.K.min, totalMin - n - p);
      if (minimumK > ranges.K.max + 0.0001) continue;
      grid.push({
        N: Number(n.toFixed(2)),
        P: Number(p.toFixed(2)),
        K: Number(minimumK.toFixed(2))
      });
    }
  }
  sortNutrientTargetsByPriority(grid, nutrientPriority, targets);
  return grid;
}

function sortNutrientTargetsByPriority(grid, nutrientPriority, targets) {
  if (!nutrientPriority.length) return;
  const remaining = ["N", "P", "K"].filter((name) => !nutrientPriority.includes(name));
  grid.sort((left, right) => {
    for (const name of nutrientPriority) {
      const difference = left[name] - right[name];
      if (Math.abs(difference) > 0.0001) return difference;
    }
    for (const name of remaining) {
      const difference = Math.abs(left[name] - targets[name]) - Math.abs(right[name] - targets[name]);
      if (Math.abs(difference) > 0.0001) return difference;
    }
    const leftTotal = left.N + left.P + left.K;
    const rightTotal = right.N + right.P + right.K;
    return leftTotal - rightTotal;
  });
}

function limitSearchTargetGrid(grid, limit, targets) {
  if (grid.length <= limit) return grid;
  const preferred = grid.slice(0, Math.max(0, limit - 2));
  const closest = [...grid]
    .sort((left, right) => (
      Math.abs(left.N - targets.N) + Math.abs(left.P - targets.P) + Math.abs(left.K - targets.K) -
      (Math.abs(right.N - targets.N) + Math.abs(right.P - targets.P) + Math.abs(right.K - targets.K))
    ))
    .slice(0, 2);
  const seen = new Set();
  return [...closest, ...preferred].filter((target) => {
    const key = `${target.N}:${target.P}:${target.K}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

function closestSearchTargets(grid, limit, targets) {
  return [...grid]
    .sort((left, right) => (
      Math.abs(left.N - targets.N) + Math.abs(left.P - targets.P) + Math.abs(left.K - targets.K) -
      (Math.abs(right.N - targets.N) + Math.abs(right.P - targets.P) + Math.abs(right.K - targets.K))
    ))
    .slice(0, limit);
}

function compareNutrientReduction(left, right, nutrientPriority) {
  for (const name of nutrientPriority) {
    const difference = left.metrics.folded[name] - right.metrics.folded[name];
    if (Math.abs(difference) > 0.0001) return difference;
  }
  return 0;
}

function comboCanContribute(materials, targets = null) {
  return ["N", "P", "K"]
    .filter((name) => !targets || targets[name] > 0)
    .every((name) => materials.some((material) => prop(material, name) > 0));
}

function comboCanReachWaterTarget(materials, target) {
  const phosphorusMaterials = materials.filter((material) => prop(material, "P") > 0);
  if (!phosphorusMaterials.length) return false;
  const hasLower = phosphorusMaterials.some((material) => prop(material, "水溶磷") <= target);
  const hasHigher = phosphorusMaterials.some((material) => prop(material, "水溶磷") >= target);
  return hasLower && hasHigher;
}

function comboCanMeetWaterSolubleTarget(materials, target) {
  const phosphorusMaterials = materials.filter((material) => prop(material, "P") > 0);
  return phosphorusMaterials.length > 0 && phosphorusMaterials.some((material) => prop(material, "水溶磷") + 0.0001 >= target);
}

function comboCanReachChlorideRange(materials, grade, finishedMoisture) {
  if (Number.isFinite(grade.maxExclusive) || Number.isFinite(grade.min)) {
    const values = materials
      .map((material) => prop(material, "氯离子") / yieldCoefficient(material, finishedMoisture))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return false;
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (Number.isFinite(grade.maxExclusive)) return min < grade.maxExclusive - 0.0001;
    if (Number.isFinite(grade.min)) return max > grade.min + 0.0001;
  }
  if (Number.isFinite(grade.minInclusive) || Number.isFinite(grade.maxInclusive)) {
    const values = materials
      .map((material) => prop(material, "氯离子") / yieldCoefficient(material, finishedMoisture))
      .filter((value) => Number.isFinite(value));
    if (!values.length) return false;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const lower = Number.isFinite(grade.minInclusive) ? grade.minInclusive : Number.NEGATIVE_INFINITY;
    const upper = Number.isFinite(grade.maxInclusive) ? grade.maxInclusive : Number.POSITIVE_INFINITY;
    return max + 0.0001 >= lower && min - 0.0001 <= upper;
  }
  return true;
}

function chlorideSolveTargets(grade) {
  if (!Number.isFinite(grade.minInclusive) || !Number.isFinite(grade.maxInclusive)) return [null];
  return [(grade.minInclusive + grade.maxInclusive) / 2];
}

function roundedQuantityMap(materials, solved) {
  const percents = solved.map((kg) => kg / 10);
  if (percents.some((pct, index) => pct < -0.05 || pct > materials[index].maxKg / 10 + 0.05)) return null;

  const rounded = percents.map((pct) => Math.max(0, Math.round(pct)));
  let diff = 100 - rounded.reduce((sum, pct) => sum + pct, 0);
  const order = percents
    .map((pct, index) => ({ index, frac: pct - Math.floor(pct) }))
    .sort((a, b) => diff > 0 ? b.frac - a.frac : a.frac - b.frac);

  let guard = 0;
  while (diff !== 0 && guard < 500) {
    let changed = false;
    for (const item of order) {
      const maxPct = Math.floor(materials[item.index].maxKg / 10);
      if (diff > 0 && rounded[item.index] < maxPct) {
        rounded[item.index] += 1;
        diff -= 1;
        changed = true;
      } else if (diff < 0 && rounded[item.index] > 0) {
        rounded[item.index] -= 1;
        diff += 1;
        changed = true;
      }
      if (diff === 0) break;
    }
    if (!changed) return null;
    guard += 1;
  }
  if (diff !== 0) return null;

  const quantities = new Map();
  materials.forEach((material, index) => {
    quantities.set(material.id, rounded[index] * 10);
  });
  return quantities;
}

function solveForMaterials(materials, targets, basis, finishedMoisture, chlorideTarget = null) {
  if (materials.length > 4 || Number.isFinite(chlorideTarget)) {
    return solveBoundedMaterialSystem(materials, targets, finishedMoisture, null, basis, chlorideTarget);
  }

  const matrix = [[], [], [], []];
  const vector = [1000, 0, 0, 0];
  materials.forEach((material) => {
    const y = yieldCoefficient(material, finishedMoisture);
    matrix[0].push(1);
    if (basis === "folded") {
      matrix[1].push(prop(material, "N") - targets.N * y);
      matrix[2].push(prop(material, "P") - targets.P * y);
      matrix[3].push(prop(material, "K") - targets.K * y);
    } else {
      matrix[1].push(prop(material, "N"));
      matrix[2].push(prop(material, "P"));
      matrix[3].push(prop(material, "K"));
    }
  });
  if (basis === "unfolded") {
    vector[1] = targets.N * 1000;
    vector[2] = targets.P * 1000;
    vector[3] = targets.K * 1000;
  }
  return solveLinearSystem(matrix, vector);
}

function solveForMaterialsWithWaterTarget(materials, targets, finishedMoisture, waterSolubleTarget, chlorideTarget = null) {
  if (materials.length > 4 || Number.isFinite(chlorideTarget)) {
    return solveBoundedMaterialSystem(materials, targets, finishedMoisture, waterSolubleTarget, "folded", chlorideTarget);
  }
  const phosphorusMaterials = materials.filter((material) => prop(material, "P") > 0);
  if (phosphorusMaterials.length && phosphorusMaterials.every((material) => Math.abs(prop(material, "水溶磷") - waterSolubleTarget) < 0.0001)) {
    return solveForMaterials(materials, targets, "folded", finishedMoisture);
  }

  const matrix = [[], [], [], []];
  const vector = [1000, 0, 0, 0];
  materials.forEach((material) => {
    const y = yieldCoefficient(material, finishedMoisture);
    matrix[0].push(1);
    matrix[1].push(prop(material, "N") - targets.N * y);
    matrix[2].push(prop(material, "P") - targets.P * y);
    matrix[3].push(prop(material, "P") * (prop(material, "水溶磷") - waterSolubleTarget) / 100);
  });
  const solved = solveLinearSystem(matrix, vector);
  return solved && solved.every((value) => Number.isFinite(value)) ? solved : null;
}

function solveBoundedMaterialSystem(materials, targets, finishedMoisture, equationWaterTarget, basis, equationChlorideTarget = null) {
  const specialEquationCount = Number.isFinite(equationWaterTarget) + Number.isFinite(equationChlorideTarget);
  const nutrientCount = Math.max(1, 3 - specialEquationCount);
  const nutrientChoices = combinations(3, nutrientCount)
    .map((choice) => choice.map((index) => ["N", "P", "K"][index]));
  const basisChoices = combinations(materials.length, 4);
  const solutions = [];
  const seenSolutions = new Set();

  for (const nutrientNames of nutrientChoices) {
    const equations = materialEquations(materials, targets, finishedMoisture, equationWaterTarget, basis, nutrientNames, equationChlorideTarget);
    for (const basisChoice of basisChoices) {
      const extraIndexes = materials.map((_, index) => index).filter((index) => !basisChoice.includes(index));
      const boundOptions = extraIndexes.map((index) => {
        const minimumKg = Math.min(MIN_MATERIAL_KG, materials[index].maxKg);
        return [...new Set([
          materials[index].maxKg,
          minimumKg,
          50,
          100,
          150,
          200,
          250,
          300
        ].filter((value) => value >= minimumKg && value <= materials[index].maxKg))];
      });
      const extraValues = [];
      visitBoundedExtras(0);

      function visitBoundedExtras(position) {
        if (position === extraIndexes.length) {
          const extraKg = extraValues.reduce((sum, value) => sum + value, 0);
          if (extraKg >= 1000) return null;

          const matrix = equations.map((equation) => basisChoice.map((index) => equation.coefficients[index]));
          const vector = equations.map((equation) => (
            equation.rhs - extraIndexes.reduce((sum, index, extraIndex) => (
              sum + extraValues[extraIndex] * equation.coefficients[index]
            ), 0)
          ));
          const basisSolution = solveLinearSystem(matrix, vector);
          if (!basisSolution || basisSolution.some((value) => !Number.isFinite(value))) return null;

          const result = Array(materials.length).fill(0);
          basisChoice.forEach((index, solutionIndex) => {
            result[index] = basisSolution[solutionIndex];
          });
          extraIndexes.forEach((index, extraIndex) => {
            result[index] = extraValues[extraIndex];
          });
          const valid = result.every((value, index) => {
            const minimumKg = Math.min(MIN_MATERIAL_KG, materials[index].maxKg);
            return value >= minimumKg - 0.05 && value <= materials[index].maxKg + 0.05;
          });
          if (!valid) return null;
          const key = result.map((value) => Math.round(value * 100) / 100).join(",");
          if (seenSolutions.has(key)) return null;
          seenSolutions.add(key);
          solutions.push(result);
          solutions.sort((left, right) => (
            materialSolutionScore(materials, left, targets, finishedMoisture, equationWaterTarget, equationChlorideTarget) -
            materialSolutionScore(materials, right, targets, finishedMoisture, equationWaterTarget, equationChlorideTarget)
          ));
          if (solutions.length > 32) solutions.pop();
          return null;
        }

        for (const value of boundOptions[position]) {
          extraValues[position] = value;
          visitBoundedExtras(position + 1);
        }
        return null;
      }
    }
  }
  return solutions.length ? solutions : null;
}

function materialSolutionScore(materials, quantities, targets, finishedMoisture, waterSolubleTarget, chlorideTarget) {
  let yieldKg = 0;
  const totals = { N: 0, P: 0, K: 0 };
  let chloride = 0;
  let phosphorusBase = 0;
  let solublePhosphorus = 0;
  materials.forEach((material, index) => {
    const kg = quantities[index];
    const yieldValue = kg * yieldCoefficient(material, finishedMoisture);
    yieldKg += yieldValue;
    ["N", "P", "K"].forEach((name) => {
      totals[name] += kg * prop(material, name);
    });
    chloride += kg * prop(material, "氯离子");
    phosphorusBase += kg * prop(material, "P");
    solublePhosphorus += kg * prop(material, "P") * prop(material, "水溶磷") / 100;
  });
  if (yieldKg <= 0) return Number.POSITIVE_INFINITY;
  const metrics = {
    N: totals.N / yieldKg,
    P: totals.P / yieldKg,
    K: totals.K / yieldKg,
    total: (totals.N + totals.P + totals.K) / yieldKg,
    chloride: chloride / yieldKg,
    water: phosphorusBase > 0 ? solublePhosphorus / phosphorusBase * 100 : 0
  };
  let score = ["N", "P", "K"].reduce((sum, name) => sum + Math.abs(metrics[name] - targets[name]), 0);
  score += Math.abs(metrics.total - (targets.N + targets.P + targets.K)) * 0.5;
  if (Number.isFinite(chlorideTarget)) score += Math.abs(metrics.chloride - chlorideTarget) * 0.2;
  if (Number.isFinite(waterSolubleTarget)) score += Math.abs(metrics.water - waterSolubleTarget) * 0.2;
  return score;
}

function materialEquations(materials, targets, finishedMoisture, waterSolubleTarget, basis, nutrientNames, chlorideTarget) {
  const equations = [{
    coefficients: materials.map(() => 1),
    rhs: 1000
  }];
  nutrientNames.forEach((name) => {
    equations.push({
      coefficients: materials.map((material) => {
        const y = yieldCoefficient(material, finishedMoisture);
        return basis === "folded" ? prop(material, name) - targets[name] * y : prop(material, name);
      }),
      rhs: basis === "folded" ? 0 : targets[name] * 1000
    });
  });
  if (Number.isFinite(waterSolubleTarget)) {
    equations.push({
      coefficients: materials.map((material) => (
        prop(material, "P") * (prop(material, "水溶磷") - waterSolubleTarget) / 100
      )),
      rhs: 0
    });
  }
  if (Number.isFinite(chlorideTarget)) {
    equations.push({
      coefficients: materials.map((material) => (
        prop(material, "氯离子") - chlorideTarget * yieldCoefficient(material, finishedMoisture)
      )),
      rhs: 0
    });
  }
  return equations;
}

function calculateFormula(process, quantities, finishedMoisture, processingFee) {
  const items = [];
  let theoreticalKg = 0;
  let yieldKg = 0;
  let rawCost = 0;

  process.materials.forEach((material) => {
    const kg = quantities.get(material.id) || 0;
    if (kg <= 0.000001) return;
    const actualKg = kg * yieldCoefficient(material, finishedMoisture);
    const cost = (kg / 1000) * material.price;
    theoreticalKg += kg;
    yieldKg += actualKg;
    rawCost += cost;
    items.push({
      id: material.id,
      name: material.name,
      kg,
      actualKg,
      price: material.price,
      cost,
      material
    });
  });

  if (Math.abs(theoreticalKg - 1000) > 0.1 || yieldKg <= 0) return null;

  const metrics = { folded: {}, unfolded: {} };
  INDICATORS.forEach((name) => {
    const special = specialMetric(name, items, yieldKg, process, finishedMoisture, theoreticalKg);
    if (special !== null) {
      metrics.folded[name] = special.folded;
      metrics.unfolded[name] = special.unfolded;
      return;
    }
    const total = items.reduce((sum, item) => sum + item.kg * prop(item.material, name), 0);
    metrics.folded[name] = total / yieldKg;
    metrics.unfolded[name] = total / theoreticalKg;
  });
  metrics.folded["总养分"] = metrics.folded.N + metrics.folded.P + metrics.folded.K;
  metrics.unfolded["总养分"] = metrics.unfolded.N + metrics.unfolded.P + metrics.unfolded.K;

  return {
    items,
    theoreticalKg,
    yieldKg,
    yieldRate: (yieldKg / theoreticalKg) * 100,
    standardCost: rawCost,
    actualCost: rawCost / (yieldKg / 1000) + processingFee,
    metrics
  };
}

function specialMetric(name, items, yieldKg, process, finishedMoisture, theoreticalKg) {
  if (name === "含水量" && process.name === "转鼓") {
    const total = items.reduce((sum, item) => sum + item.kg * prop(item.material, name), 0);
    return {
      folded: Math.min(total / yieldKg, finishedMoisture),
      unfolded: total / theoreticalKg
    };
  }
  if (name !== "水溶磷") return null;
  const phosphorusBase = items.reduce((sum, item) => sum + item.kg * prop(item.material, "P"), 0);
  if (phosphorusBase <= 0) return { folded: 0, unfolded: 0 };
  const numerator = items.reduce((sum, item) => {
    return sum + item.kg * prop(item.material, "P") * (prop(item.material, name) / 100);
  }, 0);
  const ratio = (numerator / phosphorusBase) * 100;
  return {
    folded: ratio,
    unfolded: ratio
  };
}

function targetsMatch(candidate, ranges, totalMin, basis) {
  const metrics = basis === "folded" ? candidate.metrics.folded : candidate.metrics.unfolded;
  if (metrics["总养分"] + 0.0001 < totalMin) return false;
  return ["N", "P", "K"].every((name) => metrics[name] + 0.0001 >= ranges[name].min && metrics[name] - 0.0001 <= ranges[name].max);
}

function passesConstraints(candidate, constraints) {
  if (!constraints) return true;
  for (const [name, bounds] of Object.entries(constraints)) {
    const value = candidate.metrics.folded[name];
    if (!Number.isFinite(value)) continue;
    const min = bounds.min === "" ? null : Number(bounds.min);
    const max = bounds.max === "" ? null : Number(bounds.max);
    if (min !== null && Number.isFinite(min) && value + 0.0001 < min) return false;
    if (max !== null && Number.isFinite(max) && value - 0.0001 > max) return false;
  }
  return true;
}

function passesStandardSettings(candidate, settings) {
  const metrics = candidate.metrics.folded;
  const grade = CHLORIDE_GRADES[settings.chlorideGrade] || CHLORIDE_GRADES.medium;
  const chloride = metrics["氯离子"];
  if (Number.isFinite(grade.min) && chloride <= grade.min + 0.0001) return false;
  if (Number.isFinite(grade.minInclusive) && chloride + 0.0001 < grade.minInclusive) return false;
  if (Number.isFinite(grade.maxExclusive) && chloride >= grade.maxExclusive) return false;
  if (Number.isFinite(grade.maxInclusive) && chloride - 0.0001 > grade.maxInclusive) return false;

  return true;
}

function passesWaterSolubleTarget(candidate, target) {
  if (!Number.isFinite(target)) return true;
  return candidate.metrics.folded["水溶磷"] + 0.0001 >= target;
}

function waterSolubleExcess(candidate, settings) {
  const min = optionalNumber(settings.waterSolublePMin);
  if (!Number.isFinite(min)) return 0;
  const value = Number(candidate.metrics.folded["水溶磷"]);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value - min);
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const unique = [];
  for (const candidate of candidates) {
    const key = candidate.items
      .map((item) => `${item.id}:${Math.round(item.kg * 10) / 10}`)
      .sort()
      .join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
  }
  return unique;
}

function selectDistinctCandidates(candidates, count) {
  const selected = [];
  const thresholds = [80, 40, 0];
  for (const threshold of thresholds) {
    for (const candidate of candidates) {
      if (selected.includes(candidate)) continue;
      if (selected.every((chosen) => compositionDistance(candidate, chosen) >= threshold)) {
        selected.push(candidate);
      }
      if (selected.length === count) return selected;
    }
  }
  return selected;
}

function compositionDistance(a, b) {
  const allIds = new Set([...a.items.map((item) => item.id), ...b.items.map((item) => item.id)]);
  let distance = 0;
  allIds.forEach((id) => {
    distance += Math.abs(itemKg(a, id) - itemKg(b, id));
  });
  return distance;
}

function itemKg(candidate, id) {
  const item = candidate.items.find((entry) => entry.id === id);
  return item ? item.kg : 0;
}

function yieldCoefficient(material, finishedMoisture) {
  const moistureDelta = (prop(material, "含水量") - finishedMoisture) / 100;
  return Math.max(0, material.lossFactor * (1 - moistureDelta));
}

function prop(material, name) {
  return Number(material.props?.[name]) || 0;
}

function solveLinearSystem(matrix, vector) {
  const n = vector.length;
  const a = matrix.map((row, index) => [...row, vector[index]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
    }
    if (Math.abs(a[pivot][col]) < 1e-9) return null;
    [a[col], a[pivot]] = [a[pivot], a[col]];
    const divisor = a[col][col];
    for (let j = col; j <= n; j += 1) a[col][j] /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = col; j <= n; j += 1) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => row[n]);
}

function combinations(length, size) {
  const result = [];
  const current = [];
  function visit(start) {
    if (current.length === size) {
      result.push([...current]);
      return;
    }
    for (let index = start; index <= length - (size - current.length); index += 1) {
      current.push(index);
      visit(index + 1);
      current.pop();
    }
  }
  visit(0);
  return result;
}

function metricDisplayList(candidate, process) {
  const names = ["N", "P", "K", "总养分", "氯离子", "含水量", "PH值"];
  if (supportsWaterSoluble(process)) names.push("水溶磷");
  if (candidate.metrics.folded["水不溶物"]) names.push("水不溶物");
  ["硝氮(N)", "有机质", "Mg(镁)", "Ca(钙)", "B(硼)", "Zn(锌)"].forEach((name) => {
    if (candidate.metrics.folded[name]) names.push(name);
  });
  return names;
}

function recipeSourceLabel(source) {
  return source === "recommended" ? "推荐生成" : "手动录入";
}

function recipeMaterialSnapshot(item) {
  const material = clone(item.material || {});
  return {
    id: item.id,
    name: item.name || material.name || item.id,
    category: item.category || material.category || "",
    price: toNumber(item.price, material.price || 0),
    kg: toNumber(item.kg, 0),
    actualKg: toNumber(item.actualKg, item.kg || 0),
    cost: toNumber(item.cost, 0),
    material
  };
}

function recipeSnapshotFromCandidate(candidate, process, settings, name, note) {
  return {
    id: `RECIPE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name || `${settings.formulaText || "未命名"} ${process.name}方案`,
    source: "recommended",
    processName: process.name,
    formulaText: settings.formulaText || "",
    note: note || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetSnapshot: clone(settings),
    items: candidate.items.filter((item) => item.kg > 0.05).map(recipeMaterialSnapshot),
    result: {
      standardCost: candidate.standardCost,
      actualCost: candidate.actualCost,
      yieldKg: candidate.yieldKg,
      yieldRate: candidate.yieldRate,
      theoreticalKg: candidate.theoreticalKg,
      metrics: clone(candidate.metrics)
    }
  };
}

function recipeDraftFromCandidate(candidate, name, note) {
  const process = currentProcess();
  const settings = currentSettings();
  return {
    ...recipeSnapshotFromCandidate(candidate, process, settings, name, note),
    id: "",
    createdAt: "",
    updatedAt: ""
  };
}

function recipeDraftFromRecipe(recipe) {
  return clone(recipe);
}

function findRecipe(id) {
  return state.recipes.find((recipe) => recipe.id === id);
}

function openRecipeSaveDialog(candidateIndex) {
  const candidate = latestCandidates[candidateIndex];
  if (!candidate) return;
  const process = currentProcess();
  const settings = currentSettings();
  ui.recipeSaveCandidateIndex.value = String(candidateIndex);
  ui.recipeSaveName.value = `${settings.formulaText || "未命名"} ${process.name}方案 ${candidateIndex + 1}`;
  ui.recipeSaveNote.value = "";
  ui.recipeSaveSummary.innerHTML = `
    <div class="recipe-preview-grid">
      <span>工艺</span><strong>${escapeHtml(process.name)}</strong>
      <span>配合式</span><strong>${escapeHtml(settings.formulaText || "-")}</strong>
      <span>实际成本</span><strong>${formatCurrency(candidate.actualCost)}</strong>
      <span>原料数量</span><strong>${candidate.items.filter((item) => item.kg > 0.05).length} 种</strong>
    </div>`;
  ui.recipeSaveDialog.showModal();
}

function confirmRecommendedRecipeSave() {
  const candidateIndex = Number(ui.recipeSaveCandidateIndex.value);
  const candidate = latestCandidates[candidateIndex];
  if (!candidate) return;
  const recipe = recipeSnapshotFromCandidate(
    candidate,
    currentProcess(),
    currentSettings(),
    ui.recipeSaveName.value.trim(),
    ui.recipeSaveNote.value.trim()
  );
  state.recipes.unshift(recipe);
  saveState();
  ui.recipeSaveDialog.close();
  renderRecipes();
  showToast("配方已保存");
}

function openRecipeEditor(recipeOrDraft) {
  const draft = recipeOrDraft
    ? (recipeOrDraft.id ? recipeDraftFromRecipe(recipeOrDraft) : clone(recipeOrDraft))
    : {
      id: "",
      name: "",
      source: "manual",
      processName: state.processName,
      formulaText: "",
      note: "",
      targetSnapshot: clone(currentSettings()),
      items: [{ id: "", kg: 0 }]
    };
  draft.items ||= [{ id: "", kg: 0 }];
  activeRecipeDraft = draft;
  ui.recipeDialogTitle.textContent = draft.id ? "编辑配方" : "新建配方";
  ui.recipeDialogHint.textContent = `${recipeSourceLabel(draft.source)}，按 1000 kg/t 录入原料用量。`;
  ui.recipeEditId.value = draft.id || "";
  ui.recipeSource.value = draft.source || "manual";
  ui.recipeName.value = draft.name || "";
  ui.recipeProcess.value = draft.processName || state.processName;
  ui.recipeFormula.value = draft.formulaText || "";
  ui.recipeNote.value = draft.note || "";
  renderRecipeMaterialsEditor();
  ui.recipeDialog.showModal();
}

function recipeProcess() {
  return state.processes.find((process) => process.name === ui.recipeProcess.value) || currentProcess();
}

function materialForRecipeItem(item, process) {
  return process.materials.find((material) => material.id === item.id) || item.material || null;
}

function renderRecipeMaterialsEditor() {
  if (!activeRecipeDraft) return;
  const process = recipeProcess();
  const materials = process.materials;
  ui.recipeMaterialsEditor.innerHTML = activeRecipeDraft.items.map((item, index) => {
    const selectedMaterial = materialForRecipeItem(item, process);
    const options = materials.map((material) => `<option value="${escapeHtml(material.id)}" ${material.id === item.id ? "selected" : ""}>${escapeHtml(material.name)}</option>`).join("");
    const fallback = item.id && !materials.some((material) => material.id === item.id)
      ? `<option value="${escapeHtml(item.id)}" selected>${escapeHtml(item.name || item.id)}（已保存快照）</option>`
      : "";
    return `
      <div class="recipe-material-row" data-recipe-index="${index}">
        <select data-recipe-material aria-label="第 ${index + 1} 项原料"><option value="">请选择原料</option>${fallback}${options}</select>
        <input type="number" min="0" step="1" data-recipe-kg aria-label="第 ${index + 1} 项用量 kg/t" value="${escapeHtml(formatInput(item.kg))}" placeholder="kg/t">
        <button type="button" data-recipe-remove="${index}" class="danger" aria-label="删除第 ${index + 1} 项">删除</button>
      </div>`;
  }).join("");
  updateRecipeEditorPreview();
}

function collectRecipeEditorItems() {
  const process = recipeProcess();
  return Array.from(ui.recipeMaterialsEditor.querySelectorAll(".recipe-material-row")).map((row) => {
    const id = row.querySelector("[data-recipe-material]")?.value || "";
    const kg = toNumber(row.querySelector("[data-recipe-kg]")?.value, 0);
    const material = process.materials.find((item) => item.id === id) || activeRecipeDraft.items[Number(row.dataset.recipeIndex)]?.material;
    return material ? recipeMaterialSnapshot({ ...material, id: material.id, kg, material }) : { id, kg };
  }).filter((item) => item.id);
}

function calculateRecipeResult(draft, items) {
  const process = state.processes.find((item) => item.name === draft.processName) || currentProcess();
  const quantities = new Map(items.map((item) => [item.id, item.kg]));
  return calculateFormula(
    process,
    quantities,
    toNumber(draft.targetSnapshot?.finishedMoisture, process.finishedMoisture),
    toNumber(draft.targetSnapshot?.processingFee, process.processingFee)
  );
}

function updateRecipeEditorPreview() {
  if (!activeRecipeDraft) return;
  const items = collectRecipeEditorItems();
  const total = items.reduce((sum, item) => sum + item.kg, 0);
  const result = calculateRecipeResult({ ...activeRecipeDraft, processName: ui.recipeProcess.value }, items);
  ui.recipeEditorPreview.innerHTML = result
    ? `<div class="recipe-preview-grid"><span>原料总量</span><strong>${formatNumber(total, 0)} kg/t</strong><span>实际成本</span><strong>${formatCurrency(result.actualCost)}</strong><span>折算总养分</span><strong>${formatMetric("总养分", result.metrics.folded["总养分"])}</strong></div>`
    : `<span class="muted">请选择原料并录入用量，预览将显示成本和折算指标。</span>`;
}

function handleRecipeEditorInput(event) {
  if (event.type === "change" && event.target.matches("[data-recipe-material]")) {
    const row = event.target.closest(".recipe-material-row");
    const item = activeRecipeDraft?.items[Number(row?.dataset.recipeIndex)];
    const material = recipeProcess().materials.find((entry) => entry.id === event.target.value);
    if (item && material) Object.assign(item, { id: material.id, name: material.name, category: material.category, material: clone(material) });
  }
  updateRecipeEditorPreview();
}

function saveRecipeEditor() {
  if (!activeRecipeDraft) return;
  const items = collectRecipeEditorItems().filter((item) => item.kg > 0);
  const total = items.reduce((sum, item) => sum + item.kg, 0);
  const name = ui.recipeName.value.trim();
  if (!name) return showToast("请输入配方名称");
  if (!items.length) return showToast("请至少选择 1 种原料");
  if (Math.abs(total - 1000) > 0.01) return showToast("原料总量必须为 1000 kg/t");
  const draft = { ...activeRecipeDraft, name, processName: ui.recipeProcess.value, formulaText: ui.recipeFormula.value.trim(), note: ui.recipeNote.value.trim(), items };
  const result = calculateRecipeResult(draft, items);
  if (!result) return showToast("配方原料用量无法计算");
  const now = new Date().toISOString();
  const recipe = {
    ...draft,
    id: draft.id || `RECIPE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: draft.createdAt || now,
    updatedAt: now,
    targetSnapshot: clone(draft.targetSnapshot || currentSettings()),
    items: result.items.filter((item) => item.kg > 0.05).map(recipeMaterialSnapshot),
    result: {
      standardCost: result.standardCost,
      actualCost: result.actualCost,
      yieldKg: result.yieldKg,
      yieldRate: result.yieldRate,
      theoreticalKg: result.theoreticalKg,
      metrics: clone(result.metrics)
    }
  };
  const existingIndex = state.recipes.findIndex((entry) => entry.id === recipe.id);
  if (existingIndex >= 0) state.recipes.splice(existingIndex, 1, recipe);
  else state.recipes.unshift(recipe);
  saveState();
  activeRecipeDraft = null;
  ui.recipeDialog.close();
  renderRecipes();
  showToast("配方已保存");
}

function renderRecipes() {
  if (!ui.recipesList) return;
  if (!state.recipes.length) {
    ui.recipesList.innerHTML = `<div class="status">还没有保存的配方，推荐结果或新建配方后会显示在这里。</div>`;
    return;
  }
  ui.recipesList.innerHTML = state.recipes.map((recipe) => `
    <article class="recipe-list-item">
      <div class="recipe-list-main">
        <div class="recipe-list-title"><strong>${escapeHtml(recipe.name || "未命名配方")}</strong><span class="recipe-source-badge">${recipeSourceLabel(recipe.source)}</span></div>
        <div class="recipe-list-meta"><span>${escapeHtml(recipe.processName || "-")}</span><span>${escapeHtml(recipe.formulaText || "未填写配合式")}</span><span>${recipe.items?.length || 0} 种原料</span><span>${formatCurrency(recipe.result?.actualCost)}</span></div>
        <small class="muted">最近更新：${escapeHtml(formatDateTime(recipe.updatedAt || recipe.createdAt))}</small>
      </div>
      <div class="recipe-list-actions">
        <button type="button" data-action="recipe-detail" data-recipe-id="${escapeHtml(recipe.id)}">查看明细</button>
        <button type="button" data-action="recipe-edit" data-recipe-id="${escapeHtml(recipe.id)}">编辑</button>
        <button type="button" data-action="recipe-reuse" data-recipe-id="${escapeHtml(recipe.id)}">再次使用</button>
        <button type="button" class="danger" data-action="recipe-delete" data-recipe-id="${escapeHtml(recipe.id)}">删除</button>
      </div>
    </article>`).join("");
}

function handleRecipeListAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const recipe = findRecipe(button.dataset.recipeId);
  if (!recipe) return;
  const action = button.dataset.action;
  if (action === "recipe-detail") openRecipeDetail(recipe);
  if (action === "recipe-edit" || action === "recipe-reuse") openRecipeEditor(recipe);
  if (action === "recipe-delete") deleteRecipe(recipe.id);
}

function openRecipeDetail(recipe) {
  ui.recipeDetailId.value = recipe.id;
  ui.recipeDetailTitle.textContent = recipe.name || "配方明细";
  ui.recipeDetailMeta.textContent = `${recipeSourceLabel(recipe.source)} · ${recipe.processName || "-"} · ${formatDateTime(recipe.updatedAt || recipe.createdAt)}`;
  const metrics = recipe.result?.metrics?.folded || {};
  const metricNames = ["N", "P", "K", "总养分", "氯离子", "含水量", "PH值", "水溶磷", "水不溶物"]
    .filter((name) => Number.isFinite(Number(metrics[name])));
  ui.recipeDetailContent.innerHTML = `
    <div class="recipe-detail-summary"><span>配合式</span><strong>${escapeHtml(recipe.formulaText || "-")}</strong><span>实际成本</span><strong>${formatCurrency(recipe.result?.actualCost)}</strong><span>备注</span><strong>${escapeHtml(recipe.note || "-")}</strong></div>
    <div class="table-scroll"><table class="data-table recipe-detail-table"><thead><tr><th>原料</th><th>类别</th><th>kg/t</th><th>单价</th><th>成本</th></tr></thead><tbody>${(recipe.items || []).map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td>${formatNumber(item.kg, 0)}</td><td>${formatCurrency(item.price)}</td><td>${formatCurrency(item.cost)}</td></tr>`).join("")}</tbody></table></div>
    <div class="table-scroll"><table class="data-table compact-table recipe-detail-table"><thead><tr><th>指标</th><th>折算后</th></tr></thead><tbody>${metricNames.map((name) => `<tr><td>${escapeHtml(name)}</td><td>${formatMetric(name, Number(metrics[name]))}</td></tr>`).join("")}</tbody></table></div>`;
  ui.recipeDetailDialog.showModal();
}

function deleteRecipe(id) {
  const recipe = findRecipe(id);
  if (!recipe || !confirm(`删除配方“${recipe.name || "未命名配方"}”？`)) return;
  state.recipes = state.recipes.filter((entry) => entry.id !== id);
  saveState();
  if (ui.recipeDetailDialog.open) ui.recipeDetailDialog.close();
  renderRecipes();
  showToast("配方已删除");
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("zh-CN", { hour12: false });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "compound-fertilizer-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.processes) || !imported.settings) throw new Error("bad data");
      state = imported;
      state.recipes ||= [];
      state.activeTab = ["recommendations", "materials", "recipes"].includes(state.activeTab) ? state.activeTab : "recommendations";
      saveState();
      renderProcessOptions();
      renderAll();
      clearRecommendationResults();
    } catch (error) {
      alert("导入文件格式不正确。");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function toNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function optionalNumber(value) {
  if (String(value ?? "").trim() === "") return NaN;
  const number = toNumber(value, NaN);
  return number > 0 ? number : NaN;
}

function formatInput(value) {
  if (!Number.isFinite(Number(value))) return "";
  return String(Number(value));
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "-";
  return Number(value).toFixed(digits);
}

function formatCurrency(value) {
  if (!Number.isFinite(value)) return "-";
  return `￥${Number(value).toFixed(0)}`;
}

function formatMetric(name, value) {
  if (!Number.isFinite(value)) return "-";
  if (name === "PH值") return Number(value).toFixed(2);
  return `${Number(value).toFixed(2)}%`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (typeof module !== "undefined") {
  module.exports = {
    buildInitialState,
    generateRecommendations,
    calculateFormula,
    INDICATORS
  };
}
