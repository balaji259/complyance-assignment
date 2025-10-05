# E-Invoicing Readiness & Gap Analyzer

A full-stack MERN application that analyzes invoice data compliance against the GETS v0.1 standard.

## Features

- 3-step wizard interface (Context → Upload → Results)
- CSV/JSON file upload with parsing (max 200 rows)
- Field detection with similarity matching
- 5 compliance rule checks
- Scoring system (Data, Coverage, Rules, Posture, Overall)
- MongoDB persistence with 7-day retention
- Interactive results dashboard



## Tech Stack

- **MongoDB** - Document database for uploads and reports
- **Express.js** - RESTful API server
- **React** - Frontend UI with hooks
- **Node.js** - Runtime environment

## Database Setup

This application uses MongoDB with automatic TTL expiration after 7 days.


