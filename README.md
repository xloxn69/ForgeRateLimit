# ForgeRateLimit

ForgeRateLimit is a **production-grade rate limiting and queueing system** extension built for ForgeScript, providing enterprise-level token bucket rate limiting across multiple scopes with advanced features like circuit breakers, surge guards, and weighted fair queuing.

## Features

✨ **Multi-Scope Token Buckets** - Global, Guild, User, Flow, and Action-Type buckets  
🔄 **Weighted Fair Queuing** - Fair scheduling across flows with priority classes  
⚡ **Circuit Breakers** - Auto-pause flows with high error rates  
🛡️ **Surge Guards** - Automatic policy degradation during overload  
📊 **Real-time Events** - Comprehensive event system for monitoring  
🎯 **ETA Calculation** - Multi-bucket ETA reasoning with queue wait estimates  
⚙️ **Concurrency Control** - Per-guild and per-flow concurrency limits  
📈 **Priority Classes** - Moderation > System > Messaging > Heavy  

## Installation

```bash
npm install github:xloxn69/ForgeRateLimit
```

## Basic Usage

```javascript
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeRateLimit } = require("forge-ratelimit");

const client = new ForgeClient({
    extensions: [
        new ForgeRateLimit({
            events: ["tokenReserved", "throttled", "circuitBreaker"] // Optional events
        })
    ]
});
```

## Event System

ForgeRateLimit emits events that you can listen to in your bot:

```javascript
// In your bot setup
const rateLimitExtension = new ForgeRateLimit({
    events: ["tokenReserved", "throttled", "queued", "circuitBreaker", "surgeGuard"]
});

// Add event handlers
rateLimitExtension.commands.add({
    type: "throttled",
    code: `$log[⚠️ Throttled: $throttleReason - ETA: $eventData[eta]s]`
});

rateLimitExtension.commands.add({
    type: "circuitBreaker", 
    code: `$log[🔥 Circuit breaker $eventData[action] for flow $eventData[flowId]]`
});
```

## Functions

### Core Functions

#### `$estimateCost[actions]`
Estimates the token cost for a list of actions.

**Parameters:**
- `actions` (String) - Comma-separated list of action types

**Returns:** Number (total estimated cost)

**Example:**
```
$estimateCost[send_message,role_edit]
$c[Returns: 3 - send_message (1) + role_edit (2) = 3 tokens]
```

#### `$reserveTokens[guildId;userId;flowId;cost;actionTypes?]`
Reserves tokens from rate limiting buckets.

**Parameters:**
- `guildId` (String) - Guild ID
- `userId` (String) - User ID  
- `flowId` (String) - Flow ID
- `cost` (Number) - Token cost
- `actionTypes` (String, optional) - Action types

**Returns:** Boolean (true if reservation successful)

**Environment Variables Set:**
- `$env[rateLimitSuccess]` - "true" or "false"
- `$env[rateLimitReserved]` - Number of tokens reserved
- `$env[rateLimitReason]` - Reason if failed
- `$env[rateLimitEta]` - ETA in seconds until tokens available

**Example:**
```
$reserveTokens[$guildId;$authorId;test-flow;3;send_message]
$if[$env[rateLimitSuccess]==true]
  Reserved: $env[rateLimitReserved] tokens
$else
  Blocked: $env[rateLimitReason] (ETA: $env[rateLimitEta]s)
$endif
```

#### `$refundTokens[guildId;userId;flowId;amount]`
Refunds tokens to buckets after operation completion.

**Parameters:**
- `guildId` (String) - Guild ID
- `userId` (String) - User ID
- `flowId` (String) - Flow ID
- `amount` (Number) - Amount to refund

**Returns:** Boolean (true if successful)

**Example:**
```
$refundTokens[$guildId;$authorId;test-flow;1]
$c[Returns: true - Refunded 1 token to all relevant buckets]
```

### Bucket Functions

#### `$getBucketInfo[scope;id?]`
Gets information about a rate limiting bucket.

**Parameters:**
- `scope` (String) - Bucket scope: "global", "guild", "user", "flow"
- `id` (String, optional) - Bucket ID (format depends on scope)

**Returns:** Boolean (true if bucket exists)

**Environment Variables Set:**
- `$env[bucketExists]` - "true" or "false"
- `$env[bucketTokens]` - Current tokens
- `$env[bucketCapacity]` - Maximum capacity
- `$env[bucketFillPercentage]` - Fill percentage (0-100)

