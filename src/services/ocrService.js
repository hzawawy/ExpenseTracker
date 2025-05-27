import TextRecognition from '@react-native-ml-kit/text-recognition';

const calculateTextConfidence = (text, blocks) => {
    if (!text || text.length === 0) return 0;
    let confidence = 0.5;
    if (text.length > 100) confidence += 0.2;
    if (text.length > 200) confidence += 0.1;
    if (blocks && blocks.length > 5) confidence += 0.1;
    if (blocks && blocks.length > 10) confidence += 0.1;
    const hasNumbers = /\d/.test(text);
    const hasPrices = /\$\d+\.?\d*/.test(text);
    const hasWords = /[A-Za-z]{3,}/.test(text);
    const hasStructure = text.includes('\n');
    if (hasNumbers) confidence += 0.1;
    if (hasPrices) confidence += 0.2;
    if (hasWords) confidence += 0.1;
    if (hasStructure) confidence += 0.1;
    const receiptWords = ['total', 'subtotal', 'tax', 'thank', 'receipt', 'store', 'date', 'time'];
    const foundReceiptWords = receiptWords.filter(word => text.toLowerCase().includes(word)).length;
    confidence += foundReceiptWords * 0.05;
    return Math.min(1, confidence);
};

export const performEnhancedMLKitOCR = async (imageUri, ocrSettings) => {
    const attempts = [];
    const maxAttempts = ocrSettings.multipleAttempts ? 3 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await TextRecognition.recognize(imageUri);
            const extractedText = result.text || '';
            const blocks = result.blocks || [];
            const confidence = calculateTextConfidence(extractedText, blocks);
            attempts.push({ attempt, text: extractedText, blocks: blocks, confidence: confidence });
            if (extractedText.length > 50 && confidence > ocrSettings.confidenceThreshold) {
                return { text: extractedText, blocks: blocks, confidence: confidence, engine: `ML Kit (Attempt ${attempt})`, attempts: attempts };
            }
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`ML Kit OCR Attempt ${attempt} Error:`, error);
            attempts.push({ attempt, error: error.message, success: false });
        }
    }
    const successfulAttempts = attempts.filter(a => a.text);
    if (successfulAttempts.length > 0) {
        const bestAttempt = successfulAttempts.reduce((best, current) => current.confidence > best.confidence ? current : best);
        return { text: bestAttempt.text, blocks: bestAttempt.blocks, confidence: bestAttempt.confidence, engine: `ML Kit (Best of ${maxAttempts})`, attempts: attempts };
    }
    throw new Error(`All ${maxAttempts} OCR attempts failed`);
};

const extractMerchant = (lines) => {
    const merchantPatterns = [
        /^[A-Z\s&'.-]{4,40}$/, /^[A-Z][a-zA-Z\s&'.-]{3,40}$/, /^[A-Z]{2,}\s+[A-Z]{2,}/, /^[A-Za-z]+\s*[A-Za-z]*\s*[A-Za-z]*$/
    ];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (line.match(/\$\d/) || line.match(/^\d+/) || line.length < 3) continue;
        for (const pattern of merchantPatterns) {
            if (pattern.test(line)) return line;
        }
    }
    return 'Unknown Store';
};

const extractDate = (lines) => {
    const datePatterns = [
        /\d{1,2}\/\d{1,2}\/\d{2,4}/, /\d{1,2}-\d{1,2}-\d{2,4}/, /\d{4}-\d{2}-\d{2}/, /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i
    ];
    for (const line of lines) {
        for (const pattern of datePatterns) {
            const match = line.match(pattern);
            if (match) return match[0];
        }
    }
    return new Date().toISOString().split('T')[0];
};

// This version includes the "Cash" keyword fix
const extractTotals = (lines) => {
    let total = 0;
    let subtotal = 0;
    let tax = 0;
    const totalLineIndices = new Set();
    const numberRegex = /(\d+\.\d{2})/g;
    let potentialTotals = [];

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        const numbers = (line.match(numberRegex) || []).map(parseFloat);
        if (numbers.length === 0) continue;
        const maxNumberInLine = Math.max(...numbers);

        if ((lowerLine.includes('total') && !lowerLine.includes('sub')) || lowerLine.includes('cash')) {
            potentialTotals.push(maxNumberInLine);
            totalLineIndices.add(i);
        } else if (lowerLine.includes('subtotal') || lowerLine.includes('sub total')) {
            subtotal = Math.max(subtotal, maxNumberInLine);
            totalLineIndices.add(i);
        } else if (lowerLine.includes('tax')) {
            tax = Math.max(tax, maxNumberInLine);
            totalLineIndices.add(i);
        }
    }

    if (potentialTotals.length > 0) {
        total = Math.max(...potentialTotals);
    }
    return { total, subtotal, tax, totalLineIndices: Array.from(totalLineIndices) };
};

