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