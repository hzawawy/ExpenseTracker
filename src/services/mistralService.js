import { initLlama, loadLlamaModelInfo } from 'llama.rn';
import * as FileSystem from 'expo-file-system';

class MistralService {
    constructor() {
        this.context = null;
        this.isInitialized = false;
        this.modelInfo = null;
    }

    async initialize(modelPath = null) {
        if (this.isInitialized && this.context) return;

        try {
            console.log('🤖 Initializing Mistral model...');
            
            const defaultModelPath = `${FileSystem.documentDirectory}ministral-3b-instruct-q4_k_m.gguf`;
            const finalModelPath = modelPath || defaultModelPath;
            
            const modelExists = await FileSystem.getInfoAsync(finalModelPath);
            if (!modelExists.exists) {
                throw new Error(`Model file not found at ${finalModelPath}`);
            }

            this.modelInfo = await loadLlamaModelInfo(finalModelPath);
            console.log('📋 Model Info:', this.modelInfo);
            
            this.context = await initLlama({
                model: finalModelPath,
                n_ctx: 4096,
                n_gpu_layers: 0,
                embedding: false,
                n_threads: 2,
                temp: 0.3,
                top_p: 0.9,
                seed: -1,
            });

            this.isInitialized = true;
            console.log('✅ Mistral model initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize Mistral model:', error);
            throw error;
        }
    }

    async downloadModel(onProgress = null) {
        const url = 'https://huggingface.co/QuantFactory/Ministral-3b-instruct-GGUF/resolve/main/Ministral-3b-instruct.Q4_K_M.gguf';
        const filename = 'ministral-3b-instruct-q4_k_m.gguf';
        const localPath = `${FileSystem.documentDirectory}${filename}`;

        try {
            console.log('📥 Downloading Mistral model...');
            
            const fileInfo = await FileSystem.getInfoAsync(localPath);
            if (fileInfo.exists) {
                console.log('✅ Model already exists locally');
                return localPath;
            }

            const downloadResult = await FileSystem.downloadAsync(
                url,
                localPath,
                { progressCallback: onProgress }
            );

            if (downloadResult.status === 200) {
                console.log('✅ Model downloaded successfully');
                return localPath;
            } else {
                throw new Error(`Download failed with status: ${downloadResult.status}`);
            }

        } catch (error) {
            console.error('❌ Model download failed:', error);
            throw error;
        }
    }

    async parseReceiptText(ocrText) {
        if (!this.isInitialized || !this.context) {
            await this.initialize();
        }

        const prompt = `You are an expert at extracting structured data from receipt text. 

RECEIPT TEXT:
${ocrText}

Please extract the following information and return it as valid JSON:

{
  "merchant": "Store name",
  "date": "YYYY-MM-DD format",
  "total": 0.00,
  "subtotal": 0.00,
  "tax": 0.00,
  "items": [
    {
      "description": "Item name",
      "amount": 0.00,
      "category": "Food|Transport|Health|Shopping|Entertainment|Bills|Other"
    }
  ]
}

Guidelines:
- Extract only clear, confident information
- Use 0.00 for amounts if unclear
- Categorize items appropriately
- Remove quantity indicators from item descriptions
- Format date as YYYY-MM-DD, use today's date if unclear
- Return only valid JSON, no additional text

JSON:`;

        try {
            const response = await this.context.completion({
                prompt: prompt,
                n_predict: 1000,
                stop: ['\n\n', '</s>'],
                temperature: 0.3,
                top_p: 0.9,
                top_k: 40,
                repeat_penalty: 1.1,
            });

            return this.parseResponse(response.text);

        } catch (error) {
            console.error('❌ Mistral parsing failed:', error);
            throw error;
        }
    }

    parseResponse(rawResponse) {
        try {
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            return {
                merchant: parsed.merchant || 'Unknown Store',
                date: parsed.date || new Date().toISOString().split('T')[0],
                total: Number(parsed.total) || 0,
                subtotal: Number(parsed.subtotal) || 0,
                tax: Number(parsed.tax) || 0,
                items: Array.isArray(parsed.items) ? parsed.items
                    .filter(item => item.description && item.amount)
                    .map((item, index) => ({
                        id: `mistral-item-${index}`,
                        description: String(item.description).trim(),
                        amount: Number(item.amount) || 0,
                        category: this.validateCategory(item.category),
                        selected: true,
                        lineNumber: index + 1,
                        confidence: 0.9
                    })) : []
            };

        } catch (error) {
            console.error('❌ Failed to parse Mistral response:', error);
            return {
                merchant: 'Unknown Store',
                date: new Date().toISOString().split('T')[0],
                total: 0,
                subtotal: 0,
                tax: 0,
                items: []
            };
        }
    }

    validateCategory(category) {
        const validCategories = ['Food', 'Transport', 'Health', 'Shopping', 'Entertainment', 'Bills', 'Other'];
        
        if (typeof category === 'string') {
            const normalized = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
            return validCategories.includes(normalized) ? normalized : 'Other';
        }
        
        return 'Other';
    }

    async isModelReady() {
        return this.isInitialized && this.context !== null;
    }

    async release() {
        if (this.context) {
            await this.context.release();
            this.context = null;
            this.isInitialized = false;
            console.log('🗑️ Mistral model released');
        }
    }
}

export default new MistralService();