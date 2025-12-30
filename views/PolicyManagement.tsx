
import React, { useState, useEffect } from 'react';
import { Policy, PolicyPlan, Claim } from '../types';

const generateMockMembers = (count: number) => Array.from({ length: count }).map((_, i) => ({
  id: `M${1000 + i}`,
  name: ['张三', '李四', '王五', '赵六', '孙七'][i % 5] + (i > 5 ? i : ''),
  idCard: `11010119900101${1000 + i}`,
  premium: 1200 + Math.random() * 800,
  claimCount: Math.floor(Math.random() * 5)
}));

export const mockPolicies: Policy[] = [
  {
    id: 'P1',
    policyNumber: 'POL-001',
    name: '华为技术有限公司 - 雇主责任险',
    type: '雇主责任险',
    holder: '华为技术有限公司',
    insuredCount: 5200,
    status: '生效中',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-31',
    terms: '涵盖工伤身故(120万)、伤残赔付、医疗费用。',
    plans: [
      { 
        id: 'PL1', 
        name: '方案A (管理层)', 
        benefits: ['意外身故: 100万', '意外医疗: 10万', '住院津贴: 200/天'], 
        specialTerms: [
          '扩展猝死条款：涵盖工作时间内急性病发作 48 小时内死亡。',
          '既往症约定：不追究入职前一年内的既往病史，仅限心脑血管类除外。',
          '扩展运动损伤：包含公司组织的体育赛事产生的意外医疗费用。',
          '法律费用：提供因工伤引发诉讼的法律援助费用，最高 5 万元。'
        ],
        members: generateMockMembers(12) 
      },
      { 
        id: 'PL2', 
        name: '方案B (研发工程师)', 
        benefits: ['意外身故: 50万', '意外医疗: 5万', '住院津贴: 100/天'], 
        specialTerms: [
          '加班扩展：保障时间自动覆盖员工加班返家途中及法定节假日。',
          '无免赔额约定：意外医疗取消 100 元免赔额门槛。',
          '职业病关怀：包含因工作环境引发的急性铅中毒等特定职业病保障。'
        ],
        members: generateMockMembers(30) 
      }
    ]
  },
  {
    id: 'P2',
    policyNumber: 'POL-003',
    name: '腾讯科技 - 团体补充医疗保障',
    type: '补充医疗险',
    holder: '腾讯科技(深圳)有限公司',
    insuredCount: 3800,
    status: '生效中',
    effectiveDate: '2024-03-01',
    expiryDate: '2025-02-28',
    terms: '门诊/住院全额报销，涵盖特需医疗。',
    plans: [
      { 
        id: 'PL3', 
        name: '精英医疗方案 (尊享级)', 
        benefits: ['特需医疗报销: 100%', '全球紧急救援: 有', '私立/外资医院直付: 支持'], 
        specialTerms: [
          '指定医疗机构：上海华山医院、瑞金医院等三甲特需部直付无需垫付。',
          '抗癌特药扩展：包含《国家特药目录》外 50 种高价进口抗癌药，0 免赔。',
          '家属共享：员工配偶及未成年子女自动共享保单保额 50%。',
          '牙科/眼科专项：每年提供 2000 元牙科检查及配镜津贴。'
        ],
        members: generateMockMembers(15) 
      }
    ]
  }
];

interface PolicyManagementProps {
  initialPolicyNumber?: string | null;
  onClearJump?: () => void;
  returnToClaim?: Claim | null;
  onBackToClaim?: (claim: Claim) => void;
}

