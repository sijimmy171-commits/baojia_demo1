import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Archive,
  ArrowRight,
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  Coins,
  Cpu,
  Download,
  FileSpreadsheet,
  FileText,
  Folder,
  ListTodo,
  MessageSquare,
  Mic,
  Paperclip,
  PlusCircle,
  Search,
  Send,
  Trash2,
  X,
} from 'lucide-react';

const PROJECTS_PER_PAGE = 5;
const SUB_TAB_CATEGORIES = ['格兰', '端子', '壳体', '防雨罩', '包装', '其他'];
const GROUP_LABELS = ['今天', '昨天', '近7天'];

const GLAND_MODEL_OPTIONS = ['BDM-H', 'BDM-II', 'BDM-III'];
const GLAND_ARMORED_OPTIONS = ['铠装', '非铠装'];
const GLAND_THREAD_OPTIONS = ['M20×1.5', 'M25×1.5', 'M32×1.5', 'NPT1/2'];
const GLAND_MATERIAL_OPTIONS = ['316L', '304', '黄铜镀镍', '工程塑料'];
const INSTALL_DIRECTION_OPTIONS = ['下进下出', '侧进侧出', '上进下出'];

const TERMINAL_BRAND_OPTIONS = ['菲尼克斯', '魏德米勒', 'WAGO'];
const TERMINAL_CURRENT_OPTIONS = ['10A', '20A', '32A', '60A', '100A'];
const TERMINAL_EXPLOSION_OPTIONS = ['增安型', '隔爆型', '本安型'];

const SHELL_DIMENSION_OPTIONS = ['300×200×150', '400×300×250', '420×320×260', '500×400×300'];
const SHELL_EXPLOSION_OPTIONS = ['Ex eb IIC T6 Gb/Ex tb IIIC T80℃ Db', 'Ex db IIC T6 Gb', 'Ex eb mb IIC T5 Gb'];
const SHELL_MATERIAL_OPTIONS = ['不锈钢 316', '不锈钢 304', '碳钢喷塑'];
const SHELL_THICKNESS_OPTIONS = ['标准薄型', '标准厚型', '加厚型'];

const PACKAGE_STYLE_OPTIONS = ['木箱', '纸箱', '免熏蒸木箱'];
const PACKAGE_MARK_OPTIONS = ['标准铭牌', '客户定制铭牌'];
const RAIN_COVER_REQUIRED_OPTIONS = ['需要', '不需要'];
const RAIN_COVER_SIZE_OPTIONS = ['标准尺寸', '加长型', '加宽型', '加高型'];
const RAIN_COVER_SHELL_TYPE_OPTIONS = ['立式壳体', '卧式壳体', '挂壁式壳体'];
const RAIN_COVER_MATERIAL_OPTIONS = ['不锈钢 316', '不锈钢 304', '碳钢喷塑'];
const RAIN_COVER_STYLE_OPTIONS = ['标准防雨罩', '斜顶式', '加筋式', '带滴水边'];
const OTHER_FIELD_TYPE_OPTIONS = ['备注', '客户要求', '特殊附件'];

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function renderRichMessage(text, isAi) {
  return String(text)
    .split('**')
    .map((part, index) => (index % 2 === 1 ? <strong key={`${part}-${index}`} className={isAi ? 'ai-highlight' : ''}>{part}</strong> : part));
}

function makeChat() {
  return [
    { id: 1, sender: 'ai', text: '已为您创建“连云港神宇石化”项目，您可以直接补充需求或上传图纸。', time: '14:00' },
    { id: 2, sender: 'user', text: '我要做一个不锈钢防爆接线箱，1进6出，M20×1.5，下进下出，Ex eb IIC T6 Gb/Ex tb IIIC T80℃ Db，IP66，带防雨罩。', time: '14:02' },
    { id: 3, sender: 'ai', text: '已为您解析需求。\n1. **强依赖项缺失**：端子数量、电流大小。\n2. **弱依赖项默认**：壳体厚度、端子品牌、防雨罩方式已先按标准方案预设。', time: '14:03' },
    { id: 4, sender: 'user', text: '30个端子，20A。', time: '14:05' },
    { id: 5, sender: 'ai', text: '收到。根据规则引擎估算，箱体尺寸可优先选择 **400×300×250**，已同步生成首版 BOM 和报价清单。', time: '14:05' },
    { id: 6, sender: 'user', text: '客户反馈需要改成 420×320×260，格兰调整为 M20/M25/M32 各一套。', time: '14:18' },
    { id: 7, sender: 'ai', text: '已记录为“客户反馈修订”方案，可从当前报价版本直接派生新版本并继续完善 BOM 和报价。', time: '14:19' },
  ];
}

function makeGlandRows(versionId = 'v1.0') {
  if (versionId === 'v1.1') {
    return [
      { id: 'g1', model: 'BDM-H', armored: '铠装', threadSpec: 'M20×1.5', material: '316L', installDirection: '下进下出', quantity: '4' },
      { id: 'g2', model: 'BDM-H', armored: '铠装', threadSpec: 'M25×1.5', material: '316L', installDirection: '下进下出', quantity: '2' },
      { id: 'g3', model: 'BDM-H', armored: '铠装', threadSpec: 'M32×1.5', material: '316L', installDirection: '下进下出', quantity: '1' },
      { id: 'g4', model: 'BDM-H', armored: '铠装', threadSpec: 'M20×1.5', material: '316L', installDirection: '下进下出', quantity: '1' },
    ];
  }

  return [
    { id: 'g1', model: 'BDM-H', armored: '铠装', threadSpec: 'M20×1.5', material: '316L', installDirection: '下进下出', quantity: '4' },
    { id: 'g2', model: 'BDM-H', armored: '铠装', threadSpec: 'M25×1.5', material: '316L', installDirection: '下进下出', quantity: '3' },
    { id: 'g3', model: 'BDM-H', armored: '铠装', threadSpec: 'M32×1.5', material: '316L', installDirection: '下进下出', quantity: '1' },
  ];
}

function makeTerminalRows(versionId = 'v1.0') {
  if (versionId === 'v1.1') {
    return [{ id: 't1', brand: '菲尼克斯', current: '20A', explosionType: '增安型', quantity: '30', wireSection: '2.5mm2' }];
  }
  return [{ id: 't1', brand: '', current: '', explosionType: '', quantity: '', wireSection: '' }];
}

