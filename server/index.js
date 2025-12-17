import express from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'

const app = express()
app.use(cors())
app.use(express.json())

const HOLIDAY_SYSTEM_INSTRUCTION = `
你是一个全球商务日历数据助手。你的任务是根据请求的年份、月份和国家，提供该国准确的公众假期和银行休息日信息。
特别注意：
1. 中东国家（如沙特、约旦、埃及）通常周五和周六是周末，周日是工作日，但这不属于“假期”，除非是特定节日。
2. 请准确区分法定节假日（Public Holiday）和银行休息日（Bank Holiday）。
3. 如果该月没有假期，返回空数组。
`

const ASSISTANT_SYSTEM_INSTRUCTION = `
你是一个专业的跨国业务秘书，服务于一家业务遍及亚洲和中东的公司。
你的能力包括：
1. 翻译：将用户的中文输入翻译成目标国家的当地语言（商务风格）。
2. 礼仪建议：根据目标国家提供商务社交、着装、沟通禁忌等建议。
3. 提醒生成：根据用户输入生成待办事项建议。
请用简洁、专业的语气回答。
`


function getAI() {
  const apiKey = process.env.GEMINI_API_KEY
  return new GoogleGenAI({ apiKey })
}

app.get('/api/holidays', async (req, res) => {
  const { country, year, month } = req.query
  try {
    const ai = getAI()
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `请列出 ${country} 在 ${year}年${month}月 的所有公众假期和重要的银行休息日。`,
      config: {
        systemInstruction: HOLIDAY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    })
    const text = response.text || '[]'
    res.json(JSON.parse(text))
  } catch {
    res.json([])
  }
})

app.post('/api/assistant', async (req, res) => {
  const { query, country, context } = req.body
  let prompt = ''
  if (context === 'translation') {
    prompt = `请将以下文本翻译成${country.lang}，用于商务沟通场景：\n"${query}"\n\n同时附带中文对照和发音指导（如果适用）。`
  } else {
    prompt = `针对${country.name}的业务场景：${query}`
  }
  try {
    const ai = getAI()
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION }
    })
    res.json({ text: response.text || '无法生成回答' })
  } catch {
    res.status(500).json({ text: 'AI 助手暂时不可用。' })
  }
})

app.get('/api/exchange-rate', async (req, res) => {
  const { from, to } = req.query
  try {
    const ai = getAI()
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `What is the current exchange rate from 1 ${from} to ${to}? 
      Please answer with ONLY the numeric rate (e.g., 5.34). Do not include any text explanation.`,
      config: { tools: [{ googleSearch: {} }] }
    })
    const text = response.text || ''
    const match = text.match(/[\d,]+\.?\d*/)
    const rate = match ? parseFloat(match[0].replace(/,/g, '')) : 0
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk.web)
      .filter((web) => web) || []
    res.json({ rate, lastUpdated: new Date().toLocaleString('zh-CN'), sources })
  } catch {
    res.status(500).json(null)
  }
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000
app.listen(port, () => {})
