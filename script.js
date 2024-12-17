document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const downloadPdfButton = document.getElementById('download-pdf');
    let expenses = [];

    // Handle form submission
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('expense-category').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const notes = document.getElementById('expense-notes').value;

        if (!date || !category || !amount) {
            alert("Please fill in all required fields.");
            return;
        }

        const expense = {
            date,
            category,
            amount,
            notes
        };

        expenses.push(expense);
        updateTable();
        expenseForm.reset();
    });

    // Update the expenses table
    function updateTable() {
        expensesList.innerHTML = '';
        expenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-4 py-2 border">${expense.date}</td>
                <td class="px-4 py-2 border">${expense.category}</td>
                <td class="px-4 py-2 border">$${expense.amount.toFixed(2)}</td>
                <td class="px-4 py-2 border">${expense.notes || '-'}</td>
            `;
            expensesList.appendChild(row);
        });
    }

    // Generate and download PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Monthly Expenses Report", 14, 10);
        doc.autoTable({
            startY: 20,
            head: [['Date', 'Category', 'Amount', 'Notes']],
            body: expenses.map(expense => [
                expense.date,
                expense.category,
                `$${expense.amount.toFixed(2)}`,
                expense.notes || '-'
            ]),
        });
        doc.save('expenses-report.pdf');
    });
});
