import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Box,
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
            { id: 'q2', code: '07.03.02.09.00010L', name: '防爆外六角堵头', brand: '-', model: 'BDT-M20x1.5-316L(SC)', quantity: 1, unitPrice: 9.0, total: 9.0 },
            { id: 'q3', code: '03.99.06.000018', name: '防爆呼吸阀', brand: '-', model: 'BHX-D-M20x1.5_316', quantity: 1, unitPrice: 88.0, total: 88.0 },
            { id: 'q4', code: '03.03.03.100006', name: '焊接壳体部件(IIB)_316', brand: '-', model: '400x300x250', quantity: 1, unitPrice: 1688.71, total: 1688.71 },
            { id: 'q5', code: '03.07.02.000955', name: '400方向壳体防雨罩_罩头型_ (IIB焊接) _316', brand: '-', model: '467x145x250', quantity: 1, unitPrice: 264.34, total: 264.34 },
            { id: 'q6', code: '03.02.21.000045', name: '螺钉固定式直通端子 (防爆) _灰色', brand: '菲尼克斯', model: 'UK3N (3001501)', quantity: 30, unitPrice: 1.757, total: 52.71 },
            { id: 'q7', code: '03.02.21.000559', name: '接线端子挡板', brand: '菲尼克斯', model: 'D-UK4/10 (3003020)', quantity: 1, unitPrice: 0.87, total: 0.87 },
            { id: 'q8', code: '07.03.02.08.80032L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M32x1.5-316L-(SC)', quantity: 1, unitPrice: 70.5, total: 70.5 },
            { id: 'q9', code: '07.03.02.08.80029L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M25x1.5-316L-(SC)', quantity: 3, unitPrice: 51.0, total: 153.0 },
            { id: 'q10', code: '07.03.02.08.80027L', name: '防爆电缆夹紧密封接头', brand: '-', model: 'BDM-H-M20x1.5-316L-(SC)', quantity: 4, unitPrice: 40.5, total: 162.0 },
            { id: 'q11', code: '07.03.02.09.00011L', name: '防爆外六角堵头', brand: '-', model: 'BDT-M25x1.5-316L(SC)', quantity: 1, unitPrice: 12.0, total: 12.0 },
            { id: 'q12', code: '03.08.01.600101A', name: '通头焊接凸台_M20x1.5_4mm_316', brand: '-', model: '', quantity: 4, unitPrice: 17.05, total: 68.2 },
            { id: 'q13', code: '03.08.01.600101A', name: '通头焊接凸台_M20x1.5_4mm_316', brand: '-', model: '', quantity: 1, unitPrice: 17.05, total: 17.05 },
            { id: 'q14', code: '03.08.01.600150A', name: '通头焊接凸台_M25x1.5_4mm_316', brand: '-', model: '', quantity: 3, unitPrice: 19.8, total: 59.4 },
            { id: 'q15', code: '03.08.01.600102A', name: '通头焊接凸台_M32x1.5_4mm_316', brand: '-', model: '', quantity: 1, unitPrice: 31.24, total: 31.24 },
          ],
        },
      },
    },
  });

  for (let i = 2; i <= 15; i += 1) {
    let dateGroup = '今天';
    if (i > 3 && i <= 8) dateGroup = '昨天';
    else if (i > 8) dateGroup = '过去 7 天';

    projs.push({
      id: `proj-${i}`,
      dateGroup,
      info: { engineer: '测试员', client: `江苏特种设备厂 ${i}期`, name: `常规防爆接线箱采购-${i}` },
      versions: [{ id: 'v1.0', label: 'V1.0 (已归档)', timestamp: `2026-03-${Math.floor(i / 2) + 10} 10:00:00`, isLatest: true }],
      data: {
        'v1.0': { chat: [], dimensions: { suggested: '300×200×150', manual: '' }, parameters: [], quotation: null },
      },
    });
  }

  return projs;
};

const INITIAL_PROJECTS = generateMockProjects();

