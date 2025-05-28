import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useColors } from '../../styles/colors'; // Add this import
import { getExpensesByCategory, getTotalIncome, getTotalExpenses, getCurrentBalance } from '../../utils/transactionUtils';

const PieChart = ({ transactions, colors }) => {
    const data = getExpensesByCategory(transactions);
    
    if (data.length === 0) {
        return (
            <Text style={{
                fontSize: 16,
                color: colors.textSecondary,
                textAlign: 'center',
                padding: 20,
                fontStyle: 'italic',
            }}>
                No expense data for chart
            </Text>
        );
    }
    
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
    
    const pieChartStyles = StyleSheet.create({
        pieChartContainer: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        chartTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            textAlign: 'center',
        },
        chartItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            paddingVertical: 4,
        },
        colorIndicator: {
            width: 16,
            height: 16,
            borderRadius: 8,
            marginRight: 12,
        },
        chartLabel: {
            fontSize: 14,
            color: colors.text,
            flex: 1,
        },
    });
    
    return (
        <View style={pieChartStyles.pieChartContainer}>
            <Text style={pieChartStyles.chartTitle}>Expenses by Category</Text>
            {data.map((item, index) => {
                const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0;
                return (
                    <View key={item.category} style={pieChartStyles.chartItem}>
                        <View style={[
                            pieChartStyles.colorIndicator, 
                            { backgroundColor: chartColors[index % chartColors.length] }
                        ]} />
                        <Text style={pieChartStyles.chartLabel}>
                            {item.category}: ${item.amount.toFixed(2)} ({percentage}%)
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const ReportsModal = ({ visible, onClose, transactions, startingBalance }) => {
    const colors = useColors(); // Add this hook
    
    const totalIncome = getTotalIncome(transactions);
    const totalExpenses = getTotalExpenses(transactions);
    const currentBalance = getCurrentBalance(startingBalance, totalIncome, totalExpenses);
    
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
        reportsContainer: {
            flex: 1,
            padding: 16,
        },
        summaryContainer: {
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
        },
        summaryTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 16,
            textAlign: 'center',
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        summaryRowFinal: {
            borderBottomWidth: 0,
            paddingTop: 16,
            marginTop: 8,
            borderTopWidth: 2,
            borderTopColor: colors.border,
        },
        summaryLabel: {
            fontSize: 16,
            color: colors.text,
            fontWeight: '500',
        },
        summaryLabelFinal: {
            fontSize: 18,
            color: colors.text,
            fontWeight: 'bold',
        },
        summaryValue: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        summaryValueFinal: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        summaryValueIncome: {
            color: colors.success,
        },
        summaryValueExpense: {
            color: colors.error,
        },
        summaryValueBalancePositive: {
            color: colors.success,
        },
        summaryValueBalanceNegative: {
            color: colors.error,
        },
    });

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={themedStyles.modalContainer}>
                <View style={themedStyles.modalHeader}>
                    <Text style={themedStyles.modalHeaderTitle}>📊 Financial Reports</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={themedStyles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={themedStyles.reportsContainer}>
                    <PieChart transactions={transactions} colors={colors} />
                    
                    <View style={themedStyles.summaryContainer}>
                        <Text style={themedStyles.summaryTitle}>💰 Financial Summary</Text>
                        
                        <View style={themedStyles.summaryRow}>
                            <Text style={themedStyles.summaryLabel}>Starting Balance:</Text>
                            <Text style={themedStyles.summaryValue}>
                                ${startingBalance.toFixed(2)}
                            </Text>
                        </View>
                        
                        <View style={themedStyles.summaryRow}>
                            <Text style={themedStyles.summaryLabel}>Total Income:</Text>
                            <Text style={[themedStyles.summaryValue, themedStyles.summaryValueIncome]}>
                                +${totalIncome.toFixed(2)}
                            </Text>
                        </View>
                        
                        <View style={themedStyles.summaryRow}>
                            <Text style={themedStyles.summaryLabel}>Total Expenses:</Text>
                            <Text style={[themedStyles.summaryValue, themedStyles.summaryValueExpense]}>
                                -${totalExpenses.toFixed(2)}
                            </Text>
                        </View>
                        
                        <View style={[themedStyles.summaryRow, themedStyles.summaryRowFinal]}>
                            <Text style={themedStyles.summaryLabelFinal}>Current Balance:</Text>
                            <Text style={[
                                themedStyles.summaryValueFinal,
                                currentBalance >= 0 
                                    ? themedStyles.summaryValueBalancePositive 
                                    : themedStyles.summaryValueBalanceNegative
                            ]}>
                                ${currentBalance.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

export default ReportsModal;
