import {detectFreshInstall} from './freshInstall';

function createFakeStorage(initialKeys: string[] = []) {
  const keys = new Set(initialKeys);

  return {
    contains: (key: string) => keys.has(key),
    set: (key: string) => {
      keys.add(key);
    },
    get length() {
      return keys.size;
    },
  };
}

test('empty storage is a fresh install, and only the first time', () => {
  const storage = createFakeStorage();

  expect(detectFreshInstall(storage)).toBe(true);
  expect(detectFreshInstall(storage)).toBe(false);
});

test('existing install predating the marker is not a fresh install', () => {
  const storage = createFakeStorage(['ActiveProjectId']);

  expect(detectFreshInstall(storage)).toBe(false);
  expect(detectFreshInstall(storage)).toBe(false);
});
