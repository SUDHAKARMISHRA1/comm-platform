import { execFile, spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import type { ExecutionResult, LanguageKey } from './types';

const execFileAsync = promisify(execFile);

const binCache = new Map<string, string>();

async function resolveBin(name: string): Promise<string> {
  const cached = binCache.get(name);
  if (cached) return cached;
  if (process.platform !== 'win32') {
    binCache.set(name, name);
    return name;
  }
  try {
    const { stdout } = await execFileAsync('where', [name]);
    const path = stdout.split(/\r?\n/).map((l) => l.trim()).find((l) => l.length > 0);
    if (!path) throw new Error(`Command not found: ${name}`);
    binCache.set(name, path);
    return path;
  } catch {
    throw new Error(`${name} is not installed`);
  }
}

type ProcResult = { code: number | null; stdout: string; stderr: string; timedOut: boolean };

function runCommand(
  command: string,
  args: string[],
  options: { cwd: string; stdin?: string; timeoutMs: number },
): Promise<ProcResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, options.timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: err.message, timedOut: false });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });

    if (options.stdin) child.stdin.write(options.stdin);
    child.stdin.end();
  });
}

export async function executeLocally(
  language: LanguageKey,
  sourceCode: string,
  stdin: string,
): Promise<ExecutionResult> {
  const dir = await mkdtemp(join(tmpdir(), 'comm-code-'));
  const started = Date.now();
  try {
    if (language === 'java') {
      await writeFile(join(dir, 'Main.java'), sourceCode, 'utf8');
      const compiled = await runCommand(await resolveBin('javac'), ['Main.java'], { cwd: dir, timeoutMs: 15_000 });
      if (compiled.timedOut) {
        return { status: 'TIME_LIMIT_EXCEEDED', stdout: '', stderr: 'Compilation timed out', compileOutput: '', executionTime: 0, memory: 0 };
      }
      if (compiled.code !== 0) {
        return {
          status: 'COMPILATION_ERROR',
          stdout: '',
          stderr: compiled.stderr,
          compileOutput: (compiled.stderr || compiled.stdout).trim(),
          executionTime: 0,
          memory: 0,
        };
      }
      const run = await runCommand(await resolveBin('java'), ['-cp', dir, 'Main'], { cwd: dir, stdin, timeoutMs: 8_000 });
      return mapLocalRun(run, started);
    }

    const isCpp = language === 'cpp';
    const src = isCpp ? 'main.cpp' : 'main.c';
    const compiler = isCpp ? 'g++' : 'gcc';
    await writeFile(join(dir, src), sourceCode, 'utf8');
    const compiled = await runCommand(await resolveBin(compiler), [src, '-O2', '-o', 'main'], {
      cwd: dir,
      timeoutMs: 15_000,
    });
    if (compiled.code === 1 && compiled.stderr.includes('not recognized')) {
      throw new Error(`${compiler} is not installed`);
    }
    if (compiled.timedOut) {
      return { status: 'TIME_LIMIT_EXCEEDED', stdout: '', stderr: 'Compilation timed out', compileOutput: '', executionTime: 0, memory: 0 };
    }
    if (compiled.code !== 0) {
      return {
        status: 'COMPILATION_ERROR',
        stdout: '',
        stderr: compiled.stderr,
        compileOutput: (compiled.stderr || compiled.stdout).trim(),
        executionTime: 0,
        memory: 0,
      };
    }
    const binary = process.platform === 'win32' ? join(dir, 'main.exe') : join(dir, 'main');
    const run = await runCommand(binary, [], { cwd: dir, stdin, timeoutMs: 8_000 });
    return mapLocalRun(run, started);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

function mapLocalRun(run: ProcResult, started: number): ExecutionResult {
  const executionTime = (Date.now() - started) / 1000;
  if (run.timedOut) {
    return { status: 'TIME_LIMIT_EXCEEDED', stdout: run.stdout, stderr: 'Time limit exceeded', compileOutput: '', executionTime, memory: 0 };
  }
  if (run.code !== 0) {
    return {
      status: 'RUNTIME_ERROR',
      stdout: run.stdout,
      stderr: (run.stderr || 'Runtime error').trim(),
      compileOutput: '',
      executionTime,
      memory: 0,
    };
  }
  return {
    status: 'ACCEPTED',
    stdout: run.stdout,
    stderr: run.stderr,
    compileOutput: '',
    executionTime,
    memory: 12000,
  };
}
