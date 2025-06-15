import React, { useState, useEffect, useCallback } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestAppPermissions } from '../services/permissionService';
import { performEnhancedMLKitOCR, parseReceiptAdvanced, parseReceiptWithMistralAI } from '../services/ocrService'; // NEW: Added parseReceiptWithMistralAI
import * as FileSystem from 'expo-file-system'; // NEW: Added for model checking

const STORAGE_KEYS = {
    TRANSACTIONS: 'transactions_v1',
    RECURRING_INCOME: 'recurringIncome_v1',
    SCANNED_RECEIPTS: 'scannedReceipts_v1',
    STARTING_BALANCE: 'startingBalance_v1',
    OCR_SETTINGS: 'ocrSettings_v1',
    USE_ENHANCED_PARSING: 'useEnhancedParsing_v1', // NEW: Store user preference
};

const DEFAULT_OCR_SETTINGS = {
    multipleAttempts: true,
    confidenceThreshold: 0.7,
    parseMode: 'advanced'
};

export const useAppLogic = () => {
    // States for core data
    const [transactions, setTransactions] = useState([]);
    const [recurringIncome, setRecurringIncome] = useState([]);
    const [scannedReceipts, setScannedReceipts] = useState([]);
    const [startingBalance, setStartingBalance] = useState(0);
    const [ocrSettings, setOcrSettings] = useState(DEFAULT_OCR_SETTINGS);

    // States for UI and app flow
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);
    const [showStartingBalanceModal, setShowStartingBalanceModal] = useState(false);
    const [balanceInput, setBalanceInput] = useState('');
    const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        amount: '', category: '', description: '', type: 'expense', isRecurring: false, frequency: 'monthly'
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showReceiptsModal, setShowReceiptsModal] = useState(false);
    const [showReportsModal, setShowReportsModal] = useState(false);
    const [showMultipleItemsModal, setShowMultipleItemsModal] = useState(false);
    const [showReceiptDetailModal, setShowReceiptDetailModal] = useState(false);
    const [showOcrSettingsModal, setShowOcrSettingsModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [extractedItems, setExtractedItems] = useState([]);
    const [ocrDebugInfo, setOcrDebugInfo] = useState(null);
    const [currentReceiptIdForMultiAdd, setCurrentReceiptIdForMultiAdd] = useState(null);
    const [hasCriticalPermissions, setHasCriticalPermissions] = useState(false);
    
    // NEW: Mistral AI related states
    const [showModelDownloaderModal, setShowModelDownloaderModal] = useState(false);
    const [useEnhancedParsing, setUseEnhancedParsing] = useState(false);

    // Effect for loading data on app start
    useEffect(() => {
        const loadData = async () => {
            console.log('[AppLogic] Mount: Starting data load...');
            setIsLoading(true);

            // Step 1: Request Permissions
            const granted = await requestAppPermissions();
            setHasCriticalPermissions(granted);

            if (!granted) {
                console.warn('[AppLogic] Permissions not granted. App functionality may be limited.');
                setIsLoading(false);
                return;
            }

            // Step 2: Load Data
            try {
                // Load existing data (transactions, receipts, etc.)
                try {
                    const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
                    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
                    console.log(`[AppLogic] Load: Transactions - ${storedTransactions ? 'Loaded' : 'Defaulted'}`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (TRANSACTIONS): ${e.message}. Resetting.`);
                    setTransactions([]);
                }

                try {
                    const storedRecurringIncome = await AsyncStorage.getItem(STORAGE_KEYS.RECURRING_INCOME);
                    setRecurringIncome(storedRecurringIncome ? JSON.parse(storedRecurringIncome) : []);
                    console.log(`[AppLogic] Load: Recurring Income - ${storedRecurringIncome ? 'Loaded' : 'Defaulted'}`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (RECURRING_INCOME): ${e.message}. Resetting.`);
                    setRecurringIncome([]);
                }

                try {
                    const storedScannedReceipts = await AsyncStorage.getItem(STORAGE_KEYS.SCANNED_RECEIPTS);
                    setScannedReceipts(storedScannedReceipts ? JSON.parse(storedScannedReceipts) : []);
                    console.log(`[AppLogic] Load: Scanned Receipts - ${storedScannedReceipts ? 'Loaded' : 'Defaulted'}`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (SCANNED_RECEIPTS): ${e.message}. Resetting.`);
                    setScannedReceipts([]);
                }

                try {
                    const storedStartingBalance = await AsyncStorage.getItem(STORAGE_KEYS.STARTING_BALANCE);
                    const parsedBalance = parseFloat(storedStartingBalance);
                    setStartingBalance(storedStartingBalance !== null && !isNaN(parsedBalance) ? parsedBalance : 0);
                    console.log(`[AppLogic] Load: Starting Balance - ${storedStartingBalance !== null && !isNaN(parsedBalance) ? 'Loaded' : 'Defaulted'}`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (STARTING_BALANCE): ${e.message}. Resetting.`);
                    setStartingBalance(0);
                }

                try {
                    const storedOcrSettings = await AsyncStorage.getItem(STORAGE_KEYS.OCR_SETTINGS);
                    setOcrSettings(storedOcrSettings ? JSON.parse(storedOcrSettings) : DEFAULT_OCR_SETTINGS);
                    console.log(`[AppLogic] Load: OCR Settings - ${storedOcrSettings ? 'Loaded' : 'Defaulted'}`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (OCR_SETTINGS): ${e.message}. Resetting.`);
                    setOcrSettings(DEFAULT_OCR_SETTINGS);
                }

                // NEW: Load enhanced parsing preference and check model availability
                try {
                    const storedUseEnhanced = await AsyncStorage.getItem(STORAGE_KEYS.USE_ENHANCED_PARSING);
                    const modelPath = `${FileSystem.documentDirectory}ministral-3b-instruct-q4_k_m.gguf`;
                    const modelExists = await FileSystem.getInfoAsync(modelPath);
                    
                    // Only enable enhanced parsing if model exists AND user previously enabled it
                    const shouldUseEnhanced = storedUseEnhanced === 'true' && modelExists.exists;
                    setUseEnhancedParsing(shouldUseEnhanced);
                    console.log(`[AppLogic] Load: Enhanced parsing - ${shouldUseEnhanced ? 'Enabled' : 'Disabled'} (Model exists: ${modelExists.exists})`);
                } catch (e) {
                    console.error(`[AppLogic] Load Error (USE_ENHANCED_PARSING): ${e.message}. Resetting.`);
                    setUseEnhancedParsing(false);
                }

            } catch (e) {
                console.error("[AppLogic] Critical error during overall data loading sequence", e);
                Alert.alert("Critical Error Loading Data", "There was a major problem loading app data. Using default values. Please report this.");
                setTransactions([]); setRecurringIncome([]); setScannedReceipts([]); setStartingBalance(0); setOcrSettings(DEFAULT_OCR_SETTINGS); setUseEnhancedParsing(false);
            } finally {
                setIsLoading(false);
                console.log('[AppLogic] Mount: Data loading finished. isLoading: false');
            }
        };
        loadData();
    }, []);

    // Data Saving Effects (existing + new)
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions))
                .catch(e => console.error("[AppLogic] Save Error (TRANSACTIONS):", e.message));
        }
    }, [transactions, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.RECURRING_INCOME, JSON.stringify(recurringIncome))
                .catch(e => console.error("[AppLogic] Save Error (RECURRING_INCOME):", e.message));
        }
    }, [recurringIncome, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.SCANNED_RECEIPTS, JSON.stringify(scannedReceipts))
                .catch(e => console.error("[AppLogic] Save Error (SCANNED_RECEIPTS):", e.message));
        }
    }, [scannedReceipts, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.STARTING_BALANCE, startingBalance.toString())
                .catch(e => console.error("[AppLogic] Save Error (STARTING_BALANCE):", e.message));
        }
    }, [startingBalance, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.OCR_SETTINGS, JSON.stringify(ocrSettings))
                .catch(e => console.error("[AppLogic] Save Error (OCR_SETTINGS):", e.message));
        }
    }, [ocrSettings, isLoading]);

    // NEW: Save enhanced parsing preference
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEYS.USE_ENHANCED_PARSING, useEnhancedParsing.toString())
                .catch(e => console.error("[AppLogic] Save Error (USE_ENHANCED_PARSING):", e.message));
        }
    }, [useEnhancedParsing, isLoading]);

    // BackHandler Effect
    useEffect(() => {
        const backAction = () => {
            if (isLoading) return true;
            if (activeTab !== 'dashboard') {
                setActiveTab('dashboard');
                return true;
            }
            return false;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [activeTab, isLoading]);

    // Core Logic Functions (existing)
    const addTransaction = useCallback(() => {
        if (!newTransaction.amount || !newTransaction.category || !newTransaction.description) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newTransaction.isRecurring && newTransaction.type === 'income') {
            const recurringItem = { id: Date.now(), amount: parseFloat(newTransaction.amount), category: newTransaction.category, description: newTransaction.description, frequency: newTransaction.frequency, startDate: new Date().toISOString().split('T')[0], lastProcessed: null };
            setRecurringIncome(prev => [...prev, recurringItem]);
            Alert.alert('Success', 'Recurring income added!');
        } else {
            const transaction = { id: Date.now(), amount: parseFloat(newTransaction.amount), category: newTransaction.category, description: newTransaction.description, date: new Date().toISOString().split('T')[0], type: newTransaction.type, isRecurring: false };
            setTransactions(prev => [transaction, ...prev]);
            Alert.alert('Success', 'Transaction added!');
        }
        setNewTransaction({ amount: '', category: '', description: '', type: 'expense', isRecurring: false, frequency: 'monthly' });
    }, [newTransaction, setTransactions, setRecurringIncome]);

    const deleteTransaction = useCallback((id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setShowDeleteModal(false);
        setSelectedTransaction(null);
        Alert.alert('Success', 'Transaction deleted!');
    }, [setTransactions]);

    const deleteRecurring = useCallback((id) => {
        setRecurringIncome(prev => prev.filter(r => r.id !== id));
        Alert.alert('Success', 'Recurring income removed!');
    }, [setRecurringIncome]);

    const setInitialBalance = useCallback(() => {
        if (balanceInput.trim() === '') {
            Alert.alert('Error', 'Please enter a balance amount');
            return;
        }
        const balance = parseFloat(balanceInput) || 0;
        setStartingBalance(balance);
        setShowStartingBalanceModal(false);
        setBalanceInput('');
        Alert.alert('Success', `Starting balance set to ${balance.toFixed(2)}`);
    }, [balanceInput, setStartingBalance]);

    const addMultipleTransactions = useCallback((selectedItems, originatingReceiptId) => {
        if (!originatingReceiptId) {
            console.error("originatingReceiptId is missing in addMultipleTransactions");
            Alert.alert("Error", "Could not link transactions to the original receipt.");
            return;
        }
        const newTransactions = selectedItems.map(item => ({
            id: Date.now() + Math.random(),
            amount: item.amount,
            category: item.category,
            description: item.description,
            date: new Date().toISOString().split('T')[0],
            type: 'expense',
            isRecurring: false,
            originatingReceiptId: originatingReceiptId
        }));
        setTransactions(prev => [...newTransactions, ...prev]);
        const sumOfSelectedItems = selectedItems.reduce((sum, item) => sum + item.amount, 0);
        setScannedReceipts(prevReceipts => prevReceipts.map(r => r.id === originatingReceiptId ? { ...r, parsedData: { ...r.parsedData, total: sumOfSelectedItems }, isTotalDerived: true } : r));
        setShowMultipleItemsModal(false);
        setExtractedItems([]);
        setCurrentReceiptIdForMultiAdd(null);
        Alert.alert('Success', `Added ${selectedItems.length} transactions from receipt! Receipt total updated.`);
    }, [setTransactions, setScannedReceipts]);

    const processReceiptImage = useCallback(async (imageAsset) => {
        if (!imageAsset || !imageAsset.uri) {
            return;
        }
        setIsProcessingReceipt(true);
        setOcrDebugInfo(null);
        const currentReceiptGeneratedId = Date.now();
        try {
            let assetToProcess = imageAsset;
            if (imageAsset.width > imageAsset.height) {
                const rotatedImage = await ImageResizer.createResizedImage(imageAsset.uri, imageAsset.height, imageAsset.width, 'JPEG', 90, 90, undefined);
                assetToProcess = rotatedImage;
            }

            // NEW: Choose parsing method based on user preference and model availability
            let parsedReceipt;
            let ocrResult;
            
            if (useEnhancedParsing) {
                console.log('🤖 Using enhanced Mistral AI parsing...');
                try {
                    parsedReceipt = await parseReceiptWithMistralAI(assetToProcess.uri, ocrSettings);
                    // Extract OCR result from the enhanced parsing for debugging
                    ocrResult = parsedReceipt.originalOcrResult || {
                        text: 'Enhanced parsing used',
                        blocks: [],
                        confidence: parsedReceipt.confidence || 0.9,
                        engine: parsedReceipt.engine || 'Mistral Enhanced'
                    };
                } catch (error) {
                    console.warn('🔄 Mistral parsing failed, falling back to standard method:', error);
                    // Fallback to standard parsing
                    ocrResult = await performEnhancedMLKitOCR(assetToProcess.uri, ocrSettings);
                    parsedReceipt = parseReceiptAdvanced(ocrResult.text, ocrResult.blocks);
                }
            } else {
                console.log('📝 Using standard ML Kit parsing...');
                ocrResult = await performEnhancedMLKitOCR(assetToProcess.uri, ocrSettings);
                parsedReceipt = parseReceiptAdvanced(ocrResult.text, ocrResult.blocks);
            }

            setOcrDebugInfo({ ocrResult, parsedReceipt, processingTime: new Date().toISOString() });

            const receipt = {
                id: currentReceiptGeneratedId,
                image: assetToProcess.uri,
                extractedText: ocrResult.text,
                blocks: ocrResult.blocks,
                parsedData: parsedReceipt,
                ocrMethod: ocrResult.engine,
                confidence: ocrResult.confidence,
                attempts: ocrResult.attempts,
                scanDate: new Date().toISOString().split('T')[0],
                isTotalDerived: false,
                enhancedParsing: useEnhancedParsing // NEW: Track which method was used
            };
            setScannedReceipts(prev => [receipt, ...prev]);

            if (parsedReceipt.items && parsedReceipt.items.length > 1) {
                setExtractedItems(parsedReceipt.items.map(item => ({ ...item, selected: true })));
                setCurrentReceiptIdForMultiAdd(receipt.id);
                setShowMultipleItemsModal(true);
            } else if (parsedReceipt.items && parsedReceipt.items.length === 1) {
                const item = parsedReceipt.items[0];
                setNewTransaction(prev => ({ ...prev, amount: item.amount.toString(), category: item.category, description: item.description }));
                setActiveTab('add');
                const enhancedText = useEnhancedParsing ? ' (Enhanced AI)' : '';
                Alert.alert(`✅ OCR Success!${enhancedText}`, `Found: ${item.description}\nPrice: ${item.amount.toFixed(2)}`);
            } else {
                const enhancedText = useEnhancedParsing ? ' (Enhanced AI)' : '';
                Alert.alert(`📄 OCR Analysis Complete${enhancedText}`, `Engine: ${ocrResult.engine}\nInitial Total Guess: ${parsedReceipt.total.toFixed(2)}\n\nNo distinct items found. Tap the receipt in the list to view details.`);
            }
        } catch (error) {
            console.error('❌ Receipt processing failed:', error);
            Alert.alert('❌ OCR Processing Failed', `Error: ${error.message}\n\n💡 Try improving lighting or check OCR settings.`);
        } finally {
            setIsProcessingReceipt(false);
        }
    }, [ocrSettings, setScannedReceipts, setExtractedItems, setNewTransaction, setActiveTab, setOcrDebugInfo, useEnhancedParsing]);

    const openCamera = useCallback(() => {
        const options = { mediaType: 'photo', quality: 0.9, maxWidth: 1600, maxHeight: 2400 };
        launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                console.error('Camera Error:', response.errorCode, response.errorMessage);
                Alert.alert('Camera Error', response.errorMessage);
                return;
            }
            if (response.assets && response.assets[0]) {
                processReceiptImage(response.assets[0]);
            }
        });
    }, [processReceiptImage]);

    const openGallery = useCallback(() => {
        const options = { mediaType: 'photo', quality: 0.9, maxWidth: 1600, maxHeight: 2400 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                console.error('Gallery Error:', response.errorCode, response.errorMessage);
                Alert.alert('Gallery Error', response.errorMessage);
                return;
            }
            if (response.assets && response.assets[0]) {
                processReceiptImage(response.assets[0]);
            }
        });
    }, [processReceiptImage]);

    const scanReceipt = useCallback(async () => {
        if (!hasCriticalPermissions) {
            Alert.alert(
                'Permission Required',
                'Camera and storage permissions are essential to scan receipts. Please grant them.',
                [
                    { text: 'OK', onPress: async () => {
                        const granted = await requestAppPermissions();
                        if (granted) {
                            setHasCriticalPermissions(true);
                            showScannerOptions();
                        }
                    }},
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
            return;
        }

        showScannerOptions();
    }, [hasCriticalPermissions, openCamera, openGallery, setShowOcrSettingsModal]);

    // NEW: Helper function to show scanner options
    const showScannerOptions = useCallback(() => {
        const enhancedText = useEnhancedParsing ? ' (AI Enhanced)' : '';
        Alert.alert(`📷 Receipt Scanner${enhancedText}`, 'Choose a source for the receipt image.', [
            { text: '📷 Camera', onPress: openCamera },
            { text: '🖼️ Gallery', onPress: openGallery },
            { text: '⚙️ Settings', onPress: () => setShowOcrSettingsModal(true) },
            { text: '🤖 AI Model', onPress: () => setShowModelDownloaderModal(true) }, // NEW
            { text: 'Cancel', style: 'cancel' }
        ]);
    }, [useEnhancedParsing, openCamera, openGallery, setShowOcrSettingsModal, setShowModelDownloaderModal]);

    return {
        activeTab, setActiveTab,
        transactions, setTransactions,
        recurringIncome, setRecurringIncome,
        scannedReceipts, setScannedReceipts,
        startingBalance, setStartingBalance,
        ocrSettings, setOcrSettings,

        isLoading,
        hasCriticalPermissions,

        showStartingBalanceModal, setShowStartingBalanceModal,
        balanceInput, setBalanceInput,
        isProcessingReceipt, setIsProcessingReceipt,
        newTransaction, setNewTransaction,
        showDeleteModal, setShowDeleteModal,
        selectedTransaction, setSelectedTransaction,
        showReceiptsModal, setShowReceiptsModal,
        showReportsModal, setShowReportsModal,
        showMultipleItemsModal, setShowMultipleItemsModal,
        showReceiptDetailModal, setShowReceiptDetailModal,
        showOcrSettingsModal, setShowOcrSettingsModal,
        selectedReceipt, setSelectedReceipt,
        extractedItems, setExtractedItems,
        ocrDebugInfo, setOcrDebugInfo,
        currentReceiptIdForMultiAdd, setCurrentReceiptIdForMultiAdd,

        // NEW: Mistral AI related states and functions
        showModelDownloaderModal, setShowModelDownloaderModal,
        useEnhancedParsing, setUseEnhancedParsing,

        // Functions
        addTransaction,
        deleteTransaction,
        deleteRecurring,
        setInitialBalance,
        addMultipleTransactions,
        scanReceipt,
    };
};