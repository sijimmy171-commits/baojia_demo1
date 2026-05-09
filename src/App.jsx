import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
  ChevronLeft,
  ChevronRight,
  Coins,
  Cpu,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Folder,
  ListTodo,
  MessageSquare,
  Mic,
  Paperclip,
  PlusCircle,
  RotateCcw,
  Search,
  Send,
  Tag,
  Trash2,
  X,
} from 'lucide-react';

const PROJECTS_PER_PAGE = 5;
const GROUP_LABELS = ['今天', '昨天', '近7天'];

const SCENES = {
  junction_box: {
    label: '接线箱',
    quoteTitle: '接线箱报价助手',
    application: '防爆接线箱',
    description: '维护接线箱的格兰、端子、壳体、防雨罩与包装方案。',
  },
  distribution_box: {
    label: '配电箱',
    quoteTitle: '配电箱报价助手',
    application: '防爆配电箱',
    description: '维护配电箱的回路、电气元件、壳体、进出线与包装方案。',
  },
  operation_column: {
    label: '操作柱',
    quoteTitle: '操作柱报价助手',
    application: '防爆操作柱',
    description: '维护操作柱的按钮指示、立柱底座、铭牌、壳体与包装方案。',
  },
};

const SCENE_PARAM_CATEGORIES = {
  junction_box: ['格兰', '端子', '壳体', '防雨罩', '包装', '其他'],
  distribution_box: ['电气配置', '进出线', '壳体', '包装', '其他'],
  operation_column: ['操作元件', '立柱底座', '壳体', '铭牌', '包装', '其他'],
};

const FIELD_OPTIONS = {
  壳体: {
    箱体尺寸: ['300×200×150', '400×300×250', '420×320×260', '500×400×300', '600×500×250'],
    防爆等级: ['Ex eb IIC T6 Gb/Ex tb IIIC T80℃ Db', 'Ex db IIC T6 Gb', 'Ex eb mb IIC T5 Gb'],
    材质: ['不锈钢 316', '不锈钢 304', '碳钢喷塑', '铝合金'],
    厚度: ['标准薄型', '标准厚型', '加厚型'],
    防护等级: ['IP65', 'IP66', 'IP67'],
    安装方式: ['挂壁式', '立式', '落地式'],
  },
  格兰: {
    型号: ['BDM-H', 'BDM-II', 'BDM-III'],
    铠装: ['铠装', '非铠装'],
    螺纹规格: ['M20×1.5', 'M25×1.5', 'M32×1.5', 'NPT1/2'],
    材质: ['316L', '304', '黄铜镀镍', '工程塑料'],
    安装方向: ['下进下出', '侧进侧出', '上进下出'],
  },
  端子: {
    品牌: ['菲尼克斯', '魏德米勒', 'WAGO'],
    电流: ['10A', '20A', '32A', '60A', '100A'],
    防爆类型: ['增安型', '隔爆型', '本安型'],
  },
  防雨罩: {
    是否需要: ['需要', '不需要'],
    尺寸: ['标准尺寸', '加长型', '加宽型', '加高型'],
    壳体类型: ['立式壳体', '卧式壳体', '挂壁式壳体'],
    材质: ['不锈钢 316', '不锈钢 304', '碳钢喷塑'],
    样式: ['标准防雨罩', '斜顶式', '加筋式', '带滴水边'],
  },
  包装: {
    包装方式: ['木箱', '纸箱', '免熏蒸木箱'],
    铭牌要求: ['标准铭牌', '客户定制铭牌'],
  },
  其他: {
    其他字段类型: ['备注', '客户要求', '特殊附件'],
  },
  电气配置: {
    回路数: ['2回路', '4回路', '6回路', '8回路', '12回路'],
    主开关: ['DZ47-63 2P', 'DZ47-63 3P', '塑壳断路器 100A'],
    支路开关: ['C16 1P', 'C20 1P', 'C32 2P'],
    汇流排: ['铜排 20×3', '铜排 25×4', '绝缘汇流排'],
    漏保配置: ['不带漏保', '30mA 漏保', '100mA 漏保'],
  },
  进出线: {
    进线规格: ['M25×1.5', 'M32×1.5', 'M40×1.5'],
    出线规格: ['M20×1.5', 'M25×1.5', 'M32×1.5'],
    接线方向: ['下进下出', '上进下出', '侧进侧出'],
    门锁: ['普通锁', '三角锁', '防爆联锁'],
  },
  操作元件: {
    按钮数量: ['2只', '3只', '4只', '6只'],
    指示灯数量: ['1只', '2只', '3只'],
    急停: ['需要', '不需要'],
    转换开关: ['二位自复位', '二位保持', '三位保持'],
  },
  立柱底座: {
    立柱高度: ['800mm', '1000mm', '1200mm', '1500mm'],
    底座形式: ['圆底座', '方底座', '法兰底座'],
    引入口: ['底部进线', '侧面进线'],
    安装环境: ['室内', '室外', '海工防腐'],
  },
  铭牌: {
    铭牌语言: ['中文', '英文', '中英文'],
    铭牌材质: ['不锈钢蚀刻', '铝牌丝印', 'PVC 标签'],
    位号标识: ['按客户图纸', '按默认编号', '现场留白'],
  },
};

const DEBUG_TABLES = {
  material: [
    {
      key: 'shell',
      label: '壳体物料',
      rows: [
        { code: '03.03.03.100006', name: '防爆接线箱壳体', category: '壳体', spec: '420×320×260', scene: '接线箱' },
        { code: '03.03.04.100012', name: '防爆配电箱壳体', category: '壳体', spec: '500×400×300', scene: '配电箱' },
        { code: '03.03.05.100021', name: '防爆操作柱壳体', category: '壳体', spec: '二孔操作柱', scene: '操作柱' },
      ],
    },
    {
      key: 'gland',
      label: '格兰物料',
      rows: [
        { code: '07.03.02.08.80027L', name: '格兰', category: '格兰', spec: 'BDM-H-M20×1.5-316L', scene: '通用' },
        { code: '07.03.02.08.80029L', name: '格兰', category: '格兰', spec: 'BDM-H-M25×1.5-316L', scene: '通用' },
        { code: '07.03.02.08.80032L', name: '格兰', category: '格兰', spec: 'BDM-H-M32×1.5-316L', scene: '通用' },
      ],
    },
    {
      key: 'terminal',
      label: '端子物料',
      rows: [
        { code: '03.02.21.000045', name: '接线端子', category: '端子', spec: 'UK3N / 20A', scene: '通用' },
        { code: '03.02.21.000077', name: '接地端子', category: '端子', spec: 'USLKG 5', scene: '通用' },
      ],
    },
    {
      key: 'distribution',
      label: '配电箱电气件',
      rows: [
        { code: '06.01.11.000101', name: '小型断路器', category: '电气件', spec: 'DZ47-63 C20 2P', scene: '配电箱' },
        { code: '06.01.12.000118', name: '汇流排', category: '电气件', spec: '铜排 20×3', scene: '配电箱' },
      ],
    },
    {
      key: 'operation',
      label: '操作柱元件',
      rows: [
        { code: '06.02.02.000211', name: '防爆按钮', category: '操作元件', spec: '红/绿 一常开一常闭', scene: '操作柱' },
        { code: '06.02.03.000309', name: '防爆指示灯', category: '操作元件', spec: 'AC220V 红色', scene: '操作柱' },
      ],
    },
  ],
  config: [
    {
      key: 'match',
      label: 'BOM 匹配规则',
      rows: [
        { code: 'RULE-GLAND-001', name: '格兰匹配', category: '逻辑规则', spec: '型号 + 螺纹 + 材质 -> 物料编码', scene: '通用' },
        { code: 'RULE-DIST-001', name: '配电箱回路匹配', category: '逻辑规则', spec: '回路数 + 开关规格 -> 电气件 BOM', scene: '配电箱' },
        { code: 'RULE-OP-001', name: '操作柱元件匹配', category: '逻辑规则', spec: '按钮/灯/急停数量 -> 操作元件 BOM', scene: '操作柱' },
      ],
    },
    {
      key: 'packaging',
      label: '包装规则',
      rows: [
        { code: 'PKG-001', name: '木箱兜底', category: '包装规则', spec: '按箱体外形尺寸外扩 80mm', scene: '通用' },
        { code: 'PKG-002', name: '操作柱包装', category: '包装规则', spec: '立柱类按高度分段保护', scene: '操作柱' },
      ],
    },
  ],
};

const SCENE_TYPE_BY_PRODUCT = {
  接线箱: 'junction_box',
  防爆接线箱: 'junction_box',
  配电箱: 'distribution_box',
  防爆配电箱: 'distribution_box',
  操作柱: 'operation_column',
  防爆操作柱: 'operation_column',
};

const EXCEL_REQUIRED_HEADERS = ['序号', '产品类别'];

function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}

function renderRichMessage(text, isAi) {
  return String(text)
    .split('**')
    .map((part, index) => (index % 2 === 1 ? <strong key={`${part}-${index}`} className={isAi ? 'ai-highlight' : ''}>{part}</strong> : part));
}

function getScene(sceneType) {
  return SCENES[sceneType] || SCENES.junction_box;
}

function getFieldSuggestions(category, field) {
  return FIELD_OPTIONS[category]?.[field] || [];
}

