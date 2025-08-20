# ForgeRateLimit

ForgeRateLimit is a comprehensive rate limiting and queueing system extension built for ForgeScript, enabling sophisticated token bucket rate limiting across multiple scopes.

## Installation

```bash
npm install github:xloxn69/ForgeRateLimit
```

## Usage

```javascript
const { ForgeClient } = require("@tryforge/forgescript");
const { ForgeRateLimit } = require("forge-ratelimit");

const client = new ForgeClient({
    extensions: [
        new ForgeRateLimit()
    ]
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

### Queue Functions

#### `$addToQueue[guildId;jobData]`
Adds a job to the rate limiting queue.

**Parameters:**
- `guildId` (String) - Guild ID
- `jobData` (String) - Job data to queue

**Returns:** Boolean (true if successfully queued)

**Example:**
```
$addToQueue[$guildId;{"action":"sendMessage","data":"Hello"}]
$c[Returns: true - Job added to guild queue]
```

### Monitoring Functions

#### `$getRateLimitStats[]`
Gets comprehensive rate limiting statistics.

**Returns:** String (JSON statistics)

**Example:**
```
$getRateLimitStats[]
$c[Returns: {"totalBuckets":5,"globalTokens":950,"globalCapacity":1000,"activeBuckets":4}]
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
- Queue threshold: 15 seconds
- Max queue size: 200 jobs

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

## License

MIT