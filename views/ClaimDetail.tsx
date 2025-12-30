
import React, { useState, useEffect, useMemo } from 'react';
import { Claim, ClaimStatus, DocType, Visit } from '../types';
import { getAIClaimSummary } from '../services/geminiService';

interface ClaimDetailProps {
  claim: Claim;
  onBack: () => void;
  onViewPolicy: (policyNumber: string) => void;
}

const ClaimDetail: React.FC<ClaimDetailProps> = ({ claim, onBack, onViewPolicy }) => {
  const [activeVisitIndex, setActiveVisitIndex] = useState(0);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [aiSummary, setAiSummary] = useState<string>('正在利用 AI 深度分析全案...');
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isDocProcessing, setIsDocProcessing] = useState(false);

  const currentVisit = useMemo(() => claim.visits[activeVisitIndex], [claim.visits, activeVisitIndex]);
  const currentDoc = useMemo(() => currentVisit.docs[activeDocIndex], [currentVisit.docs, activeDocIndex]);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsSummaryLoading(true);
      const summary = await getAIClaimSummary(claim);
      setAiSummary(summary || '未能生成案件总结。');
      setIsSummaryLoading(false);
    };
    fetchSummary();
  }, [claim.id]);

  const handleDocSwitch = (idx: number) => {
    if (idx === activeDocIndex) return;
    setIsDocProcessing(true);
    setActiveDocIndex(idx);
    // 模拟瞬间拉取预处理数据
    setTimeout(() => setIsDocProcessing(false), 150);
  };

  const handleVisitSwitch = (idx: number) => {
    if (idx === activeVisitIndex) return;
    setActiveVisitIndex(idx);
    setActiveDocIndex(0);
    setIsDocProcessing(true);
    setTimeout(() => setIsDocProcessing(false), 300);
  };

  const renderDocSpecificDetails = () => {
    if (isDocProcessing) return (
      <div className="space-y-4 animate-pulse pt-4">
        <div className="h-4 bg-gray-50 rounded w-full"></div>
        <div className="h-24 bg-gray-50 rounded w-full"></div>
      </div>
    );

    const data = currentDoc.extractedData || {};

    switch (currentDoc.type) {
      case '发票':
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">票据代码</p>
                <p className="text-sm font-black text-indigo-900">{data.invoiceCode || 'N/A'}</p>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <p className="text-[9px] text-indigo-400 font-black uppercase mb-1">统筹基金支付</p>
                <p className="text-sm font-black text-indigo-900">¥{data.medicarePay || '0.00'}</p>
              </div>
            </div>
            <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b pb-2">明细清单 (AI 提取)</p>
               <div className="space-y-2">
                 {(data.items || []).map((item: string, i: number) => (
                   <div key={i} className="flex justify-between items-center text-[11px]">
                     <span className="text-gray-500 font-medium">{item.split(':')[0]}</span>
                     <span className="font-bold text-gray-900">{item.split(':')[1]}</span>
                   </div>
                 ))}
                 <div className="pt-2 flex justify-between items-center text-xs border-t mt-2">
                    <span className="font-black text-gray-900 uppercase">当前单据总计</span>
                    <span className="font-black text-indigo-600">¥{(data.items || []).reduce((acc: number, cur: string) => acc + parseFloat(cur.split('¥')[1] || '0'), 0).toFixed(2)}</span>
                 </div>
               </div>
            </div>
          </div>
        );
      case '出院小结':
        return (
          <div className="bg-amber-50/40 p-5 rounded-3xl border border-amber-100 animate-fadeIn space-y-4">
            <div className="flex items-center gap-2 border-b border-amber-100 pb-3">
               <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">关键诊疗逻辑</h4>
            </div>
            <div className="space-y-3">
               <div>
                  <p className="text-[9px] font-black text-amber-500 uppercase">主要症状</p>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{data.symptoms || '未见明显描述'}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-amber-500 uppercase">手术/处置</p>
                  <p className="text-xs text-gray-700 leading-relaxed font-bold">{data.operation || '无手术记录'}</p>
               </div>
               <div className="p-3 bg-white rounded-xl border border-amber-100/50 italic text-[10px] text-gray-500">
                  AI 备注: 该手术符合保单第 14 条“急腹症手术”保障范围。
               </div>
            </div>
          </div>
        );
      case '检查报告':
        return (
          <div className="bg-emerald-50/40 p-5 rounded-3xl border border-emerald-100 animate-fadeIn space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
               <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">辅助检查结论</h4>
            </div>
            <div className="space-y-3">
               <p className="text-[11px] text-gray-700 leading-relaxed font-medium">影像所见：{data.findings}</p>
               <div className="px-3 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                  结论：{data.conclusion}
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
               <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-xs text-gray-400 font-medium tracking-tight">已智能识别为 {currentDoc.type}，基础信息已归档。请切换至发票或小结查看明细。</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-fadeIn">
      {/* 头部摘要 */}
      <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">理算审核: {claim.caseNumber}</h1>
            <div className="flex items-center gap-3 mt-0.5">
               <p className="text-xs text-gray-500 font-bold">{claim.insuredName} | {claim.idCard}</p>
               <button 
                onClick={() => onViewPolicy(claim.policyNumber)}
                className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1.5 font-black uppercase tracking-widest"
               >
                 穿透至关联保单
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-500 hover:bg-gray-50 transition-all">标记可疑</button>
           <button className="px-7 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">批准并放款</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* 左侧：影像及就诊树 (占 8/12) */}
        <div className="lg:col-span-8 flex flex-col bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl min-h-0">
          {/* 就诊批次切换 (多就诊显示) */}
          <div className="bg-gray-800/80 backdrop-blur p-4 border-b border-gray-700 flex items-center gap-3 overflow-x-auto flex-shrink-0 scrollbar-hide">
             <div className="bg-gray-700 px-2 py-1 rounded text-[9px] text-gray-400 font-black uppercase tracking-tighter">案件就诊记录</div>
             {claim.visits.map((v, i) => (
               <button 
                key={v.id} 
                onClick={() => handleVisitSwitch(i)}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black transition-all border whitespace-nowrap ${
                  activeVisitIndex === i 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' 
                  : 'bg-gray-700 text-gray-400 border-gray-600 hover:text-gray-200'
                }`}
               >
                 {v.hospitalName} ({v.admissionDate.split('-').slice(1).join('/')})
               </button>
             ))}
          </div>

          {/* 影像预览 */}
          <div className="flex-1 flex items-center justify-center p-8 relative min-h-0 bg-black/40">
            {isDocProcessing && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-20 flex items-center justify-center animate-fadeIn">
                 <div className="text-center">
                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-white text-[9px] font-black tracking-widest uppercase">Fetching OCR Data...</p>
                 </div>
              </div>
            )}
            <img 
              key={currentDoc.id} 
              src={currentDoc.url} 
              className="max-h-full max-w-full object-contain shadow-2xl rounded-sm animate-scaleIn" 
              alt="Visit Record" 
            />
          </div>
          
          {/* 单据索引 */}
          <div className="bg-gray-800/95 p-5 border-t border-gray-700 flex-shrink-0">
             <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                {currentVisit.docs.map((doc, idx) => (
                  <button 
                    key={doc.id}
                    onClick={() => handleDocSwitch(idx)}
                    className={`flex-shrink-0 relative transition-all duration-300 ${activeDocIndex === idx ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-100'}`}
                  >
                    <div className={`w-14 h-18 rounded-xl overflow-hidden border-2 ${activeDocIndex === idx ? 'border-indigo-500 shadow-indigo-500/20' : 'border-gray-600'}`}>
                      <img src={doc.url} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-black/80 px-1 py-0.5 rounded text-[7px] text-white font-black uppercase">{doc.type}</div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* 右侧：结构化面板 (占 4/12) */}
        <div className="lg:col-span-4 overflow-y-auto pr-1 flex flex-col gap-6 custom-scrollbar min-h-0 pb-10">
           {/* 就诊基础信息 (切换单据时此块不动) */}
           <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm flex-shrink-0">
              <div className="flex items-center justify-between mb-5 border-b pb-4 border-gray-50">
                <h3 className="font-black text-gray-900 text-[10px] uppercase tracking-widest">就诊批次基础信息 (共享)</h3>
                <span className="text-[8px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-black border border-green-100 uppercase tracking-tighter">已校验数据</span>
              </div>
              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                 <div className="space-y-1">
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">就诊医疗机构</p>
                   <p className="text-xs font-black text-gray-800 leading-tight">{currentVisit.hospitalName}</p>
                   <p className="text-[9px] text-indigo-500 font-bold uppercase">{currentVisit.hospitalLevel}</p>
                 </div>
                 <div className="space-y-1 text-right">
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">就诊时段</p>
                   <p className="text-xs font-black text-gray-800">{currentVisit.admissionDate} - {currentVisit.dischargeDate}</p>
                 </div>
                 <div className="space-y-1 col-span-2 p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                   <p className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter mb-1">主要诊断结论 (ICD-10)</p>
                   <p className="text-xs font-black text-indigo-900 leading-relaxed">{currentVisit.diagnosis}</p>
                 </div>
              </div>
           </div>

           {/* 详细识别面板 (随单据切换而变) */}
           <div className="flex-1 bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-xl min-h-0 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] select-none pointer-events-none">
                 <span className="text-8xl font-black uppercase tracking-tighter">{currentDoc.type[0]}</span>
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                 <h3 className="font-black text-gray-900 text-xs flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100"></span>
                    当前单据识别: {currentDoc.type}
                 </h3>
                 <span className="text-[9px] text-gray-400 font-mono tracking-widest">CONFIDENCE: {(currentDoc.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                 {renderDocSpecificDetails()}
              </div>
           </div>

           {/* AI 全案建议 (始终可见) */}
           <div className="bg-indigo-900 p-6 rounded-[2rem] shadow-2xl text-white flex-shrink-0">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-indigo-300">AI 智能理算决策</h3>
              {isSummaryLoading ? (
                <div className="h-4 bg-white/10 rounded-full animate-pulse w-full"></div>
              ) : (
                <p className="text-[11px] leading-relaxed font-bold italic text-indigo-50">“{aiSummary}”</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;
