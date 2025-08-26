import {jest} from '@jest/globals';

// Mock child_process
const mockExecSync = jest.fn();
jest.mock('child_process', () => ({
  execSync: mockExecSync,
}));

// Test data definitions
const VALID_APP_VARIANTS = [
  'development',
  'production',
  'releaseCandidate',
  'preRelease',
] as const;

type AppVariant = (typeof VALID_APP_VARIANTS)[number];

// Test cases with inputs and expected outputs
const TEST_CASES = [
  // Development variants
  {
    pkgVersion: '1.0.0',
    appVariant: 'development',
    expectedName: 'CoMapeo Dev',
    expectedPackage: 'com.comapeo.dev',
    expectedVersion: '0.0-dev+1234567',
  },
  {
    pkgVersion: '1.6.0',
    appVariant: 'development',
    expectedName: 'CoMapeo Dev',
    expectedPackage: 'com.comapeo.dev',
    expectedVersion: '6.0-dev+1234567',
  },
  {
    pkgVersion: '2.1.3',
    appVariant: 'development',
    expectedName: 'CoMapeo Dev',
    expectedPackage: 'com.comapeo.dev',
    expectedVersion: '1.3-dev+1234567',
  },
  {
    pkgVersion: '10.25.99',
    appVariant: 'development',
    expectedName: 'CoMapeo Dev',
    expectedPackage: 'com.comapeo.dev',
    expectedVersion: '25.99-dev+1234567',
  },

  // Production variants
  {
    pkgVersion: '1.0.0',
    appVariant: 'production',
    expectedName: 'CoMapeo',
    expectedPackage: 'com.comapeo',
    expectedVersion: '0.0',
  },
  {
    pkgVersion: '1.6.0',
    appVariant: 'production',
    expectedName: 'CoMapeo',
    expectedPackage: 'com.comapeo',
    expectedVersion: '6.0',
  },
  {
    pkgVersion: '2.1.3',
    appVariant: 'production',
    expectedName: 'CoMapeo',
    expectedPackage: 'com.comapeo',
    expectedVersion: '1.3',
  },
  {
    pkgVersion: '10.25.99',
    appVariant: 'production',
    expectedName: 'CoMapeo',
    expectedPackage: 'com.comapeo',
    expectedVersion: '25.99',
  },

  // Release Candidate variants
  {
    pkgVersion: '1.0.0',
    appVariant: 'releaseCandidate',
    expectedName: 'CoMapeo RC',
    expectedPackage: 'com.comapeo.rc',
    expectedVersion: '0.0-rc+1234567',
  },
  {
    pkgVersion: '1.6.0',
    appVariant: 'releaseCandidate',
    expectedName: 'CoMapeo RC',
    expectedPackage: 'com.comapeo.rc',
    expectedVersion: '6.0-rc+1234567',
  },
  {
    pkgVersion: '2.1.3',
    appVariant: 'releaseCandidate',
    expectedName: 'CoMapeo RC',
    expectedPackage: 'com.comapeo.rc',
    expectedVersion: '1.3-rc+1234567',
  },

  // PreRelease variants
  {
    pkgVersion: '1.0.0',
    appVariant: 'preRelease',
    expectedName: 'CoMapeo Pre',
    expectedPackage: 'com.comapeo.pre',
    expectedVersion: '0.0-pre+1234567',
  },
  {
    pkgVersion: '1.6.0',
    appVariant: 'preRelease',
    expectedName: 'CoMapeo Pre',
    expectedPackage: 'com.comapeo.pre',
    expectedVersion: '6.0-pre+1234567',
  },
  {
    pkgVersion: '2.1.3',
    appVariant: 'preRelease',
    expectedName: 'CoMapeo Pre',
    expectedPackage: 'com.comapeo.pre',
    expectedVersion: '1.3-pre+1234567',
  },

  // Test with pre-release package versions (should still use same minor.patch)
  {
    pkgVersion: '1.6.0-pre',
    appVariant: 'development',
    expectedName: 'CoMapeo Dev',
    expectedPackage: 'com.comapeo.dev',
    expectedVersion: '6.0-dev+1234567',
  },
  {
    pkgVersion: '1.6.0-dev',
    appVariant: 'production',
    expectedName: 'CoMapeo',
    expectedPackage: 'com.comapeo',
    expectedVersion: '6.0',
  },
  {
    pkgVersion: '1.6.0-rc.1',
    appVariant: 'releaseCandidate',
    expectedName: 'CoMapeo RC',
    expectedPackage: 'com.comapeo.rc',
    expectedVersion: '6.0-rc+1234567',
  },
] as const;

