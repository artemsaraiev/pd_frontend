# API Specification: PaperIndex Concept

**Purpose:** Registry of papers by id (DOI or arXiv) with minimal metadata.

---

## API Endpoints

### POST /api/PaperIndex/ensure

**Description:** Ensure a paper exists (idempotent); creates if missing and returns the id.

**Requirements:**
- None

**Effects:**
- If paper exists, returns its id. Otherwise creates `{ _id: id, title?, authors: [], links: [] }`.

**Request Body:**
```json
{
  "id": "string",
  "title": "string (optional)"
}
```

**Success Response Body (Action):**
```json
{
  "result": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```
---

### POST /api/PaperIndex/updateMeta

**Description:** Update paper metadata fields.

**Requirements:**
- Paper with the given id exists.

**Effects:**
- Sets provided fields (e.g., `title`).

**Request Body:**
```json
{
  "id": "string",
  "title": "string (optional)"
}
```

**Success Response Body (Action):**
```json
{ "ok": true }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

# API Specification: AnchoredContext Concept

**Purpose:** Store anchors into a paper by logical refs and human snippets.

---

## API Endpoints

### POST /api/AnchoredContext/create

**Description:** Create a new anchor and return its id.

**Requirements:**
- None

**Effects:**
- Inserts anchor with timestamps for create/edit.

**Request Body:**
```json
{
  "paperId": "string",
  "kind": "Section | Figure | Lines",
  "ref": "string",
  "snippet": "string"
}
```

**Success Response Body (Action):**
```json
{ "result": "string" }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

# API Specification: DiscussionPub Concept

**Purpose:** Per‑paper forum with threads and replies; optional anchor link.

---

## API Endpoints

### POST /api/DiscussionPub/open

**Description:** Open a discussion pub for a paper and return its id.

**Requirements:**
- No existing pub for the `paperId`.

**Effects:**
- Creates pub.

**Request Body:**
```json
{ "paperId": "string" }
```

**Success Response Body (Action):**
```json
{ "result": "string" }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

### POST /api/DiscussionPub/startThread

**Description:** Start a thread in a pub; `anchorId` is optional.

**Requirements:**
- Pub exists.

**Effects:**
- Creates thread.

**Request Body:**
```json
{
  "pubId": "string",
  "author": "string",
  "body": "string",
  "anchorId": "string (optional)"
}
```

**Success Response Body (Action):**
```json
{ "result": "string" }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

### POST /api/DiscussionPub/reply

**Description:** Add a reply to a thread.

**Requirements:**
- Thread exists.

**Effects:**
- Creates reply.

**Request Body:**
```json
{
  "threadId": "string",
  "author": "string",
  "body": "string"
}
```

**Success Response Body (Action):**
```json
{ "result": "string" }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

# API Specification: IdentityVerification Concept

**Purpose:** Optional trust signals attached to a user.

---

## API Endpoints

### POST /api/IdentityVerification/addORCID

**Description:** Upsert verification doc and set ORCID.

**Requirements:**
- None

**Effects:**
- Sets `orcid`.

**Request Body:**
```json
{
  "userId": "string",
  "orcid": "string"
}
```

**Success Response Body (Action):**
```json
{ "ok": true }
```

**Error Response Body:**
```json
{ "error": "string" }
```

---

### POST /api/IdentityVerification/addBadge

**Description:** Add a badge to the user (set semantics).

**Requirements:**
- None

**Effects:**
- Adds badge if not present.

**Request Body:**
```json
{
  "userId": "string",
  "badge": "string"
}
```

**Success Response Body (Action):**
```json
{ "ok": true }
```

**Error Response Body:**
```json
{ "error": "string" }
```
