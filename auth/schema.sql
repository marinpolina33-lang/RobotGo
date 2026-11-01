PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
 name TEXT NOT NULL, password_hash TEXT NOT NULL, recovery_hash TEXT,
 role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
 active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
 must_change INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS rate_expiry ON rate_limits(expires_at);
CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY, request_key TEXT NOT NULL UNIQUE, payload_hash TEXT NOT NULL,
 kind TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
 company TEXT NOT NULL, project TEXT NOT NULL, details TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new','qualified','quoted','closed')),
 created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at DESC);
CREATE TABLE IF NOT EXISTS event_counts (
 day TEXT NOT NULL, event TEXT NOT NULL, page TEXT NOT NULL, device TEXT NOT NULL,
 count INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(day,event,page,device)
);
