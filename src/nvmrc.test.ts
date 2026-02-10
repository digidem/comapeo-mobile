import * as fs from 'node:fs/promises';
import * as path from 'node:path';

describe('.nvmrc files', () => {
  let rootNvmrcVersion: string;
  let backendNvmrcVersion: string;

  beforeAll(async () => {
    const rootPath = path.resolve(__dirname, '..');
    const rootNvmrcPath = path.join(rootPath, '.nvmrc');
    const backendNvmrcPath = path.join(rootPath, 'src', 'backend', '.nvmrc');

    [rootNvmrcVersion, backendNvmrcVersion] = await Promise.all([
      fs.readFile(rootNvmrcPath, 'utf8'),
      fs.readFile(backendNvmrcPath, 'utf8'),
    ]);

    rootNvmrcVersion = rootNvmrcVersion.trim();
    backendNvmrcVersion = backendNvmrcVersion.trim();
  });

  it('backend .nvmrc matches root .nvmrc', () => {
    expect(backendNvmrcVersion).toBe(rootNvmrcVersion);
  });
});