function makeParameters(versionId = 'v1.0') {
  const isLatest = versionId === 'v1.1';
  return [
    { id: 'shell-dimension', category: '壳体', field: '箱体尺寸', value: isLatest ? '420×320×260' : '400×300×250', dependency: 'strong', options: SHELL_DIMENSION_OPTIONS, note: '支持直接录入非标尺寸' },
    { id: 'shell-explosion', category: '壳体', field: '防爆等级', value: 'Ex eb IIC T6 Gb/Ex tb IIIC T80℃ Db', dependency: 'strong', options: SHELL_EXPLOSION_OPTIONS },
    { id: 'shell-material', category: '壳体', field: '材质', value: '不锈钢 316', dependency: 'strong', options: SHELL_MATERIAL_OPTIONS },
    { id: 'shell-thickness', category: '壳体', field: '厚度', value: '标准薄型', dependency: 'weak', options: SHELL_THICKNESS_OPTIONS, note: '可按客户要求改厚型' },
    { id: 'rain-required', category: '防雨罩', field: '是否需要', value: '需要', dependency: 'weak', options: RAIN_COVER_REQUIRED_OPTIONS },
    { id: 'rain-size', category: '防雨罩', field: '尺寸', value: isLatest ? '加高型' : '标准尺寸', dependency: 'weak', options: RAIN_COVER_SIZE_OPTIONS },
    { id: 'rain-shell-type', category: '防雨罩', field: '壳体类型', value: '立式壳体', dependency: 'weak', options: RAIN_COVER_SHELL_TYPE_OPTIONS },
    { id: 'rain-material', category: '防雨罩', field: '材质', value: '不锈钢 316', dependency: 'weak', options: RAIN_COVER_MATERIAL_OPTIONS },
    { id: 'rain-style', category: '防雨罩', field: '样式', value: '标准防雨罩', dependency: 'weak', options: RAIN_COVER_STYLE_OPTIONS },
    { id: 'package-style', category: '包装', field: '包装方式', value: '木箱', dependency: 'weak', options: PACKAGE_STYLE_OPTIONS },
    { id: 'package-mark', category: '包装', field: '铭牌要求', value: '标准铭牌', dependency: 'weak', options: PACKAGE_MARK_OPTIONS },
    { id: 'other-type', category: '其他', field: '其他字段类型', value: '', dependency: 'weak', options: OTHER_FIELD_TYPE_OPTIONS, note: '用于补充特殊商务或技术要求' },
    { id: 'other-content', category: '其他', field: '其他字段内容', value: '', dependency: 'weak', note: '可填写客户特别要求、交期、认证等' },
  ];
}

function makeQuotationItems(versionId = 'v1.0') {
  const isLatest = versionId === 'v1.1';
  return [
    { id: 'q1', code: '03.03.03.100006', name: '防爆接线箱壳体', brand: '-', model: isLatest ? '420×320×260' : '400×300×250', quantity: 1, unitPrice: isLatest ? 1788.71 : 1688.71, total: isLatest ? 1788.71 : 1688.71 },
    { id: 'q2', code: '03.07.02.000955', name: '防雨罩', brand: '-', model: isLatest ? '487×155×260' : '467×145×250', quantity: 1, unitPrice: isLatest ? 284.34 : 264.34, total: isLatest ? 284.34 : 264.34 },
    { id: 'q3', code: '03.02.21.000045', name: '接线端子', brand: '菲尼克斯', model: 'UK3N', quantity: 30, unitPrice: 1.757, total: 52.71 },
    { id: 'q4', code: '07.03.02.08.80032L', name: '格兰', brand: '-', model: 'BDM-H-M32×1.5-316L', quantity: 1, unitPrice: 70.5, total: 70.5 },
    { id: 'q5', code: '07.03.02.08.80029L', name: '格兰', brand: '-', model: 'BDM-H-M25×1.5-316L', quantity: isLatest ? 2 : 3, unitPrice: 51, total: isLatest ? 102 : 153 },
    { id: 'q6', code: '07.03.02.08.80027L', name: '格兰', brand: '-', model: 'BDM-H-M20×1.5-316L', quantity: isLatest ? 5 : 4, unitPrice: 40.5, total: isLatest ? 202.5 : 162 },
  ];
}

function makeVersionData(versionId = 'v1.0') {
  return {
    dimensions: { suggested: versionId === 'v1.1' ? '420×320×260' : '400×300×250', manual: '' },
    parameters: makeParameters(versionId),
    glandRows: makeGlandRows(versionId),
    terminalRows: makeTerminalRows(versionId),
    quotation: { items: makeQuotationItems(versionId) },
  };
}

function makeProject(index, overrides = {}) {
  const isPrimary = index === 1;
  const versions = isPrimary
    ? [
        { id: 'v1.0', label: 'V1.0 首版报价', timestamp: '2026-04-07 14:05:30', isLatest: false },
        { id: 'v1.1', label: 'V1.1 客户反馈修订', timestamp: '2026-04-07 14:19:00', isLatest: true },
      ]
    : [{ id: 'v1.0', label: 'V1.0 首版报价', timestamp: `2026-04-0${Math.min(index + 1, 9)} 10:00:00`, isLatest: true }];

  return {
    id: `proj-${index}`,
    dateGroup: index <= 4 ? '今天' : index <= 8 ? '昨天' : '近7天',
    info: {
      engineer: '测试员',
      client: isPrimary ? '连云港神宇石化机械设备...' : `江苏特种设备厂 ${index}期`,
      name: isPrimary ? '防爆接线箱非标定制' : `常规防爆接线箱采购-${index}`,
    },
    chat: isPrimary ? makeChat() : [],
    versions,
    data: versions.reduce((acc, version) => ({ ...acc, [version.id]: makeVersionData(version.id) }), {}),
    ...overrides,
  };
}

function createArchiveRecord(project, version, data, total, quoteNumber) {
  const params = data.parameters || [];
  const material = params.find((item) => item.field === '材质' && item.category === '壳体')?.value || '-';
  const explosionLevel = params.find((item) => item.field === '防爆等级')?.value || '-';
  const dimension = data.dimensions?.manual || data.dimensions?.suggested || '-';
  const wiring = data.glandRows?.map((item) => item.threadSpec).filter(Boolean).join(' / ') || '-';

  return {
    id: `${project.id}-${version.id}`,
    projectId: project.id,
    versionId: version.id,
    title: `${project.info.client} / ${project.info.name}`,
    client: project.info.client,
    versionLabel: version.label,
    archivedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    quoteNumber,
    total,
    dimensions: dimension,
    application: '防爆接线箱',
    productType: project.info.name,
    material,
    explosionLevel,
    wiring,
    matchScore: 96,
    matchHighlights: ['结构相近，BOM 构成高度重合', '壳体尺寸与格兰布置可直接复用'],
    matchDiffs: ['客户定制项与历史方案略有差异，建议人工复核后再引用'],
    quoteBreakdown: [
      { label: '壳体与机加工', amount: Number((total * 0.46).toFixed(2)) },
      { label: '端子及附件', amount: Number((total * 0.14).toFixed(2)) },
      { label: '格兰与辅材', amount: Number((total * 0.24).toFixed(2)) },
      { label: '包装与管理费', amount: Number((total * 0.16).toFixed(2)) },
    ],
    bomPreview: (data.quotation?.items || []).slice(0, 6).map((item) => ({ code: item.code, name: item.name, model: item.model, qty: item.quantity })),
  };
}

const INITIAL_PROJECTS = Array.from({ length: 12 }, (_, index) => makeProject(index + 1));
const INITIAL_ARCHIVES = [createArchiveRecord(INITIAL_PROJECTS[0], INITIAL_PROJECTS[0].versions[0], INITIAL_PROJECTS[0].data['v1.0'], 2370.26, '202604070054-A001-V10')];

function rowHasMissing(row, keys) {
  return keys.some((key) => !String(row[key] ?? '').trim());
}