const PolicyManagement: React.FC<PolicyManagementProps> = ({ initialPolicyNumber, onClearJump, returnToClaim, onBackToClaim }) => {
  const [filter, setFilter] = useState('全部');
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [activePlan, setActivePlan] = useState<PolicyPlan | null>(null);

  useEffect(() => {
    if (initialPolicyNumber) {
      const p = mockPolicies.find(pol => pol.policyNumber === initialPolicyNumber);
      if (p) {
        setSelectedPolicy(p);
        setActivePlan(p.plans[0]);
      }
    }
  }, [initialPolicyNumber]);

  const filteredPolicies = filter === '全部' 
    ? mockPolicies 
    : mockPolicies.filter(p => p.type === filter);

  if (selectedPolicy) {
    return (
      <div className="space-y-6 animate-fadeIn pb-10">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedPolicy(null);
                onClearJump?.();
              }}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedPolicy.name}</h2>
              <p className="text-xs text-gray-400 font-mono">保单号: {selectedPolicy.policyNumber} | {selectedPolicy.holder}</p>
            </div>
          </div>
          {returnToClaim && (
            <button 
              onClick={() => onBackToClaim?.(returnToClaim)}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              返回理赔案件: {returnToClaim.caseNumber}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest border-b pb-2">保障方案选择</h3>
                <div className="space-y-3">
                  {selectedPolicy.plans.map(plan => (
                    <button 
                      key={plan.id}
                      onClick={() => setActivePlan(plan)}
                      className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all border ${activePlan?.id === plan.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{plan.name}</span>
                        {activePlan?.id === plan.id && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>}
                      </div>
                    </button>
                  ))}
                </div>
             </div>
             
             {activePlan && (
               <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest border-b pb-2">方案特别约定 (AI 解析)</h3>
                  <div className="space-y-4">
                    {activePlan.specialTerms.map((term, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="mt-1 flex-shrink-0 w-4 h-4 rounded bg-orange-100 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>
                        </div>
                        <p className="text-[11px] leading-relaxed text-gray-600 font-medium">{term}</p>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>

          <div className="lg:col-span-8 space-y-6">
             {activePlan && (
               <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex gap-6 items-center">
                  <div className="flex-1">
                     <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">主要保障利益 (核心)</h3>
                     <div className="flex flex-wrap gap-2">
                        {activePlan.benefits.map((b, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-indigo-600 border border-indigo-100 shadow-sm">
                            {b}
                          </span>
                        ))}
                     </div>
                  </div>
                  <div className="w-px h-12 bg-indigo-200"></div>
                  <div className="text-center px-4">
                     <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">已保人数</p>
                     <p className="text-2xl font-black text-indigo-900">{activePlan.members.length}</p>
                  </div>
               </div>
             )}

             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                   <h3 className="font-bold text-gray-900">方案成员列表</h3>
                   <div className="flex items-center gap-3">
                      <div className="relative">
                        <input type="text" placeholder="搜索成员、身份证..." className="bg-gray-50 border-none rounded-xl text-xs py-2 pl-9 pr-4 w-56 focus:ring-1 focus:ring-indigo-500 transition-all"/>
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2-8H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      </button>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                          <th className="px-6 py-4">姓名</th>
                          <th className="px-6 py-4">证件信息</th>
                          <th className="px-6 py-4 text-center">风险评分</th>
                          <th className="px-6 py-4">保费估算</th>
                          <th className="px-6 py-4">赔付记录</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {activePlan?.members.map(m => (
                           <tr key={m.id} className="hover:bg-gray-50/80 transition-colors group">
                             <td className="px-6 py-4">
                                <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{m.name}</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-[10px] font-mono font-medium text-gray-400 tracking-tighter">{m.idCard}</span>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <div className={`inline-block w-2.5 h-2.5 rounded-full ${m.claimCount > 3 ? 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : m.claimCount > 0 ? 'bg-orange-300' : 'bg-green-400'}`}></div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-xs font-black text-indigo-900">¥{m.premium.toFixed(2)}</span>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <div className="flex -space-x-1">
                                      {Array.from({length: Math.min(m.claimCount, 3)}).map((_, i) => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-gray-200 border border-white"></div>
                                      ))}
                                      {m.claimCount > 3 && <span className="text-[8px] text-gray-400 pl-2">+{m.claimCount - 3}</span>}
                                   </div>
                                   <span className="text-[10px] font-bold text-gray-500">{m.claimCount} 次</span>
                                </div>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">团险保单库</h1>
          <p className="text-gray-500 text-sm font-medium">企业级保险合同集中管理与理赔责任校验。</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          {['全部', '雇主责任险', '团体意外险', '补充医疗险'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPolicies.map(policy => (
          <div 
            key={policy.id} 
            onClick={() => {
              setSelectedPolicy(policy);
              setActivePlan(policy.plans[0]);
            }}
            className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col group relative overflow-hidden cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl ${
                  policy.type === '雇主责任险' ? 'bg-gradient-to-br from-orange-400 to-rose-500' :
                  policy.type === '团体意外险' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' : 
                  'bg-gradient-to-br from-emerald-400 to-teal-600'
                }`}>
                  {policy.type[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">{policy.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded border border-indigo-100 uppercase">{policy.policyNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-5 gap-x-8 text-sm flex-1 mb-6">
              {[
                { label: '投保主体', value: policy.holder },
                { label: '覆盖人数', value: `${policy.insuredCount.toLocaleString()} 位` },
                { label: '有效期至', value: policy.expiryDate }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="font-bold text-gray-700 text-xs">{item.value}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-50 mt-auto">
               <span className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                  查看详细方案、特约与成员
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PolicyManagement;
