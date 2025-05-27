import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PieChart, LineChart } from 'react-native-chart-kit';

const Reports = ({ transactions }) => {
  const screenWidth = Dimensions.get('window').width;

  const getExpenseData = () => {
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
    
    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      population: value,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
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

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expenses by Category</Text>
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
          <Text style={styles.noDataText}>No expense data available</Text>
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Income vs Expenses (Last 7 Days)</Text>
        <LineChart
          data={timeSeriesData}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.chartTitle}>Monthly Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={[styles.summaryValue, {color: '#16a34a'}]}>
              ${getTotalIncome().toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, {color: '#dc2626'}]}>
              ${getTotalExpenses().toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.summaryLabel}>Net Balance</Text>
          <Text style={[
            styles.balanceValue,
            {color: (getTotalIncome() - getTotalExpenses()) >= 0 ? '#16a34a' : '#dc2626'}
          ]}>
            ${Math.abs(getTotalIncome() - getTotalExpenses()).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1f2937',
  },
  chart: {
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    padding: 40,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Reports;

