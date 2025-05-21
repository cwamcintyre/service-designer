export class LogHandler {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debug(message: string, data: any): void {
        if (process.env.DEBUG) {
            console.debug(`[${new Date().toISOString()}] ${message}`, data);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static log(message: string, data: any): void {
        console.log(`[${new Date().toISOString()}] ${message}`, data);
    }

    static error(message: string, error: Error): void {
        console.error(`[${new Date().toISOString()}] ${message}`, error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static warn(message: string, data: any): void {
        console.warn(`[${new Date().toISOString()}] ${message}`, data);
    }
}