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
const CHLORIDE_GRADES = {
  sulfur: { label: "硫基", maxExclusive: 3 },
  low: { label: "低氯", max: 15 },
  medium: { label: "中氯", max: 30 },
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
      ["ZG-C", "硝酸磷肥料浆(硝铵磷)", "氮源", 1296, 0, 0.995, true, [29, 9, 0, 12.5, 0, 0, 0.5, 0, 0, 1, 0, 2.8, 0, 0]],
      ["ZG-D", "尿素", "氮源", 1850, 0, 0.99, true, [46.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 7, 0, 0]],
      ["ZG-E", "碳酸氢铵", "氮源", 750, 0, 0.2, true, [17, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0]],
      ["ZG-F", "氯化铵", "氮源", 680, 460, 0.99, true, [25.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 66, 4.5, 0, 0]],
      ["ZG-G", "小硫铵", "氮源", 500, 200, 0.99, true, [14, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 4, 0, 0]],
      ["ZG-H", "硫酸铵", "氮源", 800, 0, 0.99, true, [20.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4.6, 0, 0]],
      ["ZG-I", "46一铵", "磷源", 3650, 0, 0.99, true, [8, 39, 0, 0, 0, 0, 0, 0, 0, 2, 0, 6.5, 0, 0]],
      ["ZG-J", "55一铵", "磷源", 4300, 0, 0.99, true, [10, 45, 0, 0, 0, 0, 0, 0, 0, 2, 0, 6.5, 80, 0]],
      ["ZG-K", "60一铵", "磷源", 4900, 0, 0.99, true, [10, 50, 0, 0, 0, 0, 0, 0, 0, 2, 0, 4.8, 0, 0]],
      ["ZG-L", "滤饼", "磷源", 1800, 160, 0.99, true, [7, 27, 0, 0, 0, 0, 0, 0, 0, 20, 0, 6.5, 30, 0]],
      ["ZG-M", "60%氯化钾", "钾源", 3300, 80, 0.99, true, [0, 0, 60, 0, 0, 0, 0, 0, 0, 2, 47, 7, 0, 0]],
      ["ZG-N", "62%硫酸钾", "钾源", 4300, 0, 0.99, true, [0, 0, 52, 0, 0, 0, 0, 0, 0, 2, 1.5, 7, 0, 0]],
      ["ZG-O", "62%氯化钾", "钾源", 3100, 0, 0.99, true, [0, 0, 57, 0, 0, 0, 0, 0, 0, 8, 47, 7, 0, 0]],
      ["ZG-P", "磷铵滤饼", "钾源", 900, 0, 0.99, true, [4.5, 29, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0]],
      ["ZG-Q", "黄腐酸钾", "微量元素", 2300, 0, 0.99, false, [0, 0, 0, 0, 90, 0, 0, 0, 0, 0, 0, 5.5, 0, 0]],
      ["ZG-R", "增效包3-ZX-45#(kg)", "微量元素", 0, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0]],
      ["ZG-S", "增效包6#(kg)", "微量元素", 12027, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0]],
      ["ZG-T", "硼酸", "微量元素", 0, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 5.5, 0, 0]],
      ["ZG-U", "粘合剂", "微量元素", 1080, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 98, 7, 0, 0]],
      ["ZG-V", "硫酸镁", "辅料(填充)", 200, 100, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 5.8, 0, 0]],
      ["ZG-W", "粘土", "辅料(填充)", 800, 0, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 8, 0, 0]],
      ["ZG-X", "腐殖酸", "辅料(填充)", 400, 0, 0.99, true, [0, 0, 0, 0, 85, 0, 4, 0, 0, 25, 0, 8, 0, 0]],
      ["ZG-Y", "返料", "返料", 2000, 0, 0.99, true, [18, 4, 4, 0, 0, 0, 0, 0, 0, 4, 28, 0, 0, 0]]
    ]
  },
  {
    name: "挤压",
    target: { n: 30, p: 10, k: 5 },
    finishedMoisture: 4,
    processingFee: 180,
    materials: [
      ["JY-C", "硝酸磷肥料浆(硝铵磷)", "氮源", 1296, 0, 0.995, true, [29, 9, 0, 12.5, 0, 0, 0.5, 0, 0, 1, 0, 2.8, 0, 0]],
      ["JY-D", "尿素", "氮源", 1850, 240, 0.99, true, [46.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 7, 0, 0]],
      ["JY-E", "碳酸氢铵", "氮源", 800, 0, 0.2, true, [17, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 0, 0]],
      ["JY-F", "氯化铵", "氮源", 680, 100, 0.99, true, [25.4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 66, 4.5, 0, 0]],
      ["JY-G", "三等品", "氮源", 250, 0, 0.99, true, [10, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 4, 0, 0]],
      ["JY-H", "硫酸铵", "氮源", 800, 330, 0.99, true, [20.5, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 4, 0, 0]],
      ["JY-I", "白肥", "磷源", 900, 0, 0.99, true, [0, 25, 0, 0, 0, 0, 0, 0, 0, 6, 0, 5, 0, 0]],
      ["JY-J", "一铵60%", "磷源", 4300, 170, 0.99, true, [10, 45, 0, 0, 0, 0, 0, 0, 0, 3, 0, 6.5, 0, 8]],
      ["JY-K", "小一铵", "磷源", 1800, 0, 0.99, true, [7, 27, 0, 0, 0, 0, 0, 0, 0, 20, 0, 6, 0, 1]],
      ["JY-L", "氯化钾", "钾源", 3300, 160, 0.99, true, [0, 0, 60, 0, 0, 0, 0, 0, 0, 3, 47, 6.5, 0, 2]],
      ["JY-M", "氯化钾(低价)", "钾源", 2310, 0, 0.99, true, [0, 0, 47, 0, 0, 0, 0, 0, 0, 6, 47, 5, 0, 0]],
      ["JY-N", "硫酸钾", "钾源", 4100, 0, 0.99, true, [0, 0, 52, 0, 0, 0, 0, 0, 0, 2, 0, 7, 0, 0]],
      ["JY-O", "磷铵滤饼", "钾源", 900, 0, 0.99, true, [4.5, 29, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 15]],
      ["JY-P", "黄腐酸钾", "微量元素", 2300, 0, 0.99, false, [0, 0, 0, 0, 90, 0, 0, 0, 0, 0, 0, 5.5, 0, 0]],
      ["JY-Q", "增效包3-ZX-45#(kg)", "微量元素", 0, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 40]],
      ["JY-R", "增效包6#(kg)", "微量元素", 12027, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 40]],
      ["JY-S", "硼酸", "微量元素", 0, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 5.5, 0, 1.8]],
      ["JY-T", "粘合剂", "微量元素", 1100, 0, 0.99, false, [0, 0, 0, 0, 0, 0, 0, 0, 99.7, 0, 99, 7, 0, 1.5]],
      ["JY-U", "硫酸镁", "辅料(填充)", 170, 0, 0.99, true, [10, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 5.8, 0, 0.8]],
      ["JY-V", "粘土", "辅料(填充)", 200, 0, 0.99, true, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 8, 0, 100]],
      ["JY-W", "腐殖酸", "辅料(填充)", 120, 0, 0.99, true, [5, 0, 0, 0, 85, 0, 4, 0, 0, 25, 0, 8, 0, 100]],
      ["JY-X", "返料", "返料", 1500, 0, 0.99, true, [11.62, 15.97, 15.32, 0, 0, 0, 0, 0, 0, 6, 14, 0, 0, 0]]
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
    const formulaText = `${seed.target.n}-${seed.target.p}-${seed.target.k}`;
    settings[seed.name] = {
      formulaText,
      totalNutrientsMin: seed.target.n + seed.target.p + seed.target.k,
      nutrientDrop: 1,
      nutrientReductionPriority: [],
      chlorideGrade: seed.name === "转鼓" ? "medium" : "low",
      waterSolublePMin: "",
      targetN: seed.target.n,
      targetP: seed.target.p,
      targetK: seed.target.k,
      targetBasis: "folded",
      maxMaterialCount: 4,
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
    settings
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
    return parsed;
  } catch (error) {
    return buildInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = typeof localStorage === "undefined" ? buildInitialState() : loadState();
let latestCandidates = [];
let toastTimer = null;

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
    const button = event.target.closest("button[data-material-id]");
    if (!button) return;
    openResultMaterialInfo(Number(button.dataset.candidateIndex), button.dataset.materialId);
  });

  ui.saveResultMaterialButton.addEventListener("click", saveResultMaterialInfo);

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
  ui.processSelect.innerHTML = state.processes
    .map((process) => `<option value="${escapeHtml(process.name)}">${escapeHtml(process.name)}</option>`)
    .join("");
  ui.processSelect.value = state.processName;
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
}