function renderMessage(text, isAi) {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? (
      <strong key={`${part}-${index}`} className={isAi ? 'ai-highlight' : ''}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function App() {
  const [projects] = useState(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProjectId, setActiveProjectId] = useState('proj-1');
  const [activeVersionId, setActiveVersionId] = useState('v1.0');
  const [activeMainTab, setActiveMainTab] = useState('requirements');
  const [activeSubCategory, setActiveSubCategory] = useState('壳体');
  const [inputText, setInputText] = useState('');
  const [editableParams, setEditableParams] = useState([]);
  const [editableBOM, setEditableBOM] = useState([]);
  const [isExportPreviewOpen, setIsExportPreviewOpen] = useState(false);

  const groupedProjects = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) => project.info.client.toLowerCase().includes(query) || project.info.name.toLowerCase().includes(query),
    );
    return filtered.reduce((acc, project) => {
      if (!acc[project.dateGroup]) acc[project.dateGroup] = [];
      acc[project.dateGroup].push(project);
      return acc;
    }, {});
  }, [projects, searchQuery]);

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
  }, [currentData, activeVersionId, activeProjectId]);

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

  const calculateTotal = () => editableBOM.reduce((sum, item) => sum + (item.total || 0), 0);
  const todayDateStr = '2026-03-25';
  const quoteNumber = '202512150054-A001-V01';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">AI</div>
          <span>智能报价系统</span>
        </div>
        <nav className="nav-list">
          <button className="nav-item nav-item-active"><MessageSquare size={16} />报价助手</button>
          <button className="nav-item"><BookOpen size={16} />知识库</button>
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
              const items = groupedProjects[groupName];
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
        </div>
      </aside>

      <div className="content-shell">
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
                  <option key={version.id} value={version.id}>
                    版本: {version.label} - {version.timestamp.split(' ')[1]}
                  </option>
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
                <input
                  type="text"
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
                  placeholder="补充参数..."
                />
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
                        <div className={`dimension-value ${currentData?.dimensions?.suggested?.includes('缺少') ? 'dimension-value-warning' : ''}`}>
                          {currentData?.dimensions?.suggested || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="mini-label">人工覆盖值</div>
                        <div className="override-row">
                          <input type="text" placeholder="如需非标定制，手动输入" />
                          <button>确认覆盖</button>
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
                            <td>
                              {param.dependency === 'strong' ? <span className="tag tag-strong">强依赖 (必填)</span> : <span className="tag tag-weak">弱依赖 (默认)</span>}
                            </td>
                            <td>
                              <div className="param-input-wrap">
                                {param.options ? (
                                  <select
                                    value={param.value}
                                    onChange={(event) => handleParamChange(param.id, event.target.value)}
                                    className={`param-select ${param.status === 'missing' ? 'param-missing' : ''}`}
                                  >
                                    {param.status === 'missing' && <option value="" disabled hidden>{param.note}</option>}
                                    {param.options.map((option) => <option key={option} value={option}>{option}</option>)}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={param.value}
                                    onChange={(event) => handleParamChange(param.id, event.target.value)}
                                    placeholder={param.status === 'missing' ? param.note : '请输入'}
                                    className={`param-input ${param.status === 'missing' ? 'param-missing' : ''}`}
                                  />
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
                        <button className="bom-jump-button" onClick={() => setActiveMainTab('quotation_sheet')}>
                          生成正式报价 <ArrowRight size={14} />
                        </button>
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
                                <td className="center"><button className="icon-button danger"><Trash2 size={16} /></button></td>
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
                        <button className="primary-button" onClick={() => setIsExportPreviewOpen(true)}>
                          <Download size={15} />导出 / 发起审批
                        </button>
                      </div>
                      <div className="table-wrap">
                        <table className="quote-table">
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
                                <td className="center"><button className="icon-button danger"><Trash2 size={16} /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="sheet-total">
                        <span>合计总金额:</span>
                        <strong>¥{calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
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
      </div>

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
                    <tr className="excel-total-row">
                      <td colSpan={11} />
                      <td className="right">{calculateTotal().toFixed(2)}</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setIsExportPreviewOpen(false)}>取消</button>
              <button className="export-button" onClick={() => { window.alert('Demo: 触发 Excel 实际下载动作'); setIsExportPreviewOpen(false); }}>
                <FileSpreadsheet size={16} />确认导出 Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
