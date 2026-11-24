import {
  millisecondsToHHMMSS,
  millisecondsToMMSS,
} from './millisecondsToFormattedTime';

const oneHour = 3600000;
const oneMinute = 60000;
const oneSecond = 1000;

describe('msToHHMMSS', () => {
  it('should convert milliseconds to hh:mm:ss format', () => {
    expect(
      millisecondsToHHMMSS(oneHour + oneMinute * 23 + oneSecond * 18),
    ).toBe('01:23:18');
    expect(millisecondsToHHMMSS(oneHour)).toBe('01:00:00');
    expect(millisecondsToHHMMSS(oneMinute)).toBe('00:01:00');
    expect(millisecondsToHHMMSS(oneSecond)).toBe('00:00:01');
    expect(millisecondsToHHMMSS(0)).toBe('00:00:00');
  });

  it('should pad single digit hours, minutes, and seconds with leading zeros', () => {
    expect(millisecondsToHHMMSS(5000)).toBe('00:00:05');
    expect(millisecondsToHHMMSS(59000)).toBe('00:00:59');
    expect(millisecondsToHHMMSS(3601000)).toBe('01:00:01');
  });
});

describe('show conver to format mmss', () => {
  it('should convert milliseconds to mm:ss format', () => {
    expect(millisecondsToMMSS(oneMinute * 83 + oneSecond * 20)).toBe('83:20'); // 83 minutes 20 seconds
    expect(millisecondsToMMSS(oneMinute)).toBe('01:00'); // 1 minute
    expect(millisecondsToMMSS(oneSecond)).toBe('00:01'); // 1 second
    expect(millisecondsToMMSS(0)).toBe('00:00'); // 0 milliseconds
  });

  it('should pad single digit minutes and seconds with leading zeros', () => {
    expect(millisecondsToMMSS(5000)).toBe('00:05'); // 5 seconds
    expect(millisecondsToMMSS(59000)).toBe('00:59'); // 59 seconds
    expect(millisecondsToMMSS(120000)).toBe('02:00'); // 2 minutes
  });
});
