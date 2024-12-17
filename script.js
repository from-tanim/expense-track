document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const downloadPdfButton = document.getElementById('download-pdf');
    const expenseCategories = document.getElementById('expense-categories');
    let expenses = {
        "Food": [],
        "Accessories": [],
        "Book": [],
        "Transport": [],
        "Fees": [],
        "Others": []
    };

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

        // Add expense to the appropriate category
        expenses[category].push(expense);
        updateCategories();
        expenseForm.reset();
    });

    // Update the displayed categories and expenses list
    function updateCategories() {
        expenseCategories.innerHTML = '';

        // Iterate over each category
        for (let category in expenses) {
            if (expenses[category].length > 0) {
                const categorySection = document.createElement('div');
                categorySection.classList.add('mb-6');

                const categoryTitle = document.createElement('h3');
                categoryTitle.classList.add('text-xl', 'font-semibold', 'mb-2');
                categoryTitle.textContent = category;
                categorySection.appendChild(categoryTitle);

                const table = document.createElement('table');
                table.classList.add('min-w-full', 'table-auto', 'border-collapse');

                // Table Header
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th class="px-4 py-2 text-left border">Date</th>
                    <th class="px-4 py-2 text-left border">Amount</th>
                    <th class="px-4 py-2 text-left border">Notes</th>
                    <th class="px-4 py-2 text-left border">Actions</th>
                `;
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Table Body
                const tbody = document.createElement('tbody');
                expenses[category].forEach((expense, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-4 py-2 border">${expense.date}</td>
                        <td class="px-4 py-2 border">$${expense.amount.toFixed(2)}</td>
                        <td class="px-4 py-2 border">${expense.notes || '-'}</td>
                        <td class="px-4 py-2 border text-center">
                            <button class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onclick="deleteExpense('${category}', ${index})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                categorySection.appendChild(table);
                expenseCategories.appendChild(categorySection);
            }
        }
    }

    // Delete an expense
    window.deleteExpense = function(category, index) {
        expenses[category].splice(index, 1);
        updateCategories();
    };

    // Generate and download PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Monthly Expenses Report", 14, 10);

        // Iterate over categories and expenses
        let y = 20;
        for (let category in expenses) {
            if (expenses[category].length > 0) {
                doc.text(category, 14, y);
                y += 10;

                doc.autoTable({
                    startY: y,
                    head: [['Date', 'Amount', 'Notes']],
                    body: expenses[category].map(expense => [
                        expense.date,
                        `$${expense.amount.toFixed(2)}`,
                        expense.notes || '-'
                    ]),
                });

                y = doc.lastAutoTable.finalY + 10; // Update y position for next category
            }
        }
        doc.save('expenses-report.pdf');
    });
});
