// Storage interface for quote calculator
// This is a simple app that doesn't require persistent storage
// All calculations are done on the fly

export interface IStorage {
  // Placeholder for future storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for this simple calculator app
  }
}

export const storage = new MemStorage();
