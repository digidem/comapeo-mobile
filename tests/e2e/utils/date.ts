export function getShortFormattedDate(timezone: string): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function getLongFormattedDate(timezone: string): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type DeviceInfo = {
  timezone?: string;
  [key: string]: any;
};

export async function getDeviceTimezone(): Promise<string> {
  const deviceInfo = (await driver.execute('mobile:deviceInfo')) as DeviceInfo;

  return deviceInfo.timezone ?? 'UTC';
}
