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

    // Update the expenses table, group by category
    function updateTable() {
        expensesList.innerHTML = '';

        // Group expenses by category
        const groupedExpenses = groupExpensesByCategory(expenses);

        // For each category, create a section
        for (let category in groupedExpenses) {
            const categoryExpenses = groupedExpenses[category];

            // Create a section header
            const categorySection = document.createElement('div');
            categorySection.classList.add('mb-4');
            const sectionTitle = document.createElement('h3');
            sectionTitle.classList.add('text-xl', 'font-bold', 'mb-2');
            sectionTitle.textContent = category;
            categorySection.appendChild(sectionTitle);

            // Create a table for this category
            const table = document.createElement('table');
            table.classList.add('min-w-full', 'table-auto', 'border-collapse');
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th class="px-4 py-2 text-left border">Date</th>
                    <th class="px-4 py-2 text-left border">Category</th>
                    <th class="px-4 py-2 text-left border">Amount</th>
                    <th class="px-4 py-2 text-left border">Notes</th>
                    <th class="px-4 py-2 text-left border">Actions</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            categoryExpenses.forEach((expense, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-2 border">${expense.date}</td>
                    <td class="px-4 py-2 border">${expense.category}</td>
                    <td class="px-4 py-2 border">$${expense.amount.toFixed(2)}</td>
                    <td class="px-4 py-2 border">${expense.notes || '-'}</td>
                    <td class="px-4 py-2 border">
                        <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 delete-btn" data-index="${index}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            categorySection.appendChild(table);
            expensesList.appendChild(categorySection);
        }

        // Add delete button event listeners
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteExpense(index);
            });
        });
    }

    // Group expenses by category
    function groupExpensesByCategory(expenses) {
        const grouped = {
            'Food': [],
            'Accessories': [],
            'Book': [],
            'Transport': [],
            'Fees': [],
            'Others': []
        };

        expenses.forEach(expense => {
            grouped[expense.category].push(expense);
        });

        return grouped;
    }

    // Delete an expense
    function deleteExpense(index) {
        expenses.splice(index, 1);
        updateTable();
    }

    // Generate and download PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Monthly Expenses Report", 14, 10);

        // Group the expenses by category for the report
        const groupedExpenses = groupExpensesByCategory(expenses);
        
        let yOffset = 20;  // Initial Y position for the PDF content

        // Loop through each category
        for (let category in groupedExpenses) {
            doc.text(category, 14, yOffset);
            yOffset += 10;

            // Create a table for each category
            const tableData = groupedExpenses[category].map(expense => [
                expense.date,
                expense.category,
                `$${expense.amount.toFixed(2)}`,
                expense.notes || '-'
            ]);

            // Add a table for this category
            doc.autoTable({
                startY: yOffset,
                head: [['Date', 'Category', 'Amount', 'Notes']],
                body: tableData,
                theme: 'grid'
            });

            // Update Y offset for next category
            yOffset = doc.lastAutoTable.finalY + 10;
        }

        // Save the PDF with the name 'expenses-report.pdf'
        doc.save('expenses-report.pdf');
    });
});