**Example:**
```
$getBucketInfo[global]
$if[$env[bucketExists]==true]
  Global: $env[bucketTokens]/$env[bucketCapacity] ($env[bucketFillPercentage]%)
$endif
```

### Queue Management Functions

#### `$addToQueue[guildId;jobData;priority?;flowId?;userId?]`
Adds a job to the rate limiting queue with priority support.

**Parameters:**
- `guildId` (String) - Guild ID
- `jobData` (String) - Job data to queue
- `priority` (Number, optional) - Priority class (1=moderation, 2=system, 3=messaging, 4=heavy)
- `flowId` (String, optional) - Flow ID for fairness scheduling
- `userId` (String, optional) - User ID

**Returns:** Boolean (true if successfully queued)

**Environment Variables Set:**
- `$env[jobId]` - Generated job ID
- `$env[queuePosition]` - Position in queue
- `$env[queueSize]` - Total queue size

**Example:**
```
$addToQueue[$guildId;{"action":"sendMessage","data":"Hello"};1;moderation-flow;$authorId]
$c[Added moderation job with highest priority (1)]
Queue position: $env[queuePosition]
```

#### `$processQueue[guildId]`
Processes queued jobs using weighted fair queuing by flow.

**Parameters:**
- `guildId` (String) - Guild ID to process queue for

**Returns:** Boolean (true if job was processed)

**Environment Variables Set:**
- `$env[processedJobId]` - ID of processed job
- `$env[processedFlow]` - Flow that was selected
- `$env[waitTime]` - How long job waited in queue (ms)

#### `$finishJob[guildId;jobId;success?]`
Marks a job as finished and removes it from running jobs.

**Parameters:**
- `guildId` (String) - Guild ID
- `jobId` (String) - Job ID to finish
- `success` (Boolean, optional) - Whether job completed successfully

**Returns:** Boolean (true if successful)

**Environment Variables Set:**
- `$env[executionTime]` - Job execution time (ms)
- `$env[jobSuccess]` - Whether job succeeded

### Monitoring Functions

#### `$getRateLimitStats[]`
Gets comprehensive rate limiting statistics.

**Returns:** String (JSON statistics)

**Example:**
```
$getRateLimitStats[]
$c[Returns: {"totalBuckets":5,"globalTokens":950,"globalCapacity":1000,"activeBuckets":4}]
```

### Circuit Breaker Functions

#### `$openCircuitBreaker[guildId;flowId;reason?]`
Opens a circuit breaker for a specific flow to prevent execution.

**Parameters:**
- `guildId` (String) - Guild ID
- `flowId` (String) - Flow ID to break
- `reason` (String, optional) - Reason for opening circuit breaker

**Returns:** Boolean (true if successful)

#### `$checkCircuitBreaker[guildId;flowId]`
Checks if a circuit breaker is open for a specific flow.

**Parameters:**
- `guildId` (String) - Guild ID  
- `flowId` (String) - Flow ID to check

**Returns:** Boolean (true if circuit breaker is open)

**Environment Variables Set:**
- `$env[circuitBreakerState]` - "open", "closed", or "halfOpen"
- `$env[circuitBreakerReason]` - Reason for circuit breaker state
- `$env[circuitBreakerOpenedAt]` - Timestamp when opened

### Advanced Functions

#### `$calculateETA[guildId;userId;flowId;cost]`
Calculates ETA across multiple rate limiting buckets.

**Parameters:**
- `guildId` (String) - Guild ID
- `userId` (String) - User ID  
- `flowId` (String) - Flow ID
- `cost` (Number) - Token cost required

**Returns:** Number (ETA in seconds)

**Environment Variables Set:**
- `$env[totalETA]` - Total ETA across all buckets
- `$env[limitingBucket]` - Which bucket is limiting (global/guild/user/flow)
- `$env[limitingReason]` - Detailed reason for limitation
- `$env[queueETA]` - ETA due to queue wait
- `$env[bucketETAs]` - JSON array of all bucket ETAs

#### `$checkConcurrency[guildId;flowId?]`
Checks if concurrency limits allow execution.

**Parameters:**
- `guildId` (String) - Guild ID
- `flowId` (String, optional) - Flow ID for per-flow limits

**Returns:** Boolean (true if execution allowed)

**Environment Variables Set:**
- `$env[concurrencyBlocked]` - "true" or "false"
- `$env[blockReason]` - "guild_concurrency" or "flow_concurrency"
- `$env[currentRuns]` - Current running jobs count
- `$env[maxRuns]` - Maximum allowed concurrent runs
- `$env[availableSlots]` - Available concurrency slots

