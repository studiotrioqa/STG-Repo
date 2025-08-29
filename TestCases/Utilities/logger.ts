import { Page } from '@playwright/test';
import fs from 'fs';

function formatTimestampForFileAndLog() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}-${String(now.getMilliseconds()).padStart(3, '0')}`;
}

export class LoggedPage {
  readonly page: Page;
  readonly logToFile: (msg: string) => void;
  readonly deploymentName: string;
  readonly timestamp = formatTimestampForFileAndLog();

  constructor(basePage: Page, testTitle: string, projectName: string) {
    const timestamp = formatTimestampForFileAndLog();
    const safeTitle = testTitle.replace(/[^\w\d-]/g, '_');
    const safeProject = projectName.replace(/[^\w\d-]/g, '_');

    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const logFilePath = `${logDir}/-${safeTitle}-${safeProject}-${timestamp}.log`;
    this.deploymentName = `${safeTitle}-${safeProject}-${timestamp}`;

    this.logToFile = (message: string) => {
      const logTimestamp = formatTimestampForFileAndLog();
      fs.appendFileSync(logFilePath, `[${logTimestamp}] ${message}\n`);
    };

    this.page = this._wrapPage(basePage);
  }

  private _wrapLocator(locator: any): any {
    return new Proxy(locator, {
      get: (target, prop) => {
        const orig = target[prop];
        if (typeof orig === 'function') {
          return (...args: any[]) => {
            this._log(`Calling locator.${String(prop)} with args: ${this._serialize(args)}`);
            const result = orig.apply(target, args);
            return this._handleResult(result, `locator.${String(prop)}`);
          };
        }
        return orig;
      },
    });
  }

  private _wrapPage(page: Page): Page {
    return new Proxy(page, {
      get: (target: any, prop: string) => {
        if (prop === 'keyboard') {
          return new Proxy(target.keyboard, {
            get: (kbTarget: any, kbProp: string) => {
              const orig = kbTarget[kbProp];
              if (typeof orig === 'function') {
                return (...args: any[]) => {
                  this._log(`Calling keyboard.${kbProp} with args: ${this._serialize(args)}`);
                  return orig.apply(kbTarget, args);
                };
              }
              return orig;
            },
          });
        }

        const orig = target[prop];
        if (typeof orig === 'function') {
          return (...args: any[]) => {
            this._log(`Calling page.${prop} with args: ${this._serialize(args)}`);
            const result = orig.apply(target, args);
            return this._handleResult(result, `page.${prop}`);
          };
        }

        return orig;
      },
    });
  }

  private _handleResult(result: any, context: string) {
    if (result instanceof Promise) {
      return result.then((res) => {
        this._logReturnValue(context, res);
        return res;
      });
    }

    if (result && typeof result === 'object' && typeof result['click'] === 'function') {
      return this._wrapLocator(result);
    }

    this._logReturnValue(context, result);
    return result;
  }

  private _logReturnValue(context: string, result: any) {
    try {
      if (['string', 'number', 'boolean'].includes(typeof result)) {
        this._log(`→ ${context} returned: ${JSON.stringify(result)}`);
      }
    } catch {
      this._log(`→ ${context} returned: [Unserializable]`);
    }
  }

  private _serialize(args: any[]): string {
    try {
      return JSON.stringify(args);
    } catch {
      return '[Unserializable arguments]';
    }
  }

  private _log(message: string) {
    this.logToFile(message);
  }
}
