# Curve Test Application

A TypeScript-based application for processing and analyzing curve data, built with TypeScript, Node.js and MongoDB.

## Technologies Used

- **TypeScript**: v5.8.3
- **Node.js**: v22.15.0
- **MongoDB**: v8.14.1 (via Mongoose)
- **Testing Framework**: Mocha v11.2.2 with Chai v5.2.0 and Sinon v20.0.0

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js v22.15.0
- MongoDB (running locally or accessible via connection string)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd curve-test
```

2. Install dependencies:
```bash
npm install
```

3. Ensure your instance of Mongo DB is running, and write your connection string in the consts.ts file.
```
export const MONGODB_URI = 'mongodb://localhost:27017/curve';

```

## Available Scripts

- `npm run build` - Compiles TypeScript to JavaScript
- `npm start` - Runs the compiled JavaScript
- `npm run dev` - Runs the application in development mode with hot-reload
- `npm run debug` - Runs the application in debug mode
- `npm test` - Runs the test suite

## Project Structure

```
├── src/           # Source files
├── dist/          # Compiled JavaScript
├── tests/         # Test files
├── data/          # Data files
└── .vscode/       # VS Code configuration
```