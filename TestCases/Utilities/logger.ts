import { Page } from "@playwright/test";
import fs from "fs";

function formatTimestampForFileAndLog() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}-${String(now.getMilliseconds()).padStart(3, "0")}`;
}

export function createLogger(testTitle: string, projectName: string) {
  const logDir = "logs";
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const timestamp = formatTimestampForFileAndLog();
  const safeTitle = testTitle.replace(/[^\w\d-]/g, "_");
  const safeProject = projectName.replace(/[^\w\d-]/g, "_");
  const logFilePath = `${logDir}/-${safeTitle}-${safeProject}-${timestamp}.log`;
  const deploymentName = `${safeTitle}-${safeProject}-${timestamp}`;

  function logToFile(message: string) {
    const logTimestamp = formatTimestampForFileAndLog();
    fs.appendFileSync(logFilePath, `[${logTimestamp}] ${message}\n`);
  }

  return {
    logToFile,
    deploymentName
  };
}

export function createLoggedPage(page: Page, logFn: (msg: string) => void): Page {
  const wrapLocator = (locator: any): any => {
    return new Proxy(locator, {
      get(target: any, prop: string) {
        const orig = target[prop];
        if (typeof orig === "function") {
          return (...args: any[]) => {
            let argDetails = "";
            try {
              argDetails = JSON.stringify(args);
            } catch {
              argDetails = "[Unserializable arguments]";
            }

            logFn(`Calling locator.${prop} with args: ${argDetails}`);
            const result = orig.apply(target, args);

            if (result instanceof Promise) {
              return result.then((res) => {
                try {
                  if (typeof res === "string" || typeof res === "number" || typeof res === "boolean") {
                    logFn(`→ locator.${prop} returned: ${JSON.stringify(res)}`);
                  }
                } catch {
                  logFn(`→ locator.${prop} returned: [Unserializable]`);
                }
                return res;
              });
            }

            if (result && typeof result === "object" && typeof result["click"] === "function") {
              return wrapLocator(result);
            }

            return result;
          };
        }
        return orig;
      },
    });
  };

  const loggedPage = new Proxy(page, {
    get(target: any, prop: string) {
      if (prop === "keyboard") {
        return new Proxy(target.keyboard, {
          get(kbTarget: any, kbProp: string) {
            const origKb = kbTarget[kbProp];
            if (typeof origKb === "function") {
              return (...args: any[]) => {
                let argDetails = "";
                try {
                  argDetails = JSON.stringify(args);
                } catch {
                  argDetails = "[Unserializable arguments]";
                }
                logFn(`Calling keyboard.${kbProp} with args: ${argDetails}`);
                return origKb.apply(kbTarget, args);
              };
            }
            return origKb;
          },
        });
      }

      const orig = target[prop];
      if (typeof orig === "function") {
        return (...args: any[]) => {
          let argDetails = "";
          try {
            argDetails = JSON.stringify(args);
          } catch {
            argDetails = "[Unserializable arguments]";
          }

          logFn(`Calling page.${prop} with args: ${argDetails}`);

          const result = orig.apply(target, args);

          if (result && typeof result === "object" && typeof result["click"] === "function") {
            return wrapLocator(result);
          }

          if (result instanceof Promise) {
            return result.then((res) => {
              try {
                if (typeof res === "string" || typeof res === "number" || typeof res === "boolean") {
                  logFn(`→ page.${prop} returned: ${JSON.stringify(res)}`);
                }
              } catch {
                logFn(`→ page.${prop} returned: [Unserializable]`);
              }
              return res;
            });
          }

          return result;
        };
      }
      return orig;
    },
  });

  return loggedPage;
}
