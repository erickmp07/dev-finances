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

        App.reload();
    },

    remove(index) {
        transaction.all.splice(index, 1);

        App.reload();
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