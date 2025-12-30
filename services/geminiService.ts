
import { GoogleGenAI, Type } from "@google/genai";
import { Claim, DocType } from "../types";

// Always use named parameter for apiKey and directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 智能文档分类
 */
export const classifyDocument = async (imageUrl: string): Promise<{ type: DocType; confidence: number }> => {
  const prompt = `分析这张医疗理赔单据影像，将其分类为以下之一：'发票', '费用明细', '诊断证明', '出院小结', '身份证明'。如果是其他，返回'未知'。同时给出 0-1 之间的置信度。返回 JSON 格式。`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });
    // Use .text property directly
    return JSON.parse(response.text || '{"type": "未知", "confidence": 0}');
  } catch (error) {
    return { type: '未知', confidence: 0 };
  }
};

/**
 * 增强版 OCR 识别
 */
export const getDetailedOCR = async (fileName: string) => {
  const prompt = `从医疗单据 "${fileName}" 中提取深度信息。要求返回 JSON：
  - patientName: 姓名
  - hospital: 医院名称
  - hospitalLevel: 医院等级 (如 三甲)
  - admissionDate: 入院日期
  - dischargeDate: 出院日期
  - icd10: 疾病编码
  - diagnosis: 详细诊断内容
  - totalAmount: 总金额
  - selfPay: 自费金额
  - medicarePay: 医保报销金额
  - medicineDetails: 药品明细列表 (string[])`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    // Use .text property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return null;
  }
};

/**
 * 个人健康状况总结
 */
export const getInsuredHealthSummary = async (name: string, history: any[]) => {
  const prompt = `你是一位专业的保险核保专家。请根据客户 "${name}" 的历史理赔记录：${JSON.stringify(history)}，生成一份专业的个人健康评估总结。
  字数控制在200字以内，包含健康趋势分析、慢性病风险预警和核保建议。用中文书写。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use .text property directly
    return response.text;
  } catch (error) {
    return "暂时无法生成健康总结。";
  }
};

/**
 * 获取案件 AI 总结
 */
export const getAIClaimSummary = async (claim: Claim): Promise<string> => {
  const prompt = `分析理赔案件 ${claim.caseNumber}。被保险人：${claim.insuredName}，金额：¥${claim.amount}。请基于医疗常规逻辑，给出一份简短的理赔审批建议。用中文书写，150字以内。`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use .text property directly
    return response.text || "未能生成案件建议。";
  } catch (error) {
    return "案件建议分析失败。";
  }
};

/**
 * 责任分析
 */
export const analyzeLiability = async (claimId: string) => {
  // Mock implementation for responsibility analysis
  return `案件 ${claimId} 的责任判定：符合保单扩展责任范围。`;
};
