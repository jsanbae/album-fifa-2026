export class Logger {
  static info(message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  }

  static error(message: string, meta?: Record<string, unknown>): void {
    console.error(
      JSON.stringify({ level: 'error', message, ...meta, timestamp: new Date().toISOString() }),
    );
  }

  static warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(
      JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }),
    );
  }
}
