
import React, { useState } from 'react';
import { Insured } from '../types';

const mockInsureds: Insured[] = [
  { id: 'I001', name: '张三', age: 34, gender: '男', idCard: '110101***231X', riskLevel: '高', historyCount: 12, tags: ['高频理赔', '糖尿病倾向'] },
  { id: 'I002', name: '李思', age: 28, gender: '女', idCard: '440301***9987', riskLevel: '低', historyCount: 1, tags: ['优质客户'] },
  { id: 'I003', name: '王五', age: 45, gender: '男', idCard: '320502***1124', riskLevel: '中', historyCount: 5, tags: ['慢性支气管炎'] },
  { id: 'I004', name: '赵六', age: 52, gender: '女', idCard: '610101***6618', riskLevel: '中', historyCount: 4, tags: ['甲状腺结节'] },
  { id: 'I005', name: '陈七', age: 31, gender: '男', idCard: '210102***3412', riskLevel: '低', historyCount: 2, tags: ['职场新人'] },
];

interface InsuredListProps {
  onSelect: (insured: Insured) => void;
}

const InsuredList: React.FC<InsuredListProps> = ({ onSelect }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">客户健康管理</h1>
        <p className="text-gray-500">查看被保险人的个人健康全景图谱与核保建议。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInsureds.map(person => (
          <div 
            key={person.id}
            onClick={() => onSelect(person)}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {person.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{person.name}</h3>
                  <p className="text-xs text-gray-500">{person.gender} | {person.age}岁</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                person.riskLevel === '高' ? 'bg-red-50 text-red-600' :
                person.riskLevel === '中' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                风险: {person.riskLevel}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">历史案件数</span>
                <span className="font-bold">{person.historyCount}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {person.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsuredList;
