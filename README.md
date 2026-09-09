# 🥗 NutriFlow — Intelligent Nutrition & Metabolic Health Platform

A production-grade, state-of-the-art nutrition tracking and metabolic health frontend built with **React**, **Vite**, **Tailwind CSS**, **Lucide React**, and **Recharts**. Inspired by modern Stitch visual design aesthetics.

---

## ✨ Features

- 🥑 **Interactive Food Diary (`/diary`)**
  - Multi-meal tracking: Breakfast, Lunch, Dinner, and Afternoon Snack.
  - Per-item portion management, incremental scaling, and instant calorie/macro calculation.
  - Meal copy, meal clearing, and single-item deletion with full date synchronization.
  - Quick-log modal with instant search across canonical food databases.

- 🥗 **Nutrient-Dense Recipe Engine (`/recipes`)**
  - **Dual Source Catalog**: Prebuilt chef formulations and user-created custom recipes.
  - **8 Diverse Categories**: Breakfast, Lunch, Dinner, High Protein, High Fiber, Low Calorie, Vegetarian, Quick & Easy.
  - **Live Recipe Builder**: Real-time macronutrient engine automatically computes total and per-serving calories, protein, carbs, fat, and fiber directly from canonical food items.
  - **Step-by-Step Cooking Instructions**: Reorderable and editable cooking workflow.
  - **Direct Food Diary Integration**: 1-click recipe logging with custom serving multipliers.

- 📊 **Metabolic Dashboard (`/dashboard`)**
  - Real-time calorie pacing ring & daily remaining targets.
  - Dynamic macro distribution bar charts (Protein, Carbs, Fat, Fiber).
  - Quick food log drawer and water hydration tracker with dynamic fill animation.

- 🤖 **Nutri AI Assistant (`/assistant`)**
  - Intelligent metabolic coach with preconfigured quick prompts (Macro Optimization, Meal Timing, Recovery Fuel).
  - Clean conversational interface with real-time response generation.

- 📈 **Nutrition Insights & Analytics (`/insights`)**
  - Historical intake analytics, calorie trends, and macronutrient adherence charts via Recharts.
  - Micronutrient quality scoring and dietary consistency metrics.

- 📅 **Meal Planner & Smart Grocery (`/meal-planner`, `/grocery`)**
  - Weekly meal planning calendar by day and meal category.
  - Smart grocery list with interactive checklist, category sorting, and instant additions.

- 📷 **AI Food & Barcode Scanner (`/scanner`, `/barcode-scanner`)**
  - Computer vision simulation for camera food recognition and real-time barcode lookup.
  - Instant nutrition estimation and 1-tap food diary logging.

- ⚙️ **Personalized Targets & Settings (`/settings`)**
  - Custom daily targets: Calorie cap, Protein (g), Carbs (g), Fat (g), Fiber (g), and Water intake (L).
  - Instant persistence to `localStorage` across the entire application.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with curated HSL color palette & glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Viz**: [Recharts](https://recharts.org/)
- **State & Storage**: React Context API (`NutritionContext`, `UIContext`) synchronized with `localStorage`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/MohithramMaruthi/nutriflow.git

# Navigate into the project directory
cd nutriflow

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the Vite development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Building for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── assets/          # SVG logos, branding assets
├── components/      # Modular UI components
│   ├── common/      # GlobalSearch, DatePicker, Notifications, ProPlan modals
│   ├── navigation/  # Sidebar, Topbar, MobileNav
│   ├── recipes/     # RecipeDetailModal, RecipeBuilderModal
│   └── ui/          # Button, Card, Badge, Modal, Drawer, EmptyState
├── context/         # NutritionContext, UIContext
├── data/            # Canonical food database & mock catalogs
├── hooks/           # useNutrition, useUI, useMediaQuery
├── layouts/         # MainLayout with responsive shell
├── pages/           # Application views & routes
└── utils/           # storage, date formatting, class merging
```

---

## 📄 License
This project is licensed under the MIT License.
