export function createRateLimiter(limit: number, windowMs: number) {
  const buckets = new Map<string, number[]>();

  return {
    allow(key: string, now = Date.now()) {
      const recent = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
      if (recent.length >= limit) {
        buckets.set(key, recent);
        return false;
      }
      recent.push(now);
      buckets.set(key, recent);
      return true;
    },
  };
}

export const enquiryAddressLimiter = createRateLimiter(5, 15 * 60 * 1000);