function switchTab(tabName) {
  state.activeTab = tabName === "materials" ? "materials" : "recommendations";
  renderTabState();
  saveState();
}

function renderTabState() {
  const activeTab = state.activeTab === "materials" ? "materials" : "recommendations";
  ui.tabButtons?.forEach((button) => {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  ui.recommendationsView.hidden = activeTab !== "recommendations";
  ui.materialsView.hidden = activeTab !== "materials";
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
    summary.textContent = selected.size ? `${selected.size} 项已选` : "未选择";
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
    formulaText: "",
    totalNutrientsMin: "",
    nutrientDrop: 1,
    nutrientReductionPriority: [],
    chlorideGrade: "medium",
    waterSolublePMin: "",
    maxMaterialCount: 4,
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
  settings.targetBasis = "folded";
  state.settings[process.name].constraints ||= defaultConstraints(process.name);
  return state.settings[process.name];
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
  return process?.name === "转鼓";
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
  if (maxMaterialCount < 4) {
    return { candidates: [], error: "当前求解至少需要 4 种原料，请将原料数量上限设为 4-6。" };
  }

  const finishedMoisture = toNumber(settings.finishedMoisture, process.finishedMoisture);
  const processingFee = toNumber(settings.processingFee, process.processingFee);
  const nutrientDrop = Math.min(Math.max(toNumber(settings.nutrientDrop, 1), 0), SINGLE_NUTRIENT_STANDARD_TOLERANCE);
  const nutrientPriority = normalizeNutrientPriority(settings.nutrientReductionPriority);
  const ranges = buildNutrientRanges(targets, nutrientDrop, nutrientPriority);
  const totalNutrientsMin = toNumber(settings.totalNutrientsMin, targets.N + targets.P + targets.K);
  const waterSolubleTarget = supportsWaterSoluble(process) ? optionalNumber(settings.waterSolublePMin) : NaN;
  const materials = process.materials.filter((material) => (
    material.enabled &&
    material.maxKg > 0 &&
    (!Number.isFinite(waterSolubleTarget) || prop(material, "N") > 0 || prop(material, "P") > 0 || prop(material, "K") > 0)
  ));
  if (materials.length < 4) {
    return { candidates: [], error: "至少需要启用 4 个原料。" };
  }

  const candidates = [];
  const materialCounts = [];
  for (let count = 4; count <= maxMaterialCount; count += 1) materialCounts.push(count);
  const targetGrid = Number.isFinite(waterSolubleTarget)
    ? nutrientTargetGridForWater(ranges, nutrientPriority, targets)
    : nutrientTargetGrid(ranges, totalNutrientsMin, nutrientPriority, targets);
  const searchTargetGrid = nutrientPriority.length
    ? targetGrid.slice(0, Number.isFinite(waterSolubleTarget) ? 8 : 24)
    : targetGrid;
  const waterTargetLevels = [Number.isFinite(waterSolubleTarget) ? waterSolubleTarget : null];
  const candidateLimit = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 24 : 48)
    : (Number.isFinite(waterSolubleTarget) ? 8 : 12);
  const searchBudget = nutrientPriority.length
    ? (Number.isFinite(waterSolubleTarget) ? 2400 : 8000)
    : Number.POSITIVE_INFINITY;
  let searchSteps = 0;
  let stopSearch = false;
  for (const solveWaterTarget of waterTargetLevels) {
    const levelStart = candidates.length;
    for (const materialCount of materialCounts) {
      const combos = combinations(materials.length, materialCount);
      if (nutrientPriority.length) combos.sort((left, right) => materialComboPrice(left, materials) - materialComboPrice(right, materials));
      for (const combo of combos) {
        const selected = combo.map((index) => materials[index]);
        if (!requiredIds.every((id) => selected.some((material) => material.id === id))) continue;
        if (!comboCanContribute(selected)) continue;
        if (Number.isFinite(solveWaterTarget) && !comboCanReachWaterTarget(selected, solveWaterTarget)) continue;

        for (const gridTarget of searchTargetGrid) {
          if (searchSteps >= searchBudget) {
            stopSearch = true;
            break;
          }
          searchSteps += 1;
          const solved = Number.isFinite(solveWaterTarget)
            ? solveForMaterialsWithWaterTarget(selected, gridTarget, finishedMoisture, solveWaterTarget)
            : solveForMaterials(selected, gridTarget, "folded", finishedMoisture);
          const solvedOptions = Array.isArray(solved?.[0]) ? solved : [solved];

          for (const solvedOption of solvedOptions) {
            if (!solvedOption) continue;
            const quantities = roundedQuantityMap(selected, solvedOption);
            if (!quantities) continue;

            const candidate = calculateFormula(process, quantities, finishedMoisture, processingFee);
            if (!candidate) continue;
            const usedItems = candidate.items.filter((item) => item.kg > 0.05);
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
      if (candidates.length > levelStart && !Number.isFinite(solveWaterTarget) && !nutrientPriority.length) break;
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

function nutrientTargetGridForWater(ranges, nutrientPriority = [], targets = {}) {
  const grid = [];
  for (let n = ranges.N.min; n <= ranges.N.max + 0.0001; n += 0.5) {
    for (let p = ranges.P.min; p <= ranges.P.max + 0.0001; p += 0.5) {
      grid.push({
        N: Number(n.toFixed(2)),
        P: Number(p.toFixed(2)),
        K: Number(ranges.K.min.toFixed(2))
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

function compareNutrientReduction(left, right, nutrientPriority) {
  for (const name of nutrientPriority) {
    const difference = left.metrics.folded[name] - right.metrics.folded[name];
    if (Math.abs(difference) > 0.0001) return difference;
  }
  return 0;
}

function comboCanContribute(materials) {
  return ["N", "P", "K"].every((name) => materials.some((material) => prop(material, name) > 0));
}

function comboCanReachWaterTarget(materials, target) {
  const phosphorusMaterials = materials.filter((material) => prop(material, "P") > 0);
  if (!phosphorusMaterials.length) return false;
  const hasLower = phosphorusMaterials.some((material) => prop(material, "水溶磷") <= target);
  const hasHigher = phosphorusMaterials.some((material) => prop(material, "水溶磷") >= target);
  return hasLower && hasHigher;
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

function solveForMaterials(materials, targets, basis, finishedMoisture) {
  if (materials.length > 4) {
    return solveBoundedMaterialSystem(materials, targets, finishedMoisture, null, basis);
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

function solveForMaterialsWithWaterTarget(materials, targets, finishedMoisture, waterSolubleTarget) {
  if (materials.length > 4) {
    return solveBoundedMaterialSystem(materials, targets, finishedMoisture, waterSolubleTarget, "folded");
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

function solveBoundedMaterialSystem(materials, targets, finishedMoisture, equationWaterTarget, basis) {
  const omittedNutrients = Number.isFinite(equationWaterTarget) ? ["K", "P", "N"] : [null];
  const basisChoices = combinations(materials.length, 4);
  const solutions = [];
  const seenSolutions = new Set();

  for (const omittedNutrient of omittedNutrients) {
    const equations = materialEquations(materials, targets, finishedMoisture, equationWaterTarget, basis, omittedNutrient);
    for (const basisChoice of basisChoices) {
      const extraIndexes = materials.map((_, index) => index).filter((index) => !basisChoice.includes(index));
      const boundOptions = extraIndexes.map((index) => {
        const minimumKg = Math.min(10, materials[index].maxKg);
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
            const minimumKg = Math.min(10, materials[index].maxKg);
            return value >= minimumKg - 0.05 && value <= materials[index].maxKg + 0.05;
          });
          if (!valid) return null;
          const key = result.map((value) => Math.round(value * 100) / 100).join(",");
          if (seenSolutions.has(key)) return null;
          seenSolutions.add(key);
          solutions.push(result);
          solutions.sort((left, right) => (
            materialSolutionScore(materials, left, targets, finishedMoisture, equationWaterTarget) -
            materialSolutionScore(materials, right, targets, finishedMoisture, equationWaterTarget)
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

function materialSolutionScore(materials, quantities, targets, finishedMoisture, waterSolubleTarget) {
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
  score += Math.max(0, metrics.chloride - 15) * 0.05;
  if (Number.isFinite(waterSolubleTarget)) score += Math.abs(metrics.water - waterSolubleTarget) * 0.2;
  return score;
}

function materialEquations(materials, targets, finishedMoisture, waterSolubleTarget, basis, omittedNutrient) {
  const equations = [{
    coefficients: materials.map(() => 1),
    rhs: 1000
  }];
  const nutrientNames = (Number.isFinite(waterSolubleTarget) ? ["N", "P", "K"].filter((name) => name !== omittedNutrient) : ["N", "P", "K"]);
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
  } else if (omittedNutrient !== null) {
    equations.push({
      coefficients: materials.map((material) => {
        const y = yieldCoefficient(material, finishedMoisture);
        return basis === "folded" ? prop(material, omittedNutrient) - targets[omittedNutrient] * y : prop(material, omittedNutrient);
      }),
      rhs: basis === "folded" ? 0 : targets[omittedNutrient] * 1000
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
    const special = specialMetric(name, items, yieldKg);
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

function specialMetric(name, items, yieldKg) {
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
  if (Number.isFinite(grade.maxExclusive) && chloride >= grade.maxExclusive) return false;
  if (Number.isFinite(grade.max) && chloride > grade.max + 0.0001) return false;

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
  if (supportsWaterSoluble(process) && candidate.metrics.folded["水溶磷"]) names.push("水溶磷");
  if (candidate.metrics.folded["水不溶物"]) names.push("水不溶物");
  ["硝氮(N)", "有机质", "Mg(镁)", "Ca(钙)", "B(硼)", "Zn(锌)"].forEach((name) => {
    if (candidate.metrics.folded[name]) names.push(name);
  });
  return names;
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
