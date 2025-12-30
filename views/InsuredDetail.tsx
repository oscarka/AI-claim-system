
import React, { useState, useEffect } from 'react';
import { Insured } from '../types';
import KnowledgeGraph from './KnowledgeGraph';
import { getInsuredHealthSummary } from '../services/geminiService';

interface InsuredDetailProps {
  insured: Insured;
  onBack: () => void;
}

const InsuredDetail: React.FC<InsuredDetailProps> = ({ insured, onBack }) => {
  const [summary, setSummary] = useState('深度解析客户健康档案中...');
  const [isProcessing, setIsProcessing] = useState(true);

  // 模拟该人的多维度图谱数据
  const graphData = {
    nodes: [
      { id: 'p1', label: insured.name, type: 'Person' },
      { id: 'c1', label: 'CL-2023-胃肠炎', type: 'Claim' },
      { id: 'c2', label: 'CL-2024-慢病管理', type: 'Claim' },
      { id: 'd1', label: '急性肠胃炎', type: 'Diagnosis' },
      { id: 'd2', label: '2型糖尿病', type: 'Diagnosis' },
      { id: 'd3', label: '高脂血症', type: 'Diagnosis' },
      { id: 'h1', label: '上海瑞金医院', type: 'Hospital' },
      { id: 'h2', label: '市中心医院', type: 'Hospital' },
      { id: 't1', label: '抗生素/补液', type: 'Treatment' },
      { id: 't2', label: '二甲双胍', type: 'Treatment' },
    ],
    links: [
      { source: 'p1', target: 'c1', label: '申请理赔' },
      { source: 'p1', target: 'c2', label: '申请理赔' },
      { source: 'c1', target: 'd1', label: '确诊' },
      { source: 'c2', target: 'd2', label: '确诊' },
      { source: 'c2', target: 'd3', label: '并发症' },
      { source: 'c1', target: 'h1', label: '就诊' },
      { source: 'c2', target: 'h2', label: '就诊' },
      { source: 'd1', target: 't1', label: '方案' },
      { source: 'd2', target: 't2', label: '方案' },
      { source: 'd2', target: 'd3', label: '代谢相关' },
    ]
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setIsProcessing(true);
      const res = await getInsuredHealthSummary(insured.name, graphData.nodes);
      setSummary(res || '暂无健康画像分析。');
      setIsProcessing(false);
    };
    fetchSummary();
  }, [insured.id]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{insured.name} 健康全景图谱</h1>
          <p className="text-sm text-gray-500 font-medium">客户标识: {insured.id} | 风控等级: <span className={insured.riskLevel === '高' ? 'text-red-500' : 'text-green-500'}>{insured.riskLevel}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧：文字总结区域 (占据 4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-600 border-b pb-4 border-gray-50">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 AI 健康画像分析
              </h3>
              <div className="prose prose-sm text-gray-600 leading-relaxed italic">
                 {isProcessing ? (
                   <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                      <div className="h-4 bg-gray-100 rounded w-11/12"></div>
                      <div className="h-4 bg-gray-100 rounded w-10/12"></div>
                      <div className="h-20 bg-gray-50 rounded w-full"></div>
                   </div>
                 ) : (
                   <div className="whitespace-pre-line text-sm">{summary}</div>
                 )}
              </div>
              
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-[10px] text-red-400 font-bold uppercase mb-1">健康风险预警</p>
                  <p className="text-xs text-red-700 font-medium">检测到“糖尿病”与“高脂血症”存在协同演化趋势，建议进行早期慢病干预。</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">理赔倾向性</p>
                  <p className="text-xs text-indigo-700 font-medium">历史案件主要集中在季节性呼吸道疾病，近期由于慢病确诊，理赔频率预计上升 30%。</p>
                </div>
              </div>
           </div>
        </div>

        {/* 右侧：交互式图谱区域 (占据 8/12) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden flex flex-col relative">
           <div className="absolute top-4 right-4 z-10 flex gap-2">
              <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-500 border border-gray-200 shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full"></div> 个人
                 <div className="w-2 h-2 bg-amber-500 rounded-full ml-1"></div> 案件
                 <div className="w-2 h-2 bg-red-500 rounded-full ml-1"></div> 疾病
              </div>
           </div>
           <div className="flex-1 bg-slate-50/30">
              <KnowledgeGraph nodes={graphData.nodes} links={graphData.links} height={700} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default InsuredDetail;
