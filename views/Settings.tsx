
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI 核心参数设定</h1>
          <p className="text-gray-500">管理 Aisur 系统的智能化决策逻辑、风控强度及数据安全规则。</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100">保存全局配置</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI 风控引擎 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-gray-100 bg-gray-50/30">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 AI 欺诈检测引擎
              </h3>
           </div>
           <div className="p-6 space-y-6 flex-1">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-sm font-bold text-gray-800">黑名单医院关联审查</p>
                       <p className="text-[11px] text-gray-400">自动拦截高风险区域或黑名单医院的就诊影像。</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-sm font-bold text-gray-800">影像篡改像素级检测</p>
                       <p className="text-[11px] text-gray-400">利用计算机视觉检测发票金额、公章是否有 P 图嫌疑。</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-gray-50">
                    <p className="text-xs font-bold text-gray-500 mb-3">多维案件关联强度系数 (1-10)</p>
                    <input type="range" min="1" max="10" defaultValue="7" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase">
                       <span>宽松</span>
                       <span className="text-indigo-600 font-black">当前: 7.0 (深度穿透)</span>
                       <span>极严</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 核保逻辑自动化 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-gray-100 bg-gray-50/30">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.506.326l-2.203-.44a4 4 0 00-2.52.334l-.522.26a2 2 0 01-2.457-1.157l-1.636-3.27a2 2 0 011.022-2.457l3.27-1.636a2 2 0 012.457 1.022l.547 1.022a2 2 0 002.457 1.157l2.203-.44a4 4 0 012.506-.326l.673.337a6 6 0 013.86.517l2.387.477a2 2 0 011.022.547l1.022 1.022a2 2 0 010 2.828l-1.022 1.022z" /></svg>
                 核保逻辑自动化
              </h3>
           </div>
           <div className="p-6 space-y-6 flex-1">
              <div className="space-y-4">
                 <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <p className="text-sm font-bold text-indigo-900 mb-1">自动通过阈值 (Confidence)</p>
                    <p className="text-[10px] text-indigo-400 mb-3">AI 判定结果置信度高于此值时，直接流转至财务付款环节。</p>
                    <div className="flex items-center gap-4">
                       <input type="range" defaultValue="88" className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                       <span className="text-sm font-black text-indigo-600">88%</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center px-2">
                    <div>
                       <p className="text-sm font-bold text-gray-800">ICD-10 疾病自动匹配</p>
                       <p className="text-[11px] text-gray-400">自动比对诊疗摘要与保单保障责任中的 ICD 编码。</p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                       <input type="checkbox" className="sr-only peer" defaultChecked />
                       <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* 数据隐私与脱敏 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:col-span-2">
           <div className="p-6 border-b border-gray-100 bg-gray-50/30">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 安全与合规配置 (Privacy)
              </h3>
           </div>
           <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">敏感字段脱敏</p>
                 <div className="space-y-2">
                    {['身份证号 (掩码)', '手机号码 (前三后四)', '居住地址 (模糊到街道)', '银行卡号 (仅留后四位)'].map(item => (
                      <label key={item} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <span className="text-xs text-gray-600 group-hover:text-indigo-600 transition-colors">{item}</span>
                      </label>
                    ))}
                 </div>
              </div>
              <div className="space-y-3">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">数据访问审计</p>
                 <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold mb-2">当前存证模式：区块链加密链路</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">所有审核员的查看、修改、下载操作均会实时上链存证，不可篡改。</p>
                 </div>
              </div>
              <div className="space-y-3">
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">模型版本管理</p>
                 <div className="p-4 border border-indigo-200 bg-indigo-50/20 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[11px] font-bold text-indigo-600">DeepSeek (Latest)</span>
                       <span className="px-2 py-0.5 bg-green-500 text-white text-[8px] rounded uppercase font-black">Stable</span>
                    </div>
                    <p className="text-[10px] text-gray-400">已于 2024-05-20 部署。推理性能提升 40%，OCR 识别精度提升至 99.4%。</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pb-10">
         <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">导出系统日志</button>
         <button className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-xl">应用配置修改</button>
      </div>
    </div>
  );
};

export default Settings;
