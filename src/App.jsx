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
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

const SUB_TAB_CATEGORIES = ['壳体', '格兰', '防雨罩', '端子', '包装'];
const PROJECTS_PER_PAGE = 5;

const generateMockProjects = () => {
  const projs = [];

  projs.push({
    id: 'proj-1',
    dateGroup: '今天',
    info: { engineer: '测试员', client: '连云港神宇石化机械设备有限公司', name: '防爆接线箱非标定制' },
    versions: [
      { id: 'v1.0', label: 'V1.0 (解析中)', timestamp: '2026-03-25 14:00:00', isLatest: false },
      { id: 'v1.1', label: 'V1.1 (参数齐套)', timestamp: '2026-03-25 14:05:30', isLatest: true },
    ],
    data: {
      'v1.0': {
        chat: [
          { id: 1, sender: 'ai', text: '您好，我是智能报价助手。已为您建立【连云港神宇石化】档案。您可以直接输入需求描述，或上传工程图纸。', time: '14:00' },
          { id: 2, sender: 'user', text: '我要设计一个不锈钢防爆接线箱-1进6出-M20×1.5 下进下出-Ex eb ⅡC T6 Gb/Ex tb ⅢC T80℃ Db-IP66-WF2 带防雨罩，帮我出BOM清单', time: '14:02' },
          { id: 3, sender: 'ai', text: '已为您解析需求参数。根据配置规则：\n1. **强依赖项缺失**：计算箱体尺寸需依赖内部端子排布，请补充**端子数量**及**电流大小**。\n2. **弱依赖项默认**：已为您默认选用薄壳体、标准端子品牌及底部进出线。', time: '14:03' },
        ],
        dimensions: { suggested: '待规则引擎推算 (缺少端子等强依赖)', manual: '' },
        parameters: [
          { id: 'p1', category: '壳体', field: '防爆等级', value: 'Ex eb ⅡC T6 Gb/Ex tb ⅢC T80℃ Db', status: 'confirmed', dependency: 'strong' },
          { id: 'p2', category: '壳体', field: '材质', value: '不锈钢 316', status: 'confirmed', dependency: 'strong' },
          { id: 'p3', category: '壳体', field: '厚度', value: '标准薄型', status: 'inferred', dependency: 'weak', note: '系统推荐' },
          { id: 'p4', category: '格兰', field: '进出线规格', value: '1进6出-M20×1.5', status: 'confirmed', dependency: 'strong' },
          { id: 'p5', category: '格兰', field: '进出线方向', value: '下进下出', status: 'confirmed', dependency: 'weak', note: '系统推荐默认一面' },
          { id: 'p6', category: '端子', field: '端子数量', value: '', status: 'missing', dependency: 'strong', note: '等待用户补充' },
          { id: 'p7', category: '端子', field: '额定电流', value: '', status: 'missing', dependency: 'strong', note: '等待用户补充' },
          { id: 'p8', category: '端子', field: '品牌/型号', value: '默认标准款', status: 'inferred', dependency: 'weak', note: '系统推荐' },
          { id: 'p9', category: '防雨罩', field: '是否配置防雨罩', value: '需要', status: 'confirmed', dependency: 'strong', options: ['需要', '不需要'] },
          { id: 'p10', category: '防雨罩', field: '防雨罩材质', value: '316', status: 'inferred', dependency: 'weak', note: '规则推算: 焊接壳体默认对应材质', options: ['316', '304', 'Q235', '工程塑料'] },
        ],
        quotation: null,
      },
      'v1.1': {
        chat: [
          { id: 1, sender: 'ai', text: '您好，我是智能报价助手...', time: '14:00' },
          { id: 2, sender: 'user', text: '我要设计一个不锈钢防爆接线箱...', time: '14:02' },
          { id: 3, sender: 'ai', text: '已为您解析需求参数...\n1. 强依赖缺失：端子数量、电流大小...', time: '14:03' },
          { id: 4, sender: 'user', text: '30个端子，加上挡板', time: '14:05' },
          { id: 5, sender: 'ai', text: '收到。✨ 根据规则引擎的空间计算，系统推算箱体尺寸为 **400×300×250**。\n已为您生成完整 BOM 报价清单，请查阅。', time: '14:05' },
        ],
        dimensions: { suggested: '400×300×250', manual: '' },
        parameters: [
          { id: 'p1', category: '壳体', field: '防爆等级', value: 'Ex eb ⅡC T6 Gb/Ex tb ⅢC T80℃ Db', status: 'confirmed', dependency: 'strong' },
          { id: 'p2', category: '壳体', field: '材质', value: '不锈钢 316', status: 'confirmed', dependency: 'strong' },
          { id: 'p3', category: '壳体', field: '厚度', value: '标准薄型', status: 'confirmed', dependency: 'weak', note: '系统推荐' },
          { id: 'p4', category: '格兰', field: '进出线规格', value: '1进6出-M20×1.5', status: 'confirmed', dependency: 'strong' },
          { id: 'p5', category: '格兰', field: '进出线方向', value: '下进下出', status: 'confirmed', dependency: 'weak', note: '系统推荐默认一面' },
          { id: 'p6', category: '端子', field: '端子数量', value: '30', status: 'confirmed', dependency: 'strong' },
          { id: 'p7', category: '端子', field: '额定电流', value: '20A', status: 'confirmed', dependency: 'strong' },
          { id: 'p8', category: '端子', field: '品牌/型号', value: '默认标准款', status: 'confirmed', dependency: 'weak', note: '系统推荐' },
          { id: 'p9', category: '防雨罩', field: '是否配置防雨罩', value: '需要', status: 'confirmed', dependency: 'strong', options: ['需要', '不需要'] },
          { id: 'p10', category: '防雨罩', field: '防雨罩材质', value: '316', status: 'inferred', dependency: 'weak', note: '规则推算: 焊接壳体默认对应材质', options: ['316', '304', 'Q235', '工程塑料'] },
        ],
        quotation: {
          items: [
            { id: 'q1', code: '02.01.0931', name: 'AAA纸箱上下开盖 (内尺寸)', brand: '-', model: '520x520x300', quantity: 1, unitPrice: 31.84, total: 31.84 },
            { id: 'q2', code: '07.03.02.09.00010L', name: '防爆外六角堵头', brand: '-', model: 'BDT-M20x1.5-316L(SC)', quantity: 1, unitPrice: 9, total: 9 },
            { id: 'q3', code: '03.99.06.000018', name: '防爆呼吸阀', brand: '-', model: 'BHX-D-M20x1.5_316', quantity: 1, unitPrice: 88, total: 88 },
            { id: 'q4', code: '03.03.03.100006', name: '焊接壳体部件(IIB)_316', brand: '-', model: '400x300x250', quantity: 1, unitPrice: 1688.71, total: 1688.71 },
            { id: 'q5', code: '03.07.02.000955', name: '400方向壳体防雨罩_罩头型_ (IIB焊接) _316', brand: '-', model: '467x145x250', quantity: 1, unitPrice: 264.34, total: 264.34 },
            { id: 'q6', code: '03.02.21.000045', name: '螺钉固定式直通端子 (防爆) _灰色', brand: '菲尼克斯', model: 'UK3N (3001501)', quantity: 30, unitPrice: 1.757, total: 52.71 },
            { id: 'q7', code: '03.02.21.000559', name: '接线端子挡板', brand: '菲尼克斯', model: 'D-UK4/10 (3003020)', quantity: 1, unitPrice: 0.87, total: 0.87 },
            { id: 'q8', code: '07.03.02.08.80032L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M32x1.5-316L-(SC)', quantity: 1, unitPrice: 70.5, total: 70.5 },
            { id: 'q9', code: '07.03.02.08.80029L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M25x1.5-316L-(SC)', quantity: 3, unitPrice: 51, total: 153 },
            { id: 'q10', code: '07.03.02.08.80027L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M20x1.5-316L-(SC)', quantity: 4, unitPrice: 40.5, total: 162 },
            { id: 'q11', code: '07.03.02.09.00011L', name: '防爆外六角堵头', brand: '-', model: 'BDT-M25x1.5-316L(SC)', quantity: 1, unitPrice: 12, total: 12 },
            { id: 'q12', code: '03.08.01.600101A', name: '通头焊接凸台_M20x1.5_4mm_316', brand: '-', model: '', quantity: 4, unitPrice: 17.05, total: 68.2 },
            { id: 'q13', code: '03.08.01.600101A', name: '通头焊接凸台_M20x1.5_4mm_316', brand: '-', model: '', quantity: 1, unitPrice: 17.05, total: 17.05 },
            { id: 'q14', code: '03.08.01.600150A', name: '通头焊接凸台_M25x1.5_4mm_316', brand: '-', model: '', quantity: 3, unitPrice: 19.8, total: 59.4 },
            { id: 'q15', code: '03.08.01.600102A', name: '通头焊接凸台_M32x1.5_4mm_316', brand: '-', model: '', quantity: 1, unitPrice: 31.24, total: 31.24 },
          ],
        },
      },
    },
  });

  for (let i = 2; i <= 18; i += 1) {
    let dateGroup = '今天';
    if (i > 4 && i <= 10) dateGroup = '昨天';
    else if (i > 10) dateGroup = '过去 7 天';

    projs.push({
      id: `proj-${i}`,
      dateGroup,
      info: { engineer: '测试员', client: `江苏特种设备厂 ${i}期`, name: `常规防爆接线箱采购-${i}` },
      versions: [{ id: 'v1.0', label: 'V1.0 (已归档)', timestamp: `2026-03-${Math.floor(i / 2) + 10} 10:00:00`, isLatest: true }],
      data: { 'v1.0': { chat: [], dimensions: { suggested: '300×200×150', manual: '' }, parameters: [], quotation: null } },
    });
  }

  return projs;
};

