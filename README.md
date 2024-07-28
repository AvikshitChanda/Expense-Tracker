# 💰 Spend Wise

## 📖 About

Spend Wise is a web application designed to help users track their expenses and income. Users can register, log in, and manage their financial transactions through an intuitive interface. The app includes features such as a dashboard, expense tracking, income tracking, and user authentication.

## 🛠️ Installation

To set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/spend-wise.git
    ```

2. Navigate to the project directory:
    ```sh
    cd spend-wise
    ```

3. Install the required dependencies:
    ```sh
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:
    ```
    PORT=5000
    DATABASE_URL=your_database_url
    ```

5. Start the development server:
    ```sh
    npm start
    ```

## ✨ Features

- **🔒 User Authentication:** Register and log in securely with JWT authentication.
- **📊 Dashboard:** View an overview of your financial status.
- **💸 Expense Tracking:** Record and categorize your expenses.
- **💰 Income Tracking:** Record and categorize your income.
- **⏳ Loader Animation:** Display a loader animation while fetching initial data.

## 📝 End Note

To run the server and client concurrently:

1. In one terminal window, start the backend server:
    ```sh
    node server.js
    ```

2. In another terminal window, start the React development server:
    ```sh
    npm start
    ```

Once both servers are running, you can access the application at `http://localhost:3000`.

Enjoy using Spend Wise to manage your finances! 💵
