# Document Management System - Frontend

A modern React-based document management system with OTP authentication, file upload, search, and preview capabilities.

## 🛠️ Tech Stack (2025)

- **React 18** with Vite (Not CRA - outdated)
- **Redux Toolkit** (Modern state management)
- **Tailwind CSS v4** (Utility-first styling)
- **React Router v6** (Navigation)
- **Axios** (HTTP client)

## 🚀 Setup & Run

1. Clone the repository
   ```bash
   git clone https://github.com/LokendraNath/Dodoment-Managment-System.git
   cd document-management-system
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Build for production
   ```bash
   npm run build
   ```

## 📁 Project Structure

```plaintext
src/
├── app/
│   └── store.js
├── features/
│   ├── auth/
│   │   └── authSlice.js
│   └── documents/
│       └── documentSlice.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Upload.jsx
│   ├── Search.jsx
│   └── AdminPanel.jsx
├── components/
│   └── FileActions.jsx
└── main.jsx
```

## 🔑 Feature

- OTP-based authentication
- File upload with categories and tags
- Advanced search with filters
- File preview and download
- Responsive design
- Static admin panel

## 📞 API Endpoints

All APIs are configured in Redux slices. Use your mobile number for OTP.
