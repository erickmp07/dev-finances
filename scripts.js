const modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active');
    },
    close() {
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active');
    }
};

const storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    }
};

const transaction = {
    all: storage.get(),

    add(transaction) {
        transaction.all.push(transaction);

        app.reload();
    },

    remove(index) {
        transaction.all.splice(index, 1);

        app.reload();
    },

    incomes() {
        let income = 0;
        transaction.all.forEach(transaction => {
            if (transaction.value > 0) {
                income += transaction.value;
            }
        });

        return income;
    },

    expenses() {
        let expense = 0;
        transaction.all.forEach(transaction => {
            if (transaction.value < 0) {
                expense += transaction.value;
            }
        });

        return expense;
    },

    total() {
        return transaction.incomes() + transaction.expenses();
    }
};

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr);
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.value > 0
            ? "income"
            : "expense";

        const value = utils.formatCurrency(transaction.value);

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${value}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="transaction.remove(${index})" src="./assets/minus.svg" alt="Remove transaction">
        </td>`;

        return html;
    },

    updateBalance() {
        document
            .getElementById('income-display')
            .innerHTML = utils.formatCurrency(transaction.incomes());
        
        document
            .getElementById('expense-display')
            .innerHTML = utils.formatCurrency(transaction.expenses());

        document
            .getElementById('total-display')
            .innerHTML = utils.formatCurrency(transaction.total());
    },

    clearTransaction() {
        DOM.transactionsContainer.innerHTML = "";
    }
};

const utils = {
    formatValue(value) {
        value = Number(value.replace(/\,\./g, "")) * 100;

        return value;
    },

    formatDate(date) {
        const splittedDate = date.split("-");

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },

    formatCurrency(value) {
        const signal = Number(value) < 0
            ? "-"
            : "";
        
        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100;

        value = value.toLocaleString("en", {
            style: "currency",
            currency: "USD"
        });

        return signal + value;
    }
};

const form = {
    description: document.querySelector('input#description'),
    value: document.querySelector('input#value'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: form.description.value,
            value: form.value.value,
            date: form.date.value 
        };
    },

    validateFields() {
        const { description, value, date } = form.getValues();

        if (description.trim() === "" || 
            value.trim() === "" || 
            date.trim() === "") {
            throw new Error("Please, fill all the fields.");
        }
    },

    formatValues() {
        let { description, value, date } = form.getValues();

        value = utils.formatValue(value);

        date = utils.formatDate(date);

        return {
            description,
            value,
            date
        };
    },

    clearFields() {
        form.description.value = "";
        form.value.value = "";
        form.date.value = "";
    },

    submit(event) {
        event.preventDefault();

        try {
            form.validateFields();

            const newTransaction = form.formatValues();
            transaction.add(newTransaction);
            
            form.clearFields();
            modal.close();
        } catch (error) {
            alert(error.message);
        }
    }
};

const app = {
    init() {
        transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();

        storage.set(transaction.all);
    },

    reload() {
        DOM.clearTransaction();
        app.init();
    }
};

app.init();