const INITIAL_PROJECTS = generateMockProjects();
const INITIAL_ARCHIVES = [
  {
    id: 'archive-seed-1',
    projectId: 'proj-legacy-1',
    versionId: 'v3.2',
    title: '江苏特种设备厂 8期 / 常规防爆接线箱采购-8',
    client: '江苏特种设备厂 8期',
    versionLabel: 'V3.2 (已定稿)',
    archivedAt: '2026-03-18 16:20',
    quoteNumber: '202603180023-A008-V03',
    total: 4288.5,
    dimensions: '350×260×180',
    summary: '已归档一份历史接线箱方案，可用于快速对比型号和报价结构。',
    chatCount: 6,
    bomCount: 9,
    tags: ['接线箱', '316', 'IP66'],
    application: '石化设备防爆接线箱',
    productType: '防爆接线箱',
    material: '不锈钢 316',
    explosionLevel: 'Ex eb ⅡC T6 Gb/Ex tb ⅢC T80℃ Db',
    wiring: '1进6出-M20×1.5 / 下进下出',
    matchScore: 92,
    matchHighlights: ['防爆等级一致', '材质一致', '进出线结构一致'],
    matchDiffs: ['尺寸略小（350→400）'],
    quoteBreakdown: [
      { label: '壳体与罩体', amount: 1953.05 },
      { label: '端子与附件', amount: 53.58 },
      { label: '格兰与堵头', amount: 631.87 },
      { label: '包装与其他', amount: 1650.0 },
    ],
    bomPreview: [
      { code: '03.03.03.100006', name: '焊接壳体部件(IIB)_316', model: '350x260x180', qty: 1 },
      { code: '03.07.02.000955', name: '防雨罩', model: '410x130x180', qty: 1 },
      { code: '03.02.21.000045', name: '直通端子', model: 'UK3N', qty: 24 },
    ],
  },
];

