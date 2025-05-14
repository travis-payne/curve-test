import { runIngestion } from './ingestion';
import logger from './utils/logger';

runIngestion().then(() => {
    logger.info('Ingestion completed');
}).catch((error) => {
    logger.error('Ingestion failed', error);
});