#### `$startRun[guildId;userId;flowId;cost]`
Starts a new run and tracks it in concurrency system.

**Parameters:**
- `guildId` (String) - Guild ID
- `userId` (String) - User ID
- `flowId` (String) - Flow ID  
- `cost` (Number) - Estimated token cost

**Returns:** String (run ID if successful, empty if failed)

**Environment Variables Set:**
- `$env[runId]` - Generated run ID
- `$env[runStarted]` - Timestamp when run started
- `$env[activeConcurrency]` - Current active runs count

#### `$setPriority[actionType]`
Sets priority for an action type.

**Parameters:**
- `actionType` (String) - Type of action to prioritize

**Returns:** Number (priority class: 1-4)

**Environment Variables Set:**
- `$env[actionPriority]` - Priority number (1=highest, 4=lowest)
- `$env[priorityClass]` - Priority class name

#### `$checkSurgeGuard[guildId?]`
Checks and manages surge guard system for queue wait times.

**Parameters:**
- `guildId` (String, optional) - Guild ID to check (empty for global)

**Returns:** Boolean (true if surge guard is active)

**Environment Variables Set:**
- `$env[surgeGuardActive]` - "true" or "false"
- `$env[queueWaitP95]` - 95th percentile queue wait time (ms)
- `$env[surgeThreshold]` - Surge guard activation threshold

### Event Functions

#### `$eventData[property?]`
Returns the event data for rate limiting events.

**Parameters:**
- `property` (String, optional) - Specific property to retrieve

**Returns:** String (JSON data or specific property value)

#### `$throttleReason[]`
Returns the reason for throttling in throttled events.

**Returns:** String (throttle reason)

#### `$eventTimestamp[]`
Returns the timestamp of the rate limiting event.

**Returns:** Number (timestamp)
```

## Rate Limiting Policies

ForgeRateLimit uses a **Balanced** policy by default with these limits:

### Token Buckets
- **Global**: 1000 capacity, 10 tokens/sec refill
- **Guild**: 150 capacity, 2.5 tokens/sec refill  
- **User**: 30 capacity, 0.5 tokens/sec refill
- **Flow**: 80 capacity, 1.33 tokens/sec refill

### Action Costs
- `send_message`: 1 token
- `send_embed`: 2 tokens
- `role_edit`: 2 tokens
- `timeout`: 3 tokens
- `kick_ban`: 4 tokens
- `create_delete`: 5 tokens
- `http_request`: 3 tokens

### Concurrency Limits
- Max 12 concurrent runs per guild
- Max 4 concurrent runs per flow
- Queue threshold: 15 seconds
- Max queue size: 200 jobs

### Priority Classes
1. **Moderation** (Priority 1) - timeout, kick_ban, role_edit
2. **System** (Priority 2) - create_delete, db_write, db_read  
3. **Messaging** (Priority 3) - send_message, send_embed
4. **Heavy** (Priority 4) - http_request

### Events Available
- `tokenReserved` - When tokens are successfully reserved
- `tokenRefunded` - When tokens are refunded after completion
- `bucketRefilled` - When buckets get refilled
- `throttled` - When a request is throttled with reason
- `queued` - When a request is added to queue
- `queueExecuted` - When a queued request starts execution
- `circuitBreaker` - When a flow gets auto-paused due to high error rate
- `surgeGuard` - When system enters/exits degraded state
- `policyChanged` - When rate limiting policy is updated

## Examples

### Basic Rate Limiting
```
$c[Check if we can send a message]
$reserveTokens[$guildId;$authorId;welcome-flow;1;send_message]

$if[$env[rateLimitSuccess]==true]
  $sendMessage[Welcome! You have been rate limited successfully.]
$else
  $sendMessage[Rate limited! Reason: $env[rateLimitReason]. Try again in $env[rateLimitEta] seconds.]
$endif
```

### Advanced Usage with Refunds
```
$c[Reserve tokens for complex operation]
$reserveTokens[$guildId;$authorId;mod-flow;7;timeout,send_embed]

$if[$env[rateLimitSuccess]==true]
  $c[Do the work - if it fails, we can refund]
  $try[
    $timeout[$mentioned[1];60000;Automated timeout]
    $sendEmbed[Timeout applied successfully]
  ]
  $catch[
    $c[Operation failed, refund tokens]
    $refundTokens[$guildId;$authorId;mod-flow;7]
    $sendMessage[Operation failed, tokens refunded]
  ]