function renderMessage(text, isAi) {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? (
      <strong key={`${part}-${index}`} className={isAi ? 'ai-highlight' : ''}>{part}</strong>
    ) : part,
  );
}

function createArchiveRecord(project, version, data, total, quoteNumber) {
  return {
    id: `${project.id}-${version.id}`,
    projectId: project.id,
    versionId: version.id,
    title: `${project.info.client} / ${project.info.name}`,
    client: project.info.client,
    versionLabel: version.label,
    archivedAt: '2026-03-26 10:30',
    quoteNumber,
    total,
    dimensions: data?.dimensions?.suggested || '-',
    summary: data?.chat?.[data.chat.length - 1]?.text || '已归档该项目的报价单与聊天记录。',
    chatCount: data?.chat?.length || 0,
    bomCount: data?.quotation?.items?.length || 0,
    tags: [project.info.name, data?.dimensions?.suggested || '未推算'],
  };
}

export default function App() {
  const [projects] = useState(INITIAL_PROJECTS);
  const [activeNav, setActiveNav] = useState('assistant');
  const [archiveSearch, setArchiveSearch] = useState('');
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [selectedArchiveId, setSelectedArchiveId] = useState(INITIAL_ARCHIVES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectId, setActiveProjectId] = useState('proj-1');
  const [activeVersionId, setActiveVersionId] = useState('v1.0');
  const [activeMainTab, setActiveMainTab] = useState('requirements');
  const [activeSubCategory, setActiveSubCategory] = useState('壳体');
  const [inputText, setInputText] = useState('');
  const [editableParams, setEditableParams] = useState([]);
  const [editableBOM, setEditableBOM] = useState([]);
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);
  const [projectPage, setProjectPage] = useState(1);
  const [projectPageInput, setProjectPageInput] = useState('1');
  const [dimensionOverride, setDimensionOverride] = useState('');
  const [archiveQuickFilter, setArchiveQuickFilter] = useState('all');

  const orderedFilteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const localGroupOrder = ['今天', '昨天', '过去 7 天'];
    return localGroupOrder.flatMap((groupName) =>
      projects.filter(
        (project) =>
          project.dateGroup === groupName &&
          (project.info.client.toLowerCase().includes(query) || project.info.name.toLowerCase().includes(query)),
      ),
    );
  }, [projects, searchQuery]);

  const totalProjectPages = Math.max(1, Math.ceil(orderedFilteredProjects.length / PROJECTS_PER_PAGE));

  useEffect(() => {
    setProjectPage(1);
    setProjectPageInput('1');
  }, [searchQuery]);

  useEffect(() => {
    if (projectPage > totalProjectPages) {
      setProjectPage(totalProjectPages);
      setProjectPageInput(String(totalProjectPages));
    }
  }, [projectPage, totalProjectPages]);

  const pagedProjects = useMemo(() => {
    const start = (projectPage - 1) * PROJECTS_PER_PAGE;
    const pageItems = orderedFilteredProjects.slice(start, start + PROJECTS_PER_PAGE);
    return pageItems.reduce((acc, project) => {
      if (!acc[project.dateGroup]) acc[project.dateGroup] = [];
      acc[project.dateGroup].push(project);
      return acc;
    }, {});
  }, [orderedFilteredProjects, projectPage]);

  const groupOrder = ['今天', '昨天', '过去 7 天'];
  const currentProject = projects.find((project) => project.id === activeProjectId);
  const currentVersion = currentProject?.versions.find((version) => version.id === activeVersionId) || currentProject?.versions[0];
  const currentData = currentProject?.data[activeVersionId] || currentProject?.data[currentProject?.versions[0]?.id];
  const currentCategoryParams = editableParams.filter((param) => param.category === activeSubCategory);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeVersionId, currentData?.chat?.length]);

  useEffect(() => {
    setEditableParams(currentData?.parameters ? JSON.parse(JSON.stringify(currentData.parameters)) : []);
    setEditableBOM(currentData?.quotation?.items ? JSON.parse(JSON.stringify(currentData.quotation.items)) : []);
    setDimensionOverride(currentData?.dimensions?.manual || '');
  }, [currentData, activeVersionId, activeProjectId]);

  const filteredArchives = useMemo(() => {
    const query = archiveSearch.toLowerCase();
    return archives.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        item.client.toLowerCase().includes(query) ||
        item.quoteNumber.toLowerCase().includes(query) ||
        item.productType?.toLowerCase().includes(query) ||
        item.material?.toLowerCase().includes(query) ||
        item.explosionLevel?.toLowerCase().includes(query) ||
        item.wiring?.toLowerCase().includes(query) ||
        item.dimensions?.toLowerCase().includes(query);

      const matchesFilter =
        archiveQuickFilter === 'all' ||
        (archiveQuickFilter === 'same-material' && item.material?.includes('316')) ||
        (archiveQuickFilter === 'same-explosion' && item.explosionLevel?.includes('Ex eb')) ||
        (archiveQuickFilter === 'same-structure' && item.wiring?.includes('1进6出'));

      return matchesQuery && matchesFilter;
    });
  }, [archives, archiveQuickFilter, archiveSearch]);

  const selectedArchive = filteredArchives.find((item) => item.id === selectedArchiveId) || filteredArchives[0] || null;
  const recommendedArchive = useMemo(() => {
    if (!archives.length) return null;
    return [...archives].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))[0];
  }, [archives]);

  useEffect(() => {
    if (filteredArchives.length && !filteredArchives.some((item) => item.id === selectedArchiveId)) {
      setSelectedArchiveId(filteredArchives[0].id);
    }
  }, [filteredArchives, selectedArchiveId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    window.alert('Demo模式：请在左侧下拉框中切换到 V1.1 版本查看互动效果。');
    setInputText('');
  };

  const handleParamChange = (id, newValue) => {
    setEditableParams((prev) => prev.map((param) => (param.id === id ? { ...param, value: newValue, status: 'confirmed' } : param)));
  };

  const handleBOMChange = (id, field, value) => {
    setEditableBOM((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updatedItem = { ...item, [field]: value };
        if (field === 'unitPrice' || field === 'quantity') {
          const price = parseFloat(updatedItem.unitPrice) || 0;
          const qty = parseInt(updatedItem.quantity, 10) || 0;
          updatedItem.total = price * qty;
        }
        return updatedItem;
      }),
    );
  };

  const handleDeleteBOMItem = (id) => {
    setEditableBOM((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddBOMItem = () => {
    setEditableBOM((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, code: 'NEW-CODE', name: '新增自定义物料', brand: '-', model: '待补充', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const calculateTotal = () => editableBOM.reduce((sum, item) => sum + (item.total || 0), 0);
  const todayDateStr = '2026-03-26';
  const quoteNumber = '202512150054-A001-V01';

  const handleArchiveCurrent = () => {
    if (!currentProject || !currentVersion || !currentData?.quotation?.items?.length) {
      window.alert('请先生成完整报价单后再归档到知识库。');
      return;
    }

    const record = createArchiveRecord(currentProject, currentVersion, currentData, calculateTotal(), quoteNumber);
    setArchives((prev) => [record, ...prev.filter((item) => item.id !== record.id)]);
    setSelectedArchiveId(record.id);
    setActiveNav('knowledge');
    window.alert('已将当前报价单与聊天记录归档到知识库 Demo。');
  };

  const goProjectPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalProjectPages);
    setProjectPage(nextPage);
    setProjectPageInput(String(nextPage));
  };

  const renderAssistantView = () => (
    <>
      <header className="page-header">
        <div>
          <h1>接线箱报价助手</h1>
          <p>在右侧维护需求参数，左侧与智能助手对话完成选型与报价</p>
        </div>
      </header>
      <main className="main-layout">
        <section className="chat-panel">
          <div className="chat-toolbar">
            <div className="chat-project-info">
              <span className="engineer">{currentProject?.info.engineer}</span>
              <span className="sep">|</span>
              <span className="client">{currentProject?.info.client}</span>
            </div>
            <select value={currentVersion?.id} onChange={(event) => setActiveVersionId(event.target.value)}>
              {currentProject?.versions.map((version) => (
                <option key={version.id} value={version.id}>版本: {version.label} - {version.timestamp.split(' ')[1]}</option>
              ))}
            </select>
          </div>
          <div ref={chatScrollRef} className="chat-messages">
            {currentData?.chat?.map((message) => (
              <div key={message.id} className={`message-row ${message.sender === 'user' ? 'message-row-user' : ''}`}>
                {message.sender === 'ai' && <div className="ai-avatar">AI</div>}
                <div className={`message-bubble ${message.sender === 'user' ? 'message-user' : 'message-ai'}`}>
                  <p>{renderMessage(message.text, message.sender === 'ai')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input-wrap">
            <div className="chat-input">
              <button className="icon-button"><Mic size={18} /></button>
              <button className="icon-button"><Paperclip size={18} /></button>
              <input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()} placeholder="补充参数..." />
              <button className="send-button" onClick={handleSendMessage}><Send size={16} /></button>
            </div>
          </div>
        </section>

        <section className="quotation-panel">
          <div className="tabs">
            <button className={`tab ${activeMainTab === 'requirements' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('requirements')}><FileText size={16} />1. 需求参数推算</button>
            <button className={`tab ${activeMainTab === 'bom' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('bom')}><ListTodo size={16} />2. BOM物料清单</button>
            <button className={`tab ${activeMainTab === 'quotation_sheet' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('quotation_sheet')}><Coins size={16} />3. 正式报价单</button>
          </div>

          <div className="quotation-body">
            {activeMainTab === 'requirements' && (
              <div className="stack-layout">
                <div className="panel-card">
                  <h3 className="section-title"><Cpu size={16} className="section-icon" />计算属性：箱体尺寸推算</h3>
                  <div className="dimension-grid">
                    <div>
                      <div className="mini-label-row">
                        <span className="mini-label">规则引擎输出</span>
                        <span className="tag tag-ai"><Sparkles size={10} />AI 推算</span>
                      </div>
                      <div className={`dimension-value ${currentData?.dimensions?.suggested?.includes('缺少') ? 'dimension-value-warning' : ''}`}>{currentData?.dimensions?.suggested || '-'}</div>
                    </div>
                    <div>
                      <div className="mini-label">人工覆盖值</div>
                      <div className="override-row">
                        <input type="text" value={dimensionOverride} onChange={(event) => setDimensionOverride(event.target.value)} placeholder="如需非标定制，手动输入" />
                        <button onClick={() => window.alert(`Demo：已记录人工覆盖值 ${dimensionOverride || '（空）'}`)}>确认覆盖</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel-card panel-card-p0">
                  <div className="subtabs">
                    {SUB_TAB_CATEGORIES.map((category) => (
                      <button key={category} className={`subtab ${activeSubCategory === category ? 'subtab-active' : ''}`} onClick={() => setActiveSubCategory(category)}>
                        {category}
                        {editableParams.some((param) => param.category === category && param.status === 'missing') && <span className="subtab-dot" />}
                      </button>
                    ))}
                  </div>
                  <table className="params-table">
                    <thead>
                      <tr>
                        <th>参数字段</th>
                        <th>数据类型</th>
                        <th>提取值 / 缺省值 (可直接修改)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCategoryParams.length > 0 ? currentCategoryParams.map((param) => (
                        <tr key={param.id}>
                          <td className="param-field">{param.field}</td>
                          <td>{param.dependency === 'strong' ? <span className="tag tag-strong">强依赖 (必填)</span> : <span className="tag tag-weak">弱依赖 (默认)</span>}</td>
                          <td>
                            <div className="param-input-wrap">
                              {param.options ? (
                                <select value={param.value} onChange={(event) => handleParamChange(param.id, event.target.value)} className={`param-select ${param.status === 'missing' ? 'param-missing' : ''}`}>
                                  {param.status === 'missing' && <option value="" disabled hidden>{param.note}</option>}
                                  {param.options.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                              ) : (
                                <input type="text" value={param.value} onChange={(event) => handleParamChange(param.id, event.target.value)} placeholder={param.status === 'missing' ? param.note : '请输入'} className={`param-input ${param.status === 'missing' ? 'param-missing' : ''}`} />
                              )}
                              {param.dependency === 'weak' && param.value && !param.options && <span className="param-note">({param.note})</span>}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="params-empty">该分类下暂无解析参数</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeMainTab === 'bom' && (
              <div className="full-height">
                {editableBOM.length > 0 ? (
                  <div className="sheet-card">
                    <div className="sheet-header compact-header">
                      <div>
                        <h3 className="sheet-heading"><Box size={16} className="sheet-heading-icon" />B2B 物料 BOM 清单 (技术确认)</h3>
                        <p className="sheet-help">仅核对物料规格与数量。确认无误后可一键生成正式报价单。</p>
                      </div>
                      <div className="header-action-row">
                        <button className="secondary-outline-button" onClick={handleAddBOMItem}><PlusCircle size={15} />新增物料</button>
                        <button className="bom-jump-button" onClick={() => setActiveMainTab('quotation_sheet')}>生成正式报价 <ArrowRight size={14} /></button>
                      </div>
                    </div>
                    <div className="table-wrap">
                      <table className="quote-table bom-table">
                        <thead>
                          <tr>
                            <th>物料代码</th>
                            <th>物料名称</th>
                            <th>品牌</th>
                            <th>规格型号</th>
                            <th className="center">数量</th>
                            <th className="center">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editableBOM.map((item) => (
                            <tr key={item.id}>
                              <td><input value={item.code} onChange={(event) => handleBOMChange(item.id, 'code', event.target.value)} className="bom-input mono-input" /></td>
                              <td><input value={item.name} onChange={(event) => handleBOMChange(item.id, 'name', event.target.value)} className="bom-input strong-input" /></td>
                              <td><input value={item.brand} onChange={(event) => handleBOMChange(item.id, 'brand', event.target.value)} className="bom-input" /></td>
                              <td><input value={item.model} onChange={(event) => handleBOMChange(item.id, 'model', event.target.value)} className="bom-input" /></td>
                              <td className="center"><input type="number" value={item.quantity} onChange={(event) => handleBOMChange(item.id, 'quantity', event.target.value)} className="bom-input center-input" /></td>
                              <td className="center"><button className="icon-button danger" onClick={() => handleDeleteBOMItem(item.id)}><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <AlertCircle size={48} />
                    <p className="empty-copy"><span>无法生成 BOM 清单。</span><br />检测到强依赖参数（如端子数量等）未齐套。<br />请在左侧对话中补充或在「需求参数推算」中直接填写。</p>
                  </div>
                )}
              </div>
            )}

            {activeMainTab === 'quotation_sheet' && (
              <div className="full-height">
                {editableBOM.length > 0 ? (
                  <div className="sheet-card">
                    <div className="sheet-header">
                      <div>
                        <h3>{currentProject?.info.name} - 正式报价单</h3>
                        <div className="sheet-meta">
                          <span>报价编号: {quoteNumber}</span>
                          <span>客户: {currentProject?.info.client}</span>
                          <span>制单人: {currentProject?.info.engineer}</span>
                          <span>日期: {todayDateStr}</span>
                        </div>
                      </div>
                      <div className="header-action-row">
                        <button className="secondary-outline-button" onClick={handleArchiveCurrent}><Archive size={15} />归档到知识库</button>
                        <button className="primary-button" onClick={() => setIsExportPreviewOpen(true)}><Download size={15} />导出 / 发起审批</button>
                      </div>
                    </div>
                    {recommendedArchive && (
                      <div className="recommend-inline-bar">
                        <span className="recommend-inline-label">推荐历史方案（AI匹配）</span>
                        <span className="recommend-inline-main">最优匹配：{recommendedArchive.client}</span>
                        <span className="recommend-inline-score">匹配度 {recommendedArchive.matchScore}%</span>
                        <span className="recommend-inline-text">✔ {recommendedArchive.matchHighlights?.[0]} · ✖ {recommendedArchive.matchDiffs?.[0]}</span>
                        <button className="mini-link-button" onClick={() => window.alert('Demo：已带入历史方案结构供复用参考。')}>一键复用</button>
                        <button className="mini-link-button mini-link-button-primary" onClick={() => { setSelectedArchiveId(recommendedArchive.id); setActiveNav('knowledge'); }}>对比差异</button>
                      </div>
                    )}
                    <div className="table-wrap">
                      <table className="quote-table quote-sheet-table">
                        <thead>
                          <tr>
                            <th>物料代码</th>
                            <th>物料名称</th>
                            <th>规格型号</th>
                            <th className="center">数量</th>
                            <th className="right tinted">含税单价 (¥)</th>
                            <th className="right tinted">总计 (¥)</th>
                            <th className="center">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {editableBOM.map((item) => (
                            <tr key={item.id}>
                              <td><span className="mono">{item.code}</span></td>
                              <td><span className="strong">{item.name}</span></td>
                              <td>{item.model}</td>
                              <td className="center"><input type="number" value={item.quantity} onChange={(event) => handleBOMChange(item.id, 'quantity', event.target.value)} /></td>
                              <td className="right tinted"><input type="number" step="0.01" value={item.unitPrice} onChange={(event) => handleBOMChange(item.id, 'unitPrice', event.target.value)} /></td>
                              <td className="right tinted strong">¥{item.total?.toFixed(2) || '0.00'}</td>
                              <td className="center"><button className="icon-button danger" onClick={() => handleDeleteBOMItem(item.id)}><Trash2 size={16} /></button></td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="quote-total-row">
                            <td colSpan={4} />
                            <td className="right tinted quote-total-label">合计</td>
                            <td className="right tinted quote-total-amount">¥{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <AlertCircle size={48} />
                    <p className="empty-copy"><span>无法生成报价单。</span><br />检测到强依赖参数未齐套，请先完成参数补全并确认。</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );

  const renderKnowledgeView = () => (
    <>
      <header className="page-header page-header-knowledge">
        <div>
          <h1>知识库沉淀中心</h1>
          <p>按参数搜索历史方案，快速筛选后在同页查看结构化摘要</p>
        </div>
        <button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button>
      </header>
      <main className="knowledge-layout archive-layout">
        <section className="archive-sidebar-panel archive-sidebar-panel-compact">
          <div className="archive-sidebar-search">
            <Search size={16} />
            <input value={archiveSearch} onChange={(event) => setArchiveSearch(event.target.value)} placeholder="按产品类型、材质、防爆等级、尺寸、进出线结构搜索..." />
          </div>
          <div className="quick-filter-row archive-filter-row">
            <button className={`quick-filter ${archiveQuickFilter === 'all' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('all')}>全部</button>
            <button className={`quick-filter ${archiveQuickFilter === 'same-material' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-material')}>316材质</button>
            <button className={`quick-filter ${archiveQuickFilter === 'same-explosion' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-explosion')}>同防爆等级</button>
            <button className={`quick-filter ${archiveQuickFilter === 'same-structure' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-structure')}>同进出线结构</button>
          </div>
          <div className="knowledge-list-meta">共 {filteredArchives.length} 条归档方案</div>
          <div className="archive-sidebar-list">
            {filteredArchives.map((item) => (
              <button key={item.id} className={`archive-sidebar-item archive-sidebar-item-condensed ${selectedArchive?.id === item.id ? 'archive-sidebar-item-active' : ''}`} onClick={() => setSelectedArchiveId(item.id)}>
                <div className="archive-sidebar-top"><span>{item.client}</span><small>{item.archivedAt}</small></div>
                <strong>{item.productType}</strong>
                <p>{item.title}</p>
                <div className="archive-sidebar-meta">
                  <span>{item.material}</span>
                  <span>{item.dimensions}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="archive-summary-panel">
          <div className="archive-summary-card archive-summary-card-compact">
            {selectedArchive ? (
              <div className="knowledge-inline-layout">
                <div className="knowledge-inline-topbar">
                  <div>
                    <h3>{selectedArchive.title}</h3>
                    <p>{selectedArchive.versionLabel} · {selectedArchive.quoteNumber}</p>
                  </div>
                  <button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}>回到当前项目对比</button>
                </div>

                <div className="knowledge-inline-grid compact-two-row-grid">
                  <div className="detail-section compact-section">
                    <h4>1）基础信息</h4>
                    <div className="detail-stat-grid detail-stat-grid-3 compact-stat-grid">
                      <div className="detail-stat"><span>客户</span><strong>{selectedArchive.client}</strong></div>
                      <div className="detail-stat"><span>时间</span><strong>{selectedArchive.archivedAt}</strong></div>
                      <div className="detail-stat"><span>应用场景</span><strong>{selectedArchive.application || '防爆接线场景'}</strong></div>
                    </div>
                  </div>

                  <div className="detail-section compact-section">
                    <h4>2）关键参数</h4>
                    <div className="detail-stat-grid detail-stat-grid-5 compact-stat-grid">
                      <div className="detail-stat"><span>产品类型</span><strong>{selectedArchive.productType}</strong></div>
                      <div className="detail-stat"><span>尺寸</span><strong>{selectedArchive.dimensions}</strong></div>
                      <div className="detail-stat"><span>材质</span><strong>{selectedArchive.material}</strong></div>
                      <div className="detail-stat"><span>防爆等级</span><strong>{selectedArchive.explosionLevel}</strong></div>
                      <div className="detail-stat"><span>进出线结构</span><strong>{selectedArchive.wiring}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="knowledge-inline-bottom compact-two-row-grid">
                  <div className="detail-section compact-section">
                    <h4>3）BOM</h4>
                    <table className="detail-table compact-detail-table">
                      <thead>
                        <tr>
                          <th>物料代码</th>
                          <th>物料名称</th>
                          <th>规格型号</th>
                          <th>数量</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedArchive.bomPreview?.map((item, index) => (
                          <tr key={`${item.code}-${index}`}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.model}</td>
                            <td>{item.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="detail-section compact-section">
                    <h4>4）报价</h4>
                    <div className="quote-breakdown-wrap compact-breakdown-wrap">
                      <div className="quote-breakdown-total">
                        <span>总价</span>
                        <strong>¥{selectedArchive.total.toLocaleString()}</strong>
                      </div>
                      <div className="quote-breakdown-list">
                        {selectedArchive.quoteBreakdown?.map((item) => (
                          <div key={item.label} className="quote-breakdown-item compact-breakdown-item">
                            <span>{item.label}</span>
                            <strong>¥{item.amount.toLocaleString()}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3>归档项目列表</h3>
                <p>左侧支持持续累积的大量归档项目检索。点击任意项目后，右侧会直接展示紧凑版结构化摘要，方便历史方案对比与快速复用。</p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">AI</div>
          <span>智能报价系统</span>
        </div>
        <nav className="nav-list">
          <button className={`nav-item ${activeNav === 'assistant' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('assistant')}><MessageSquare size={16} />报价助手</button>
          <button className={`nav-item ${activeNav === 'knowledge' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('knowledge')}><BookOpen size={16} />知识库</button>
          <button className="nav-item"><Cpu size={16} />规则引擎</button>
          <button className="nav-item"><Box size={16} />物料库</button>
        </nav>
        <div className="divider" />
        <div className="recent-projects">
          <div className="recent-header">
            <span>近期报价项目</span>
            <button className="icon-button subtle"><PlusCircle size={15} /></button>
          </div>
          <div className="search-box">
            <Search size={14} />
            <input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索客户或项目名称..." />
          </div>
          <div className="project-groups">
            {groupOrder.map((groupName) => {
              const items = pagedProjects[groupName];
              if (!items?.length) return null;
              return (
                <div key={groupName} className="project-group">
                  <div className="group-title">{groupName}</div>
                  <div className="project-list">
                    {items.map((project) => (
                      <button
                        key={project.id}
                        className={`project-card ${activeProjectId === project.id ? 'project-card-active' : ''}`}
                        onClick={() => {
                          setActiveProjectId(project.id);
                          setActiveVersionId(project.versions[project.versions.length - 1].id);
                          setActiveNav('assistant');
                        }}
                      >
                        <Folder size={15} />
                        <div className="project-meta">
                          <span>{project.info.client}</span>
                          <small>{project.info.name}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pagination-box">
            <button className="page-nav-button" onClick={() => goProjectPage(projectPage - 1)} disabled={projectPage <= 1}><ChevronLeft size={14} /></button>
            <div className="page-input-wrap">
              <span>第</span>
              <input value={projectPageInput} onChange={(event) => setProjectPageInput(event.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') goProjectPage(Number(projectPageInput || 1)); }} />
              <span>/ {totalProjectPages} 页</span>
            </div>
            <button className="page-jump-button" onClick={() => goProjectPage(Number(projectPageInput || 1))}>跳转</button>
            <button className="page-nav-button" onClick={() => goProjectPage(projectPage + 1)} disabled={projectPage >= totalProjectPages}><ChevronRight size={14} /></button>
          </div>
        </div>
      </aside>

      <div className="content-shell">{activeNav === 'assistant' ? renderAssistantView() : renderKnowledgeView()}</div>

      {isExportPreviewOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h2><FileSpreadsheet size={20} />导出预览</h2>
              <button className="icon-button subtle" onClick={() => setIsExportPreviewOpen(false)}><X size={24} /></button>
            </div>
            <div className="modal-content">
              <div className="excel-preview">
                <div className="excel-title">报价单查询(内部)（V1.0测试版）</div>
                <table className="excel-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>报价编号</th>
                      <th>报价版本</th>
                      <th>报价日期</th>
                      <th>业务发展商</th>
                      <th>客户</th>
                      <th>物料代码</th>
                      <th>物料名称</th>
                      <th>规格型号</th>
                      <th>品牌</th>
                      <th>数量</th>
                      <th>报价</th>
                      <th>警示</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableBOM.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{quoteNumber}</td>
                        <td>1</td>
                        <td>{todayDateStr}</td>
                        <td>{currentProject?.info.engineer}</td>
                        <td>{currentProject?.info.client}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.model}</td>
                        <td>{item.brand === '-' ? '' : item.brand}</td>
                        <td>{item.quantity}</td>
                        <td className="right">{item.total?.toFixed(2)}</td>
                        <td />
                      </tr>
                    ))}
                    <tr className="excel-total-row"><td colSpan={11} /><td className="right">{calculateTotal().toFixed(2)}</td><td /></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setIsExportPreviewOpen(false)}>取消</button>
              <button className="export-button" onClick={() => { window.alert('Demo: 触发 Excel 实际下载动作'); setIsExportPreviewOpen(false); }}><FileSpreadsheet size={16} />确认导出 Excel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









