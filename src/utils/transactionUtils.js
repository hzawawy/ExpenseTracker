export const getTotalExpenses = (transactions) =>
  transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

export const getTotalIncome = (transactions) =>
  transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

export const getCurrentBalance = (startingBalance, totalIncome, totalExpenses) =>
  startingBalance + totalIncome - totalExpenses;

export const getExpensesByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });
  return Object.entries(categoryTotals).map(([category, amount]) => ({ category, amount }));
};