function getMissingRequirementLabels(parameters, glandRows, terminalRows, dimensionValue) {
  const labels = new Set();
  parameters.forEach((param) => {
    if (param.dependency === 'strong' && !String(param.value ?? '').trim()) labels.add(`${param.category} - ${param.field}`);
  });
  glandRows.forEach((row, index) => {
    if (!String(row.model ?? '').trim()) labels.add(`格兰第${index + 1}行 - 型号`);
    if (!String(row.armored ?? '').trim()) labels.add(`格兰第${index + 1}行 - 铠装`);
    if (!String(row.threadSpec ?? '').trim()) labels.add(`格兰第${index + 1}行 - 螺纹规格`);
  });
  terminalRows.forEach((row, index) => {
    if (!String(row.current ?? '').trim()) labels.add(`端子第${index + 1}行 - 电流`);
    if (!String(row.explosionType ?? '').trim()) labels.add(`端子第${index + 1}行 - 防爆类型`);
    if (!String(row.quantity ?? '').trim()) labels.add(`端子第${index + 1}行 - 数量`);
  });
  if (!String(dimensionValue ?? '').trim()) labels.add('壳体 - 箱体尺寸');
  return Array.from(labels);
}

function getFieldSuggestions(category, field) {
  if (category === '格兰') {
    if (field === '型号') return GLAND_MODEL_OPTIONS;
    if (field === '铠装') return GLAND_ARMORED_OPTIONS;
    if (field === '螺纹规格') return GLAND_THREAD_OPTIONS;
    if (field === '材质') return GLAND_MATERIAL_OPTIONS;
    if (field === '安装方向') return INSTALL_DIRECTION_OPTIONS;
  }
  if (category === '端子') {
    if (field === '品牌') return TERMINAL_BRAND_OPTIONS;
    if (field === '电流') return TERMINAL_CURRENT_OPTIONS;
    if (field === '防爆类型') return TERMINAL_EXPLOSION_OPTIONS;
  }
  if (category === '壳体') {
    if (field === '箱体尺寸') return SHELL_DIMENSION_OPTIONS;
    if (field === '防爆等级') return SHELL_EXPLOSION_OPTIONS;
    if (field === '材质') return SHELL_MATERIAL_OPTIONS;
    if (field === '厚度') return SHELL_THICKNESS_OPTIONS;
  }
  if (category === '防雨罩') {
    if (field === '是否需要') return RAIN_COVER_REQUIRED_OPTIONS;
    if (field === '尺寸') return RAIN_COVER_SIZE_OPTIONS;
    if (field === '壳体类型') return RAIN_COVER_SHELL_TYPE_OPTIONS;
    if (field === '材质') return RAIN_COVER_MATERIAL_OPTIONS;
    if (field === '样式') return RAIN_COVER_STYLE_OPTIONS;
  }
  if (category === '包装') {
    if (field === '包装方式') return PACKAGE_STYLE_OPTIONS;
    if (field === '铭牌要求') return PACKAGE_MARK_OPTIONS;
  }
  if (category === '其他' && field === '其他字段类型') return OTHER_FIELD_TYPE_OPTIONS;
  return [];
}

