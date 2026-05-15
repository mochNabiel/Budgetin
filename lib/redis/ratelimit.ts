import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "@/lib/redis/redis"

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})
