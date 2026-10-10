interface RateLimitEntry {
  timestamps: number[];
}

const rateLimits = new Map<string, RateLimitEntry>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, { timestamps: [now] });
    return { success: true, remaining: limit - 1 };
  }

  const entry = rateLimits.get(ip)!;
  // Filter out expired timestamps
  const validTimestamps = entry.timestamps.filter(ts => now - ts < windowMs);
  
  if (validTimestamps.length >= limit) {
    entry.timestamps = validTimestamps; // Update map
    return { success: false, remaining: 0 };
  }
  
  validTimestamps.push(now);
  entry.timestamps = validTimestamps;
  return { success: true, remaining: limit - validTimestamps.length };
}

// Clean up old entries periodically to prevent memory leak (e.g. every hour)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimits.entries()) {
      // If we don't have the windowMs for cleanup, we might be a bit aggressive.
      // Let's assume max window is 1 hour (3600000 ms) for cleanup purposes.
      const validTimestamps = entry.timestamps.filter(ts => now - ts < 3600000);
      if (validTimestamps.length === 0) {
        rateLimits.delete(ip);
      } else {
        entry.timestamps = validTimestamps;
      }
    }
  }, 1000 * 60 * 60);
}