function updateVersionData(projects, projectId, versionId, updater) {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    const currentData = project.data[versionId];
    return { ...project, data: { ...project.data, [versionId]: updater(cloneDeep(currentData)) } };
  });
}

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [archivedProjectIds, setArchivedProjectIds] = useState([]);
  const [activeNav, setActiveNav] = useState('assistant');
  const [activeProjectId, setActiveProjectId] = useState('proj-1');
  const [activeVersionId, setActiveVersionId] = useState('v1.1');
  const [activeMainTab, setActiveMainTab] = useState('requirements');
  const [activeSubCategory, setActiveSubCategory] = useState('格兰');
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archiveQuickFilter, setArchiveQuickFilter] = useState('all');
  const [inputText, setInputText] = useState('');
  const [projectPage, setProjectPage] = useState(1);
  const [projectPageInput, setProjectPageInput] = useState('1');
  const [selectedArchiveId, setSelectedArchiveId] = useState(INITIAL_ARCHIVES[0]?.id || '');
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);
  const chatScrollRef = useRef(null);

  const archivedProjectIdSet = useMemo(() => new Set(archivedProjectIds), [archivedProjectIds]);

  const orderedFilteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return GROUP_LABELS.flatMap((group) =>
      projects.filter((project) => {
        if (project.dateGroup !== group) return false;
        if (archivedProjectIdSet.has(project.id)) return false;
        if (!query) return true;
        return project.info.client.toLowerCase().includes(query) || project.info.name.toLowerCase().includes(query);
      }),
    );
  }, [archivedProjectIdSet, projects, searchQuery]);

  const totalProjectPages = Math.max(1, Math.ceil(orderedFilteredProjects.length / PROJECTS_PER_PAGE));

  const pagedProjects = useMemo(() => {
    const start = (projectPage - 1) * PROJECTS_PER_PAGE;
    const pageItems = orderedFilteredProjects.slice(start, start + PROJECTS_PER_PAGE);
    return pageItems.reduce((acc, project) => {
      if (!acc[project.dateGroup]) acc[project.dateGroup] = [];
      acc[project.dateGroup].push(project);
      return acc;
    }, {});
  }, [orderedFilteredProjects, projectPage]);

  const currentProject = useMemo(() => projects.find((project) => project.id === activeProjectId) || projects[0], [activeProjectId, projects]);
  const currentVersion = currentProject?.versions.find((version) => version.id === activeVersionId) || currentProject?.versions[currentProject.versions.length - 1];
  const currentData = currentProject?.data?.[currentVersion?.id];
  const currentChat = currentProject?.chat || [];
  const todayDateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
  const quoteNumber = currentVersion ? `202604070054-A001-${currentVersion.id.toUpperCase().replace('.', '')}` : '202604070054-A001-V00';
  const currentQuoteTotal = (currentData?.quotation?.items || []).reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const currentCategoryParams = (currentData?.parameters || []).filter((item) => item.category === activeSubCategory);

  const filteredArchives = useMemo(() => {
    const query = archiveSearch.trim().toLowerCase();
    return archives.filter((item) => {
      const matchesQuery = !query || [item.title, item.client, item.quoteNumber, item.productType, item.material, item.explosionLevel, item.wiring, item.dimensions].join(' ').toLowerCase().includes(query);
      const matchesFilter =
        archiveQuickFilter === 'all' ||
        (archiveQuickFilter === 'same-material' && item.material?.includes('316')) ||
        (archiveQuickFilter === 'same-explosion' && item.explosionLevel?.includes('Ex eb')) ||
        (archiveQuickFilter === 'same-structure' && item.wiring?.includes('M20'));
      return matchesQuery && matchesFilter;
    });
  }, [archiveQuickFilter, archiveSearch, archives]);

  const selectedArchive = filteredArchives.find((item) => item.id === selectedArchiveId) || filteredArchives[0] || null;
  const recommendedArchive = useMemo(() => [...archives].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))[0] || null, [archives]);

  useEffect(() => {
    if (currentProject && !currentProject.versions.some((version) => version.id === activeVersionId)) {
      setActiveVersionId(currentProject.versions[currentProject.versions.length - 1].id);
    }
  }, [activeVersionId, currentProject]);

  useEffect(() => {
    if (projectPage > totalProjectPages) {
      setProjectPage(totalProjectPages);
      setProjectPageInput(String(totalProjectPages));
    }
  }, [projectPage, totalProjectPages]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [currentChat.length, activeProjectId]);

  useEffect(() => {
    if (filteredArchives.length && !filteredArchives.some((item) => item.id === selectedArchiveId)) {
      setSelectedArchiveId(filteredArchives[0].id);
    }
  }, [filteredArchives, selectedArchiveId]);

  const updateCurrentVersion = (updater) => {
    if (!currentProject || !currentVersion) return;
    setProjects((prev) => updateVersionData(prev, currentProject.id, currentVersion.id, updater));
  };

  const updateParamValue = (paramId, value) => {
    updateCurrentVersion((data) => ({
      ...data,
      parameters: data.parameters.map((item) => (item.id === paramId ? { ...item, value } : item)),
      dimensions: data.parameters.some((item) => item.id === paramId && item.field === '箱体尺寸') ? { ...data.dimensions, manual: value } : data.dimensions,
    }));
  };

  const updateGlandRow = (rowId, field, value) => updateCurrentVersion((data) => ({ ...data, glandRows: data.glandRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)) }));
  const updateTerminalRow = (rowId, field, value) => updateCurrentVersion((data) => ({ ...data, terminalRows: data.terminalRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)) }));
  const addGlandRow = () => updateCurrentVersion((data) => ({ ...data, glandRows: [...data.glandRows, { id: `g-${Date.now()}`, model: '', armored: '', threadSpec: '', material: '', installDirection: '', quantity: '1' }] }));
  const addTerminalRow = () => updateCurrentVersion((data) => ({ ...data, terminalRows: [...data.terminalRows, { id: `t-${Date.now()}`, brand: '', current: '', explosionType: '', quantity: '', wireSection: '' }] }));
  const deleteGlandRow = (rowId) => updateCurrentVersion((data) => ({ ...data, glandRows: data.glandRows.filter((row) => row.id !== rowId) }));
  const deleteTerminalRow = (rowId) => updateCurrentVersion((data) => ({ ...data, terminalRows: data.terminalRows.filter((row) => row.id !== rowId) }));

  const addBomItem = () => updateCurrentVersion((data) => ({
    ...data,
    quotation: { ...data.quotation, items: [...(data.quotation?.items || []), { id: `custom-${Date.now()}`, code: 'NEW-CODE', name: '新增物料', brand: '-', model: '规格待定', quantity: 1, unitPrice: 0, total: 0 }] },
  }));

  const deleteBomItem = (itemId) => updateCurrentVersion((data) => ({
    ...data,
    quotation: { ...data.quotation, items: (data.quotation?.items || []).filter((item) => item.id !== itemId) },
  }));

  const updateBomItem = (itemId, field, value) => {
    updateCurrentVersion((data) => ({
      ...data,
      quotation: {
        ...data.quotation,
        items: (data.quotation?.items || []).map((item) => {
          if (item.id !== itemId) return item;
          const nextItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const quantity = Number(nextItem.quantity) || 0;
            const unitPrice = Number(nextItem.unitPrice) || 0;
            nextItem.total = Number((quantity * unitPrice).toFixed(2));
          }
          return nextItem;
        }),
      },
    }));
  };

  const goProjectPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalProjectPages);
    setProjectPage(nextPage);
    setProjectPageInput(String(nextPage));
  };

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text || !currentProject) return;
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
    const userMessage = { id: Date.now(), sender: 'user', text, time };
    const aiMessage = { id: Date.now() + 1, sender: 'ai', text: `已记录补充说明：${text}。我会继续沿当前项目对话上下文完善参数和报价。`, time };
    setProjects((prev) => prev.map((project) => (project.id === currentProject.id ? { ...project, chat: [...(project.chat || []), userMessage, aiMessage] } : project)));
    setInputText('');
  };

  const handleVersionChange = (nextVersionId) => {
    setActiveVersionId(nextVersionId);
    setActiveMainTab('requirements');
  };

  const handleCreateQuoteVersion = () => {
    if (!currentProject || !currentVersion || !currentData) return;
    const match = /^v(\d+)\.(\d+)$/i.exec(currentVersion.id || 'v1.0');
    const major = match ? Number(match[1]) : 1;
    const minor = match ? Number(match[2]) + 1 : 1;
    const nextId = `v${major}.${minor}`;
    const nextLabel = `V${major}.${minor} 客户反馈修订`;
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

    setProjects((prev) => prev.map((project) => {
      if (project.id !== currentProject.id) return project;
      return {
        ...project,
        versions: [...project.versions.map((version) => ({ ...version, isLatest: false })), { id: nextId, label: nextLabel, timestamp, isLatest: true }],
        data: { ...project.data, [nextId]: cloneDeep(project.data[currentVersion.id]) },
      };
    }));

    setActiveVersionId(nextId);
    setActiveMainTab('requirements');
    window.alert(`已基于 ${currentVersion.label} 派生新报价版本：${nextLabel}`);
  };

  const handleOpenBomTab = () => {
    if (!currentData) return;
    const dimensionValue = currentData.dimensions?.manual || currentData.dimensions?.suggested || '';
    const missingLabels = getMissingRequirementLabels(currentData.parameters || [], currentData.glandRows || [], currentData.terminalRows || [], dimensionValue);
    if (missingLabels.length > 0) {
      if (missingLabels[0].startsWith('格兰')) setActiveSubCategory('格兰');
      else if (missingLabels[0].startsWith('端子')) setActiveSubCategory('端子');
      else if (missingLabels[0].startsWith('壳体')) setActiveSubCategory('壳体');
      setActiveMainTab('requirements');
      window.alert(`当前还有以下强依赖参数未补齐，暂不能生成 BOM：\n- ${missingLabels.join('\n- ')}\n\n请先补充后再进入 BOM 物料清单。`);
      return;
    }
    setActiveMainTab('bom');
  };

  const handleArchiveCurrent = () => {
    if (!currentProject || !currentVersion || !currentData || !(currentData.quotation?.items || []).length) {
      window.alert('当前还没有可归档的报价清单，请先完善 BOM 和正式报价单。');
      return;
    }
    const record = createArchiveRecord(currentProject, currentVersion, currentData, currentQuoteTotal, quoteNumber);
    setArchives((prev) => [record, ...prev.filter((item) => item.id !== record.id)]);
    setArchivedProjectIds((prev) => (prev.includes(currentProject.id) ? prev : [currentProject.id, ...prev]));
    setSelectedArchiveId(record.id);
    setActiveNav('knowledge');
    window.alert('当前报价版本已归档到“历史报价单”。该项目将从近期报价项目中移出，但后续仍可从历史报价单继续报价。');
  };

  const handleResumeArchivedProject = () => {
    if (!selectedArchive) return;
    const targetProject = projects.find((project) => project.id === selectedArchive.projectId);
    if (!targetProject) {
      window.alert('未找到对应项目，暂时无法继续报价。');
      return;
    }

    const baseVersionId = selectedArchive.versionId;
    const baseData = targetProject.data?.[baseVersionId];
    if (!baseData) {
      window.alert('未找到对应报价版本数据，暂时无法继续报价。');
      return;
    }

    const parsedVersions = targetProject.versions
      .map((version) => {
        const match = /^v(\d+)\.(\d+)$/i.exec(version.id || '');
        if (!match) return null;
        return { id: version.id, major: Number(match[1]), minor: Number(match[2]) };
      })
      .filter(Boolean);

    const latestParsed = parsedVersions.sort((a, b) => (a.major - b.major) || (a.minor - b.minor)).at(-1);
    const nextMajor = latestParsed ? latestParsed.major : 1;
    const nextMinor = latestParsed ? latestParsed.minor + 1 : 1;
    const nextId = 'v' + nextMajor + '.' + nextMinor;
    const nextLabel = 'V' + nextMajor + '.' + nextMinor + ' 归档后继续报价';
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

    setProjects((prev) => prev.map((project) => {
      if (project.id !== targetProject.id) return project;
      return {
        ...project,
        versions: [...project.versions.map((version) => ({ ...version, isLatest: false })), { id: nextId, label: nextLabel, timestamp, isLatest: true }],
        data: {
          ...project.data,
          [nextId]: cloneDeep(baseData),
        },
      };
    }));

    setArchivedProjectIds((prev) => prev.filter((projectId) => projectId !== targetProject.id));
    setActiveProjectId(targetProject.id);
    setActiveVersionId(nextId);
    setActiveMainTab('requirements');
    setActiveSubCategory('格兰');
    setActiveNav('assistant');
    window.alert('已从 ' + selectedArchive.versionLabel + ' 派生新版本 ' + nextLabel + '，该项目已重新回到报价流程中。');
  };

  const handleCreateProject = () => {
    const now = new Date();
    const timestamp = now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const id = 'proj-' + Date.now();
    const version = { id: 'v1.0', label: 'V1.0 首版报价', timestamp, isLatest: true };
    const newProject = {
      id,
      dateGroup: '今天',
      info: {
        engineer: '测试员',
        client: '新建客户项目',
        name: '待补充需求',
      },
      chat: [
        { id: Date.now() + 1, sender: 'ai', text: '新项目已创建。您可以直接输入客户需求，我会持续保留整个项目对话，并协助生成报价版本、BOM 和正式报价单。', time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) },
      ],
      versions: [version],
      data: {
        'v1.0': makeVersionData('v1.0'),
      },
    };

    setProjects((prev) => [newProject, ...prev]);
    setArchivedProjectIds((prev) => prev.filter((projectId) => projectId !== id));
    setActiveProjectId(id);
    setActiveVersionId('v1.0');
    setActiveMainTab('requirements');
    setActiveSubCategory('格兰');
    setActiveNav('assistant');
    setSearchQuery('');
    setProjectPage(1);
    setProjectPageInput('1');
  };

  const openProject = (project) => {
    setActiveProjectId(project.id);
    setActiveVersionId(project.versions[project.versions.length - 1].id);
    setActiveMainTab('requirements');
    setActiveSubCategory('格兰');
    setActiveNav('assistant');
  };

  const categoryHasMissing = (category) => {
    if (!currentData) return false;
    if (category === '格兰') return (currentData.glandRows || []).some((row) => rowHasMissing(row, ['model', 'armored', 'threadSpec']));
    if (category === '端子') return (currentData.terminalRows || []).some((row) => rowHasMissing(row, ['current', 'explosionType', 'quantity']));
    if (category === '壳体') {
      const params = (currentData.parameters || []).filter((item) => item.category === '壳体' && item.dependency === 'strong');
      const hasMissingParam = params.some((item) => !String(item.value ?? '').trim());
      const dimensionValue = currentData.dimensions?.manual || currentData.dimensions?.suggested || '';
      return hasMissingParam || !String(dimensionValue).trim();
    }
    return (currentData.parameters || []).some((item) => item.category === category && item.dependency === 'strong' && !String(item.value ?? '').trim());
  };

  const renderSelectField = (label, value, options, onChange, placeholder, className = 'config-input', allowCustom = true) => {
    const isCustom = value && !options.includes(value);
    return (
      <div className="select-input-stack">
        <select value={isCustom ? '__custom__' : (value || '')} onChange={(event) => {
          if (event.target.value === '__custom__') {
            onChange(value || '');
            return;
          }
          onChange(event.target.value);
        }} className={className}>
          {!value && <option value="">{placeholder}</option>}
          {options.map((option) => <option key={`${label}-${option}`} value={option}>{option}</option>)}
          {allowCustom && <option value="__custom__">手动输入...</option>}
        </select>
        {allowCustom && (isCustom || !value) && <input value={value || ''} onChange={(event) => onChange(event.target.value)} className={`${className} custom-manual-input`} placeholder={`可手动输入${label}`} />}
      </div>
    );
  };

  const renderManualOrSelect = (category, field, value, onChange, placeholder, className, allowCustom = true) => {
    const suggestions = getFieldSuggestions(category, field);
    if (suggestions.length) return renderSelectField(field, value, suggestions, onChange, placeholder, className, allowCustom);
    return <input value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />;
  };

  const renderDefaultParamsTable = (params) => (
    <table className="params-table">
      <thead>
        <tr>
          <th>参数字段</th>
          <th>数据类型</th>
          <th>提取值 / 缺省值（可直接修改）</th>
        </tr>
      </thead>
      <tbody>
        {params.length > 0 ? params.map((param) => {
          const isMissing = param.dependency === 'strong' && !String(param.value ?? '').trim();
          return (
            <tr key={param.id}>
              <td className="param-field">{param.field}</td>
              <td>{param.dependency === 'strong' ? <span className="tag tag-strong">强依赖（必填）</span> : <span className="tag tag-weak">弱依赖（可调整）</span>}</td>
              <td>
                <div className="param-input-wrap">
                  {renderManualOrSelect(param.category, param.field, param.value, (nextValue) => updateParamValue(param.id, nextValue), param.note || '请输入', `param-input ${isMissing ? 'param-missing' : ''}`)}
                  {param.note && <span className="param-note">({param.note})</span>}
                </div>
              </td>
            </tr>
          );
        }) : <tr><td colSpan={3} className="params-empty">当前分类暂无结构化参数，可在“其他”中补充备注与客户要求。</td></tr>}
      </tbody>
    </table>
  );

  const renderGlandConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>格兰配置（多型号 × 数量）</h4></div>
        <div className="config-card-body">
          <div className="config-grid-headings config-grid-gland">
            <div className="config-grid-head required">型号</div>
            <div className="config-grid-head required">铠装</div>
            <div className="config-grid-head required">螺纹规格</div>
            <div className="config-grid-head">材质</div>
            <div className="config-grid-head">安装方向</div>
            <div className="config-grid-head">数量</div>
            <div className="config-grid-head">操作</div>
          </div>
          <div className="config-grid-rows">
            {(currentData?.glandRows || []).map((row) => (
              <div key={row.id} className="config-grid-row config-grid-gland">
                <div className="config-grid-cell">{renderManualOrSelect('格兰', '型号', row.model, (value) => updateGlandRow(row.id, 'model', value), '选择或输入型号', `config-input ${!String(row.model).trim() ? 'config-input-missing' : ''}`)}</div>
                <div className="config-grid-cell">{renderManualOrSelect('格兰', '铠装', row.armored, (value) => updateGlandRow(row.id, 'armored', value), '选择铠装类型', `config-input ${!String(row.armored).trim() ? 'config-input-missing' : ''}`)}</div>
                <div className="config-grid-cell">{renderManualOrSelect('格兰', '螺纹规格', row.threadSpec, (value) => updateGlandRow(row.id, 'threadSpec', value), '选择或输入螺纹规格', `config-input ${!String(row.threadSpec).trim() ? 'config-input-missing' : ''}`)}</div>
                <div className="config-grid-cell">{renderManualOrSelect('格兰', '材质', row.material, (value) => updateGlandRow(row.id, 'material', value), '选择或输入材质', 'config-input')}</div>
                <div className="config-grid-cell">{renderManualOrSelect('格兰', '安装方向', row.installDirection, (value) => updateGlandRow(row.id, 'installDirection', value), '选择安装方向', 'config-input')}</div>
                <div className="config-grid-cell"><input type="number" min="1" value={row.quantity} onChange={(event) => updateGlandRow(row.id, 'quantity', event.target.value)} className="config-input" /></div>
                <div className="config-grid-cell config-grid-action"><button className="icon-button danger" onClick={() => deleteGlandRow(row.id)}><Trash2 size={16} /></button></div>
              </div>
            ))}
          </div>
          <div className="config-footer-row">
            <button className="secondary-outline-button" onClick={addGlandRow}><PlusCircle size={15} />新增一行</button>
            <span>支持不同型号设置不同数量，型号、铠装、螺纹规格为强依赖参数。</span>
          </div>
        </div>
      </div>

      <div className="config-card-shell">
        <div className="config-card-header"><h4>关联物料配件</h4></div>
        <div className="config-card-body">
          <table className="detail-table related-table">
            <thead><tr><th>来源格兰</th><th>配件类别</th><th>物料编码</th><th>物料名称</th></tr></thead>
            <tbody>
              {(currentData?.glandRows || []).map((row, index) => (
                <tr key={`related-${row.id}`}>
                  <td>第{index + 1}行</td>
                  <td>关联配件</td>
                  <td>{row.threadSpec ? `AUTO-${row.threadSpec}` : '-'}</td>
                  <td>{row.model ? `${row.model} 关联件` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTerminalConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>端子配置（品牌 / 电流 / 防爆类型 / 数量）</h4></div>
        <div className="config-card-body">
          <div className="config-grid-headings config-grid-terminal">
            <div className="config-grid-head">品牌</div>
            <div className="config-grid-head required">电流</div>
            <div className="config-grid-head required">防爆类型</div>
            <div className="config-grid-head required">数量</div>
            <div className="config-grid-head">导线截面</div>
            <div className="config-grid-head">操作</div>
          </div>
          <div className="config-grid-rows">
            {(currentData?.terminalRows || []).map((row) => (
              <div key={row.id} className="config-grid-row config-grid-terminal">
                <div className="config-grid-cell">{renderManualOrSelect('端子', '品牌', row.brand, (value) => updateTerminalRow(row.id, 'brand', value), '选择或输入品牌', 'config-input')}</div>
                <div className="config-grid-cell">{renderManualOrSelect('端子', '电流', row.current, (value) => updateTerminalRow(row.id, 'current', value), '选择或输入电流', `config-input ${!String(row.current).trim() ? 'config-input-missing' : ''}`)}</div>
                <div className="config-grid-cell">{renderManualOrSelect('端子', '防爆类型', row.explosionType, (value) => updateTerminalRow(row.id, 'explosionType', value), '选择防爆类型', `config-input ${!String(row.explosionType).trim() ? 'config-input-missing' : ''}`)}</div>
                <div className="config-grid-cell"><input type="number" min="1" value={row.quantity} onChange={(event) => updateTerminalRow(row.id, 'quantity', event.target.value)} className={`config-input ${!String(row.quantity).trim() ? 'config-input-missing' : ''}`} /></div>
                <div className="config-grid-cell"><input value={row.wireSection} onChange={(event) => updateTerminalRow(row.id, 'wireSection', event.target.value)} placeholder="例如 2.5mm2" className="config-input" /></div>
                <div className="config-grid-cell config-grid-action"><button className="icon-button danger" onClick={() => deleteTerminalRow(row.id)}><Trash2 size={16} /></button></div>
              </div>
            ))}
          </div>
          <div className="config-footer-row"><button className="secondary-outline-button" onClick={addTerminalRow}><PlusCircle size={15} />新增一行</button><span>品牌、电流支持下拉选择；电流、防爆类型、数量为强依赖参数。</span></div>
        </div>
      </div>
    </div>
  );

  const renderShellConfig = () => {
    const shellParams = (currentData?.parameters || []).filter((item) => item.category === '壳体');
    return (
      <div className="requirements-inner">
        <div className="config-card-shell">
          <div className="config-card-header"><h4>壳体页（尺寸已并入壳体）</h4></div>
          <div className="config-card-body">
            <div className="config-grid-headings config-grid-fixed-4">
              {shellParams.map((item) => <div key={`${item.id}-head`} className={`config-grid-head ${item.dependency === 'strong' ? 'required' : ''}`}>{item.field}</div>)}
            </div>
            <div className="config-grid-rows"><div className="config-grid-row config-grid-fixed-4">{shellParams.map((item) => <div key={item.id} className="config-grid-cell">{renderManualOrSelect('壳体', item.field, item.value, (value) => updateParamValue(item.id, value), item.note || '请选择或输入', `config-input ${item.dependency === 'strong' && !String(item.value).trim() ? 'config-input-missing' : ''}`)}</div>)}</div></div>
            <div className="config-footer-row"><span>壳体的尺寸、防爆等级、材质、厚度均支持下拉建议，同时保留人工录入能力。</span></div>
          </div>
        </div>
      </div>
    );
  };

  const renderRainCoverConfig = () => renderDefaultParamsTable((currentData?.parameters || []).filter((item) => item.category === '防雨罩'));
  const renderPackagingConfig = () => renderDefaultParamsTable((currentData?.parameters || []).filter((item) => item.category === '包装'));
  const renderOtherConfig = () => renderDefaultParamsTable((currentData?.parameters || []).filter((item) => item.category === '其他'));

  const renderRequirementsPanel = () => (
    <div className="stack-layout">
      <div className="panel-card panel-card-p0">
        <div className="subtabs">{SUB_TAB_CATEGORIES.map((category) => <button key={category} className={`subtab ${activeSubCategory === category ? 'subtab-active' : ''}`} onClick={() => setActiveSubCategory(category)}>{category}{categoryHasMissing(category) && <span className="subtab-dot" />}</button>)}</div>
        {activeSubCategory === '格兰' && renderGlandConfig()}
        {activeSubCategory === '端子' && renderTerminalConfig()}
        {activeSubCategory === '壳体' && renderShellConfig()}
        {activeSubCategory === '防雨罩' && renderRainCoverConfig()}
        {activeSubCategory === '包装' && renderPackagingConfig()}
        {activeSubCategory === '其他' && renderOtherConfig()}
      </div>
    </div>
  );

  const renderBomPanel = () => {
    const items = currentData?.quotation?.items || [];
    if (!items.length) return <div className="empty-state"><AlertCircle size={48} /><p className="empty-copy"><span>当前还没有可展示的 BOM 清单</span><br />请先补齐需求参数并生成首版报价。</p></div>;
    return (
      <div className="full-height"><div className="sheet-card"><div className="sheet-header compact-header"><div><h3 className="sheet-heading"><Box size={16} className="sheet-heading-icon" />BOM 物料清单</h3><p className="sheet-help">当前报价版本对应的可编辑 BOM，支持人工补料、删料和调整数量。</p></div><div className="header-action-row"><button className="secondary-outline-button" onClick={addBomItem}><PlusCircle size={15} />新增物料</button><button className="bom-jump-button" onClick={() => setActiveMainTab('quotation_sheet')}>去正式报价单<ArrowRight size={14} /></button></div></div><div className="table-wrap"><table className="quote-table bom-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>品牌</th><th>规格型号</th><th className="center">数量</th><th className="center">操作</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><input value={item.code} onChange={(event) => updateBomItem(item.id, 'code', event.target.value)} className="bom-input mono-input" /></td><td><input value={item.name} onChange={(event) => updateBomItem(item.id, 'name', event.target.value)} className="bom-input strong-input" /></td><td><input value={item.brand} onChange={(event) => updateBomItem(item.id, 'brand', event.target.value)} className="bom-input" /></td><td><input value={item.model} onChange={(event) => updateBomItem(item.id, 'model', event.target.value)} className="bom-input" /></td><td className="center"><input type="number" value={item.quantity} onChange={(event) => updateBomItem(item.id, 'quantity', event.target.value)} className="bom-input center-input" /></td><td className="center"><button className="icon-button danger" onClick={() => deleteBomItem(item.id)}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div></div></div>
    );
  };

  const renderQuotationPanel = () => {
    const items = currentData?.quotation?.items || [];
    if (!items.length) return <div className="empty-state"><AlertCircle size={48} /><p className="empty-copy"><span>当前还没有正式报价单</span><br />请先生成并完善 BOM 物料清单。</p></div>;
    return (
      <div className="full-height"><div className="sheet-card"><div className="sheet-header"><div><h3>{currentProject?.info.name} - 正式报价单</h3><div className="sheet-meta"><span>报价编号: {quoteNumber}</span><span>报价版本: {currentVersion?.label}</span><span>客户: {currentProject?.info.client}</span><span>工程师: {currentProject?.info.engineer}</span><span>日期: {todayDateStr}</span></div></div><div className="header-action-row"><button className="secondary-outline-button" onClick={handleArchiveCurrent}><Archive size={15} />归档到历史报价单</button><button className="primary-button" onClick={() => setIsExportPreviewOpen(true)}><Download size={15} />导出 / 预览</button></div></div>{recommendedArchive && <div className="recommend-inline-bar"><span className="recommend-inline-label">历史推荐</span><span className="recommend-inline-main">{recommendedArchive.client}</span><span className="recommend-inline-score">相似度 {recommendedArchive.matchScore}%</span><span className="recommend-inline-text">亮点：{recommendedArchive.matchHighlights?.[0]}；差异：{recommendedArchive.matchDiffs?.[0]}</span><button className="mini-link-button mini-link-button-primary" onClick={() => { setSelectedArchiveId(recommendedArchive.id); setActiveNav('knowledge'); }}>查看历史报价单</button></div>}<div className="table-wrap"><table className="quote-table quote-sheet-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>规格型号</th><th className="center">数量</th><th className="right tinted">单价 (元)</th><th className="right tinted">小计 (元)</th><th className="center">操作</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><span className="mono">{item.code}</span></td><td><span className="strong">{item.name}</span></td><td>{item.model}</td><td className="center"><input type="number" value={item.quantity} onChange={(event) => updateBomItem(item.id, 'quantity', event.target.value)} /></td><td className="right tinted"><input type="number" step="0.01" value={item.unitPrice} onChange={(event) => updateBomItem(item.id, 'unitPrice', event.target.value)} /></td><td className="right tinted strong">¥{Number(item.total || 0).toFixed(2)}</td><td className="center"><button className="icon-button danger" onClick={() => deleteBomItem(item.id)}><Trash2 size={16} /></button></td></tr>)}</tbody><tfoot><tr className="quote-total-row"><td colSpan={4} /><td className="right tinted quote-total-label">合计</td><td className="right tinted quote-total-amount">¥{currentQuoteTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td /></tr></tfoot></table></div></div></div>
    );
  };

  const renderAssistantView = () => (
    <><header className="page-header"><div><h1>接线箱报价助手</h1><p>左侧保留整个项目对话，右侧按报价版本维护需求参数、BOM 和正式报价单。</p></div></header><main className="assistant-layout"><section className="chat-panel"><div className="chat-panel-head"><div className="chat-project-meta"><strong>{currentProject?.info.engineer}</strong><span>{currentProject?.info.client}</span></div><div className="chat-project-note">项目对话持续保留，不随版本切换覆盖</div></div><div className="chat-scroll" ref={chatScrollRef}>{(currentChat || []).map((item) => <div key={item.id} className={`chat-row ${item.sender === 'user' ? 'chat-row-user' : 'chat-row-ai'}`}>{item.sender === 'ai' && <div className="chat-avatar">AI</div>}<div className={`chat-bubble ${item.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>{renderRichMessage(item.text, item.sender === 'ai')}</div></div>)}</div><div className="chat-input-bar"><button className="icon-button subtle"><Mic size={16} /></button><button className="icon-button subtle"><Paperclip size={16} /></button><input value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') handleSendMessage(); }} placeholder="补充参数或记录客户反馈..." /><button className="send-button" onClick={handleSendMessage}><Send size={18} /></button></div></section><section className="quotation-panel"><div className="quote-version-bar"><span className="quote-version-label">当前报价版本</span><div className="quote-version-actions"><select value={currentVersion?.id} onChange={(event) => handleVersionChange(event.target.value)} className="quote-version-select">{currentProject?.versions.map((version) => <option key={version.id} value={version.id}>{version.label} - {version.timestamp.split(' ')[1]}</option>)}</select><button className="secondary-outline-button" onClick={handleCreateQuoteVersion}><PlusCircle size={15} />新增报价版本</button></div></div><div className="tabs"><button className={`tab ${activeMainTab === 'requirements' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('requirements')}><FileText size={16} />1. 需求参数推算</button><button className={`tab ${activeMainTab === 'bom' ? 'tab-active' : ''}`} onClick={handleOpenBomTab}><ListTodo size={16} />2. BOM物料清单</button><button className={`tab ${activeMainTab === 'quotation_sheet' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('quotation_sheet')}><Coins size={16} />3. 正式报价单</button></div><div className="quotation-body">{activeMainTab === 'requirements' && renderRequirementsPanel()}{activeMainTab === 'bom' && renderBomPanel()}{activeMainTab === 'quotation_sheet' && renderQuotationPanel()}</div></section></main></>
  );

  const renderKnowledgeView = () => (
    <><header className="page-header page-header-knowledge"><div><h1>历史报价单</h1><p>归档后的报价版本统一沉淀到历史报价单，可按客户、材质、防爆等级和结构快速检索。</p></div><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></header><main className="knowledge-layout archive-layout"><section className="archive-sidebar-panel archive-sidebar-panel-compact"><div className="archive-sidebar-search"><Search size={16} /><input value={archiveSearch} onChange={(event) => setArchiveSearch(event.target.value)} placeholder="搜索客户、型号、材质、报价编号..." /></div><div className="quick-filter-row archive-filter-row"><button className={`quick-filter ${archiveQuickFilter === 'all' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('all')}>全部</button><button className={`quick-filter ${archiveQuickFilter === 'same-material' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-material')}>316材质</button><button className={`quick-filter ${archiveQuickFilter === 'same-explosion' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-explosion')}>同防爆等级</button><button className={`quick-filter ${archiveQuickFilter === 'same-structure' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-structure')}>同格兰结构</button></div><div className="knowledge-list-meta">共 {filteredArchives.length} 份历史报价单</div><div className="archive-sidebar-list">{filteredArchives.map((item) => <button key={item.id} className={`archive-sidebar-item archive-sidebar-item-condensed ${selectedArchive?.id === item.id ? 'archive-sidebar-item-active' : ''}`} onClick={() => setSelectedArchiveId(item.id)}><div className="archive-sidebar-top"><span>{item.client}</span><small>{item.archivedAt}</small></div><strong>{item.productType}</strong><p>{item.title}</p><div className="archive-sidebar-meta"><span>{item.material}</span><span>{item.dimensions}</span></div></button>)}</div></section><section className="archive-summary-panel"><div className="archive-summary-card archive-summary-card-compact">{selectedArchive ? <div className="knowledge-inline-layout"><div className="knowledge-inline-topbar"><div><h3>{selectedArchive.title}</h3><p>{selectedArchive.versionLabel} - {selectedArchive.quoteNumber}</p></div><div className="header-action-row"><button className="secondary-outline-button" onClick={handleResumeArchivedProject}><PlusCircle size={15} />继续报价</button><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></div></div><div className="knowledge-inline-grid compact-two-row-grid"><div className="detail-section compact-section"><h4>1. 基本信息</h4><div className="detail-stat-grid detail-stat-grid-3 compact-stat-grid"><div className="detail-stat"><span>客户</span><strong>{selectedArchive.client}</strong></div><div className="detail-stat"><span>归档时间</span><strong>{selectedArchive.archivedAt}</strong></div><div className="detail-stat"><span>应用场景</span><strong>{selectedArchive.application}</strong></div></div></div><div className="detail-section compact-section"><h4>2. 产品结构</h4><div className="detail-stat-grid detail-stat-grid-5 compact-stat-grid"><div className="detail-stat"><span>产品类型</span><strong>{selectedArchive.productType}</strong></div><div className="detail-stat"><span>箱体尺寸</span><strong>{selectedArchive.dimensions}</strong></div><div className="detail-stat"><span>材质</span><strong>{selectedArchive.material}</strong></div><div className="detail-stat"><span>防爆等级</span><strong>{selectedArchive.explosionLevel}</strong></div><div className="detail-stat"><span>布线摘要</span><strong>{selectedArchive.wiring}</strong></div></div></div></div><div className="knowledge-inline-bottom compact-two-row-grid"><div className="detail-section compact-section"><h4>3. BOM 预览</h4><table className="detail-table compact-detail-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>规格型号</th><th>数量</th></tr></thead><tbody>{selectedArchive.bomPreview?.map((item, index) => <tr key={`${item.code}-${index}`}><td>{item.code}</td><td>{item.name}</td><td>{item.model}</td><td>{item.qty}</td></tr>)}</tbody></table></div><div className="detail-section compact-section"><h4>4. 报价拆分</h4><div className="quote-breakdown-wrap compact-breakdown-wrap"><div className="quote-breakdown-total"><span>总价</span><strong>¥{selectedArchive.total.toLocaleString()}</strong></div><div className="quote-breakdown-list">{selectedArchive.quoteBreakdown?.map((item) => <div key={item.label} className="quote-breakdown-item compact-breakdown-item"><span>{item.label}</span><strong>¥{item.amount.toLocaleString()}</strong></div>)}</div></div></div></div></div> : <><h3>暂无历史报价单</h3><p>项目归档后会自动进入这里，供后续查询和知识复用。</p></>}</div></section></main></>
  );

  return (
    <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-badge">AI</div><span>智能报价系统</span></div><nav className="nav-list"><button className={`nav-item ${activeNav === 'assistant' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('assistant')}><MessageSquare size={16} />报价助手</button><button className={`nav-item ${activeNav === 'knowledge' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('knowledge')}><BookOpen size={16} />历史报价单</button><button className="nav-item"><Cpu size={16} />规则引擎</button><button className="nav-item"><Box size={16} />物料库</button></nav><div className="divider" /><div className="recent-projects"><div className="recent-header"><span>近期报价项目</span><button className="icon-button subtle" onClick={handleCreateProject}><PlusCircle size={15} /></button></div><div className="search-box"><Search size={14} /><input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索客户或项目名称..." /></div><div className="project-groups">{GROUP_LABELS.map((groupName) => { const items = pagedProjects[groupName]; if (!items?.length) return null; return <div key={groupName} className="project-group"><div className="group-title">{groupName}</div><div className="project-list">{items.map((project) => <button key={project.id} className={`project-card ${activeProjectId === project.id ? 'project-card-active' : ''}`} onClick={() => openProject(project)}><Folder size={15} /><div className="project-meta"><span>{project.info.client}</span><small>{project.info.name}</small></div></button>)}</div></div>; })}</div><div className="pagination-box"><button className="page-nav-button" onClick={() => goProjectPage(projectPage - 1)} disabled={projectPage <= 1}><ChevronLeft size={14} /></button><div className="page-input-wrap"><span>第</span><input value={projectPageInput} onChange={(event) => setProjectPageInput(event.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') goProjectPage(Number(projectPageInput || 1)); }} /><span>/ {totalProjectPages} 页</span></div><button className="page-jump-button" onClick={() => goProjectPage(Number(projectPageInput || 1))}>跳转</button><button className="page-nav-button" onClick={() => goProjectPage(projectPage + 1)} disabled={projectPage >= totalProjectPages}><ChevronRight size={14} /></button></div></div></aside><div className="content-shell">{activeNav === 'assistant' ? renderAssistantView() : renderKnowledgeView()}</div>{isExportPreviewOpen && <div className="modal-backdrop"><div className="modal-card"><div className="modal-header"><h2><FileSpreadsheet size={20} />导出预览</h2><button className="icon-button subtle" onClick={() => setIsExportPreviewOpen(false)}><X size={24} /></button></div><div className="modal-content"><div className="excel-preview"><div className="excel-title">正式报价单 Excel 预览</div><table className="excel-table"><thead><tr><th>序号</th><th>报价编号</th><th>报价版本</th><th>报价日期</th><th>工程师</th><th>客户</th><th>物料编码</th><th>物料名称</th><th>规格型号</th><th>品牌</th><th>数量</th><th>金额</th><th>备注</th></tr></thead><tbody>{(currentData?.quotation?.items || []).map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{quoteNumber}</td><td>{currentVersion?.label}</td><td>{todayDateStr}</td><td>{currentProject?.info.engineer}</td><td>{currentProject?.info.client}</td><td>{item.code}</td><td>{item.name}</td><td>{item.model}</td><td>{item.brand === '-' ? '' : item.brand}</td><td>{item.quantity}</td><td className="right">{Number(item.total || 0).toFixed(2)}</td><td /></tr>)}</tbody></table></div></div></div></div>}</div>
  );
}













