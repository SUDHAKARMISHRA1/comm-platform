/** Scoped console logger (`[time] [LEVEL] [scope] message`). */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function timestamp(): string {
  return new Date().toISOString();
}

export function createLogger(scope: string, minLevel: LogLevel = 'info') {
  const emit = (level: LogLevel, message: string, extra?: unknown) => {
    if (levelOrder[level] < levelOrder[minLevel]) {
      return;
    }

    const payload = extra === undefined ? '' : extra;
    const line = `[${timestamp()}] [${level.toUpperCase()}] [${scope}] ${message}`;

    if (level === 'error') {
      console.error(line, payload);
      return;
    }
    if (level === 'warn') {
      console.warn(line, payload);
      return;
    }
    console.info(line, payload);
  };

  return {
    debug: (message: string, extra?: unknown) => emit('debug', message, extra),
    info: (message: string, extra?: unknown) => emit('info', message, extra),
    warn: (message: string, extra?: unknown) => emit('warn', message, extra),
    error: (message: string, extra?: unknown) => emit('error', message, extra),
  };
}
