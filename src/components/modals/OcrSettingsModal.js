import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import

const OcrSettingsModal = ({ visible, onClose, ocrSettings, setOcrSettings, ocrDebugInfo }) => {
    const colors = useColors(); // Add this hook

    // Create themed styles
    const themedStyles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.card,
        },
        modalHeaderTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        closeButton: {
            fontSize: 24,
            color: colors.textSecondary,
            padding: 8,
        },
        settingsContainer: {
            flex: 1,
            padding: 16,
        },
        settingsTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        settingsSubtitle: {
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 24,
            lineHeight: 22,
        },
        settingOption: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        settingInfo: {
            flex: 1,
        },
        settingName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
        },
        settingDescription: {
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 18,
        },
        settingToggle: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            minWidth: 50,
            alignItems: 'center',
        },
        settingToggleActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        settingToggleText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.text,
        },
        settingSlider: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sliderContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
        },
        sliderOption: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flex: 1,
            marginHorizontal: 2,
            alignItems: 'center',
        },
        sliderOptionActive: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        sliderText: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.text,
        },
        debugInfoContainer: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        debugTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        debugText: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
            fontFamily: 'monospace',
        },
        ocrTipsContainer: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        tipsTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        tipText: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 8,
            lineHeight: 20,
        },
    });

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>🔧 OCR Settings</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={themedStyles.settingsContainer}>
                    <Text style={themedStyles.settingsTitle}>ML Kit Enhancement Options</Text>
                    <Text style={themedStyles.settingsSubtitle}>
                        Configure advanced processing for better recognition
                    </Text>
                    
                    <View style={themedStyles.settingOption}>
                        <View style={themedStyles.settingInfo}>
                            <Text style={themedStyles.settingName}>Multiple OCR Attempts</Text>
                            <Text style={themedStyles.settingDescription}>
                                Try OCR multiple times for better accuracy
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                themedStyles.settingToggle, 
                                ocrSettings.multipleAttempts && themedStyles.settingToggleActive
                            ]}
                            onPress={() => setOcrSettings(prev => ({
                                ...prev, 
                                multipleAttempts: !prev.multipleAttempts
                            }))}
                        >
                            <Text style={[
                                themedStyles.settingToggleText,
                                ocrSettings.multipleAttempts && { color: '#FFFFFF' }
                            ]}>
                                {ocrSettings.multipleAttempts ? 'ON' : 'OFF'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={themedStyles.settingOption}>
                        <View style={themedStyles.settingInfo}>
                            <Text style={themedStyles.settingName}>Advanced Parsing</Text>
                            <Text style={themedStyles.settingDescription}>
                                Use machine learning-like parsing logic
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[
                                themedStyles.settingToggle, 
                                ocrSettings.parseMode === 'advanced' && themedStyles.settingToggleActive
                            ]}
                            onPress={() => setOcrSettings(prev => ({
                                ...prev, 
                                parseMode: prev.parseMode === 'advanced' ? 'basic' : 'advanced'
                            }))}
                        >
                            <Text style={[
                                themedStyles.settingToggleText,
                                ocrSettings.parseMode === 'advanced' && { color: '#FFFFFF' }
                            ]}>
                                {ocrSettings.parseMode === 'advanced' ? 'ON' : 'OFF'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={themedStyles.settingSlider}>
                        <Text style={themedStyles.settingName}>Confidence Threshold</Text>
                        <Text style={themedStyles.settingDescription}>
                            Minimum confidence to accept an OCR attempt: {Math.round(ocrSettings.confidenceThreshold * 100)}%
                        </Text>
                        <View style={themedStyles.sliderContainer}>
                            {[0.5, 0.6, 0.7, 0.8, 0.9].map(value => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        themedStyles.sliderOption, 
                                        ocrSettings.confidenceThreshold === value && themedStyles.sliderOptionActive
                                    ]}
                                    onPress={() => setOcrSettings(prev => ({
                                        ...prev, 
                                        confidenceThreshold: value
                                    }))}
                                >
                                    <Text style={[
                                        themedStyles.sliderText,
                                        ocrSettings.confidenceThreshold === value && { color: '#FFFFFF' }
                                    ]}>
                                        {Math.round(value * 100)}%
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    
                    {ocrDebugInfo && (
                        <View style={themedStyles.debugInfoContainer}>
                            <Text style={themedStyles.debugTitle}>🔍 Last OCR Debug Info</Text>
                            <Text style={themedStyles.debugText}>
                                Engine: {ocrDebugInfo.ocrResult.engine}
                            </Text>
                            <Text style={themedStyles.debugText}>
                                Attempts: {ocrDebugInfo.ocrResult.attempts?.length || 1}
                            </Text>
                            <Text style={themedStyles.debugText}>
                                OCR Confidence: {Math.round((ocrDebugInfo.ocrResult.confidence || 0) * 100)}%
                            </Text>
                            <Text style={themedStyles.debugText}>
                                Parse Confidence: {Math.round((ocrDebugInfo.parsedReceipt.confidence || 0) * 100)}%
                            </Text>
                            <Text style={themedStyles.debugText}>
                                Items Found: {ocrDebugInfo.parsedReceipt.items?.length || 0}
                            </Text>
                            <Text style={themedStyles.debugText}>
                                Text Length: {ocrDebugInfo.ocrResult.text?.length || 0} chars
                            </Text>
                        </View>
                    )}
                    
                    <View style={themedStyles.ocrTipsContainer}>
                        <Text style={themedStyles.tipsTitle}>💡 OCR Tips</Text>
                        <Text style={themedStyles.tipText}>
                            • Good lighting is the most important factor.
                        </Text>
                        <Text style={themedStyles.tipText}>
                            • Hold the phone parallel to the receipt.
                        </Text>
                        <Text style={themedStyles.tipText}>
                            • Ensure the receipt is flat and not crumpled.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default OcrSettingsModal;
