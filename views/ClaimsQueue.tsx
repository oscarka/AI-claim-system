
import React, { useState } from 'react';
import { Claim, ClaimStatus } from '../types';

interface ClaimsQueueProps {
  onSelectClaim: (claim: Claim) => void;
}

const mockClaims: Claim[] = [
  // Fix: changed 'docs' to 'visits' to match the Claim interface
  { id: '1', caseNumber: 'CL-2024-001', insuredId: 'I001', insuredName: '张三', idCard: '110101***231X', policyNumber: 'POL-001', status: ClaimStatus.UNDER_REVIEW, amount: 1500, createdAt: '2024-05-20', visits: [] },
  { id: '2', caseNumber: 'CL-2024-002', insuredId: 'I003', insuredName: '王五', idCard: '320502***1124', policyNumber: 'POL-005', status: ClaimStatus.OCR_PROCESSING, amount: 4200, createdAt: '2024-05-21', visits: [] },
  { id: '3', caseNumber: 'CL-2024-003', insuredId: 'I002', insuredName: '李思', idCard: '440301***9987', policyNumber: 'POL-003', status: ClaimStatus.PENDING, amount: 800, createdAt: '2024-05-21', visits: [] },
  { id: '4', caseNumber: 'CL-2024-004', insuredId: 'I004', insuredName: '赵雷', idCard: '130101***5510', policyNumber: 'POL-012', status: ClaimStatus.APPROVED, amount: 12000, createdAt: '2024-05-18', visits: [] },
  { id: '5', caseNumber: 'CL-2024-005', insuredId: 'I005', insuredName: '刘勇', idCard: '210102***3412', policyNumber: 'POL-001', status: ClaimStatus.REJECTED, amount: 300, createdAt: '2024-05-15', visits: [] },
  { id: '6', caseNumber: 'CL-2024-006', insuredId: 'I006', insuredName: '陈静', idCard: '310104***8821', policyNumber: 'POL-008', status: ClaimStatus.UNDER_REVIEW, amount: 2600, createdAt: '2024-05-22', visits: [] },
  { id: '7', caseNumber: 'CL-2024-007', insuredId: 'I007', insuredName: '孙亮', idCard: '370102***3319', policyNumber: 'POL-001', status: ClaimStatus.PENDING_DOCS, amount: 950, createdAt: '2024-05-22', visits: [] },
  { id: '8', caseNumber: 'CL-2024-008', insuredId: 'I008', insuredName: '周梅', idCard: '420106***7715', policyNumber: 'POL-009', status: ClaimStatus.APPROVED, amount: 1800, createdAt: '2024-05-23', visits: [] },
  { id: '9', caseNumber: 'CL-2024-009', insuredId: 'I009', insuredName: '吴刚', idCard: '510107***2211', policyNumber: 'POL-003', status: ClaimStatus.UNDER_REVIEW, amount: 5500, createdAt: '2024-05-23', visits: [] },
  { id: '10', caseNumber: 'CL-2024-010', insuredId: 'I010', insuredName: '郑洁', idCard: '610101***6618', policyNumber: 'POL-010', status: ClaimStatus.PENDING, amount: 1200, createdAt: '2024-05-24', visits: [] },
];

const StatusBadge: React.FC<{ status: ClaimStatus }> = ({ status }) => {
  const styles: Record<ClaimStatus, string> = {
    [ClaimStatus.PENDING]: 'bg-gray-100 text-gray-600',
    [ClaimStatus.OCR_PROCESSING]: 'bg-blue-100 text-blue-600 animate-pulse',
    [ClaimStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-600',
    [ClaimStatus.APPROVED]: 'bg-green-100 text-green-600',
    [ClaimStatus.REJECTED]: 'bg-red-100 text-red-600',
    [ClaimStatus.PENDING_DOCS]: 'bg-purple-100 text-purple-600',
  };

  const labels: Record<ClaimStatus, string> = {
    [ClaimStatus.PENDING]: '等待受理',
    [ClaimStatus.OCR_PROCESSING]: 'OCR 识别中',
    [ClaimStatus.UNDER_REVIEW]: '人工复核',
    [ClaimStatus.APPROVED]: '准予赔付',
    [ClaimStatus.REJECTED]: '拒绝受理',
    [ClaimStatus.PENDING_DOCS]: '等待资料',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const ClaimsQueue: React.FC<ClaimsQueueProps> = ({ onSelectClaim }) => {
  const [filter, setFilter] = useState<string>('全部');

  const filteredClaims = filter === '全部' 
    ? mockClaims 
    : mockClaims.filter(c => {
        if (filter === '人工复核') return c.status === ClaimStatus.UNDER_REVIEW;
        if (filter === '准予赔付') return c.status === ClaimStatus.APPROVED;
        if (filter === '等待受理') return c.status === ClaimStatus.PENDING;
        return true;
      });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">理赔案件队列</h2>
          <p className="text-sm text-gray-500">管理并审核所有新进入系统的团体理赔申请。</p>
        </div>
        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
          {['全部', '等待受理', '人工复核', '准予赔付'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === f ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4">案件号</th>
              <th className="px-6 py-4">被保险人</th>
              <th className="px-6 py-4">关联保单</th>
              <th className="px-6 py-4">申请金额</th>
              <th className="px-6 py-4">提交日期</th>
              <th className="px-6 py-4">当前状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClaims.map((claim) => (
              <tr 
                key={claim.id} 
                className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                onClick={() => onSelectClaim(claim)}
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-indigo-600">{claim.caseNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${claim.id}/32/32`} className="rounded-full w-8 h-8" alt="Insured" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{claim.insuredName}</p>
                      <p className="text-xs text-gray-500">{claim.idCard}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{claim.policyNumber}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">¥{claim.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-xs text-gray-500">{claim.createdAt}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={claim.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClaimsQueue;
