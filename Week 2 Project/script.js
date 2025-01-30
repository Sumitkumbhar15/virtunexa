let expenses = [];
const chartData = {
    labels: ['Food', 'Travel', 'Entertainment', 'Other'],
    datasets: [{
        label: 'Expenses by Category',
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    }]
};

const config = {
    type: 'pie',
    data: chartData
};

const expenseChart = new Chart(
    document.getElementById('expenseChart'),
    config
);

const trendChartData = {
    labels: [],
    datasets: [{
        label: 'Spending Trends',
        data: [],
        borderColor: '#007BFF',
        tension: 0.4
    }]
};

const trendChart = new Chart(
    document.getElementById('trendChart'),
    {
        type: 'line',
        data: trendChartData
    }
);

document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    const expense = { date, amount, category, description };
    expenses.push(expense);

    updateOverview();
    updateCharts();
    updateTable();
    alert('Expense added successfully!');
});

document.getElementById('timeRange').addEventListener('change', function() {
    if (this.value === 'custom') {
        document.getElementById('customDateRange').style.display = 'block';
    } else {
        document.getElementById('customDateRange').style.display = 'none';
    }
});

document.getElementById('filterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const timeRange = document.getElementById('timeRange').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    let filteredExpenses = expenses;

    if (timeRange === 'weekly') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= oneWeekAgo);
    } else if (timeRange === 'monthly') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= oneMonthAgo);
    } else if (timeRange === 'custom') {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        filteredExpenses = filteredExpenses.filter(exp => new Date(exp.date) >= startDate && new Date(exp.date) <= endDate);
    }

    if (categoryFilter !== 'all') {
        filteredExpenses = filteredExpenses.filter(exp => exp.category === categoryFilter);
    }

    updateCharts(filteredExpenses);
    alert(`Filtered ${filteredExpenses.length} expenses.`);
});

function updateOverview() {
    const monthlyTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('monthlyTotal').textContent = `$${monthlyTotal.toFixed(2)}`;

    const budget = parseFloat(document.getElementById('budget').value) || Infinity;
    if (monthlyTotal > budget) {
        document.getElementById('budgetAlert').style.display = 'block';
    } else {
        document.getElementById('budgetAlert').style.display = 'none';
    }

    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    let topCategory = 'None';
    let maxAmount = 0;
    for (let [key, value] of Object.entries(categoryTotals)) {
        if (value > maxAmount) {
            maxAmount = value;
            topCategory = key;
        }
    }

    document.getElementById('topCategory').textContent = topCategory;
}

function updateCharts(filteredExpenses = expenses) {
    const categoryTotals = { Food: 0, Travel: 0, Entertainment: 0, Other: 0 };
    filteredExpenses.forEach(expense => {
        categoryTotals[expense.category] += expense.amount;
    });

    chartData.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();

    trendChartData.labels = filteredExpenses.map(exp => exp.date);
    trendChartData.datasets[0].data = filteredExpenses.map(exp => exp.amount);
    trendChart.update();
}

function updateTable() {
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateOverview();
    updateCharts();
    updateTable();
}

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('bg-dark');
    document.body.classList.toggle('text-light');
});