$else
  $sendMessage[Cannot perform action: $env[rateLimitReason]]
$endif
```

### Queue Management with Priority
```
$c[Add high-priority moderation job]
$addToQueue[$guildId;{"action":"timeout","user":"123456789"};1;moderation-flow;$authorId]

$c[Process next job from queue]
$processQueue[$guildId]
$if[$env[processedJobId]]
  Processing job: $env[processedJobId] from flow: $env[processedFlow]
  Wait time: $env[waitTime]ms
$endif[]
```

### Circuit Breaker Usage
```
$c[Check if flow is circuit broken]
$checkCircuitBreaker[$guildId;problematic-flow]
$if[$env[circuitBreakerState]==open]
  $sendMessage[⚠️ Flow is circuit broken: $env[circuitBreakerReason]]
$else[]
  $c[Flow is healthy, proceed with operation]
  $reserveTokens[$guildId;$authorId;problematic-flow;5]
$endif[]
```

### ETA Calculation
```
$c[Calculate ETA for expensive operation]
$calculateETA[$guildId;$authorId;heavy-flow;15]
$if[$env[totalETA]>0]
  $sendMessage[❌ Rate limited! 
  ETA: $env[totalETA]s
  Limiting bucket: $env[limitingBucket]
  Reason: $env[limitingReason]]
$else[]
  $sendMessage[✅ Ready to proceed immediately]
$endif[]
```

### Concurrency Management
```
$c[Check if we can start new automation]
$checkConcurrency[$guildId;automation-flow]
$if[$env[concurrencyBlocked]==true]
  $sendMessage[🚫 Cannot start: $env[blockReason] 
  Current runs: $env[currentRuns]/$env[maxRuns]]
$else[]
  $c[Start the automation]
  $startRun[$guildId;$authorId;automation-flow;10]
  $sendMessage[🚀 Started automation with ID: $env[runId]]
$endif[]
```

### Surge Guard Monitoring
```
$c[Check system load]
$checkSurgeGuard[$guildId]
$if[$env[surgeGuardActive]==true]
  $sendMessage[⚠️ System under load!
  Queue wait P95: $env[queueWaitP95]ms
  Threshold: $env[surgeThreshold]ms]
$endif[]
```

## Complete Function Reference

ForgeRateLimit provides **21 functions** across 7 categories:

### Core Functions (6)
- `$estimateCost` - Estimate token costs for actions
- `$reserveTokens` - Reserve tokens from buckets  
- `$refundTokens` - Refund tokens after completion
- `$getBucketInfo` - Get bucket status and capacity
- `$addToQueue` - Add jobs to priority queue
- `$getRateLimitStats` - Get comprehensive statistics

### Queue Management (2)
- `$processQueue` - Process jobs with fair scheduling
- `$finishJob` - Complete jobs and update circuit breakers

### Circuit Breakers (2)
- `$openCircuitBreaker` - Manually open circuit breaker
- `$checkCircuitBreaker` - Check circuit breaker state

### Advanced Systems (4)
- `$calculateETA` - Multi-bucket ETA calculation
- `$checkConcurrency` - Concurrency limit checking
- `$startRun` - Start tracked runs
- `$checkSurgeGuard` - Surge protection system

### Priority & Monitoring (2)
- `$setPriority` - Set action priority classes
- `$checkSurgeGuard` - Monitor system load

### Event Functions (3)
- `$eventData` - Access event data in handlers
- `$throttleReason` - Get throttling reasons
- `$eventTimestamp` - Get event timestamps

### Events (9)
- `tokenReserved`, `tokenRefunded`, `bucketRefilled`
- `throttled`, `queued`, `queueExecuted`  
- `circuitBreaker`, `surgeGuard`, `policyChanged`

## Architecture

ForgeRateLimit implements a **multi-scope token bucket system** with:

🏗️ **5 Bucket Scopes** - Global → Guild → User → Flow → Action-Type  
⚖️ **Weighted Fair Queuing** - Prevents flow starvation  
🔄 **Circuit Breakers** - Auto-pause problematic flows  
🛡️ **Surge Guards** - Graceful degradation under load  
📊 **Real-time Events** - Comprehensive monitoring  
🎯 **Priority Classes** - Critical operations first  

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**ForgeRateLimit** - Production-grade rate limiting for ForgeScript  
Made with ❤️ by [xloxn69](https://github.com/xloxn69)