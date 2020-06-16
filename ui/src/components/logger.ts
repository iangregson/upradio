// With big thanks to PeerJS

const LOG_PREFIX = 'UpRadio';

/*
Prints log messages depending on the debug level passed in. Defaults to 0.
0  Prints no logs.
1  Prints only errors.
2  Prints errors and warnings.
3  Prints all logs.
*/
export enum LogLevel {
  Disabled,
  Errors,
  Warnings,
  All
}

export class Logger {
  private logLevel = LogLevel.Disabled;
  
  constructor(logLevel?: LogLevel) {
    this.logLevel = logLevel || LogLevel.Disabled;
  }

  log(...args: any[]) {
    if (this.logLevel >= LogLevel.All) {
      this._print('log', ...args);
    }
  }
  
  debug(...args: any[]) {
    if (this.logLevel >= LogLevel.All) {
      this._print('debug', ...args);
    }
  }
  
  info(...args: any[]) {
    if (this.logLevel >= LogLevel.All) {
      this._print('info', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.logLevel >= LogLevel.Warnings) {
      this._print('warn', ...args);
    }
  }

  error(...args: any[]) {
    if (this.logLevel >= LogLevel.Errors) {
      this._print('error', ...args);
    }
  }

  private _print(level: string, ...rest: any[]): void {
    const copy = [`${LOG_PREFIX} ${level.toUpperCase()} ::`, ...rest];

    for (let i in copy) {
      if (copy[i] instanceof Error) {
        copy[i] = "(" + copy[i].name + ") " + copy[i].message;

      }
    }
    console[level](...copy);
  }
}

export default new Logger();