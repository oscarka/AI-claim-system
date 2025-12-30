
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import ClaimsQueue from './views/ClaimsQueue';
import ClaimDetail from './views/ClaimDetail';
import InsuredList from './views/InsuredList';
import InsuredDetail from './views/InsuredDetail';
import PolicyManagement from './views/PolicyManagement';
import Settings from './views/Settings';
import { Claim, Insured, ClaimStatus, Visit, ClaimDoc } from './types';

// 增强型 Mock 单据生成
const createMockDoc = (id: string, type: string, seed: string): ClaimDoc => {
  const dataMap: any = {
    '发票': {
      invoiceCode: `INV-${Math.floor(Math.random() * 900000)}`,
      medicarePay: (Math.random() * 1000).toFixed(2),
      items: ['西药费: ¥890.00', '材料费: ¥1200.00', '诊查费: ¥50.00', '化验费: ¥340.00']
    },
    '出院小结': {
      symptoms: '右下腹转移性疼痛伴发热',
      operation: '腹腔镜下阑尾切除术',
      order: '出院后注意休息，伤口禁水，1周后门诊复查。'
    },
    '检查报告': {
      findings: '阑尾粗大，直径约 1.2cm，周围见液性暗区。',
      conclusion: '符合急性阑尾炎表现。'
    },
    '费用明细': {
      details: '查看 128 项完整明细清单...'
    }
  };

  return {
    id,
    url: `https://picsum.photos/seed/${seed}/800/1000`,
    type: type as any,
    confidence: 0.95 + Math.random() * 0.04,
    extractedData: dataMap[type] || {}
  };
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedInsured, setSelectedInsured] = useState<Insured | null>(null);
  const [targetPolicyNumber, setTargetPolicyNumber] = useState<string | null>(null);
  const [returnClaim, setReturnClaim] = useState<Claim | null>(null);

  const renderContent = () => {
    if (selectedClaim) {
      return (
        <ClaimDetail 
          claim={selectedClaim} 
          onBack={() => setSelectedClaim(null)} 
          onViewPolicy={(polNum) => {
            setReturnClaim(selectedClaim);
            setTargetPolicyNumber(polNum);
            setSelectedClaim(null);
            setActiveView('policies');
          }}
        />
      );
    }
    
    if (selectedInsured) {
      return <InsuredDetail insured={selectedInsured} onBack={() => setSelectedInsured(null)} />;
    }

    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'claims':
        return (
          <ClaimsQueue 
            onSelectClaim={(c) => {
              // 模拟一个案件包含三次就诊的情况
              const visits: Visit[] = [
                {
                  id: 'V101',
                  hospitalName: '上海华山医院',
                  hospitalLevel: '三级甲等',
                  admissionDate: '2024-05-10',
                  dischargeDate: '2024-05-15',
                  diagnosis: '急性阑尾炎 (住院手术)',
                  totalVisitAmount: 12500.50,
                  docs: [
                    createMockDoc('d1-1', '发票', 'v1invoice'),
                    createMockDoc('d1-2', '出院小结', 'v1summary'),
                    createMockDoc('d1-3', '费用明细', 'v1detail'),
                  ]
                },
                {
                  id: 'V102',
                  hospitalName: '上海华山医院 (门诊)',
                  hospitalLevel: '三级甲等',
                  admissionDate: '2024-05-22',
                  dischargeDate: '2024-05-22',
                  diagnosis: '阑尾切除术后复查',
                  totalVisitAmount: 480.00,
                  docs: [
                    createMockDoc('d2-1', '发票', 'v2invoice'),
                    createMockDoc('d2-2', '检查报告', 'v2report'),
                  ]
                },
                {
                  id: 'V103',
                  hospitalName: '益丰大药房 (医保定点)',
                  hospitalLevel: '药店',
                  admissionDate: '2024-05-25',
                  dischargeDate: '2024-05-25',
                  diagnosis: '术后康复配药',
                  totalVisitAmount: 235.60,
                  docs: [
                    createMockDoc('d3-1', '发票', 'v3invoice'),
                  ]
                }
              ];
              setSelectedClaim({ ...c, visits });
            }} 
          />
        );
      case 'knowledge': return <InsuredList onSelect={(i) => setSelectedInsured(i)} />;
      case 'policies':
        return (
          <PolicyManagement 
            initialPolicyNumber={targetPolicyNumber} 
            onClearJump={() => setTargetPolicyNumber(null)}
            returnToClaim={returnClaim}
            onBackToClaim={(claim) => {
              setReturnClaim(null);
              setTargetPolicyNumber(null);
              setSelectedClaim(claim);
            }}
          />
        );
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={(v) => { 
        setActiveView(v); 
        setSelectedClaim(null); 
        setSelectedInsured(null); 
        setTargetPolicyNumber(null);
        setReturnClaim(null);
      }} />
      <main className="ml-64 flex-1 p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white shadow-sm sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="relative">
                <input type="text" placeholder="搜索案件、被保险人或保单条目..." className="bg-gray-100/80 border-none rounded-xl pl-10 pr-4 py-2.5 text-xs w-96 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium"/>
                <svg className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] animate-pulse">AI Agent Active</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase">Gemini 3 Flash Enabled</span>
              </div>
              <div className="h-8 w-px bg-gray-100"></div>
              <img src="https://picsum.photos/seed/user/64/64" className="w-9 h-9 rounded-xl border-2 border-indigo-100 shadow-sm" alt="Admin" />
           </div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
