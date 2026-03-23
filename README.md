# StatSnap – Smart Data Analyzer

## 1. Project Overview

StatSnap is a full‑stack data analysis web application that lets users upload a CSV or Excel file and instantly get actionable insights. It provides a data preview, descriptive statistics, column‑wise insights in plain English, outlier detection using the IQR method, and clean visualizations — all available through a simple web dashboard with downloadable reports.

Backend:
- Python
- Django
- Django REST Framework
- Pandas
- Matplotlib / Seaborn

Frontend:
- HTML
- CSS
- Bootstrap
- JavaScript (Fetch API)

Purpose:
- User uploads a CSV or Excel file → the system analyzes it with Pandas → returns a JSON payload with preview, descriptive statistics, column insights, outlier counts, and graph URLs → frontend renders a professional dashboard. Downloadable reports (Excel/PDF/DOCX) are also provided from the backend.

## 2. Project Architecture

```
Frontend (Port 5500)
   ↓  POST /api/upload/    GET /api/download/<format>/
API Call
   ↓
Backend Django Server (Port 8000)
   ↓
Data Processing (Pandas)
   ↓
Generate:
 - Preview
 - Describe (numeric/object handled separately)
 - Column Insights (numeric/object statements)
 - Outlier Detection (IQR)
 - Graphs (bar chart, boxplot, correlation heatmap)
   ↓
Return JSON response
   ↓
Frontend renders dashboard
```

## 3. Folder Structure

```
StatSnap/
│
├── backend/
│   ├── analyzer/
│   ├── config/
│   ├── media/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── images/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

## 4. Installation Steps

Windows commands:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

## 5. Running the Project

Terminal 1 (Backend):
```
cd backend
venv\Scripts\activate
python manage.py runserver
```
Backend runs on:
```
http://127.0.0.1:8000/
```

Terminal 2 (Frontend):
```
cd frontend
python -m http.server 5500
```
Frontend runs on:
```
http://127.0.0.1:5500/
```

## 6. Execution Flow (Important)

1. User selects a CSV/XLSX file in the browser.
2. Frontend sends a POST request to `/api/upload/` with the file.
3. Django receives and validates the file.
4. Pandas loads the DataFrame.
5. Data is split into:
   - Numeric columns
   - Object columns
6. Generate:
   - `df.describe()` on numeric columns (and separate describe for object columns)
   - 7 numeric statements per column (records, mean, median, min, max, std, 50% explanation)
   - 3–4 object statements (records, unique values, most frequent value, frequency)
7. Outlier detection using IQR:
   - Q1, Q3, IQR = Q3 - Q1  
   - Outliers are values outside (Q1 − 1.5×IQR) or (Q3 + 1.5×IQR)
8. Generate graphs (bar chart of means, boxplot of numeric columns, optional correlation heatmap).
9. Return JSON with preview, describe, statements, outliers, and graph URLs.
10. Frontend renders tables, insights, and charts.
11. Download endpoints provide report files (Excel/PDF/DOCX).

## 7. Features

- CSV & Excel Upload
- Data Preview
- Descriptive Statistics (numeric/object handled correctly)
- Column Insights (plain English statements)
- Outlier Detection (IQR)
- Graph Visualization (bar/boxplot/heatmap)
- Download Reports (CSV/Excel/PDF/DOCX)
- Dashboard Summary Cards
- Professional, responsive UI

## 8. Sample Column Insight Explanation

Example:
```
TV column has 200 records.
Average value is 147.
50% of values are below 149.
No significant outliers detected.
```

## 9. Technologies Used

Backend:
- Python, Django, Django REST Framework
- Pandas
- Matplotlib, Seaborn

Frontend:
- HTML, CSS, Bootstrap
- JavaScript (Fetch API)

Utilities:
- django-cors-headers (development CORS)


