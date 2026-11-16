export function millisecondsToHHMMSS(ms: number) {
  const hours = Math.floor(ms / 3600000); // 1 hour = 3600000 ms
  const minutes = Math.floor((ms % 3600000) / 60000); // 1 min = 60000 ms
  const seconds = Math.floor((ms % 60000) / 1000); // 1 sec = 1000 ms

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

export function millisecondsToMMSS(ms: number) {
  const minutes = Math.floor(ms / 60000); // 1 min = 60000 ms
  const seconds = Math.floor((ms % 60000) / 1000); // 1 sec = 1000 ms

  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}
