# Document Management System Interface

This is a frontend assignment for AllSoft, implementing a Document Management System interface using React, Redux Toolkit, and Tailwind CSS.

## Project Overview

The application allows users to:
- **Login**: Authenticate using a mobile number and OTP (handled by backend).
- **Upload Documents**: Upload PDF/Image files with metadata (Category, Name/Department, Tags, Remarks).
- **Search Documents**: Filter documents by category, date range, and tags.
- **Preview & Download**: View and download uploaded files.
- **Admin Panel**: A static interface for user creation.

## Tech Stack

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd docoment-managment-system
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Features & Implementation Details

- **Incremental Commits**: The project was developed with structured, incremental commits.
- **Responsive Design**: The UI is fully responsive and works on mobile, tablet, and desktop.
- **Error Handling**: Robust error handling for API requests (Login, Upload, Search).
- **Modern UI**: Uses gradients, glassmorphism, and smooth transitions for a premium feel.

## API Integration

The application integrates with the provided Postman collection endpoints:
- `POST /generateOTP`
- `POST /validateOTP`
- `POST /saveDocumentEntry` (Multipart upload)
- `POST /searchDocumentEntry`
- `POST /documentTags`

## Notes

- Ensure the backend API is accessible.
- If CORS issues occur during local development, a proxy might be needed or the backend should allow localhost origins.
