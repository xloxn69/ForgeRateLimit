| Function | Description |
|----------|-------------|
| `$estimateCost` | Estimates the token cost for a list of actions |
| `$reserveTokens` | Reserves tokens from buckets for rate limiting |
| `$refundTokens` | Refunds tokens to buckets after operation completion |
| `$getBucketInfo` | Gets information about a rate limiting bucket |
| `$addToQueue` | Adds a job to the rate limiting queue |
| `$getRateLimitStats` | Gets comprehensive rate limiting statistics |
| `$eventData` | Returns the event data for rate limiting events |
| `$throttleReason` | Returns the reason for throttling in throttled events |
| `$eventTimestamp` | Returns the timestamp of the rate limiting event |
| `$openCircuitBreaker` | Opens a circuit breaker for a specific flow to prevent execution |
| `$checkCircuitBreaker` | Checks if a circuit breaker is open for a specific flow |
| `$processQueue` | Processes queued jobs using weighted fair queuing by flow |
| `$finishJob` | Marks a job as finished and removes it from running jobs |
| `$checkSurgeGuard` | Checks and manages surge guard system for queue wait times |
| `$setPriority` | Sets priority for an action (moderation > system > messaging > heavy) |
| `$calculateETA` | Calculates ETA across multiple rate limiting buckets |
| `$checkConcurrency` | Checks if concurrency limits allow execution |
| `$startRun` | Starts a new run and tracks it in concurrency system |