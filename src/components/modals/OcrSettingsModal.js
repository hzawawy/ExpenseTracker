import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../styles/appStyles';

const OcrSettingsModal = ({ visible, onClose, ocrSettings, setOcrSettings, ocrDebugInfo }) => (
    <Modal visible={visible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>🔧 OCR Settings</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>ML Kit Enhancement Options</Text>
                <Text style={styles.settingsSubtitle}>Configure advanced processing for better recognition</Text>
                
                <View style={styles.settingOption}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingName}>Multiple OCR Attempts</Text>
                        <Text style={styles.settingDescription}>Try OCR multiple times for better accuracy</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.settingToggle, ocrSettings.multipleAttempts && styles.settingToggleActive]}
                        onPress={() => setOcrSettings(prev => ({...prev, multipleAttempts: !prev.multipleAttempts}))}
                    >
                        <Text style={styles.settingToggleText}>{ocrSettings.multipleAttempts ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingOption}>
                    <View style={styles.settingInfo}>
                        <Text style={styles.settingName}>Advanced Parsing</Text>
                        <Text style={styles.settingDescription}>Use machine learning-like parsing logic</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.settingToggle, ocrSettings.parseMode === 'advanced' && styles.settingToggleActive]}
                        onPress={() => setOcrSettings(prev => ({...prev, parseMode: prev.parseMode === 'advanced' ? 'basic' : 'advanced'}))}
                    >
                        <Text style={styles.settingToggleText}>{ocrSettings.parseMode === 'advanced' ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.settingSlider}>
                    <Text style={styles.settingName}>Confidence Threshold</Text>
                    <Text style={styles.settingDescription}>Minimum confidence to accept an OCR attempt: {Math.round(ocrSettings.confidenceThreshold * 100)}%</Text>
                    <View style={styles.sliderContainer}>
                        {[0.5, 0.6, 0.7, 0.8, 0.9].map(value => (
                            <TouchableOpacity
                                key={value}
                                style={[styles.sliderOption, ocrSettings.confidenceThreshold === value && styles.sliderOptionActive]}
                                onPress={() => setOcrSettings(prev => ({...prev, confidenceThreshold: value}))}
                            >
                                <Text style={styles.sliderText}>{Math.round(value * 100)}%</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                
                {ocrDebugInfo && (
                    <View style={styles.debugInfoContainer}>
                        <Text style={styles.debugTitle}>🔍 Last OCR Debug Info</Text>
                        <Text style={styles.debugText}>Engine: {ocrDebugInfo.ocrResult.engine}</Text>
                        <Text style={styles.debugText}>Attempts: {ocrDebugInfo.ocrResult.attempts?.length || 1}</Text>
                        <Text style={styles.debugText}>OCR Confidence: {Math.round((ocrDebugInfo.ocrResult.confidence || 0) * 100)}%</Text>
                        <Text style={styles.debugText}>Parse Confidence: {Math.round((ocrDebugInfo.parsedReceipt.confidence || 0) * 100)}%</Text>
                        <Text style={styles.debugText}>Items Found: {ocrDebugInfo.parsedReceipt.items?.length || 0}</Text>
                        <Text style={styles.debugText}>Text Length: {ocrDebugInfo.ocrResult.text?.length || 0} chars</Text>
                    </View>
                )}
                
                <View style={styles.ocrTipsContainer}>
                    <Text style={styles.tipsTitle}>💡 OCR Tips</Text>
                    <Text style={styles.tipText}>• Good lighting is the most important factor.</Text>
                    <Text style={styles.tipText}>• Hold the phone parallel to the receipt.</Text>
                    <Text style={styles.tipText}>• Ensure the receipt is flat and not crumpled.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    </Modal>
);

export default OcrSettingsModal;
