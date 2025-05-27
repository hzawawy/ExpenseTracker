import React from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../styles/appStyles';
import { getExpensesByCategory, getTotalIncome, getTotalExpenses, getCurrentBalance } from '../../utils/transactionUtils';

const PieChart = ({ transactions }) => {
    const data = getExpensesByCategory(transactions);
    if (data.length === 0) {
        return <Text style={styles.emptyText}>No expense data for chart</Text>;
    }

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];

    return (
        <View style={styles.pieChartContainer}>
            <Text style={styles.chartTitle}>Expenses by Category</Text>
            {data.map((item, index) => {
                const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(1) : 0;
                return (
                    <View key={item.category} style={styles.chartItem}>
                        <View style={[styles.colorIndicator, { backgroundColor: colors[index % colors.length] }]} />
                        <Text style={styles.chartLabel}>{item.category}: ${item.amount.toFixed(2)} ({percentage}%)</Text>
                    </View>
                );
            })}
        </View>
    );
};


const ReportsModal = ({ visible, onClose, transactions, startingBalance }) => {
    const totalIncome = getTotalIncome(transactions);
    const totalExpenses = getTotalExpenses(transactions);
    const currentBalance = getCurrentBalance(startingBalance, totalIncome, totalExpenses);

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderTitle}>📊 Financial Reports</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.reportsContainer}>
                    <PieChart transactions={transactions} />
                    
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>💰 Financial Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Starting Balance:</Text>
                            <Text style={styles.summaryValue}>${startingBalance.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Income:</Text>
                            <Text style={[styles.summaryValue, {color: '#16a34a'}]}>+${totalIncome.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Expenses:</Text>
                            <Text style={[styles.summaryValue, {color: '#dc2626'}]}>-${totalExpenses.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.summaryRowFinal]}>
                            <Text style={styles.summaryLabelFinal}>Current Balance:</Text>
                            <Text style={[styles.summaryValueFinal, {color: currentBalance >= 0 ? '#16a34a' : '#dc2626'}]}>
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
