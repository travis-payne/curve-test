import logger from './logger';

export interface RowErrors {
  line: number;
  errors: string[];
}

/**
 * Tracks and logs errors that occur during data ingestion
 */
export class ErrorTracker {
  private rowErrors: Map<number, string[]> = new Map();

  addMissingFieldError(line: number, field: string): void {
    this.addError(line, `Missing required field: ${field}`);
  }

  addContractNotFoundError(line: number, contractName: string): void {
    this.addError(line, `Contract not found: ${contractName}`);
  }

  private addError(line: number, errorMessage: string): void {
    if (!this.rowErrors.has(line)) {
      this.rowErrors.set(line, []);
    }
    this.rowErrors.get(line)?.push(errorMessage);
  }

  getErrors(): RowErrors[] {
    const result: RowErrors[] = [];
    this.rowErrors.forEach((errors, line) => {
      result.push({ line, errors });
    });
    return result;
  }

  getErrorsForLine(line: number): string[] | undefined {
    return this.rowErrors.get(line);
  }


  hasErrors(): boolean {
    return this.rowErrors.size > 0;
  }

  hasErrorsForLine(line: number): boolean {
    return this.rowErrors.has(line);
  }

  getErrorArray(): RowErrors[] {
    return Array.from(this.rowErrors.entries()).map(([line, errors]) => ({ line, errors }));
  }

  logErrors(): void {
    if (this.hasErrors()) {
      const errorsArray = this.getErrors();
      let errorMessage = 'Errors occurred during ingestion:';
      
      errorsArray.forEach(rowError => {
        errorMessage += `\n${JSON.stringify(rowError)}`;
      });
      
      logger.error(errorMessage);
    } else {
      logger.info('No errors occurred during ingestion.');
    }
  }
}