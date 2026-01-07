/**
 * API Module - Re-export for backwards compatibility
 * 
 * The actual implementation is now split into domain-specific modules in ./api/:
 * - core.ts    - Base request function
 * - auth.ts    - Login, register, password reset, verification
 * - users.ts   - Profiles, follows, search
 * - posts.ts   - Post CRUD, likes, comments, crowns, sharing, saves
 * - reels.ts   - Reel CRUD, likes, comments, sharing, saves
 * - startups.ts - Startup fetching, likes, crowns, comments
 * - trades.ts  - Trading, portfolio, investor functions
 * - chats.ts   - Chat and messaging functions
 * - misc.ts    - Notifications, settings, uploads, jobs, events, etc.
 */

export * from './api/index';