// This version includes the "Cash" keyword fix for skipping lines
const shouldSkipLine = (line) => {
    const skipPatterns = [
        /^(receipt|thank\s*you|visit|welcome|store|location|phone|address|cashier|clerk|tran\s#)/i,
        /^(subtotal|sub-total|tax|total|change|cash|card|credit|debit|payment|balance|due|amount\s*tendered)/i,
        /^[\d\s\-\/\:\.]+$/,
        /^store\s*#?\d+/i,
        /^\*+$/, /^-+$/, /^=+$/,
        /^\d+\s+\$\d+/,
        /^\(\d{3}\)\s*\d{3}[\s\-]?\d{4}$/,
        /^\d+\s+[A-Za-z\s]+\s+(way|street|ave|blvd|drive|dr|st)$/i,
        /^\d{2}\/\d{2}\/\d{4}/,
    ];
    return skipPatterns.some(pattern => pattern.test(line.trim()));
};

// This version includes the "Cash" keyword fix for validating items
const validateItem = (description, amount) => {
    if (!description || !amount) return false;
    if (description.length < 2 || description.length > 50) return false;
    if (amount <= 0 || amount > 5000) return false;
    if (/^(tax|total|subtotal|sub-total|change|cash|card|payment|balance|discount|coupon|due)/i.test(description.trim())) {
        return false;
    }
    return true;
};

const categorizeItemAdvanced = (description) => {
    const desc = description.toLowerCase();
    const categoryMap = {
        'Food': ['milk', 'bread', 'egg', 'cheese', 'pizza', 'burger', 'coffee', 'food', 'snack', 'restaurant', 'grocery', 'produce', 'meat', 'dairy'],
        'Transport': ['gas', 'fuel', 'parking', 'uber', 'lyft', 'taxi', 'bus', 'train', 'transport'],
        'Health': ['medicine', 'pharmacy', 'doctor', 'clinic', 'health', 'pills'],
        'Shopping': ['clothes', 'shirt', 'pants', 'shoes', 'soap', 'shampoo', 'store', 'retail', 'household'],
        'Entertainment': ['movie', 'cinema', 'game', 'book', 'concert', 'ticket', 'entertainment'],
        'Bills': ['electric', 'water', 'internet', 'phone', 'cable', 'insurance', 'rent', 'utility', 'bills']
    };
    for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(keyword => desc.includes(keyword))) {
            return category;
        }
    }
    return 'Other';
};

const calculateItemConfidence = (description, amount) => {
    let confidence = 0.5;
    if (amount >= 0.5 && amount <= 200) confidence += 0.2;
    if (description.length >= 3 && description.length <= 30) confidence += 0.2;
    if (description.match(/[a-z]/)) confidence += 0.1;
    if (description.match(/^\d+$/)) confidence -= 0.4;
    return Math.max(0, Math.min(1, confidence));
};

const createItemObject = (description, amount, lineNumber) => {
    const cleanDescription = description.trim().replace(/^\d+\s*/, '');
    return {
        id: `${lineNumber}-${cleanDescription}-${amount}`,
        description: cleanDescription,
        amount: amount,
        category: categorizeItemAdvanced(cleanDescription),
        selected: true,
        lineNumber: lineNumber,
        confidence: calculateItemConfidence(cleanDescription, amount)
    };
};

const mapReceiptCategoryToOurCategory = (receiptCategory) => {
    if (!receiptCategory) return 'Other';
    const category = receiptCategory.toLowerCase().trim();
    const categoryMappings = {
        'groceries': 'Food', 'grocery': 'Food', 'food': 'Food', 'fuel': 'Transport', 'gas': 'Transport', 'pharmacy': 'Health', 'medicine': 'Health', 'household': 'Shopping', 'entertainment': 'Entertainment', 'utilities': 'Bills'
    };
    if (categoryMappings[category]) return categoryMappings[category];
    for (const [key, value] of Object.entries(categoryMappings)) {
        if (category.includes(key) || key.includes(category)) return value;
    }
    return 'Other';
};

const isPotentialItem = (line) => {
    return line.match(/[A-Za-z]{2,}/) && line.match(/\d/) && line.length >= 3 && line.length <= 60;
};

const scorePotentialItem = (line) => {
    let score = 0;
    if (line.match(/\$?\d+\.?\d{0,2}/)) score += 0.3;
    if (line.match(/[A-Za-z]{3,}/)) score += 0.2;
    if (line.length >= 5 && line.length <= 30) score += 0.2;
    if (line.match(/\d+\s*x\s*\d/)) score += 0.3;
    return score;
};

