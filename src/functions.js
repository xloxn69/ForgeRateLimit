/* ------------------------------------------------------------------ */
/* ALL rate limiting logic lives here. Core token bucket algorithms. */
/* ------------------------------------------------------------------ */

// Action costs for different operations
export const ACTION_COSTS = {
  send_message: 1,
  send_embed: 2,
  role_edit: 2,
  timeout: 3,
  kick_ban: 4,
  create_delete: 5,
  http_request: 3,
  db_read: 0.5,
  db_write: 1
};

/**
 * Estimate the token cost for a list of actions
 * @param {string} actionsStr - Comma-separated list of action types
 * @returns {number} Total estimated cost
 */
export const estimateCost = (actionsStr) => {
  if (!actionsStr) return 0;
  
  const actions = actionsStr.split(',').map(a => a.trim());
  let totalCost = 0;
  
  for (const action of actions) {
    const cost = ACTION_COSTS[action];
    if (cost !== undefined) {
      totalCost += cost;
    } else {
      // Unknown action defaults to 1 token
      totalCost += 1;
    }
  }
  
  return totalCost;
};

/**
 * Reserve tokens from buckets
 * @param {Map} buckets - Token buckets
 * @param {Object} policy - Rate limiting policy
 * @param {string} guildId - Guild ID
 * @param {string} userId - User ID
 * @param {string} flowId - Flow ID
 * @param {number} cost - Token cost
 * @param {string} actionTypes - Action types
 * @returns {Object} Reservation result
 */
export const reserveTokens = (buckets, policy, guildId, userId, flowId, cost, actionTypes) => {
  const numCost = typeof cost === 'string' ? parseInt(cost) : cost;
  
  if (isNaN(numCost) || numCost <= 0) {
    return { success: false, reason: "Invalid cost", eta: 0 };
  }

  // Check global bucket
  const globalBucket = buckets.get('global');
  if (!globalBucket || globalBucket.tokens < numCost) {
    const eta = globalBucket ? Math.ceil((numCost - globalBucket.tokens) / policy.global.refillRate) : 60;
    return { success: false, reason: "global_limit", eta };
  }

  // Check guild bucket
  const guildKey = `guild_${guildId}`;
  let guildBucket = buckets.get(guildKey);
  if (!guildBucket) {
    guildBucket = { ...policy.guild };
    buckets.set(guildKey, guildBucket);
  }
  
  if (guildBucket.tokens < numCost) {
    const eta = Math.ceil((numCost - guildBucket.tokens) / policy.guild.refillRate);
    return { success: false, reason: "guild_limit", eta };
  }

  // Check user bucket
  const userKey = `user_${guildId}_${userId}`;
  let userBucket = buckets.get(userKey);
  if (!userBucket) {
    userBucket = { ...policy.user };
    buckets.set(userKey, userBucket);
  }
  
  if (userBucket.tokens < numCost) {
    const eta = Math.ceil((numCost - userBucket.tokens) / policy.user.refillRate);
    return { success: false, reason: "user_limit", eta };
  }

  // Check flow bucket
  const flowKey = `flow_${guildId}_${flowId}`;
  let flowBucket = buckets.get(flowKey);
  if (!flowBucket) {
    flowBucket = { ...policy.flow };
    buckets.set(flowKey, flowBucket);
  }
  
  if (flowBucket.tokens < numCost) {
    const eta = Math.ceil((numCost - flowBucket.tokens) / policy.flow.refillRate);
    return { success: false, reason: "flow_limit", eta };
  }

  // All checks passed - reserve tokens
  globalBucket.tokens -= numCost;
  guildBucket.tokens -= numCost;
  userBucket.tokens -= numCost;
  flowBucket.tokens -= numCost;

  return { success: true, reserved: numCost, eta: 0 };
};

/**
 * Refund tokens to buckets
 * @param {Map} buckets - Token buckets
 * @param {Object} policy - Rate limiting policy
 * @param {string} guildId - Guild ID
 * @param {string} userId - User ID
 * @param {string} flowId - Flow ID
 * @param {number} amount - Amount to refund
 * @returns {boolean} Success status
 */
export const refundTokens = (buckets, policy, guildId, userId, flowId, amount) => {
  const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return false;
  }

  // Refund to all relevant buckets
  const globalBucket = buckets.get('global');
  if (globalBucket) {
    globalBucket.tokens = Math.min(policy.global.capacity, globalBucket.tokens + numAmount);
  }

  const guildBucket = buckets.get(`guild_${guildId}`);
  if (guildBucket) {
    guildBucket.tokens = Math.min(policy.guild.capacity, guildBucket.tokens + numAmount);
  }

  const userBucket = buckets.get(`user_${guildId}_${userId}`);
  if (userBucket) {
    userBucket.tokens = Math.min(policy.user.capacity, userBucket.tokens + numAmount);
  }

  const flowBucket = buckets.get(`flow_${guildId}_${flowId}`);
  if (flowBucket) {
    flowBucket.tokens = Math.min(policy.flow.capacity, flowBucket.tokens + numAmount);
  }

  return true;
};

/**
 * Get bucket information
 * @param {Map} buckets - Token buckets
 * @param {Object} policy - Rate limiting policy
 * @param {string} scope - Bucket scope (global, guild, user, flow)
 * @param {string} id - Bucket ID
 * @returns {Object} Bucket info
 */
export const getBucketInfo = (buckets, policy, scope, id = '') => {
  let bucketKey;
  let policyRef;

  switch (scope) {
    case 'global':
      bucketKey = 'global';
      policyRef = policy.global;
      break;
    case 'guild':
      bucketKey = `guild_${id}`;
      policyRef = policy.guild;
      break;
    case 'user':
      const [guildId, userId] = id.split('_');
      bucketKey = `user_${guildId}_${userId}`;
      policyRef = policy.user;
      break;
    case 'flow':
      const [gId, flowId] = id.split('_');
      bucketKey = `flow_${gId}_${flowId}`;
      policyRef = policy.flow;
      break;
    default:
      return { exists: false };
  }

  const bucket = buckets.get(bucketKey);
  if (!bucket) {
    return { exists: false };
  }

  const fillPercentage = Math.round((bucket.tokens / bucket.capacity) * 100);
  
  return {
    exists: true,
    tokens: bucket.tokens,
    capacity: bucket.capacity,
    fillPercentage
  };
};

/**
 * Add job to queue (placeholder)
 * @param {Map} buckets - Token buckets
 * @param {Object} policy - Rate limiting policy
 * @param {string} guildId - Guild ID
 * @param {string} jobData - Job data
 * @returns {boolean} Success status
 */
export const addToQueue = (buckets, policy, guildId, jobData) => {
  // Placeholder for queue functionality
  return true;
};

/**
 * Get rate limiting statistics
 * @param {Map} buckets - Token buckets
 * @param {Object} policy - Rate limiting policy
 * @returns {string} Statistics JSON
 */
export const getRateLimitStats = (buckets, policy) => {
  const stats = {
    totalBuckets: buckets.size,
    globalTokens: buckets.get('global')?.tokens || 0,
    globalCapacity: policy.global.capacity,
    activeBuckets: Array.from(buckets.keys()).filter(key => key !== 'global').length
  };
  
  return JSON.stringify(stats);
};