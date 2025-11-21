# Slovenian Mortgage Calculator

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)

A sophisticated financial planning tool designed specifically for the real estate market. This application goes beyond simple mortgage calculations to provide a holistic view of affordability, risk, and long-term financial health, wrapped in a modern interface.

## 🌟 Key Features

-   **Advanced Mortgage Calculation**: Annuity-style payment schedules with customizable terms and interest rates.
-   **Slovenian Market Specifics**:
    -   **DTI Validation**: Checks against the 40% Debt-to-Income limit.
    -   **Collateral Logic**: Validates parent property collateral (80% LTV rule) for 100% financing.
    -   **Child Costs**: Uses localized data for estimated child-rearing expenses by age group.
-   **Financial Stress Testing**: Simulates scenarios like interest rate hikes (+2%), job loss, or unexpected expenses to test financial resilience.
-   **Investment & Savings**: Calculates emergency fund targets and suggests investment allocations (ETFs vs. Savings) based on risk tolerance.
-   **Liquid Design UI**: A glassmorphic, fluid interface with dark/light mode support, interactive charts, and smooth animations.
-   **Privacy First**: All calculations are performed client-side. No personal financial data is stored on servers.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), CSS Variables, Custom Keyframes
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **State Management**: React Hooks, LocalStorage persistence

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mortgage-calculator.git
    cd mortgage-calculator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
│   ├── (dashboard)/     # Calculator and Results routes
│   └── globals.css      # Global styles and theme variables
├── components/
│   ├── charts/          # Recharts visualizations
│   ├── forms/           # Input forms (Income, Expenses, Mortgage, etc.)
│   ├── results/         # Result summary cards and tables
│   └── ui/              # Reusable UI components (Card, Button, Input)
├── lib/
│   ├── calculations/    # Core financial logic (DTI, Mortgage, Stress Test)
│   ├── constants/       # Banking rules and market data
│   └── schemas/         # Zod validation schemas
└── hooks/               # Custom React hooks
```

## 🔒 Security & Performance

-   **Security Headers**: Configured with strict HSTS, X-Frame-Options, and Permissions-Policy.
-   **Input Validation**: All user inputs are strictly validated using Zod schemas to prevent injection or calculation errors.
-   **Optimization**:
    -   Zero-runtime CSS-in-JS overhead (Tailwind).
    -   Optimized animations using CSS transforms and `will-change`.
    -   Client-side processing for instant feedback.

## 📄 License

This project is licensed under the MIT License.

