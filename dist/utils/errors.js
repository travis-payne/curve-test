"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTracker = void 0;
const logger_1 = __importDefault(require("./logger"));
/**
 * Tracks and logs errors that occur during data ingestion
 */
class ErrorTracker {
    rowErrors = new Map();
    addMissingFieldError(line, field) {
        this.addError(line, `Missing required field: ${field}`);
    }
    addContractNotFoundError(line, contractName) {
        this.addError(line, `Contract not found: ${contractName}`);
    }
    addError(line, errorMessage) {
        if (!this.rowErrors.has(line)) {
            this.rowErrors.set(line, []);
        }
        this.rowErrors.get(line)?.push(errorMessage);
    }
    getErrors() {
        const result = [];
        this.rowErrors.forEach((errors, line) => {
            result.push({ line, errors });
        });
        return result;
    }
    getErrorsForLine(line) {
        return this.rowErrors.get(line);
    }
    hasErrors() {
        return this.rowErrors.size > 0;
    }
    hasErrorsForLine(line) {
        return this.rowErrors.has(line);
    }
    getErrorArray() {
        return Array.from(this.rowErrors.entries()).map(([line, errors]) => ({ line, errors }));
    }
    logErrors() {
        if (this.hasErrors()) {
            const errorsArray = this.getErrors();
            let errorMessage = 'Errors occurred during ingestion:';
            errorsArray.forEach(rowError => {
                errorMessage += `\n${JSON.stringify(rowError)}`;
            });
            logger_1.default.error(errorMessage);
        }
        else {
            logger_1.default.info('No errors occurred during ingestion.');
        }
    }
}
exports.ErrorTracker = ErrorTracker;
