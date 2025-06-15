import React, { useState, useEffect } from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useColors } from '../../styles/colors';
import MistralService from '../../services/mistralService';

const ModelDownloaderModal = ({ visible, onClose, onDownloadComplete }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isModelReady, setIsModelReady] = useState(false);
    const [downloadedSize, setDownloadedSize] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const colors = useColors();

    useEffect(() => {
        checkModelStatus();
    }, []);

    const checkModelStatus = async () => {
        try {
            const modelPath = `${FileSystem.documentDirectory}ministral-3b-instruct-q4_k_m.gguf`;
            const modelExists = await FileSystem.getInfoAsync(modelPath);
            setIsModelReady(modelExists.exists);
        } catch (error) {
            console.error('Error checking model status:', error);
        }
    };

    const downloadModel = async () => {
        setIsDownloading(true);
        setDownloadProgress(0);
        setDownloadedSize(0);
        setTotalSize(0);

        try {
            await MistralService.downloadModel((progress) => {
                const percent = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
                setDownloadProgress(percent);
                setDownloadedSize(progress.totalBytesWritten);
                setTotalSize(progress.totalBytesExpectedToWrite);
            });

            setIsModelReady(true);
            Alert.alert('Success', '🤖 AI model downloaded successfully! Enhanced receipt parsing is now available.');
            onDownloadComplete && onDownloadComplete();

        } catch (error) {
            Alert.alert('Error', `Failed to download model: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

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
        container: {
            padding: 20,
            backgroundColor: colors.card,
            borderRadius: 10,
            margin: 15,
            borderWidth: 1,
            borderColor: colors.border,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: colors.text,
        },
        description: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 15,
            lineHeight: 20,
        },
        downloadButton: {
            backgroundColor: colors.primary,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
        },
        downloadButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
        progressContainer: {
            alignItems: 'center',
        },
        progressBarContainer: {
            width: '100%',
            height: 8,
            backgroundColor: colors.surface,
            borderRadius: 4,
            marginBottom: 10,
        },
        progressBar: {
            height: 8,
            backgroundColor: colors.primary,
            borderRadius: 4,
        },
        progressText: {
            marginTop: 10,
            fontSize: 14,
            color: colors.text,
            textAlign: 'center',
        },
        sizeText: {
            fontSize: 12,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 5,
        },
        statusText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.success,
            textAlign: 'center',
        },
        subText: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: 5,
        },
        benefitsContainer: {
            marginTop: 20,
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 8,
        },
        benefitsTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        benefitItem: {
            fontSize: 14,
            color: colors.textSecondary,
            marginBottom: 4,
            paddingLeft: 8,
        },
    });

    if (isModelReady) {
        return (
            <Modal visible={visible} animationType="slide">
                <SafeAreaView style={themedStyles.modalContainer}>
                    <View style={themedStyles.modalHeader}>
                        <Text style={themedStyles.modalHeaderTitle}>🤖 AI Enhancement</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={themedStyles.closeButton}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={themedStyles.container}>
                        <Text style={themedStyles.statusText}>✅ AI Model Ready</Text>
                        <Text style={themedStyles.subText}>Enhanced receipt parsing enabled</Text>
                        
                        <View style={themedStyles.benefitsContainer}>
                            <Text style={themedStyles.benefitsTitle}>🎯 Enhanced Features Active:</Text>
                            <Text style={themedStyles.benefitItem}>• Improved item recognition accuracy</Text>
                            <Text style={themedStyles.benefitItem}>• Automatic item categorization</Text>
                            <Text style={themedStyles.benefitItem}>• Better merchant name extraction</Text>
                            <Text style={themedStyles.benefitItem}>• Smarter total amount detection</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>🤖 AI Enhancement</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <View style={themedStyles.container}>
                    <Text style={themedStyles.title}>Enhanced AI Receipt Parser</Text>
                    <Text style={themedStyles.description}>
                        Download the AI model (~2.5GB) for significantly improved receipt parsing accuracy and automatic categorization.
                    </Text>
                    
                    {isDownloading ? (
                        <View style={themedStyles.progressContainer}>
                            <View style={themedStyles.progressBarContainer}>
                                <View 
                                    style={[
                                        themedStyles.progressBar, 
                                        { width: `${downloadProgress * 100}%` }
                                    ]} 
                                />
                            </View>
                            <Text style={themedStyles.progressText}>
                                {Math.round(downloadProgress * 100)}% Downloaded
                            </Text>
                            <Text style={themedStyles.sizeText}>
                                {formatBytes(downloadedSize)} / {formatBytes(totalSize)}
                            </Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={themedStyles.downloadButton} onPress={downloadModel}>
                            <Text style={themedStyles.downloadButtonText}>Download AI Model</Text>
                        </TouchableOpacity>
                    )}

                    <View style={themedStyles.benefitsContainer}>
                        <Text style={themedStyles.benefitsTitle}>✨ What you'll get:</Text>
                        <Text style={themedStyles.benefitItem}>• 90%+ accuracy improvement</Text>
                        <Text style={themedStyles.benefitItem}>• Automatic item categorization</Text>
                        <Text style={themedStyles.benefitItem}>• Better handling of complex receipts</Text>
                        <Text style={themedStyles.benefitItem}>• Completely offline processing</Text>
                        <Text style={themedStyles.benefitItem}>• No API costs or privacy concerns</Text>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default ModelDownloaderModal;