function makeChat(sceneType = 'junction_box') {
  if (sceneType === 'distribution_box') {
    return [
      { id: 1, sender: 'ai', text: '已创建“配电箱改造”项目，请补充回路、开关和安装要求。', time: '09:20' },
      { id: 2, sender: 'user', text: '需要一台防爆配电箱，4回路，主开关 63A，支路 C20，下进下出，IP66。', time: '09:22' },
      { id: 3, sender: 'ai', text: '已解析为配电箱场景。强依赖项为 **回路数、主开关、支路开关、箱体尺寸**，已先生成演示 BOM。', time: '09:23' },
    ];
  }
  if (sceneType === 'operation_column') {
    return [
      { id: 1, sender: 'ai', text: '已创建“操作柱联锁控制”项目，请补充按钮、指示灯和立柱要求。', time: '10:10' },
      { id: 2, sender: 'user', text: '做一台防爆操作柱，2按钮、2指示灯、带急停，立柱 1000mm，室外安装。', time: '10:12' },
      { id: 3, sender: 'ai', text: '已识别为操作柱场景。按钮、指示灯、急停、立柱高度会作为本场景核心参数参与 BOM 匹配。', time: '10:13' },
    ];
  }
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

function makeParameters(sceneType = 'junction_box', versionId = 'v1.0') {
  const isLatest = versionId === 'v1.1';
  const common = [
    { id: 'shell-dimension', category: '壳体', field: '箱体尺寸', value: isLatest ? '420×320×260' : '400×300×250', dependency: 'strong', note: '支持直接录入非标尺寸' },
    { id: 'shell-explosion', category: '壳体', field: '防爆等级', value: 'Ex eb IIC T6 Gb/Ex tb IIIC T80℃ Db', dependency: 'strong' },
    { id: 'shell-material', category: '壳体', field: '材质', value: '不锈钢 316', dependency: 'strong' },
    { id: 'shell-thickness', category: '壳体', field: '厚度', value: '标准薄型', dependency: 'weak' },
    { id: 'shell-protection', category: '壳体', field: '防护等级', value: 'IP66', dependency: 'weak' },
    { id: 'package-style', category: '包装', field: '包装方式', value: '木箱', dependency: 'weak' },
    { id: 'package-mark', category: '包装', field: '铭牌要求', value: '标准铭牌', dependency: 'weak' },
    { id: 'other-type', category: '其他', field: '其他字段类型', value: '', dependency: 'weak', note: '用于补充特殊商务或技术要求' },
    { id: 'other-content', category: '其他', field: '其他字段内容', value: '', dependency: 'weak', note: '可填写客户特别要求、交期、认证等' },
  ];

  if (sceneType === 'distribution_box') {
    return [
      { id: 'dist-loop', category: '电气配置', field: '回路数', value: '4回路', dependency: 'strong' },
      { id: 'dist-main', category: '电气配置', field: '主开关', value: 'DZ47-63 3P', dependency: 'strong' },
      { id: 'dist-branch', category: '电气配置', field: '支路开关', value: 'C20 1P', dependency: 'strong' },
      { id: 'dist-busbar', category: '电气配置', field: '汇流排', value: '铜排 20×3', dependency: 'weak' },
      { id: 'dist-leakage', category: '电气配置', field: '漏保配置', value: '30mA 漏保', dependency: 'weak' },
      { id: 'wire-in', category: '进出线', field: '进线规格', value: 'M32×1.5', dependency: 'strong' },
      { id: 'wire-out', category: '进出线', field: '出线规格', value: 'M25×1.5', dependency: 'strong' },
      { id: 'wire-dir', category: '进出线', field: '接线方向', value: '下进下出', dependency: 'strong' },
      { id: 'door-lock', category: '进出线', field: '门锁', value: '三角锁', dependency: 'weak' },
      ...common.map((item) => (item.id === 'shell-dimension' ? { ...item, value: '500×400×300' } : item)),
    ];
  }

  if (sceneType === 'operation_column') {
    return [
      { id: 'op-button', category: '操作元件', field: '按钮数量', value: '2只', dependency: 'strong' },
      { id: 'op-light', category: '操作元件', field: '指示灯数量', value: '2只', dependency: 'strong' },
      { id: 'op-stop', category: '操作元件', field: '急停', value: '需要', dependency: 'strong' },
      { id: 'op-switch', category: '操作元件', field: '转换开关', value: '二位保持', dependency: 'weak' },
      { id: 'column-height', category: '立柱底座', field: '立柱高度', value: '1000mm', dependency: 'strong' },
      { id: 'base-type', category: '立柱底座', field: '底座形式', value: '法兰底座', dependency: 'strong' },
      { id: 'entry-type', category: '立柱底座', field: '引入口', value: '底部进线', dependency: 'weak' },
      { id: 'install-env', category: '立柱底座', field: '安装环境', value: '室外', dependency: 'weak' },
      { id: 'plate-lang', category: '铭牌', field: '铭牌语言', value: '中文', dependency: 'weak' },
      { id: 'plate-material', category: '铭牌', field: '铭牌材质', value: '不锈钢蚀刻', dependency: 'weak' },
      { id: 'plate-tag', category: '铭牌', field: '位号标识', value: '按客户图纸', dependency: 'weak' },
      ...common.map((item) => (item.id === 'shell-dimension' ? { ...item, value: '二孔操作柱' } : item)),
    ];
  }

  return [
    { id: 'rain-required', category: '防雨罩', field: '是否需要', value: '需要', dependency: 'weak' },
    { id: 'rain-size', category: '防雨罩', field: '尺寸', value: isLatest ? '加高型' : '标准尺寸', dependency: 'weak' },
    { id: 'rain-shell-type', category: '防雨罩', field: '壳体类型', value: '立式壳体', dependency: 'weak' },
    { id: 'rain-material', category: '防雨罩', field: '材质', value: '不锈钢 316', dependency: 'weak' },
    { id: 'rain-style', category: '防雨罩', field: '样式', value: '标准防雨罩', dependency: 'weak' },
    ...common,
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

function withTotals(items) {
  return items.map((item) => ({ ...item, total: Number(((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)).toFixed(2)) }));
}

function normalizeExcelText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function findExcelValue(row, exactName) {
  const direct = row[exactName];
  if (direct !== undefined) return normalizeExcelText(direct);
  const matchKey = Object.keys(row).find((key) => normalizeExcelText(key) === exactName || normalizeExcelText(key).includes(exactName));
  return matchKey ? normalizeExcelText(row[matchKey]) : '';
}

function parseTerminalCurrent(value) {
  const text = normalizeExcelText(value);
  const ampMatch = text.match(/(\d+(?:\.\d+)?)\s*A/i);
  const sectionMatch = text.match(/(\d+(?:\.\d+)?(?:\s*[～~-]\s*\d+(?:\.\d+)?)?)\s*mm/i);
  return {
    current: ampMatch ? `${ampMatch[1]}A` : text,
    wireSection: sectionMatch ? `${sectionMatch[1].replace(/\s/g, '')}mm2` : '',
  };
}

function normalizeThreadSpec(value) {
  return normalizeExcelText(value)
    .replace(/\*/g, '×')
    .replace(/x/gi, '×')
    .replace(/M(\d+)\s*×\s*(\d+(?:\.\d+)?)/i, 'M$1×$2')
    .replace(/^G/i, 'G');
}

function inferGlandMeta(typeText) {
  const text = normalizeExcelText(typeText);
  const modelMatch = text.match(/BDM-[A-Z]+/i);
  return {
    model: modelMatch ? modelMatch[0].toUpperCase() : 'BDM-H',
    armored: text.includes('非铠装') ? '非铠装' : text.includes('铠装') ? '铠装' : '',
  };
}

function parseGlandSpecRows(typeText, specText, direction, prefix) {
  const meta = inferGlandMeta(typeText);
  const source = normalizeExcelText(specText);
  if (!source || source === '0') return [];
  return source.split('+').map((part, index) => {
    const item = normalizeExcelText(part);
    const match = item.match(/^(\d+)\s*[-x×]?\s*(.+)$/i);
    const quantity = match ? match[1] : '1';
    const threadSpec = normalizeThreadSpec(match ? match[2] : item);
    return {
      id: `${prefix}-${index + 1}-${Date.now()}`,
      model: meta.model,
      armored: meta.armored,
      threadSpec,
      material: '',
      installDirection: direction || '下进下出',
      quantity,
    };
  });
}

function applyParamValue(params, category, field, value, note) {
  let found = false;
  const next = params.map((param) => {
    if (param.category === category && param.field === field) {
      found = true;
      return { ...param, value: value || param.value, note: note || param.note };
    }
    return param;
  });
  if (!found && value) {
    next.push({ id: `excel-${category}-${field}-${Date.now()}`, category, field, value, dependency: 'weak', note });
  }
  return next;
}

function materialCodeForGland(threadSpec) {
  if (threadSpec.includes('M32')) return '07.03.02.08.80032L';
  if (threadSpec.includes('M25') || threadSpec.includes('G3/4')) return '07.03.02.08.80029L';
  if (threadSpec.includes('M20') || threadSpec.includes('G1/2')) return '07.03.02.08.80027L';
  if (threadSpec.includes('G1')) return '07.03.02.08.80031L';
  return '07.03.02.08.80000L';
}

function makeImportedJunctionQuotation(row, glandRows, terminalRow, params) {
  const material = findExcelValue(row, '箱体材质') || params.find((item) => item.category === '壳体' && item.field === '材质')?.value || '-';
  const explosion = findExcelValue(row, '防爆标志');
  const rain = findExcelValue(row, '是否需要防雨罩');
  const plug = findExcelValue(row, '堵头数量及规格');
  const breather = findExcelValue(row, '呼吸阀材质');
  const terminalQty = Number(terminalRow.quantity) || 0;
  const baseItems = [
    { id: 'q-shell', code: '03.03.03.100006', name: '防爆接线箱壳体', brand: '-', model: `${material} / ${explosion || '防爆'}`, quantity: 1, unitPrice: material.includes('316') ? 1880 : material.includes('铝合金') ? 1280 : 1580 },
    { id: 'q-terminal', code: '03.02.21.000045', name: '接线端子', brand: terminalRow.brand || '-', model: `${terminalRow.current || '20A'} ${terminalRow.wireSection || ''}`.trim(), quantity: terminalQty || 1, unitPrice: 1.8 },
    ...glandRows.map((item, index) => ({ id: `q-gland-${index + 1}`, code: materialCodeForGland(item.threadSpec), name: '格兰', brand: '-', model: `${item.model}-${item.threadSpec}-${item.armored || '标准'}`, quantity: Number(item.quantity) || 1, unitPrice: item.threadSpec.includes('M32') || item.threadSpec.includes('G1') ? 70.5 : item.threadSpec.includes('M25') || item.threadSpec.includes('G3/4') ? 51 : 40.5 })),
  ];
  if (rain && !rain.includes('不配')) {
    baseItems.push({ id: 'q-rain', code: '03.07.02.000955', name: '防雨罩', brand: '-', model: rain, quantity: 1, unitPrice: 264.34 });
  }
  if (plug && plug !== '0') {
    baseItems.push({ id: 'q-plug', code: '07.03.09.000100', name: '堵头', brand: '-', model: plug, quantity: 1, unitPrice: 32 });
  }
  if (breather && !breather.includes('不配')) {
    baseItems.push({ id: 'q-breather', code: '07.03.10.000210', name: '呼吸阀', brand: '-', model: breather, quantity: 1, unitPrice: 96 });
  }
  return withTotals(baseItems);
}

function makeImportedVersionData(row, sceneType) {
  const base = makeVersionData(sceneType, 'v1.0');
  if (sceneType !== 'junction_box') return base;

  const terminalInfo = parseTerminalCurrent(findExcelValue(row, '端子电流/客户导线平方'));
  const direction = findExcelValue(row, '进出线方向') || '下进下出';
  const glandRows = [
    ...parseGlandSpecRows(findExcelValue(row, '进线格兰类型'), findExcelValue(row, '进线格兰数量及规格'), direction, 'excel-in'),
    ...parseGlandSpecRows(findExcelValue(row, '出线格兰类型'), findExcelValue(row, '出线格兰数量及规格'), direction, 'excel-out'),
  ];
  const terminalRow = {
    id: 'excel-terminal-1',
    brand: findExcelValue(row, '端子品牌'),
    current: terminalInfo.current,
    explosionType: findExcelValue(row, '防爆标志').includes('增安') ? '增安型' : '隔爆型',
    quantity: findExcelValue(row, '端子数量'),
    wireSection: terminalInfo.wireSection,
  };

  let params = base.parameters;
  params = applyParamValue(params, '壳体', '材质', findExcelValue(row, '箱体材质'));
  params = applyParamValue(params, '壳体', '防爆等级', findExcelValue(row, '防爆标志'));
  params = applyParamValue(params, '壳体', '安装方式', findExcelValue(row, '安装方式'));
  params = applyParamValue(params, '防雨罩', '是否需要', findExcelValue(row, '是否需要防雨罩'));
  params = applyParamValue(params, '其他', '其他字段类型', 'Excel导入备注');
  params = applyParamValue(
    params,
    '其他',
    '其他字段内容',
    [
      findExcelValue(row, '堵头数量及规格') && `堵头：${findExcelValue(row, '堵头数量及规格')}`,
      findExcelValue(row, '堵头是否开孔') && `堵头开孔：${findExcelValue(row, '堵头是否开孔')}`,
      findExcelValue(row, '呼吸阀材质') && `呼吸阀：${findExcelValue(row, '呼吸阀材质')}`,
      findExcelValue(row, '箱体颜色') && `颜色：${findExcelValue(row, '箱体颜色')}`,
      findExcelValue(row, '其他要求备注'),
    ].filter(Boolean).join('；'),
  );

  return {
    ...base,
    parameters: params,
    glandRows,
    terminalRows: [terminalRow],
    quotation: { items: makeImportedJunctionQuotation(row, glandRows, terminalRow, params) },
  };
}

function makeImportedProjectFromRow(importRow, index) {
  const now = new Date();
  const version = { id: 'v1.0', label: 'V1.0 Excel导入首版', timestamp: now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), isLatest: true };
  const scene = getScene(importRow.sceneType);
  const id = `excel-${Date.now()}-${index}-${importRow.seq}`;
  return {
    id,
    sceneType: importRow.sceneType,
    dateGroup: '今天',
    info: {
      engineer: '测试员',
      client: 'Excel批量导入客户',
      name: `Excel导入-序号${importRow.seq}-${scene.label}`,
    },
    chat: [
      { id: Date.now() + index * 10 + 1, sender: 'ai', text: `已从 Excel 第 ${importRow.rowNumber} 行导入 ${scene.label} 项目。`, time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) },
      { id: Date.now() + index * 10 + 2, sender: 'user', text: importRow.summary, time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) },
    ],
    versions: [version],
    data: { [version.id]: makeImportedVersionData(importRow.raw, importRow.sceneType) },
  };
}

