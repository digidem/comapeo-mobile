import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as semver from 'semver';

describe('frontend package.json', () => {
  let allFrontendDependencies: Record<string, string>;

  beforeAll(async () => {
    const rootPath = path.resolve(__dirname, '..', '..');
    const frontendPackageJsonPath = path.join(rootPath, 'package.json');
    allFrontendDependencies = await readAllDependencies(
      frontendPackageJsonPath,
    );
  });

  it('all front end dependencies use exact version', () => {
    for (const version of Object.values(allFrontendDependencies)) {
      const isExact = semver.valid(version) !== null;
      expect(isExact).toBe(true);
    }
  });
});

async function readAllDependencies(
  packageJsonPath: string,
): Promise<Record<string, string>> {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const {dependencies = {}, devDependencies = {}} = packageJson;
  const allDependencies: Record<string, string> = {
    ...dependencies,
    ...devDependencies,
  };

  return allDependencies;
}
