#  Alameed

**Alameed** is a modern desktop application for managing automotive spare parts stores. Built with **Electron**, **Next.js**, **React**, **TypeScript**, and **SQLite**, it provides a fast, offline-first experience for inventory, purchases, sales, and reporting.

> Designed for small and medium automotive parts businesses that need a simple, reliable, and efficient management system.

---

##  Features

###  Product Management
- Create, edit, and delete products
- Barcode & SKU support
- OEM and alternate part numbers
- Product categories
- Brand & manufacturer management
- Vehicle brand/model compatibility
- Stock quantity tracking
- Buying & selling prices

###  Purchase Management
- Register supplier purchases
- Automatically increase inventory
- Purchase history
- Purchase invoices
- Cost tracking

###  Sales Management
- Create sales invoices
- Automatic stock deduction
- Invoice printing
- Customer purchase history

### Reports
- Inventory overview
- Purchase reports
- Sales reports
- Revenue tracking
- Expense tracking
- Profit calculation
- Product movement history

###  User Management
- Secure authentication
- Role-based permissions
- Session management

### Printing
- Printable invoices
- Clean invoice layout

### Desktop Experience
- Offline-first
- Fast local SQLite database
- Native Windows application
- No internet connection required

---

# Tech Stack

- Electron
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Drizzle ORM
- SQLite
- TanStack Query
- Electron Builder

---

# Project Structure

```
alameed/
│
├── app/                # Next.js App Router
├── components/         # UI Components
├── electron/           # Electron Main Process
├── drizzle/            # Database Schema & Migrations
├── database/           # SQLite Database
├── lib/                # Utilities
├── hooks/              # React Hooks
├── ipc/                # Electron IPC Handlers
└── assets/             # Icons & Images
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/yourusername/alameed.git
```

Install dependencies

```bash
npm install
```

---

# Development

Start Next.js + Electron

```bash
npm run dev
```

---

# Production Build

Create a Windows installer

```bash
npm run build
```

The generated installer will be located inside:

```
release/
```

---

# Database

Alameed uses a local **SQLite** database through **Drizzle ORM**.

Main entities:

- Users
- Categories
- Products
- Purchases
- Sales
- Purchase Items
- Sale Items

---

# Main Modules

## Inventory

Manage all automotive spare parts including:

- Product Name
- SKU
- Barcode
- Brand
- Manufacturer
- Vehicle Brand
- Vehicle Model
- Position
- OEM Number
- Alternate Number
- Quantity
- Purchase Price
- Selling Price

---

## Purchases

- Purchase invoices
- Supplier records
- Stock updates
- Purchase history

---

## Sales

- Sales invoices
- Automatic stock deduction
- Profit calculation
- Invoice printing

---

## Reports

The reporting module provides insights into:

- Total Purchases
- Total Sales
- Total Expenses
- Net Profit
- Current Inventory Value
- Best Selling Products
- Low Stock Products
- Product Movement History

---

## Authentication

Supports secure local authentication with user sessions.

Roles can include:

- Administrator
- Manager
- Employee

---

# Screenshots


# Requirements

- Windows 7 SP1 or newer *(32-bit and 64-bit supported depending on the build)*
- 4 GB RAM recommended
- 500 MB free disk space

---

# Roadmap

- Invoice image OCR
- Supplier management
- Customer management
- Backup & Restore
- Excel export
- PDF export
- Advanced analytics
- Barcode scanner support
- Receipt printer optimization
- AI-powered invoice extraction
- Dashboard improvements

---

# License

This project is licensed under the MIT License.

---

# Author

**Abdelrahman Mohamed**

Built with ❤️ using Electron + Next.js.