function parseImportWorksheet(workbook, fileName) {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  const headers = rows.length ? Object.keys(rows[0]).map(normalizeExcelText) : [];
  const missingHeaders = EXCEL_REQUIRED_HEADERS.filter((header) => !headers.some((item) => item === header));
  if (!rows.length || missingHeaders.length) {
    return { fileName, sheetName: sheetName || '-', rows: [], errors: [`缺少必要表头：${missingHeaders.join('、') || '序号、产品类别'}`] };
  }

  const seenSeq = new Set();
  const importRows = rows.map((raw, index) => {
    const seq = findExcelValue(raw, '序号');
    const productType = findExcelValue(raw, '产品类别');
    const hasBusinessValue = Object.entries(raw).some(([key, value]) => normalizeExcelText(key) !== '序号' && normalizeExcelText(value));
    if (!seq || !hasBusinessValue) return null;
    const sceneType = SCENE_TYPE_BY_PRODUCT[productType];
    const status = [];
    if (!productType) status.push({ type: 'error', message: '缺少产品类别' });
    if (productType && !sceneType) status.push({ type: 'error', message: `未知产品类别：${productType}` });
    if (seenSeq.has(seq)) status.push({ type: 'warning', message: `序号 ${seq} 重复` });
    seenSeq.add(seq);
    const summary = [
      findExcelValue(raw, '箱体材质'),
      findExcelValue(raw, '防爆标志'),
      findExcelValue(raw, '端子数量') && `${findExcelValue(raw, '端子数量')}个端子`,
      findExcelValue(raw, '进线格兰数量及规格'),
      findExcelValue(raw, '出线格兰数量及规格'),
    ].filter(Boolean).join(' / ');
    return {
      id: `${seq}-${index + 2}`,
      seq,
      rowNumber: index + 2,
      productType,
      sceneType: sceneType || 'unknown',
      sceneLabel: sceneType ? getScene(sceneType).label : '-',
      projectName: sceneType ? `Excel导入-序号${seq}-${getScene(sceneType).label}` : `Excel导入-序号${seq}`,
      summary,
      status,
      raw,
    };
  }).filter(Boolean);

  return { fileName, sheetName, rows: importRows, errors: [] };
}

function makeQuotationItems(sceneType = 'junction_box', versionId = 'v1.0') {
  const isLatest = versionId === 'v1.1';
  if (sceneType === 'distribution_box') {
    return withTotals([
      { id: 'q1', code: '03.03.04.100012', name: '防爆配电箱壳体', brand: '-', model: '500×400×300', quantity: 1, unitPrice: 2260 },
      { id: 'q2', code: '06.01.11.000101', name: '小型断路器', brand: '正泰', model: 'DZ47-63 C20 2P', quantity: 4, unitPrice: 58 },
      { id: 'q3', code: '06.01.12.000118', name: '汇流排', brand: '-', model: '铜排 20×3', quantity: 1, unitPrice: 156 },
      { id: 'q4', code: '07.03.02.08.80029L', name: '进出线格兰', brand: '-', model: 'BDM-H-M25×1.5-316L', quantity: 5, unitPrice: 51 },
      { id: 'q5', code: '09.01.01.000044', name: '门锁组件', brand: '-', model: '三角锁', quantity: 1, unitPrice: 36 },
    ]);
  }
  if (sceneType === 'operation_column') {
    return withTotals([
      { id: 'q1', code: '03.03.05.100021', name: '防爆操作柱壳体', brand: '-', model: '二孔操作柱', quantity: 1, unitPrice: 1280 },
      { id: 'q2', code: '06.02.02.000211', name: '防爆按钮', brand: '-', model: '红/绿 一常开一常闭', quantity: 2, unitPrice: 86 },
      { id: 'q3', code: '06.02.03.000309', name: '防爆指示灯', brand: '-', model: 'AC220V 红色', quantity: 2, unitPrice: 72 },
      { id: 'q4', code: '06.02.04.000416', name: '急停按钮', brand: '-', model: '蘑菇头自锁', quantity: 1, unitPrice: 118 },
      { id: 'q5', code: '03.08.01.000066', name: '立柱底座', brand: '-', model: '1000mm 法兰底座', quantity: 1, unitPrice: 410 },
    ]);
  }
  return withTotals([
    { id: 'q1', code: '03.03.03.100006', name: '防爆接线箱壳体', brand: '-', model: isLatest ? '420×320×260' : '400×300×250', quantity: 1, unitPrice: isLatest ? 1788.71 : 1688.71 },
    { id: 'q2', code: '03.07.02.000955', name: '防雨罩', brand: '-', model: isLatest ? '487×155×260' : '467×145×250', quantity: 1, unitPrice: isLatest ? 284.34 : 264.34 },
    { id: 'q3', code: '03.02.21.000045', name: '接线端子', brand: '菲尼克斯', model: 'UK3N', quantity: 30, unitPrice: 1.757 },
    { id: 'q4', code: '07.03.02.08.80032L', name: '格兰', brand: '-', model: 'BDM-H-M32×1.5-316L', quantity: 1, unitPrice: 70.5 },
    { id: 'q5', code: '07.03.02.08.80029L', name: '格兰', brand: '-', model: 'BDM-H-M25×1.5-316L', quantity: isLatest ? 2 : 3, unitPrice: 51 },
    { id: 'q6', code: '07.03.02.08.80027L', name: '格兰', brand: '-', model: 'BDM-H-M20×1.5-316L', quantity: isLatest ? 5 : 4, unitPrice: 40.5 },
  ]);
}

function makeVersionData(sceneType = 'junction_box', versionId = 'v1.0') {
  const dimensionByScene = {
    junction_box: versionId === 'v1.1' ? '420×320×260' : '400×300×250',
    distribution_box: '500×400×300',
    operation_column: '二孔操作柱',
  };
  return {
    dimensions: { suggested: dimensionByScene[sceneType] || dimensionByScene.junction_box, manual: '' },
    parameters: makeParameters(sceneType, versionId),
    glandRows: sceneType === 'junction_box' ? makeGlandRows(versionId) : [],
    terminalRows: sceneType === 'junction_box' ? makeTerminalRows(versionId) : [],
    quotation: { items: makeQuotationItems(sceneType, versionId) },
  };
}

function makeProject(index, overrides = {}) {
  const sceneType = overrides.sceneType || (index === 6 ? 'distribution_box' : index === 9 ? 'operation_column' : 'junction_box');
  const scene = getScene(sceneType);
  const isPrimary = index === 1;
  const versions = isPrimary
    ? [
        { id: 'v1.0', label: 'V1.0 首版报价', timestamp: '2026-04-07 14:05:30', isLatest: false },
        { id: 'v1.1', label: 'V1.1 客户反馈修订', timestamp: '2026-04-07 14:19:00', isLatest: true },
      ]
    : [{ id: 'v1.0', label: 'V1.0 首版报价', timestamp: `2026-04-${String(Math.min(index + 1, 28)).padStart(2, '0')} 10:00:00`, isLatest: true }];
  const defaultNames = {
    junction_box: isPrimary ? '防爆接线箱非标定制' : `常规防爆接线箱采购-${index}`,
    distribution_box: `防爆配电箱改造-${index}`,
    operation_column: `防爆操作柱联锁控制-${index}`,
  };
  return {
    id: `proj-${index}`,
    sceneType,
    dateGroup: index <= 4 ? '今天' : index <= 8 ? '昨天' : '近7天',
    info: {
      engineer: '测试员',
      client: isPrimary ? '连云港神宇石化机械设备...' : `江苏特种设备厂 ${index}期`,
      name: defaultNames[sceneType] || `${scene.label}报价-${index}`,
    },
    chat: isPrimary || sceneType !== 'junction_box' ? makeChat(sceneType) : [],
    versions,
    data: versions.reduce((acc, version) => ({ ...acc, [version.id]: makeVersionData(sceneType, version.id) }), {}),
    ...overrides,
  };
}

function getArchiveWiring(project, data) {
  if (project.sceneType === 'distribution_box') {
    const params = data.parameters || [];
    const loop = params.find((item) => item.field === '回路数')?.value || '-';
    const direction = params.find((item) => item.field === '接线方向')?.value || '-';
    return `${loop} / ${direction}`;
  }
  if (project.sceneType === 'operation_column') {
    const params = data.parameters || [];
    const buttons = params.find((item) => item.field === '按钮数量')?.value || '-';
    const lights = params.find((item) => item.field === '指示灯数量')?.value || '-';
    const height = params.find((item) => item.field === '立柱高度')?.value || '-';
    return `${buttons} / ${lights} / ${height}`;
  }
  return data.glandRows?.map((item) => item.threadSpec).filter(Boolean).join(' / ') || '-';
}

function createArchiveRecord(project, version, data, total, quoteNumber) {
  const params = data.parameters || [];
  const scene = getScene(project.sceneType);
  const material = params.find((item) => item.field === '材质' && item.category === '壳体')?.value || '-';
  const explosionLevel = params.find((item) => item.field === '防爆等级' && item.category === '壳体')?.value || '-';
  const dimension = data.dimensions?.manual || data.dimensions?.suggested || '-';
  return {
    id: `${project.id}-${version.id}-${Date.now()}`,
    projectId: project.id,
    versionId: version.id,
    sceneType: project.sceneType,
    title: `${project.info.client} / ${project.info.name}`,
    client: project.info.client,
    versionLabel: version.label,
    archivedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    quoteNumber,
    total,
    dimensions: dimension,
    application: scene.application,
    productType: project.info.name,
    material,
    explosionLevel,
    wiring: getArchiveWiring(project, data),
    matchScore: project.sceneType === 'junction_box' ? 96 : 91,
    matchHighlights: ['同场景报价结构可复用', '壳体与核心物料规则已匹配'],
    matchDiffs: ['客户定制项需要人工复核后再引用'],
    quoteBreakdown: [
      { label: '壳体与机加工', amount: Number((total * 0.42).toFixed(2)) },
      { label: project.sceneType === 'operation_column' ? '按钮及操作元件' : '端子及电气件', amount: Number((total * 0.24).toFixed(2)) },
      { label: '格兰与辅材', amount: Number((total * 0.18).toFixed(2)) },
      { label: '包装与管理费', amount: Number((total * 0.16).toFixed(2)) },
    ],
    bomPreview: (data.quotation?.items || []).slice(0, 6).map((item) => ({ code: item.code, name: item.name, model: item.model, qty: item.quantity })),
  };
}

function rowHasMissing(row, keys) {
  return keys.some((key) => !String(row[key] ?? '').trim());
}

function getMissingRequirementLabels(sceneType, parameters, glandRows, terminalRows, dimensionValue) {
  const labels = new Set();
  parameters.forEach((param) => {
    if (param.dependency === 'strong' && !String(param.value ?? '').trim()) labels.add(`${param.category} - ${param.field}`);
  });
  if (sceneType === 'junction_box') {
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
  }
  if (!String(dimensionValue ?? '').trim()) labels.add('壳体 - 箱体尺寸');
  return Array.from(labels);
}

function updateVersionData(projects, projectId, versionId, updater) {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    const currentData = project.data[versionId];
    return { ...project, data: { ...project.data, [versionId]: updater(cloneDeep(currentData)) } };
  });
}

