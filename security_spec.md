# security_spec.md: Attribute-Based Access Control and Security Specification

Evaluating the security of the application structure and designing rules protecting users, metadata, shopping details, books progress, and scholarly feedback against exploit patterns.

## 1. Data Invariants

1. **User Identity Invariant**: A user's profile (`/users/{userId}`), cart (`/carts/{userId}`), wishlist (`/wishlists/{userId}`), and reading progress (`/progress/{userId}`) can only be created, read, or modified by the authenticated user whose `request.auth.uid` matches the `{userId}`.
2. **Review Integrity Invariant**: A review document (`/reviews/{bookId}`) is publicly readable but must satisfy a strict structure on updates/creation: any addition must have a valid structure (no ghost parameters), and users cannot edit other users' existing items in reviews array unless they match high privilege.
3. **Immutability of Key Identifiers**: Critical fields like `uid` on `users` documents, once set, must remain immutable on updates.
4. **Verified Emails Only**: Write operations to the user profile, cart, books progress, and review submissions require the user to be signed in with a verified email address (`request.auth.token.email_verified == true`).

---

## 2. The "Dirty Dozen" Payloads (Exploit Attempts)

Here are twelve specific JSON payloads designed to bypass security and break data invariants, each matching a scenario where access should be denied.

### Case 1: Identity Spoofing (Write Profile as Other)
* **Attempt**: Attacker `user_jack` attempts to modify profile of `user_jill`.
* **Path**: `/users/user_jill`
* **Payload**: 
  ```json
  { "uid": "user_jill", "email": "jill@bookverse.org", "displayName": "Hack Attempt" }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 2: Spoofing Owner in Payload Field
* **Attempt**: Signed-in user `user_jack` sets `uid` parameter in payload to `user_bob` to corrupt indexes.
* **Path**: `/users/user_jack`
* **Payload**: 
  ```json
  { "uid": "user_bob", "email": "jack@bookverse.org", "currentStreakDays": 10, "dailyGoalMinutes": 45 }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 3: Ghost Field / Shadow Update Attack
* **Attempt**: Attacker passes unvalidated `isSiteAdmin` or `isVip` field on profile create, trying to escalate privileges.
* **Path**: `/users/user_jack`
* **Payload**: 
  ```json
  { "uid": "user_jack", "email": "jack@bookverse.org", "currentStreakDays": 0, "dailyGoalMinutes": 30, "isVip": true }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 4: Zero Email Verification Write
* **Attempt**: User logs in with non-verified email account to update progress history.
* **Path**: `/progress/user_unverified`
* **Payload**: 
  ```json
  { "history": [], "updatedAt": "2026-06-13T16:17:10.000Z" }
  ```
* **Context**: `request.auth.token.email_verified == false`
* **Expected Result**: `PERMISSION_DENIED`

### Case 5: Path ID Poisoning (Denial of Wallet)
* **Attempt**: Malicious client requests creation of document with an excessively large garbage string ID.
* **Path**: `/users/very_long_garbage_key_with_excess_weight_representing_denial_of_wallet_exhaustion_injection_attack_string_exceeding_standard_limits_12345678`
* **Payload**: 
  ```json
  { "uid": "very_long_garbage_key_with_excess_weight_representing_denial_of_wallet_exhaustion_injection_attack_string_exceeding_standard_limits_12345678", "email": "excess@bookverse.org", "currentStreakDays": 1, "dailyGoalMinutes": 30 }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 6: Review Spam Ghost Field (Attribute Pollution)
* **Attempt**: User adds supplementary fields directly into reviews document structure trying to compromise schema or inject executable code.
* **Path**: `/reviews/book_philosophies`
* **Payload**: 
  ```json
  { "reviews": [], "maliciousScriptCode": "eval('alert(1)')" }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 7: Mutating Immutable Creation Fields
* **Attempt**: User tries to shift their permanent profile custom identifier (`uid`) during an update.
* **Path**: `/users/user_jack`
* **Payload**: 
  ```json
  { "uid": "user_malicious_new_id", "email": "jack@bookverse.org", "currentStreakDays": 5, "dailyGoalMinutes": 45 }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 8: Unbounded Cart Payload Size Exhaustion
* **Attempt**: Attacker passes a huge mock cart items array containing non-conforming parameters.
* **Path**: `/carts/user_jack`
* **Payload**: 
  ```json
  { "items": [{ "invalidEntry": "x" }], "updatedAt": "2026-06-13T16:17:10.000Z" }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 9: Unauthorized Reads (PII Blanket Get)
* **Attempt**: Authenticated reader `user_jack` attempts to retrieve all records or profile details of another user `user_jill`.
* **Path**: `/users/user_jill`
* **Request**: `GET`
* **Expected Result**: `PERMISSION_DENIED`

### Case 10: State Shortcut (Bypassing Progress Counters)
* **Attempt**: Malicious client updates books reading progress by supplying an invalid document structure containing negative pages.
* **Path**: `/progress/user_jack`
* **Payload**: 
  ```json
  { "history": [{ "bookId": "b1", "currentPage": -500, "totalPages": 100 }], "updatedAt": "2026-06-13T16:17:10.000Z" }
  ```
* **Expected Result**: `PERMISSION_DENIED`

### Case 11: Spoofed Client App Trust
* **Attempt**: Relying only on a local query filter, the client tries to retrieve a bulk query list of all user carts without authenticating.
* **Request**: Query `/carts`
* **Expected Result**: `PERMISSION_DENIED`

### Case 12: Anonymous Review Injection
* **Attempt**: An anonymous, unauthenticated visitor attempts to write review data to books reviews collection.
* **Path**: `/reviews/book_stoic_meditations`
* **Payload**:
  ```json
  { "reviews": [{ "userName": "shadow", "rating": 5, "comment": "Nice!" }] }
  ```
* **Expected Result**: `PERMISSION_DENIED`

---

## 3. Test Specification Draft (Declarative Test Runner)

To verify correctness safely, mock test specifications map permissions behavior cleanly.

```typescript
// firestore.rules.test.ts (Declarative mapping placeholder)
describe("Security Rules fortress validation", () => {
  it("denies unauthenticated writes completely", () => {
    // Assert write returns PERMISSION_DENIED
  });
  it("denies mismatched user document access", () => {
    // Assert write to user_jill by user_jack fails
  });
  it("allows owner to read and write their own folders", () => {
    // Assert success
  });
});
```