// ✨ FIX: This function is restored to its more robust, multi-pattern version.
const extractItemsMultiStrategy = (lines, totalLineIndices) => {
    const items = [];
    const potentialItems = [];
    
    const standardPatterns = [
        /^(.+?)\s+\$?(\d+\.?\d{0,2})$/,          // Item Price
        /^(.+?)\s{2,}(\d+\.?\d{0,2})$/,         // Item  Price (with more spaces)
        /^(.+?)\s*\$(\d+\.?\d{0,2})$/,          // Item $Price
        /^(.+?)\s*-\s*(\d+\.?\d{0,2})$/,         // Item - Price
        /^(.+?)\s*@\s*(\d+\.?\d{0,2})$/          // Item @ Price
    ];
    
    const quantityPatterns = [
        /^(.+?)\s+\d+\s*x\s*(\d+\.?\d{0,2})$/,   // Item Qty x Price
        /^(\d+)\s+(.+?)\s+(\d+\.?\d{0,2})$/,    // Qty Item Price
        /^(.+?)\s+qty:\s*\d+\s+(\d+\.?\d{0,2})$/i // Item Qty: N Price
    ];
    
    const multiLinePatterns = [
        /^1@\s*(\d+\.?\d{0,2})$/                 // For lines like "1@ 7.54" followed by "GROCERIES"
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
        
        if (totalLineIndices.includes(i) || shouldSkipLine(line)) {
            continue;
        }

        let itemFound = false;

        // Try multi-line patterns first
        for (const pattern of multiLinePatterns) {
            const match = line.match(pattern);
            // Expects item description on the next line for this specific multi-line pattern
            if (match && nextLine && !shouldSkipLine(nextLine) && nextLine.match(/^[A-Za-z][A-Za-z\s&'-]{2,40}$/)) {
                const amount = parseFloat(match[1]);
                const description = nextLine.trim();
                if (validateItem(description, amount)) {
                    const item = createItemObject(description, amount, i + 1); // Line number of the price
                    const mappedCategory = mapReceiptCategoryToOurCategory(description);
                     if (mappedCategory !== 'Other') {
                         item.category = mappedCategory;
                         item.detectedCategory = description;
                     }
                    items.push(item);
                    itemFound = true;
                    i++; // Crucial: Skip the next line as it was consumed for the description
                    break; 
                }
            }
        }
        if (itemFound) continue;

        // Try quantity patterns
        for (const pattern of quantityPatterns) {
            const match = line.match(pattern);
            if (match) {
                let description, amountStr;
                if (pattern.source === quantityPatterns[0].source) { // Item Qty x Price
                    description = match[1]; amountStr = match[2];
                } else if (pattern.source === quantityPatterns[1].source) { // Qty Item Price
                    description = match[2]; amountStr = match[3];
                } else { // Item Qty: N Price
                    description = match[1]; amountStr = match[2];
                }
                const amount = parseFloat(amountStr);
                if (validateItem(description.trim(), amount)) {
                    items.push(createItemObject(description.trim(), amount, i + 1));
                    itemFound = true;
                    break;
                }
            }
        }
        if (itemFound) continue;

        // Try standard patterns
        for (const pattern of standardPatterns) {
            const match = line.match(pattern);
            if (match) {
                const description = match[1].trim();
                const amount = parseFloat(match[2]);
                if (validateItem(description, amount)) {
                    items.push(createItemObject(description, amount, i + 1));
                    itemFound = true;
                    break;
                }
            }
        }
        if (itemFound) continue;

        // If no specific pattern matched but line seems like an item
        if (isPotentialItem(line)) {
            potentialItems.push({ text: line, lineNumber: i + 1, score: scorePotentialItem(line) });
        }
    }
    items.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    potentialItems.sort((a, b) => b.score - a.score);
    return { items, potentialItems };
};

const calculateParsingConfidence = (parseResult) => {
    let confidence = 0;
    if (parseResult.merchant && parseResult.merchant !== 'Unknown Store') confidence += 0.2;
    if (parseResult.total > 0) confidence += 0.3;
    if (parseResult.items.length > 0) confidence += 0.3;
    const avgItemConfidence = parseResult.items.length > 0 ? parseResult.items.reduce((sum, item) => sum + (item.confidence || 0), 0) / parseResult.items.length : 0;
    confidence += avgItemConfidence * 0.2;
    return Math.min(1, confidence);
};

export const parseReceiptAdvanced = (text, blocks = []) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const parseResult = {
        merchant: '', items: [], potentialItems: [], total: 0, subtotal: 0, tax: 0, date: '', confidence: 0, processingSteps: []
    };
    
    parseResult.processingSteps.push('🏪 Extracting merchant...');
    parseResult.merchant = extractMerchant(lines);
    
    parseResult.processingSteps.push('📅 Extracting date...');
    parseResult.date = extractDate(lines);
    
    parseResult.processingSteps.push('💰 Extracting totals...');
    const totals = extractTotals(lines);
    parseResult.total = totals.total;
    parseResult.subtotal = totals.subtotal;
    parseResult.tax = totals.tax;
    
    parseResult.processingSteps.push('🛍️ Extracting items...');
    const itemResults = extractItemsMultiStrategy(lines, totals.totalLineIndices);
    parseResult.items = itemResults.items;
    parseResult.potentialItems = itemResults.potentialItems;
    
    parseResult.confidence = calculateParsingConfidence(parseResult);
    
    console.log('✅ Advanced parsing completed:', parseResult);
    return parseResult;
};