describe('app.config.ts', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules and environment
    jest.resetModules();
    jest.clearAllMocks();
    process.env = {...originalEnv};

    // Mock git commit SHA
    mockExecSync.mockReturnValue(
      Buffer.from('1234567890abcdef1234567890abcdef12345678\n'),
    );
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // Helper function to get config with mocked package version
  const getConfigWithPackageVersion = (packageVersion: string) => {
    // Mock the package.json module before requiring app.config.ts
    jest.doMock('./package.json', () => ({
      version: packageVersion,
    }));

    // Import the config function
    const configModule = require('./app.config.ts');
    return configModule;
  };

  describe.each(TEST_CASES)(
    'package.json: $pkgVersion, APP_VARIANT: $appVariant',
    ({
      pkgVersion,
      appVariant,
      expectedName,
      expectedPackage,
      expectedVersion,
    }) => {
      it('should generate correct configuration', () => {
        // Set environment
        process.env.APP_VARIANT = appVariant;
        delete process.env.APP_VERSION; // Use generated version

        // Get config function with mocked package.json
        const configFunction = getConfigWithPackageVersion(pkgVersion);

        // Call the config function
        const inputConfig = {
          name: 'TestApp',
          version: '1.0.0',
          extra: {},
          ios: {},
          android: {},
        };

        const result = configFunction({config: inputConfig});

        // Assertions
        expect(result.name).toBe(expectedName);
        expect(result.android.package).toBe(expectedPackage);
        expect(result.version).toBe(expectedVersion);

        // Additional checks
        expect(result.ios.bundleIdentifier).toBe(expectedPackage);
        expect(result.extra.eas.projectId).toBe(
          '2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
        );
        expect(result.updates.url).toBe(
          'https://u.expo.dev/2d5b8137-12ec-45aa-9c23-56b6a1c522b7',
        );
        expect(result.runtimeVersion.policy).toBe('appVersion');
      });
    },
  );

  describe('with custom APP_VERSION environment variable', () => {
    const customVersionTestCases = [
      {
        appVersion: '1.0',
        appVariant: 'development',
        expectedName: 'CoMapeo Dev',
        expectedPackage: 'com.comapeo.dev',
      },
      {
        appVersion: '2.5-dev.1',
        appVariant: 'development',
        expectedName: 'CoMapeo Dev',
        expectedPackage: 'com.comapeo.dev',
      },
      {
        appVersion: '1.0-rc',
        appVariant: 'releaseCandidate',
        expectedName: 'CoMapeo RC',
        expectedPackage: 'com.comapeo.rc',
      },
      {
        appVersion: '3.1-pre.5',
        appVariant: 'preRelease',
        expectedName: 'CoMapeo Pre',
        expectedPackage: 'com.comapeo.pre',
      },
    ];

    it.each(customVersionTestCases)(
      'should use APP_VERSION=$appVersion for $appVariant variant',
      ({appVersion, appVariant, expectedName, expectedPackage}) => {
        // Set environment
        process.env.APP_VARIANT = appVariant;
        process.env.APP_VERSION = appVersion;

        // Get config function (package.json version shouldn't be used)
        const configFunction = getConfigWithPackageVersion('1.0.0');

        // Call the config function
        const inputConfig = {
          name: 'TestApp',
          version: '1.0.0',
          extra: {},
          ios: {},
          android: {},
        };

        const result = configFunction({config: inputConfig});

        // Should use the custom APP_VERSION exactly
        expect(result.version).toBe(appVersion);
        expect(result.name).toBe(expectedName);
        expect(result.android.package).toBe(expectedPackage);
      },
    );
  });

  describe('error handling', () => {
    it('should throw error for invalid APP_VARIANT', () => {
      process.env.APP_VARIANT = 'invalid';

      expect(() => {
        getConfigWithPackageVersion('1.0.0');
      }).toThrow(
        'Invalid APP_VARIANT: invalid. Must be one of: development, production, releaseCandidate, preRelease.',
      );
    });

    it('should throw error for invalid APP_VERSION format', () => {
      process.env.APP_VARIANT = 'development';
      process.env.APP_VERSION = 'invalid-version';

      expect(() => {
        getConfigWithPackageVersion('1.0.0');
      }).toThrow(/Invalid APP_VERSION: invalid-version/);
    });

    it('should throw error for invalid package.json version', () => {
      process.env.APP_VARIANT = 'development';
      delete process.env.APP_VERSION;

      const configFunction = getConfigWithPackageVersion('invalid');

      expect(() => {
        configFunction({
          config: {
            name: 'Test',
            version: '1.0.0',
            extra: {},
            ios: {},
            android: {},
          },
        });
      }).toThrow('Invalid package version format: invalid');
    });

    it('should handle missing git repo gracefully', () => {
      process.env.APP_VARIANT = 'development';
      delete process.env.APP_VERSION;
      delete process.env.EAS_BUILD_GIT_COMMIT_HASH;

      // Mock execSync to throw error (simulating no git repo)
      mockExecSync.mockImplementation(() => {
        throw new Error('Not a git repository');
      });

      const configFunction = getConfigWithPackageVersion('1.6.0');

      const result = configFunction({
        config: {
          name: 'Test',
          version: '1.0.0',
          extra: {},
          ios: {},
          android: {},
        },
      });

      // Should generate version without commit SHA
      expect(result.version).toBe('6.0-dev');
    });
  });

  describe('production variant specifics', () => {
    it('should not include commit SHA in production builds', () => {
      process.env.APP_VARIANT = 'production';
      delete process.env.APP_VERSION;

      const configFunction = getConfigWithPackageVersion('1.6.0');

      const result = configFunction({
        config: {
          name: 'Test',
          version: '1.0.0',
          extra: {},
          ios: {},
          android: {},
        },
      });

      // Should not include commit SHA for production
      expect(result.version).toBe('6.0');
      expect(result.version).not.toContain('+');
    });
  });

  describe('EAS_BUILD_GIT_COMMIT_HASH environment variable', () => {
    it('should use EAS_BUILD_GIT_COMMIT_HASH when available', () => {
      process.env.APP_VARIANT = 'development';
      process.env.EAS_BUILD_GIT_COMMIT_HASH =
        'abcdef1234567890abcdef1234567890abcdef12';
      delete process.env.APP_VERSION;

      const configFunction = getConfigWithPackageVersion('1.6.0');

      const result = configFunction({
        config: {
          name: 'Test',
          version: '1.0.0',
          extra: {},
          ios: {},
          android: {},
        },
      });

      // Should use EAS commit hash instead of git command
      expect(result.version).toBe('6.0-dev+abcdef1');
      expect(mockExecSync).not.toHaveBeenCalled();
    });
  });
});
