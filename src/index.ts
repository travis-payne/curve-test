import { runIngestion } from './ingestion';

runIngestion().then(() => {
    console.log('Ingestion completed');
}).catch((error) => {
    console.error('Ingestion failed', error);
});