const INITIAL_PROJECTS = Array.from({ length: 12 }, (_, index) => makeProject(index + 1));
const INITIAL_ARCHIVES = [
  createArchiveRecord(INITIAL_PROJECTS[0], INITIAL_PROJECTS[0].versions[0], INITIAL_PROJECTS[0].data['v1.0'], 2370.26, '202604070054-A001-V10'),
  createArchiveRecord(INITIAL_PROJECTS[5], INITIAL_PROJECTS[5].versions[0], INITIAL_PROJECTS[5].data['v1.0'], 2939, '202604090071-D001-V10'),
  createArchiveRecord(INITIAL_PROJECTS[8], INITIAL_PROJECTS[8].versions[0], INITIAL_PROJECTS[8].data['v1.0'], 2124, '202604110088-O001-V10'),
];

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [debugTables, setDebugTables] = useState(() => cloneDeep(DEBUG_TABLES));
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
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [createSceneType, setCreateSceneType] = useState('junction_box');
  const [createProjectName, setCreateProjectName] = useState('');
  const [debugMode, setDebugMode] = useState('material');
  const [debugTableKey, setDebugTableKey] = useState(DEBUG_TABLES.material[0].key);
  const [debugSearch, setDebugSearch] = useState('');
  const [debugEditingId, setDebugEditingId] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [importError, setImportError] = useState('');
  const chatScrollRef = useRef(null);
  const excelInputRef = useRef(null);

  const archivedProjectIdSet = useMemo(() => new Set(archivedProjectIds), [archivedProjectIds]);
  const currentProject = useMemo(() => projects.find((project) => project.id === activeProjectId) || projects[0], [activeProjectId, projects]);
  const currentScene = getScene(currentProject?.sceneType);
  const currentCategories = SCENE_PARAM_CATEGORIES[currentProject?.sceneType] || SCENE_PARAM_CATEGORIES.junction_box;
  const currentVersion = currentProject?.versions.find((version) => version.id === activeVersionId) || currentProject?.versions[currentProject.versions.length - 1];
  const currentData = currentProject?.data?.[currentVersion?.id];
  const currentChat = currentProject?.chat || [];
  const todayDateStr = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
  const quoteNumber = currentVersion ? `202604070054-A001-${currentVersion.id.toUpperCase().replace('.', '')}` : '202604070054-A001-V00';
  const currentQuoteTotal = (currentData?.quotation?.items || []).reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  const orderedFilteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return GROUP_LABELS.flatMap((group) =>
      projects.filter((project) => {
        if (project.dateGroup !== group) return false;
        if (archivedProjectIdSet.has(project.id)) return false;
        if (!query) return true;
        const sceneLabel = getScene(project.sceneType).label;
        return [project.info.client, project.info.name, sceneLabel].join(' ').toLowerCase().includes(query);
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

  const filteredArchives = useMemo(() => {
    const query = archiveSearch.trim().toLowerCase();
    return archives.filter((item) => {
      const queryText = [item.title, item.client, item.quoteNumber, item.productType, item.material, item.explosionLevel, item.wiring, item.dimensions, item.application].join(' ').toLowerCase();
      const matchesQuery = !query || queryText.includes(query);
      const matchesFilter =
        archiveQuickFilter === 'all' ||
        (archiveQuickFilter === 'same-material' && item.material?.includes('316')) ||
        (archiveQuickFilter === 'same-explosion' && item.explosionLevel?.includes('Ex eb')) ||
        (archiveQuickFilter === 'same-structure' && item.wiring && item.wiring !== '-');
      return matchesQuery && matchesFilter;
    });
  }, [archiveQuickFilter, archiveSearch, archives]);

  const selectedArchive = filteredArchives.find((item) => item.id === selectedArchiveId) || filteredArchives[0] || null;
  const recommendedArchive = useMemo(() => {
    const sameScene = archives.filter((item) => item.sceneType === currentProject?.sceneType);
    return [...(sameScene.length ? sameScene : archives)].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))[0] || null;
  }, [archives, currentProject?.sceneType]);

  const activeDebugTable = useMemo(() => {
    const tables = debugTables[debugMode] || [];
    return tables.find((item) => item.key === debugTableKey) || tables[0];
  }, [debugMode, debugTableKey, debugTables]);

  const filteredDebugRows = useMemo(() => {
    const rows = activeDebugTable?.rows || [];
    const query = debugSearch.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => [row.code, row.name, row.category, row.spec, row.scene].join(' ').toLowerCase().includes(query));
  }, [activeDebugTable, debugSearch]);

  const importStats = useMemo(() => {
    const rows = importPreview?.rows || [];
    const valid = rows.filter((row) => !row.status.some((item) => item.type === 'error'));
    const warnings = rows.reduce((sum, row) => sum + row.status.filter((item) => item.type === 'warning').length, 0);
    const errors = rows.reduce((sum, row) => sum + row.status.filter((item) => item.type === 'error').length, 0) + (importPreview?.errors?.length || 0);
    return { total: rows.length, valid: valid.length, warnings, errors };
  }, [importPreview]);

  useEffect(() => {
    if (currentProject && !currentProject.versions.some((version) => version.id === activeVersionId)) {
      setActiveVersionId(currentProject.versions[currentProject.versions.length - 1].id);
    }
  }, [activeVersionId, currentProject]);

  useEffect(() => {
    if (!currentCategories.includes(activeSubCategory)) {
      setActiveSubCategory(currentCategories[0]);
    }
  }, [activeSubCategory, currentCategories]);

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

  useEffect(() => {
    const tables = debugTables[debugMode] || [];
    if (tables.length && !tables.some((table) => table.key === debugTableKey)) {
      setDebugTableKey(tables[0].key);
    }
  }, [debugMode, debugTableKey, debugTables]);

  const updateCurrentVersion = (updater) => {
    if (!currentProject || !currentVersion) return;
    setProjects((prev) => updateVersionData(prev, currentProject.id, currentVersion.id, updater));
  };

  const updateParamValue = (paramId, value) => {
    updateCurrentVersion((data) => {
      const nextParams = data.parameters.map((param) => (param.id === paramId ? { ...param, value } : param));
      const dimensionParam = nextParams.find((item) => item.id === 'shell-dimension');
      return { ...data, parameters: nextParams, dimensions: { ...data.dimensions, suggested: dimensionParam?.value || data.dimensions?.suggested } };
    });
  };

  const updateGlandRow = (rowId, field, value) => updateCurrentVersion((data) => ({ ...data, glandRows: data.glandRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)) }));
  const updateTerminalRow = (rowId, field, value) => updateCurrentVersion((data) => ({ ...data, terminalRows: data.terminalRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)) }));
  const addGlandRow = () => updateCurrentVersion((data) => ({ ...data, glandRows: [...data.glandRows, { id: `g-${Date.now()}`, model: '', armored: '', threadSpec: '', material: '', installDirection: '', quantity: '1' }] }));
  const addTerminalRow = () => updateCurrentVersion((data) => ({ ...data, terminalRows: [...data.terminalRows, { id: `t-${Date.now()}`, brand: '', current: '', explosionType: '', quantity: '', wireSection: '' }] }));
  const deleteGlandRow = (rowId) => updateCurrentVersion((data) => ({ ...data, glandRows: data.glandRows.filter((row) => row.id !== rowId) }));
  const deleteTerminalRow = (rowId) => updateCurrentVersion((data) => ({ ...data, terminalRows: data.terminalRows.filter((row) => row.id !== rowId) }));

  const addBomItem = () => updateCurrentVersion((data) => ({
    ...data,
    quotation: { ...data.quotation, items: [...data.quotation.items, { id: `q-${Date.now()}`, code: '', name: '新增物料', brand: '-', model: '', quantity: 1, unitPrice: 0, total: 0 }] },
  }));
  const deleteBomItem = (itemId) => updateCurrentVersion((data) => ({ ...data, quotation: { ...data.quotation, items: data.quotation.items.filter((item) => item.id !== itemId) } }));
  const updateBomItem = (itemId, field, value) => {
    updateCurrentVersion((data) => ({
      ...data,
      quotation: {
        ...data.quotation,
        items: data.quotation.items.map((item) => {
          if (item.id !== itemId) return item;
          const nextItem = { ...item, [field]: value };
          const quantity = Number(nextItem.quantity) || 0;
          const unitPrice = Number(nextItem.unitPrice) || 0;
          return { ...nextItem, total: Number((quantity * unitPrice).toFixed(2)) };
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
    const aiMessage = { id: Date.now() + 1, sender: 'ai', text: `已记录到${currentScene.label}项目：${text}。我会沿当前场景模板继续完善参数、BOM 和报价。`, time };
    setProjects((prev) => prev.map((project) => (project.id === currentProject.id ? { ...project, chat: [...project.chat, userMessage, aiMessage] } : project)));
    setInputText('');
  };

  const handleVersionChange = (nextVersionId) => {
    setActiveVersionId(nextVersionId);
    setActiveMainTab('requirements');
    setActiveSubCategory((SCENE_PARAM_CATEGORIES[currentProject?.sceneType] || SCENE_PARAM_CATEGORIES.junction_box)[0]);
  };

  const handleCreateQuoteVersion = () => {
    if (!currentProject || !currentVersion) return;
    const match = /^v(\d+)\.(\d+)$/i.exec(currentVersion.id || 'v1.0');
    const major = match ? Number(match[1]) : 1;
    const minor = match ? Number(match[2]) + 1 : 1;
    const nextId = `v${major}.${minor}`;
    const nextLabel = `V${major}.${minor} 客户反馈修订`;
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    setProjects((prev) =>
      prev.map((project) =>
        project.id === currentProject.id
          ? {
              ...project,
              versions: project.versions.map((version) => ({ ...version, isLatest: false })).concat({ id: nextId, label: nextLabel, timestamp, isLatest: true }),
              data: { ...project.data, [nextId]: cloneDeep(currentData) },
            }
          : project,
      ),
    );
    setActiveVersionId(nextId);
    window.alert(`已基于 ${currentVersion.label} 派生新报价版本：${nextLabel}`);
  };

  const handleOpenBomTab = () => {
    const dimensionValue = currentData?.dimensions?.manual || currentData?.dimensions?.suggested || '';
    const missingLabels = getMissingRequirementLabels(currentProject?.sceneType, currentData?.parameters || [], currentData?.glandRows || [], currentData?.terminalRows || [], dimensionValue);
    if (missingLabels.length) {
      window.alert(`当前还有以下强依赖参数未补齐，暂不能生成 BOM：\n- ${missingLabels.join('\n- ')}\n\n请先补充后再进入 BOM 物料清单。`);
      setActiveMainTab('requirements');
      return;
    }
    setActiveMainTab('bom');
  };

  const handleArchiveCurrent = () => {
    if (!currentProject || !currentVersion || !currentData?.quotation?.items?.length) {
      window.alert('当前还没有可归档的报价清单，请先完善 BOM 和正式报价单。');
      return;
    }
    const record = createArchiveRecord(currentProject, currentVersion, currentData, currentQuoteTotal, quoteNumber);
    setArchives((prev) => [record, ...prev.filter((item) => !(item.projectId === currentProject.id && item.versionId === currentVersion.id))]);
    setArchivedProjectIds((prev) => Array.from(new Set([...prev, currentProject.id])));
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
    const baseData = targetProject.data?.[selectedArchive.versionId];
    if (!baseData) {
      window.alert('未找到对应报价版本数据，暂时无法继续报价。');
      return;
    }
    const parsedVersions = targetProject.versions
      .map((version) => {
        const match = /^v(\d+)\.(\d+)$/i.exec(version.id || '');
        return match ? { major: Number(match[1]), minor: Number(match[2]) } : null;
      })
      .filter(Boolean);
    const latestParsed = parsedVersions.sort((a, b) => (a.major - b.major) || (a.minor - b.minor)).at(-1);
    const nextMajor = latestParsed ? latestParsed.major : 1;
    const nextMinor = latestParsed ? latestParsed.minor + 1 : 1;
    const nextId = `v${nextMajor}.${nextMinor}`;
    const nextLabel = `V${nextMajor}.${nextMinor} 归档后继续报价`;
    const timestamp = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    setProjects((prev) =>
      prev.map((project) =>
        project.id === targetProject.id
          ? {
              ...project,
              versions: project.versions.map((version) => ({ ...version, isLatest: false })).concat({ id: nextId, label: nextLabel, timestamp, isLatest: true }),
              data: { ...project.data, [nextId]: cloneDeep(baseData) },
            }
          : project,
      ),
    );
    setArchivedProjectIds((prev) => prev.filter((id) => id !== targetProject.id));
    setActiveProjectId(targetProject.id);
    setActiveVersionId(nextId);
    setActiveMainTab('requirements');
    setActiveSubCategory((SCENE_PARAM_CATEGORIES[targetProject.sceneType] || SCENE_PARAM_CATEGORIES.junction_box)[0]);
    setActiveNav('assistant');
    window.alert(`已从 ${selectedArchive.versionLabel} 派生新版本 ${nextLabel}，该项目已重新回到报价流程中。`);
  };

  const openCreateProjectModal = () => {
    const defaultSceneType = 'junction_box';
    const defaultScene = getScene(defaultSceneType);
    setCreateSceneType(defaultSceneType);
    setCreateProjectName(`${defaultScene.application}新报价`);
    setIsCreateProjectOpen(true);
  };

  const handleSelectCreateScene = (sceneType) => {
    const scene = getScene(sceneType);
    setCreateSceneType(sceneType);
    setCreateProjectName((prev) => {
      const trimmed = prev.trim();
      const isAutoName = Object.values(SCENES).some((item) => trimmed === `${item.application}新报价`);
      return !trimmed || isAutoName ? `${scene.application}新报价` : prev;
    });
  };

  const handleCreateProject = () => {
    const now = new Date();
    const id = `proj-${Date.now()}`;
    const timestamp = now.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');
    const version = { id: 'v1.0', label: 'V1.0 首版报价', timestamp, isLatest: true };
    const scene = getScene(createSceneType);
    const projectName = createProjectName.trim() || `${scene.application}新报价`;
    const newProject = {
      id,
      sceneType: createSceneType,
      dateGroup: '今天',
      info: {
        engineer: '测试员',
        client: '新客户项目',
        name: projectName,
      },
      chat: [
        { id: Date.now() + 1, sender: 'ai', text: `新${scene.label}项目已创建。您可以输入客户需求，我会按${scene.label}模板维护参数、BOM 和正式报价单。`, time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }) },
      ],
      versions: [version],
      data: { [version.id]: makeVersionData(createSceneType, version.id) },
    };
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(id);
    setActiveVersionId(version.id);
    setActiveMainTab('requirements');
    setActiveSubCategory(SCENE_PARAM_CATEGORIES[createSceneType][0]);
    setActiveNav('assistant');
    setIsCreateProjectOpen(false);
    setCreateProjectName('');
  };

  const handleExcelFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImportError('');
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const preview = parseImportWorksheet(workbook, file.name);
      setImportPreview(preview);
    } catch (error) {
      console.error(error);
      setImportError('Excel 解析失败，请确认文件为 .xls 或 .xlsx 格式。');
      setImportPreview(null);
    } finally {
      event.target.value = '';
    }
  };

  const handleGenerateImportedProjects = () => {
    const validRows = (importPreview?.rows || []).filter((row) => !row.status.some((item) => item.type === 'error'));
    if (!validRows.length) {
      window.alert('当前没有可生成的有效项目，请先检查导入预览。');
      return;
    }
    const newProjects = validRows.map((row, index) => makeImportedProjectFromRow(row, index + 1));
    setProjects((prev) => [...newProjects, ...prev]);
    setArchivedProjectIds((prev) => prev.filter((id) => !newProjects.some((project) => project.id === id)));
    setActiveProjectId(newProjects[0].id);
    setActiveVersionId('v1.0');
    setActiveMainTab('requirements');
    setActiveSubCategory(SCENE_PARAM_CATEGORIES[newProjects[0].sceneType][0]);
    setProjectPage(1);
    setProjectPageInput('1');
    setActiveNav('assistant');
    setImportPreview(null);
    window.alert(`已从 Excel 生成 ${newProjects.length} 个报价项目。`);
  };

  const openProject = (project) => {
    setActiveProjectId(project.id);
    const latest = project.versions.find((version) => version.isLatest) || project.versions[project.versions.length - 1];
    setActiveVersionId(latest.id);
    setActiveMainTab('requirements');
    setActiveSubCategory((SCENE_PARAM_CATEGORIES[project.sceneType] || SCENE_PARAM_CATEGORIES.junction_box)[0]);
    setActiveNav('assistant');
  };

  const categoryHasMissing = (category) => {
    if (!currentData) return false;
    if (category === '格兰') return currentData.glandRows?.some((row) => rowHasMissing(row, ['model', 'armored', 'threadSpec']));
    if (category === '端子') return currentData.terminalRows?.some((row) => rowHasMissing(row, ['current', 'explosionType', 'quantity']));
    const params = (currentData.parameters || []).filter((item) => item.category === category && item.dependency === 'strong');
    return params.some((item) => !String(item.value ?? '').trim());
  };

  const renderSelectField = (label, value, options, onChange, placeholder, className = 'config-input', allowCustom = true) => {
    const isCustom = value && !options.includes(value);
    return (
      <div className="select-input-stack">
        <select value={isCustom ? '__custom__' : value || ''} onChange={(event) => { const next = event.target.value; onChange(next === '__custom__' ? '' : next); }} className={className} aria-label={label}>
          <option value="">{placeholder || '请选择'}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
          {allowCustom && <option value="__custom__">手动输入...</option>}
        </select>
        {allowCustom && (isCustom || !value) && (
          <input value={isCustom ? value : ''} onChange={(event) => onChange(event.target.value)} className={`${className} custom-manual-input`} placeholder="手动输入" aria-label={`${label}手动输入`} />
        )}
      </div>
    );
  };

  const renderManualOrSelect = (category, field, value, onChange, placeholder, className, allowCustom = true) => {
    const suggestions = getFieldSuggestions(category, field);
    if (suggestions.length) return renderSelectField(field, value, suggestions, onChange, placeholder, className, allowCustom);
    return <input value={value ?? ''} onChange={(event) => onChange(event.target.value)} className={className || 'config-input'} placeholder={placeholder || '请输入'} />;
  };

  const renderDefaultParamsTable = (params) => (
    <div className="requirements-inner">
      <table className="params-table">
        <thead><tr><th>参数</th><th>依赖</th><th>当前值</th><th>说明</th></tr></thead>
        <tbody>
          {params.length ? params.map((param) => {
            const isMissing = param.dependency === 'strong' && !String(param.value ?? '').trim();
            return (
              <tr key={param.id}>
                <td className="param-field">{param.field}</td>
                <td><span className={`tag ${param.dependency === 'strong' ? 'tag-strong' : 'tag-weak'}`}>{param.dependency === 'strong' ? '强依赖' : '弱依赖'}</span></td>
                <td>{renderManualOrSelect(param.category, param.field, param.value, (value) => updateParamValue(param.id, value), param.note || '请选择或输入', `param-select ${isMissing ? 'param-missing' : ''}`)}</td>
                <td>{param.note || '支持手动维护，后续可接规则引擎。'}</td>
              </tr>
            );
          }) : <tr><td colSpan={4} className="params-empty">当前场景暂无该类参数</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const getParam = (category, field) => (currentData?.parameters || []).find((item) => item.category === category && item.field === field);

  const renderSmallEmptyRow = (colSpan, text) => <tr><td colSpan={colSpan} className="params-empty">{text}</td></tr>;

  const renderGlandConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>格兰配置（多型号 × 数量）</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按当前格兰参数执行物料匹配测试。')}>匹配物料测试</button></div>
        <div className="config-card-body">
          <div className="config-grid-headings config-grid-gland-online">
            {['数量', '型号+型号描述', '方向', '外螺纹', '内螺纹', '材质', '密封圈范围', '操作'].map((item, index) => <div key={item} className={`config-grid-head ${[0, 1, 2, 3].includes(index) ? 'required' : ''}`}>{item}</div>)}
          </div>
          <div className="config-grid-rows">
            {(currentData?.glandRows || []).map((row) => (
              <div key={row.id} className="config-grid-row config-grid-gland-online">
                <div className="config-grid-cell"><input type="number" value={row.quantity} onChange={(event) => updateGlandRow(row.id, 'quantity', event.target.value)} className="config-input" /></div>
                <div className="config-grid-cell">{renderSelectField('型号', row.model, FIELD_OPTIONS.格兰.型号, (value) => updateGlandRow(row.id, 'model', value), '型号')}<small className="field-subtext">{row.armored || '型号描述'}</small></div>
                <div className="config-grid-cell">{renderSelectField('安装方向', row.installDirection, FIELD_OPTIONS.格兰.安装方向, (value) => updateGlandRow(row.id, 'installDirection', value), '方向')}</div>
                <div className="config-grid-cell">{renderSelectField('螺纹规格', row.threadSpec, FIELD_OPTIONS.格兰.螺纹规格, (value) => updateGlandRow(row.id, 'threadSpec', value), '外螺纹')}</div>
                <div className="config-grid-cell"><input value="无" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-cell">{renderSelectField('材质', row.material, FIELD_OPTIONS.格兰.材质, (value) => updateGlandRow(row.id, 'material', value), '材质')}</div>
                <div className="config-grid-cell"><input value="0S" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-action"><button className="icon-button danger" onClick={() => deleteGlandRow(row.id)}><Trash2 size={16} /></button></div>
              </div>
            ))}
          </div>
          {!(currentData?.glandRows || []).length && <div className="config-empty-line">暂无格兰，点击"新增一行"添加</div>}
          <div className="config-footer-row"><button className="secondary-outline-button" onClick={addGlandRow}><PlusCircle size={15} />新增一行</button><span>数量、型号、方向、外螺纹为必填参数；支持不同型号设置不同数量</span></div>
        </div>
      </div>
      <div className="config-card-shell">
        <div className="config-card-header"><h4>堵头配置（BDT）</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已执行堵头物料匹配测试。')}>匹配物料测试</button></div>
        <div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['状态', '型号', '螺纹规格', '材质', '是否开孔', '安装方向', '数量', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{renderSmallEmptyRow(8, '暂无堵头，点击"新增一行"添加')}</tbody></table></div>
        <div className="config-footer-row"><button className="secondary-outline-button"><PlusCircle size={15} />新增一行</button><span>型号、螺纹规格、是否开孔、数量为必填参数；开孔时增安型配锁母，防爆型配凸台</span></div>
      </div>
      <div className="config-card-shell">
        <div className="config-card-header"><h4>呼吸阀配置（BHX系列）</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已执行呼吸阀匹配测试。')}>匹配物料测试</button></div>
        <div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['状态', '型号', '螺纹规格', '材质', '开孔', '方向', '数量', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{renderSmallEmptyRow(8, '暂无呼吸阀，点击"新增一行"添加')}</tbody></table></div>
        <div className="config-footer-row"><button className="secondary-outline-button"><PlusCircle size={15} />新增一行</button><span>型号、数量为必填参数</span></div>
      </div>
      <div className="config-card-shell">
        <div className="config-card-header"><h4>关联物料配件</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已根据格兰行匹配锁母/凸台配件。')}>配件匹配测试</button></div>
        <div className="accessory-block-title">系统匹配（仅可删除）</div>
        <div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['来源', '配件类别', '物料编码', '物料名称', '数量', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{(currentData?.glandRows || []).length ? (currentData.glandRows || []).map((row, index) => <tr key={`acc-${row.id}`}><td>格兰第{index + 1}行</td><td>凸台</td><td className="mono">03.08.01.600209</td><td><span className="strong">通头焊接凸台_{row.threadSpec || 'M32×1.5'}_3mm_{row.material || '304'}</span></td><td>{row.quantity || 1}</td><td><button className="icon-button danger"><Trash2 size={16} /></button></td></tr>) : renderSmallEmptyRow(6, '暂无系统匹配写入的配件；执行「智能物料匹配」或下方「配件匹配测试」后可在此查看与删除。')}</tbody></table></div>
        <div className="accessory-block-title">用户自选配件（锁母 / 凸台）</div>
        <div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['数量', '配件类别', '螺纹规格', '材质', '厚度', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{renderSmallEmptyRow(6, '暂无；点击下方新增按钮添加')}</tbody></table></div>
        <div className="config-footer-row"><button className="secondary-outline-button"><PlusCircle size={15} />新增锁母</button><button className="secondary-outline-button"><PlusCircle size={15} />新增凸台</button></div>
      </div>
    </div>
  );

  const renderTerminalConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>端子配置</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按端子参数执行物料匹配测试。')}>匹配物料测试</button></div>
        <div className="config-card-body">
          <div className="config-grid-headings config-grid-terminal-online">
            {['状态', '数量', '防爆', '额定电流下限(A)+导线截面', '品牌', '端子类型', '本安', '接地', '双层', '操作'].map((item, index) => <div key={item} className={`config-grid-head ${[1, 2, 3].includes(index) ? 'required' : ''}`}>{item}</div>)}
          </div>
          <div className="config-grid-rows">
            {(currentData?.terminalRows || []).map((row) => (
              <div key={row.id} className="config-grid-row config-grid-terminal-online">
                <div className="config-grid-cell"><span className="tag tag-weak">可匹配</span></div>
                <div className="config-grid-cell"><input type="number" value={row.quantity} onChange={(event) => updateTerminalRow(row.id, 'quantity', event.target.value)} className="config-input" /></div>
                <div className="config-grid-cell">{renderSelectField('防爆类型', row.explosionType, FIELD_OPTIONS.端子.防爆类型, (value) => updateTerminalRow(row.id, 'explosionType', value), '防爆类型')}</div>
                <div className="config-grid-cell"><div className="terminal-current-stack">{renderSelectField('电流', row.current, FIELD_OPTIONS.端子.电流, (value) => updateTerminalRow(row.id, 'current', value), '电流')}<input value={row.wireSection} onChange={(event) => updateTerminalRow(row.id, 'wireSection', event.target.value)} className="config-input" placeholder="导线截面" /></div></div>
                <div className="config-grid-cell">{renderSelectField('品牌', row.brand, FIELD_OPTIONS.端子.品牌, (value) => updateTerminalRow(row.id, 'brand', value), '品牌')}</div>
                <div className="config-grid-cell"><input value="直通端子" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-cell"><input value="否" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-cell"><input value="否" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-cell"><input value="否" readOnly className="config-input muted-input" /></div>
                <div className="config-grid-action"><button className="icon-button danger" onClick={() => deleteTerminalRow(row.id)}><Trash2 size={16} /></button></div>
              </div>
            ))}
          </div>
          {!(currentData?.terminalRows || []).length && <div className="config-empty-line">暂无端子，点击"新增一行"添加</div>}
          <div className="config-footer-row"><button className="secondary-outline-button" onClick={addTerminalRow}><PlusCircle size={15} />新增一行</button></div>
        </div>
      </div>
      <div className="config-card-shell">
        <div className="config-card-header"><h4>端子关联配件（挡板 / 尾顶）</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已执行端子配件匹配测试。')}>匹配物料测试</button></div>
        <div className="accessory-block-title">系统匹配（仅可删除）</div>
        <div className="config-empty-line">暂无系统匹配写入的端子配件；执行「智能物料匹配」或下方「匹配物料测试」后可在此查看与删除。</div>
        {['用户自选 — 挡板', '用户自选 — 尾顶'].map((title) => <div key={title} className="terminal-accessory-section"><div className="accessory-block-title">{title}</div><div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['来源端子', '规格说明', '数量', '匹配依据', '已解析物料', '解析', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{renderSmallEmptyRow(7, `暂无${title.includes('挡板') ? '挡板' : '尾顶'}自选行；可点击下方按钮新增`)}</tbody></table></div><div className="config-footer-row"><button className="secondary-outline-button"><PlusCircle size={15} />新增一行</button></div></div>)}
        <p className="sheet-help accessory-help">用户自选区通过来源端子与预制校验接口定位物料，编码写入会话但不展示；报价与 BOM 仍使用解析后的物料编码。</p>
      </div>
    </div>
  );

  const renderShellConfig = () => {
    const fields = ['材质', '防爆等级', '箱体尺寸', '厚度', '接合面类型'];
    return (
      <div className="requirements-inner">
        <div className="config-card-shell">
          <div className="config-card-header"><h4>壳体参数</h4><div className="header-action-row"><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按材质和防爆等级智能校验壳体参数。')}>智能校验填充</button><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按当前需求执行智能尺寸匹配。')}>智能尺寸匹配</button></div></div>
          <div className="online-field-grid">
            {fields.map((field) => {
              const param = field === '接合面类型' ? null : getParam('壳体', field);
              return <label key={field} className="online-field"><span>{['材质', '防爆等级'].includes(field) && <b>*</b>}{field === '材质' ? '箱体材质' : field}</span>{param ? renderManualOrSelect('壳体', param.field, param.value, (value) => updateParamValue(param.id, value), field === '箱体尺寸' ? '选择尺寸（联动过滤）' : `选择${field}`, 'config-input') : <input className="config-input" placeholder="接合面类型" />}</label>;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderRainCoverConfig = () => {
    const required = getParam('防雨罩', '是否需要');
    const enabled = required?.value !== '不需要';
    const fields = ['尺寸', '壳体类型', '材质', '样式'];
    return (
      <div className="requirements-inner">
        <div className="config-card-shell">
          <div className="config-card-header"><h4>防雨罩（可选，与预制库同步）</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按壳体尺寸匹配防雨罩。')}>按壳体匹配防雨罩</button></div>
          <div className="switch-line"><span>需要防雨罩：</span><button className={`toggle-pill ${enabled ? 'toggle-pill-on' : ''}`} onClick={() => required && updateParamValue(required.id, enabled ? '不需要' : '需要')}>{enabled ? '开启' : '关闭'}</button><small>关闭后不参与防雨罩物料匹配；已填写的筛选条件会保留</small></div>
          <div className="online-field-grid">
            {fields.map((field) => {
              const param = getParam('防雨罩', field);
              return <label key={field} className="online-field"><span>{field}</span>{param ? renderManualOrSelect('防雨罩', param.field, param.value, (value) => updateParamValue(param.id, value), enabled ? `选择${field}` : '请先打开「需要防雨罩」', `config-input ${!enabled ? 'muted-input' : ''}`) : <input className="config-input" placeholder={enabled ? `选择${field}` : '请先打开「需要防雨罩」'} />}</label>;
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderPackagingConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>包装配置</h4><button className="secondary-outline-button" onClick={() => window.alert('静态演示：已按箱体尺寸智能推荐包装。')}>智能推荐包装</button></div>
        <div className="online-field-grid">
          {['包装方式', '包装尺寸'].map((field) => {
            const param = getParam('包装', field);
            return <label key={field} className="online-field"><span>{field === '包装方式' ? '包装类型' : field}</span>{param ? renderManualOrSelect('包装', param.field, param.value, (value) => updateParamValue(param.id, value), `选择${field}`, 'config-input') : <input className="config-input" placeholder="智能推荐后填入" />}</label>;
          })}
        </div>
        <p className="sheet-help inline-help">智能物料匹配会在最后一步自动执行「智能推荐包装」并写入推荐结果（如命中）。</p>
      </div>
    </div>
  );

  const renderOtherMaterialConfig = () => (
    <div className="requirements-inner">
      <div className="config-card-shell">
        <div className="config-card-header"><h4>其他物料</h4></div>
        <div className="table-wrap compact-config-table"><table className="quote-table"><thead><tr>{['字段名称', '字段值', '数量', '操作'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody>{renderSmallEmptyRow(4, '暂无其他物料，点击"新增一行"添加')}</tbody></table></div>
        <div className="config-footer-row"><button className="secondary-outline-button"><PlusCircle size={15} />新增一行</button><span>用于记录其他需要报价的物料信息</span></div>
      </div>
    </div>
  );

  const renderGenericCategoryConfig = (category) => {
    if (currentProject?.sceneType === 'junction_box') {
      if (category === '壳体') return renderShellConfig();
      if (category === '防雨罩') return renderRainCoverConfig();
      if (category === '包装') return renderPackagingConfig();
      if (category === '其他') return renderOtherMaterialConfig();
    }
    return renderDefaultParamsTable((currentData?.parameters || []).filter((item) => item.category === category));
  };

  const renderRequirementsPanel = () => (
    <div className="stack-layout">
      <div className="panel-card panel-card-p0">
        <div className="requirements-action-bar"><button className="primary-button ghost-primary" onClick={() => window.alert('静态演示：已执行智能物料匹配。')}>智能物料匹配</button><button className="bom-jump-button" onClick={() => setActiveMainTab('bom')}>生成BOM物料</button></div>
        <div className="subtabs">{currentCategories.map((category) => <button key={category} className={`subtab ${activeSubCategory === category ? 'subtab-active' : ''}`} onClick={() => setActiveSubCategory(category)}>{category}{categoryHasMissing(category) && <span className="subtab-dot" />}</button>)}</div>
        {activeSubCategory === '格兰' && renderGlandConfig()}
        {activeSubCategory === '端子' && renderTerminalConfig()}
        {!['格兰', '端子'].includes(activeSubCategory) && renderGenericCategoryConfig(activeSubCategory)}
      </div>
    </div>
  );

  const renderBomPanel = () => {
    const items = currentData?.quotation?.items || [];
    return (
      <div className="full-height">
        <div className="sheet-card">
          <div className="sheet-header compact-header">
            <div><h3 className="sheet-heading"><Box size={16} className="sheet-heading-icon" />BOM物料清单</h3><p className="sheet-help">{currentScene.label}当前报价版本对应的可编辑 BOM，支持人工补料、删料和调整数量。</p></div>
            <div className="header-action-row"><button className="secondary-outline-button" onClick={addBomItem}><PlusCircle size={15} />新增物料</button><button className="secondary-outline-button" onClick={() => window.alert('静态演示：BOM 已按当前参数刷新。')}>更新BOM</button><button className="secondary-outline-button" onClick={() => window.alert('静态演示：这里会导出 BOM Excel。')}><Download size={15} />导出 Excel</button><button className="secondary-outline-button" onClick={() => window.alert('静态演示：这里会打开图纸预览。')}>预览图纸</button><button className="bom-jump-button" onClick={() => setActiveMainTab('quotation_sheet')}>去正式报价单<ArrowRight size={14} /></button></div>
          </div>
          <div className="table-wrap">
            <table className="quote-table bom-table">
              <thead><tr><th>物料编码</th><th>物料名称</th><th>规格型号</th><th>品牌</th><th className="center">数量</th><th className="center">操作</th></tr></thead>
              <tbody>{items.length ? items.map((item) => <tr key={item.id}><td><input value={item.code} onChange={(event) => updateBomItem(item.id, 'code', event.target.value)} className="bom-input mono-input" /></td><td><input value={item.name} onChange={(event) => updateBomItem(item.id, 'name', event.target.value)} className="bom-input strong-input" /></td><td><input value={item.model} onChange={(event) => updateBomItem(item.id, 'model', event.target.value)} className="bom-input" /></td><td><input value={item.brand} onChange={(event) => updateBomItem(item.id, 'brand', event.target.value)} className="bom-input" /></td><td className="center"><input type="number" value={item.quantity} onChange={(event) => updateBomItem(item.id, 'quantity', event.target.value)} className="bom-input center-input" /></td><td className="center"><button className="icon-button danger" onClick={() => deleteBomItem(item.id)}><Trash2 size={16} /></button></td></tr>) : renderSmallEmptyRow(6, '暂无物料，点击"新增物料"添加')}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderQuotationPanel = () => {
    const items = currentData?.quotation?.items || [];
    if (!items.length) {
      return (
        <div className="full-height">
          <div className="sheet-card">
            <div className="sheet-header compact-header">
              <div><h3>正式报价单</h3><p className="sheet-help">报价单根据 BOM 物料清单生成，可保存版本或导出 Excel。</p></div>
              <div className="header-action-row"><button className="secondary-outline-button" onClick={() => window.alert('静态演示：当前报价版本已保存。')}>保存版本</button><button className="primary-button" onClick={() => setIsExportPreviewOpen(true)}><Download size={15} />导出 Excel</button></div>
            </div>
            <div className="empty-state embedded-empty">
              <AlertCircle size={48} />
              <p className="empty-copy"><span>暂无报价数据，请先在BOM页面添加物料</span></p>
              <button className="secondary-outline-button" onClick={() => setActiveMainTab('bom')}><ArrowLeft size={15} />返回 BOM</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="full-height">
        <div className="sheet-card">
          <div className="sheet-header">
            <div><h3>正式报价单</h3><div className="sheet-meta"><span>{currentScene.label} / {currentProject?.info.name}</span><span>报价编号: {quoteNumber}</span><span>报价版本: {currentVersion?.label}</span><span>客户: {currentProject?.info.client}</span><span>工程师: {currentProject?.info.engineer}</span><span>日期: {todayDateStr}</span></div></div>
            <div className="header-action-row"><button className="secondary-outline-button" onClick={() => window.alert('静态演示：当前报价版本已保存。')}>保存版本</button><button className="secondary-outline-button" onClick={handleArchiveCurrent}><Archive size={15} />归档到历史报价单</button><button className="primary-button" onClick={() => setIsExportPreviewOpen(true)}><Download size={15} />导出 Excel</button></div>
          </div>
          {recommendedArchive && <div className="recommend-inline-bar"><span className="recommend-inline-label">历史推荐</span><span className="recommend-inline-main">{recommendedArchive.client}</span><span className="recommend-inline-score">相似度 {recommendedArchive.matchScore}%</span><span className="recommend-inline-text">亮点：{recommendedArchive.matchHighlights?.[0]}；差异：{recommendedArchive.matchDiffs?.[0]}</span><button className="mini-link-button mini-link-button-primary" onClick={() => { setSelectedArchiveId(recommendedArchive.id); setActiveNav('knowledge'); }}>查看历史报价单</button></div>}
          <div className="table-wrap">
            <table className="quote-table quote-sheet-table">
              <thead><tr><th>物料编码</th><th>物料名称</th><th>规格型号</th><th className="center">数量</th><th className="right tinted">单价 (元)</th><th className="right tinted">小计 (元)</th><th className="center">操作</th></tr></thead>
              <tbody>{items.map((item) => <tr key={item.id}><td><span className="mono">{item.code}</span></td><td><span className="strong">{item.name}</span></td><td>{item.model}</td><td className="center"><input type="number" value={item.quantity} onChange={(event) => updateBomItem(item.id, 'quantity', event.target.value)} /></td><td className="right tinted"><input type="number" step="0.01" value={item.unitPrice} onChange={(event) => updateBomItem(item.id, 'unitPrice', event.target.value)} /></td><td className="right tinted strong">¥{Number(item.total || 0).toFixed(2)}</td><td className="center"><button className="icon-button danger" onClick={() => deleteBomItem(item.id)}><Trash2 size={16} /></button></td></tr>)}</tbody>
              <tfoot><tr className="quote-total-row"><td colSpan={4} /><td className="right tinted quote-total-label">合计</td><td className="right tinted quote-total-amount">¥{currentQuoteTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td /></tr></tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderAssistantView = () => (
    <>
      <header className="page-header">
        <div className="page-header-block">
          <div className="eyebrow-row"><span className="eyebrow-chip">{currentScene.label}</span><span className="eyebrow-muted">{currentProject?.info.client}</span></div>
          <h1>{currentScene.quoteTitle}</h1>
          <p>{currentScene.description} 左侧保留整个项目对话，右侧按报价版本维护需求参数、BOM 和正式报价单。</p>
        </div>
        <div className="status-chip-row">
          <div className="status-chip status-chip-accent"><span>当前场景</span><strong>{currentScene.application}</strong></div>
          <div className="status-chip"><span>报价版本</span><strong>{currentVersion?.label}</strong></div>
          <div className="status-chip"><span>报价金额</span><strong>¥{currentQuoteTotal.toLocaleString()}</strong></div>
        </div>
      </header>
      <main className="assistant-layout">
        <section className="chat-panel">
          <div className="chat-panel-head">
            <div className="chat-project-meta"><strong>{currentProject?.info.engineer}</strong><span>{currentProject?.info.client}</span></div>
            <div className="assistant-mini-strip"><span className="assistant-mini-pill">{currentScene.label}</span><span className="assistant-mini-pill">{currentProject?.info.name}</span></div>
            <div className="chat-project-note">项目对话持续保留，不随报价版本切换覆盖；场景决定右侧参数和 BOM 模板。</div>
          </div>
          <div className="chat-scroll" ref={chatScrollRef}>{(currentChat || []).map((item) => <div key={item.id} className={`chat-row ${item.sender === 'user' ? 'chat-row-user' : 'chat-row-ai'}`}>{item.sender === 'ai' && <div className="chat-avatar">AI</div>}<div className={`chat-bubble ${item.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>{renderRichMessage(item.text, item.sender === 'ai')}</div></div>)}</div>
          <div className="chat-input-bar"><button className="icon-button subtle"><Mic size={16} /></button><button className="icon-button subtle"><Paperclip size={16} /></button><input value={inputText} onChange={(event) => setInputText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') handleSendMessage(); }} placeholder={`补充${currentScene.label}参数或记录客户反馈...`} /><button className="send-button" onClick={handleSendMessage}><Send size={18} /></button></div>
        </section>
        <section className="quotation-panel">
          <div className="quote-version-bar"><span className="quote-version-label">当前报价版本</span><div className="quote-version-actions"><select value={currentVersion?.id} onChange={(event) => handleVersionChange(event.target.value)} className="quote-version-select">{currentProject?.versions.map((version) => <option key={version.id} value={version.id}>{version.label} - {version.timestamp.split(' ')[1]}</option>)}</select><button className="secondary-outline-button" onClick={handleCreateQuoteVersion}><PlusCircle size={15} />新增报价版本</button></div></div>
          <div className="tabs"><button className={`tab ${activeMainTab === 'requirements' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('requirements')}><FileText size={16} />1. 需求参数测算</button><button className={`tab ${activeMainTab === 'bom' ? 'tab-active' : ''}`} onClick={handleOpenBomTab}><ListTodo size={16} />2. BOM物料清单</button><button className={`tab ${activeMainTab === 'quotation_sheet' ? 'tab-active' : ''}`} onClick={() => setActiveMainTab('quotation_sheet')}><Coins size={16} />3. 正式报价单</button></div>
          <div className="quotation-body">{activeMainTab === 'requirements' && renderRequirementsPanel()}{activeMainTab === 'bom' && renderBomPanel()}{activeMainTab === 'quotation_sheet' && renderQuotationPanel()}</div>
        </section>
      </main>
    </>
  );

  const renderKnowledgeView = () => (
    <>
      <header className="page-header page-header-knowledge"><div><h1>历史报价单</h1><p>归档后的报价版本统一沉淀到历史报价单，可按客户、场景、材质、防爆等级和结构快速检索。</p></div><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></header>
      <main className="knowledge-layout archive-layout">
        <section className="archive-sidebar-panel archive-sidebar-panel-compact">
          <div className="archive-sidebar-search"><Search size={16} /><input value={archiveSearch} onChange={(event) => setArchiveSearch(event.target.value)} placeholder="搜索客户、场景、型号、报价编号..." /></div>
          <div className="quick-filter-row archive-filter-row"><button className={`quick-filter ${archiveQuickFilter === 'all' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('all')}>全部</button><button className={`quick-filter ${archiveQuickFilter === 'same-material' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-material')}>316材质</button><button className={`quick-filter ${archiveQuickFilter === 'same-explosion' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-explosion')}>同防爆等级</button><button className={`quick-filter ${archiveQuickFilter === 'same-structure' ? 'quick-filter-active' : ''}`} onClick={() => setArchiveQuickFilter('same-structure')}>同结构</button></div>
          <div className="knowledge-list-meta">共 {filteredArchives.length} 份历史报价单</div>
          <div className="archive-sidebar-list">{filteredArchives.map((item) => <button key={item.id} className={`archive-sidebar-item archive-sidebar-item-condensed ${selectedArchive?.id === item.id ? 'archive-sidebar-item-active' : ''}`} onClick={() => setSelectedArchiveId(item.id)}><div className="archive-sidebar-top"><span>{item.client}</span><small>{item.archivedAt}</small></div><strong>{item.application}</strong><p>{item.title}</p><div className="archive-sidebar-meta"><span>{item.material}</span><span>{item.dimensions}</span></div></button>)}</div>
        </section>
        <section className="archive-summary-panel"><div className="archive-summary-card archive-summary-card-compact">{selectedArchive ? <div className="knowledge-inline-layout"><div className="knowledge-inline-topbar"><div><h3>{selectedArchive.title}</h3><p>{selectedArchive.versionLabel} - {selectedArchive.quoteNumber}</p></div><div className="header-action-row"><button className="secondary-outline-button" onClick={handleResumeArchivedProject}><PlusCircle size={15} />继续报价</button><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></div></div><div className="knowledge-inline-grid compact-two-row-grid"><div className="detail-section compact-section"><h4>1. 基本信息</h4><div className="detail-stat-grid detail-stat-grid-3 compact-stat-grid"><div className="detail-stat"><span>客户</span><strong>{selectedArchive.client}</strong></div><div className="detail-stat"><span>归档时间</span><strong>{selectedArchive.archivedAt}</strong></div><div className="detail-stat"><span>应用场景</span><strong>{selectedArchive.application}</strong></div></div></div><div className="detail-section compact-section"><h4>2. 产品结构</h4><div className="detail-stat-grid detail-stat-grid-5 compact-stat-grid"><div className="detail-stat"><span>产品类型</span><strong>{selectedArchive.productType}</strong></div><div className="detail-stat"><span>箱体尺寸</span><strong>{selectedArchive.dimensions}</strong></div><div className="detail-stat"><span>材质</span><strong>{selectedArchive.material}</strong></div><div className="detail-stat"><span>防爆等级</span><strong>{selectedArchive.explosionLevel}</strong></div><div className="detail-stat"><span>结构摘要</span><strong>{selectedArchive.wiring}</strong></div></div></div></div><div className="knowledge-inline-bottom compact-two-row-grid"><div className="detail-section compact-section"><h4>3. BOM 预览</h4><table className="detail-table compact-detail-table"><thead><tr><th>物料编码</th><th>物料名称</th><th>规格型号</th><th>数量</th></tr></thead><tbody>{selectedArchive.bomPreview?.map((item, index) => <tr key={`${item.code}-${index}`}><td>{item.code}</td><td>{item.name}</td><td>{item.model}</td><td>{item.qty}</td></tr>)}</tbody></table></div><div className="detail-section compact-section"><h4>4. 报价拆分</h4><div className="quote-breakdown-wrap compact-breakdown-wrap"><div className="quote-breakdown-total"><span>总价</span><strong>¥{selectedArchive.total.toLocaleString()}</strong></div><div className="quote-breakdown-list">{selectedArchive.quoteBreakdown?.map((item) => <div key={item.label} className="quote-breakdown-item compact-breakdown-item"><span>{item.label}</span><strong>¥{item.amount.toLocaleString()}</strong></div>)}</div></div></div></div></div> : <><h3>暂无历史报价单</h3><p>项目归档后会自动进入这里，供后续查询和知识复用。</p></>}</div></section>
      </main>
    </>
  );

  const renderRulesView = () => (
    <>
      <header className="page-header page-header-knowledge"><div><h1>规则引擎</h1><p>静态演示规则页：展示提示词模板、字段映射、强依赖校验和 BOM 匹配策略。</p></div><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></header>
      <main className="rules-layout">
        <section className="rules-card rules-card-wide"><div className="rules-card-head"><Cpu size={18} /><h3>提示词模板</h3></div><p>主对话会按当前项目场景注入不同的字段 schema：接线箱关注格兰和端子，配电箱关注回路与电气件，操作柱关注按钮、灯、急停和立柱。</p><div className="prompt-preview">系统角色：你是防爆产品报价助手。请先识别场景，再输出缺失强依赖项、默认弱依赖项、推荐 BOM 和报价风险提示。</div></section>
        <section className="rules-card"><div className="rules-card-head"><Tag size={18} /><h3>字段映射</h3></div><table className="detail-table"><tbody><tr><td>shell_material</td><td>壳体材质</td></tr><tr><td>gland_specs</td><td>格兰规格</td></tr><tr><td>distribution_loop_count</td><td>配电箱回路数</td></tr><tr><td>operation_button_count</td><td>操作柱按钮数量</td></tr></tbody></table></section>
        <section className="rules-card"><div className="rules-card-head"><AlertCircle size={18} /><h3>强依赖校验</h3></div><ul className="rules-list"><li>接线箱：壳体尺寸、格兰型号/铠装/螺纹、端子电流/防爆类型/数量。</li><li>配电箱：回路数、主开关、支路开关、进线/出线规格、接线方向。</li><li>操作柱：按钮数量、指示灯数量、急停、立柱高度、底座形式。</li></ul></section>
        <section className="rules-card"><div className="rules-card-head"><Box size={18} /><h3>BOM 匹配摘要</h3></div><ul className="rules-list"><li>通用壳体按材质、尺寸、防爆等级匹配。</li><li>配电箱按回路数展开断路器、汇流排、门锁和辅材。</li><li>操作柱按按钮/灯/急停数量展开操作元件和铭牌。</li></ul></section>
      </main>
    </>
  );

  const updateDebugRow = (rowCode, field, value) => {
    setDebugTables((prev) => ({
      ...prev,
      [debugMode]: prev[debugMode].map((table) =>
        table.key === activeDebugTable.key
          ? { ...table, rows: table.rows.map((row) => (row.code === rowCode ? { ...row, [field]: value } : row)) }
          : table,
      ),
    }));
  };

  const deleteDebugRow = (rowCode) => {
    setDebugTables((prev) => ({
      ...prev,
      [debugMode]: prev[debugMode].map((table) => (table.key === activeDebugTable.key ? { ...table, rows: table.rows.filter((row) => row.code !== rowCode) } : table)),
    }));
  };

  const renderDebugView = () => (
    <>
      <header className="page-header page-header-knowledge"><div><h1>数据调试</h1><p>本地静态数据调试页，可演示物料库、逻辑规则、搜索、编辑、删除和导出入口。</p></div><div className="header-action-row"><button className="secondary-outline-button" onClick={() => setDebugTables(cloneDeep(DEBUG_TABLES))}><RotateCcw size={15} />恢复 mock 数据</button><button className="secondary-outline-button" onClick={() => setActiveNav('assistant')}><ArrowRight size={15} />返回报价助手</button></div></header>
      <main className="debug-layout">
        <section className="debug-panel">
          <div className="debug-tabs"><button className={`quick-filter ${debugMode === 'material' ? 'quick-filter-active' : ''}`} onClick={() => { setDebugMode('material'); setDebugTableKey(debugTables.material[0].key); }}>物料库</button><button className={`quick-filter ${debugMode === 'config' ? 'quick-filter-active' : ''}`} onClick={() => { setDebugMode('config'); setDebugTableKey(debugTables.config[0].key); }}>逻辑规则</button></div>
          <div className="debug-table-list">{(debugTables[debugMode] || []).map((table) => <button key={table.key} className={`debug-table-button ${activeDebugTable?.key === table.key ? 'debug-table-button-active' : ''}`} onClick={() => setDebugTableKey(table.key)}><span>{table.label}</span><small>{table.rows.length} 条</small></button>)}</div>
        </section>
        <section className="debug-content">
          <div className="debug-toolbar"><div className="archive-sidebar-search"><Search size={16} /><input value={debugSearch} onChange={(event) => setDebugSearch(event.target.value)} placeholder="搜索编码、名称、规格、场景..." /></div><button className="secondary-outline-button" onClick={() => window.alert('静态演示：这里会导出当前表格 Excel。')}><Download size={15} />导出</button></div>
          <div className="sheet-card"><div className="sheet-header compact-header"><div><h3>{activeDebugTable?.label}</h3><p className="sheet-help">编辑/删除只影响当前前端内存，刷新后恢复初始 mock 数据。</p></div></div><div className="table-wrap"><table className="quote-table"><thead><tr><th>编码</th><th>名称</th><th>分类</th><th>规格/规则</th><th>场景</th><th className="center">操作</th></tr></thead><tbody>{filteredDebugRows.map((row) => { const editing = debugEditingId === row.code; return <tr key={row.code}><td className="mono">{row.code}</td><td>{editing ? <input className="bom-input strong-input" value={row.name} onChange={(event) => updateDebugRow(row.code, 'name', event.target.value)} /> : <span className="strong">{row.name}</span>}</td><td>{editing ? <input className="bom-input" value={row.category} onChange={(event) => updateDebugRow(row.code, 'category', event.target.value)} /> : row.category}</td><td>{editing ? <input className="bom-input" value={row.spec} onChange={(event) => updateDebugRow(row.code, 'spec', event.target.value)} /> : row.spec}</td><td>{editing ? <input className="bom-input" value={row.scene} onChange={(event) => updateDebugRow(row.code, 'scene', event.target.value)} /> : <span className="tag tag-ai">{row.scene}</span>}</td><td className="center"><button className="mini-link-button" onClick={() => setDebugEditingId(editing ? '' : row.code)}>{editing ? '完成' : '编辑'}</button><button className="mini-link-button" onClick={() => deleteDebugRow(row.code)}>删除</button></td></tr>; })}</tbody></table></div></div>
        </section>
      </main>
    </>
  );

  const renderContent = () => {
    if (activeNav === 'knowledge') return renderKnowledgeView();
    if (activeNav === 'rules') return renderRulesView();
    if (activeNav === 'debug') return renderDebugView();
    return renderAssistantView();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-badge">AI</div><span>智能报价系统</span></div>
        <nav className="nav-list">
          <button className={`nav-item ${activeNav === 'assistant' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('assistant')}><MessageSquare size={16} />报价助手</button>
          <button className={`nav-item ${activeNav === 'knowledge' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('knowledge')}><BookOpen size={16} />历史报价单</button>
          <button className={`nav-item ${activeNav === 'rules' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('rules')}><Cpu size={16} />规则引擎</button>
          <button className={`nav-item ${activeNav === 'debug' ? 'nav-item-active' : ''}`} onClick={() => setActiveNav('debug')}><Database size={16} />数据调试</button>
        </nav>
        <div className="divider" />
        <div className="recent-projects">
          <div className="recent-header">
            <span>近期报价项目</span>
            <div className="recent-header-actions">
              <button className="icon-button subtle" title="批量导入 Excel" onClick={() => excelInputRef.current?.click()}><FileSpreadsheet size={15} /></button>
              <button className="icon-button subtle" title="新增报价项目" onClick={openCreateProjectModal}><PlusCircle size={15} /></button>
            </div>
          </div>
          <input ref={excelInputRef} type="file" accept=".xls,.xlsx" className="hidden-file-input" onChange={handleExcelFileChange} />
          {importError && <div className="sidebar-alert">{importError}</div>}
          <div className="search-box"><Search size={14} /><input type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="搜索客户、项目或场景..." /></div>
          <div className="project-groups">{GROUP_LABELS.map((groupName) => { const items = pagedProjects[groupName]; if (!items?.length) return null; return <div key={groupName} className="project-group"><div className="group-title">{groupName}</div><div className="project-list">{items.map((project) => <button key={project.id} className={`project-card ${activeProjectId === project.id ? 'project-card-active' : ''}`} onClick={() => openProject(project)}><Folder size={15} /><div className="project-meta"><span>{project.info.client}</span><small>{getScene(project.sceneType).label} / {project.info.name}</small></div></button>)}</div></div>; })}</div>
          <div className="pagination-box"><button className="page-nav-button" onClick={() => goProjectPage(projectPage - 1)} disabled={projectPage <= 1}><ChevronLeft size={14} /></button><div className="page-input-wrap"><span>第</span><input value={projectPageInput} onChange={(event) => setProjectPageInput(event.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') goProjectPage(Number(projectPageInput || 1)); }} /><span>/ {totalProjectPages} 页</span></div><button className="page-jump-button" onClick={() => goProjectPage(Number(projectPageInput || 1))}>跳转</button><button className="page-nav-button" onClick={() => goProjectPage(projectPage + 1)} disabled={projectPage >= totalProjectPages}><ChevronRight size={14} /></button></div>
        </div>
      </aside>
      <div className="content-shell">{renderContent()}</div>

      {importPreview && (
        <div className="modal-backdrop">
          <div className="modal-card import-modal-card">
            <div className="modal-header">
              <h2><FileSpreadsheet size={20} />Excel 批量导入预览</h2>
              <button className="icon-button subtle" onClick={() => setImportPreview(null)}><X size={24} /></button>
            </div>
            <div className="modal-content import-modal-content">
              <div className="import-summary-bar">
                <div className="status-chip"><span>文件</span><strong>{importPreview.fileName}</strong></div>
                <div className="status-chip"><span>Sheet</span><strong>{importPreview.sheetName}</strong></div>
                <div className="status-chip status-chip-accent"><span>有效项目</span><strong>{importStats.valid}</strong></div>
                <div className="status-chip"><span>警告</span><strong>{importStats.warnings}</strong></div>
                <div className="status-chip"><span>错误</span><strong>{importStats.errors}</strong></div>
              </div>
              {importPreview.errors?.length ? <div className="import-error-box">{importPreview.errors.join('；')}</div> : null}
              <div className="table-wrap import-preview-table-wrap">
                <table className="quote-table import-preview-table">
                  <thead><tr><th>序号</th><th>产品类别</th><th>客户/项目名</th><th>场景</th><th>关键参数摘要</th><th>状态</th></tr></thead>
                  <tbody>
                    {importPreview.rows.length ? importPreview.rows.map((row) => {
                      const rowErrors = row.status.filter((item) => item.type === 'error');
                      const rowWarnings = row.status.filter((item) => item.type === 'warning');
                      return (
                        <tr key={row.id}>
                          <td className="mono">{row.seq}</td>
                          <td>{row.productType || '-'}</td>
                          <td><span className="strong">Excel批量导入客户</span><br /><span className="muted-small">{row.projectName}</span></td>
                          <td>{row.sceneLabel !== '-' ? <span className="tag tag-ai">{row.sceneLabel}</span> : '-'}</td>
                          <td>{row.summary || '-'}</td>
                          <td>
                            {rowErrors.length ? <span className="tag tag-strong">{rowErrors.map((item) => item.message).join('；')}</span> : <span className="tag tag-weak">可生成</span>}
                            {rowWarnings.map((item) => <span key={item.message} className="tag tag-warning">{item.message}</span>)}
                          </td>
                        </tr>
                      );
                    }) : <tr><td colSpan={6} className="params-empty">没有识别到有效项目行</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={() => setImportPreview(null)}>取消导入</button>
              <button className="primary-button" onClick={handleGenerateImportedProjects} disabled={importStats.valid <= 0}>生成全部有效项目</button>
            </div>
          </div>
        </div>
      )}

      {isCreateProjectOpen && (
        <div className="modal-backdrop">
          <div className="modal-card create-modal-card">
            <div className="modal-header"><h2><PlusCircle size={20} />新增报价项目</h2><button className="icon-button subtle" onClick={() => setIsCreateProjectOpen(false)}><X size={24} /></button></div>
            <div className="modal-content create-modal-content">
              <div className="scene-choice-grid">
                {Object.entries(SCENES).map(([key, scene]) => <button key={key} className={`scene-choice-card ${createSceneType === key ? 'scene-choice-card-active' : ''}`} onClick={() => handleSelectCreateScene(key)}><strong>{scene.label}</strong><span>{scene.description}</span></button>)}
              </div>
              <label className="create-project-name-field">
                <span>项目名称</span>
                <input type="text" value={createProjectName} onChange={(event) => setCreateProjectName(event.target.value)} placeholder="请输入项目名称" autoFocus />
              </label>
            </div>
            <div className="modal-footer"><button className="secondary-button" onClick={() => setIsCreateProjectOpen(false)}>取消</button><button className="primary-button" onClick={handleCreateProject} disabled={!createProjectName.trim()}>创建项目</button></div>
          </div>
        </div>
      )}

      {isExportPreviewOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header"><h2><FileSpreadsheet size={20} />导出预览</h2><button className="icon-button subtle" onClick={() => setIsExportPreviewOpen(false)}><X size={24} /></button></div>
            <div className="modal-content"><div className="excel-preview"><div className="excel-title">{currentScene.label}正式报价单 Excel 预览</div><table className="excel-table"><thead><tr><th>序号</th><th>报价编号</th><th>报价版本</th><th>报价日期</th><th>场景</th><th>工程师</th><th>客户</th><th>物料编码</th><th>物料名称</th><th>规格型号</th><th>品牌</th><th>数量</th><th>金额</th><th>备注</th></tr></thead><tbody>{(currentData?.quotation?.items || []).map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{quoteNumber}</td><td>{currentVersion?.label}</td><td>{todayDateStr}</td><td>{currentScene.label}</td><td>{currentProject?.info.engineer}</td><td>{currentProject?.info.client}</td><td>{item.code}</td><td>{item.name}</td><td>{item.model}</td><td>{item.brand === '-' ? '' : item.brand}</td><td>{item.quantity}</td><td className="right">{Number(item.total || 0).toFixed(2)}</td><td /></tr>)}</tbody></table></div></div>
          </div>
        </div>
      )}
    </div>
  );
}
