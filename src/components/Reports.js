import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { useColors } from '../styles/colors'; // Add this import

const Reports = ({ transactions }) => {
  const screenWidth = Dimensions.get('window').width;
  const colors = useColors(); // Add this hook

  const getExpenseData = () => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

    const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    
    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      population: value,
      color: chartColors[index % chartColors.length],
      legendFontColor: colors.text, // Use theme color for legend
      legendFontSize: 12,
    }));
  };

  const getTimeSeriesData = () => {
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const labels = last7Days.map(date => {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const expensesData = last7Days.map(date => {
      return transactions
        .filter(t => t.date === date && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const incomeData = last7Days.map(date => {
      return transactions
        .filter(t => t.date === date && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    });

    return {
      labels,
      datasets: [
        {
          data: expensesData,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: incomeData,
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          strokeWidth: 2
        }
      ],
      legend: ['Expenses', 'Income']
    };
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const expenseData = getExpenseData();
  const timeSeriesData = getTimeSeriesData();

  // Chart config that adapts to theme
  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => colors.primary.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    labelColor: (opacity = 1) => colors.text.replace('rgb', 'rgba').replace(')', `, ${opacity})`),
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontSize: 12,
      fill: colors.text
    }
  };

  // Create themed styles
  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    chartContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: colors.text,
    },
    chart: {
      borderRadius: 8,
    },
    noDataText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      padding: 40,
      fontStyle: 'italic',
    },
    summaryContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    summaryValueIncome: {
      color: colors.success,
    },
    summaryValueExpense: {
      color: colors.error,
    },
    balanceContainer: {
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    balanceValue: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    balanceValuePositive: {
      color: colors.success,
    },
    balanceValueNegative: {
      color: colors.error,
    },
  });

  const netBalance = getTotalIncome() - getTotalExpenses();

  return (
    <ScrollView style={themedStyles.container} showsVerticalScrollIndicator={false}>
      <View style={themedStyles.chartContainer}>
        <Text style={themedStyles.chartTitle}>Expenses by Category</Text>
        {expenseData.length > 0 ? (
          <PieChart
            data={expenseData}
            width={screenWidth - 64}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={themedStyles.noDataText}>No expense data available</Text>
        )}
      </View>

      <View style={themedStyles.chartContainer}>
        <Text style={themedStyles.chartTitle}>Income vs Expenses (Last 7 Days)</Text>
        <LineChart
          data={timeSeriesData}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={themedStyles.chart}
        />
      </View>

      <View style={themedStyles.summaryContainer}>
        <Text style={themedStyles.chartTitle}>Monthly Summary</Text>
        <View style={themedStyles.summaryRow}>
          <View style={themedStyles.summaryItem}>
            <Text style={themedStyles.summaryLabel}>Total Income</Text>
            <Text style={[themedStyles.summaryValue, themedStyles.summaryValueIncome]}>
              ${getTotalIncome().toFixed(2)}
            </Text>
          </View>
          <View style={themedStyles.summaryItem}>
            <Text style={themedStyles.summaryLabel}>Total Expenses</Text>
            <Text style={[themedStyles.summaryValue, themedStyles.summaryValueExpense]}>
              ${getTotalExpenses().toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={themedStyles.balanceContainer}>
          <Text style={themedStyles.summaryLabel}>Net Balance</Text>
          <Text style={[
            themedStyles.balanceValue,
            netBalance >= 0 ? themedStyles.balanceValuePositive : themedStyles.balanceValueNegative
          ]}>
            ${Math.abs(netBalance).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Reports;
