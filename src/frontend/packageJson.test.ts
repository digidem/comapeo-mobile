import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as semver from 'semver';

describe('frontend package.json', () => {
  let frontendMapeoDependencies: Record<string, string>;
  let backendMapeoDependencies: Record<string, string>;

  beforeAll(async () => {
    const rootPath = path.resolve(__dirname, '..', '..');
    const frontendPackageJsonPath = path.join(rootPath, 'package.json');
    const backendPackageJsonPath = path.join(
      rootPath,
      'src',
      'backend',
      'package.json',
    );
    [frontendMapeoDependencies, backendMapeoDependencies] = await Promise.all([
      readMapeoDependencies(frontendPackageJsonPath),
      readMapeoDependencies(backendPackageJsonPath),
    ]);
  });

  it('uses exact versions for @mapeo dependencies', () => {
    for (const version of Object.values(frontendMapeoDependencies)) {
      const isExact = semver.valid(version) !== null;
      expect(isExact).toBe(true);
    }
  });

  it('uses versions of @mapeo dependencies that match their backend counterparts', () => {
    for (const [dependency, frontendVersion] of Object.entries(
      frontendMapeoDependencies,
    )) {
      const backendVersion = backendMapeoDependencies[dependency];
      if (!backendVersion) continue;
      expect(semver.satisfies(frontendVersion, backendVersion)).toBe(true);
    }
  });
});

async function readMapeoDependencies(
  packageJsonPath: string,
): Promise<Record<string, string>> {
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const {dependencies = {}, devDependencies = {}} = packageJson;
  const allDependencies: Record<string, string> = {
    ...dependencies,
    ...devDependencies,
  };
  const mapeoEntries = Object.entries(allDependencies).filter(
    ([dependency]) =>
      dependency.startsWith('@mapeo/') || dependency.startsWith('@comapeo/'),
  );
  return Object.fromEntries(mapeoEntries);
}
