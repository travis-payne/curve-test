"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ingestion_1 = require("./ingestion");
(0, ingestion_1.runIngestion)().then(() => {
    console.log('Ingestion completed');
}).catch((error) => {
    console.error('Ingestion failed', error);
});
