# Plan: Auth Foundation

**Generated**: 2026-06-25
**Estimated Complexity**: High

## Overview

Build real registration and login flow first, without external auth APIs. Use existing `db.json` and RTK Query user endpoints as backend source of truth. The auth block must be fully testable end to end before any other closed-page work continues.

Target behavior:

- registration validates all fields and required state
- registration rejects duplicate users from `users` in `db.json`
- successful registration persists a new user
- login validates all fields and required state
- login checks user existence and password
- successful login sets authenticated state
- auth state only changes header behavior for now
- server-side errors use a shared common component
- successful registration redirects to login
- successful login stays authenticated in app state

## Scope

In scope:

- login page logic
- registration page logic
- shared auth/session state
- public/private route split where needed for auth-related screens
- shared server error component
- header behavior based on auth state
- tests for auth helpers and core flow

Out of scope for this phase:

- password reset
- logout UI polish beyond minimal needs
- full guard system for every future page
- profile, cart, checkout, orders, and ratings logic
- visual polish outside auth flow

## Auth Rules

### Registration

1. Validate all fields.
2. Require every field.
3. Search `users` for matching identity.
4. If duplicate exists, show server-style error and do not save.
5. If user is new, persist to `users`.
6. Redirect to `/login` after success.

### Login

1. Validate all fields.
2. Require every field.
3. Search `users` for matching user.
4. If user exists, compare password.
5. Wrong password shows server-style error.
6. Correct password sets auth state.

### Auth State

- Auth state comes from app state, not from page-local UI state.
- For this phase, header is the only consumer.
- If user is not authenticated, header shows `Зарегистрироваться`.
- If user is authenticated, header shows cart access instead.

## Sprint 1: Auth Data Layer

**Goal**: Make registration and login real against current `users` data.

**Demo/Validation**:

- duplicate registration is rejected
- fresh registration writes new user into `db.json`
- login succeeds only with correct password
- login failure shows shared server error UI

### Task 1.1: Define auth domain rules

- **Location**: `src/types/user.ts`, `src/entities/user/*`, `src/app/api/usersApi.ts`, new helper modules under `src/entities/user/lib`
- **Description**: Formalize duplicate-user check, credential lookup, and auth payload/result handling.
- **Dependencies**: none
- **Acceptance Criteria**:
  - duplicate user detection is deterministic
  - registration payload excludes `confirmPassword` from persisted data
  - login lookup uses existing user records only
- **Validation**:
  - unit tests for helper functions
  - smoke check against current `db.json` shape

### Task 1.2: Add auth/session state

- **Location**: `src/app/store.ts`, new auth slice under `src/features/auth` or `src/app/auth`
- **Description**: Store authenticated user identity in app state and expose selectors/actions for login and logout flow.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - auth state can be set on login
  - auth state can be cleared later
  - state is accessible outside page components
- **Validation**:
  - store-level tests
  - reducer tests

## Sprint 2: Auth Screens

**Goal**: Wire pages to actual behavior and shared error handling.

**Demo/Validation**:

- registration page submits real data
- login page submits real data
- server-side errors render in one shared place
- success navigation works

### Task 2.1: Build shared server error component

- **Location**: `src/components/ui/*` or `src/components/shared/*`
- **Description**: Add a reusable error block for backend-style auth failures.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - same component can render registration and login errors
  - messages are readable and visually distinct
- **Validation**:
  - component test or story-like stub

### Task 2.2: Implement registration flow

- **Location**: `src/pages/auth/RegisterPage.tsx`, related form helpers
- **Description**: Connect form validation, duplicate-user check, persistence, error display, and redirect to login.
- **Dependencies**: Tasks 1.1, 2.1
- **Acceptance Criteria**:
  - all fields are required and validated
  - duplicate user is rejected with server error
  - new user is saved
  - success navigates to `/login`
- **Validation**:
  - behavior tests for success and duplicate failure

### Task 2.3: Implement login flow

- **Location**: `src/pages/auth/LoginPage.tsx`, related auth helpers
- **Description**: Connect login validation, user lookup, password check, auth state update, and error display.
- **Dependencies**: Tasks 1.1, 1.2, 2.1
- **Acceptance Criteria**:
  - all fields are required and validated
  - unknown user fails with server error
  - wrong password fails with server error
  - correct password sets auth state
- **Validation**:
  - behavior tests for success and failure states

## Sprint 3: Header and Route Behavior

**Goal**: Make auth state visible in app shell and prepare public/private route split.

**Demo/Validation**:

- header changes based on auth state
- auth pages remain reachable
- foundation is ready for closed-page guards later

### Task 3.1: Make header depend on auth state

- **Location**: `src/components/layout/Header/Header.tsx`, `src/components/layout/MainLayout/MainLayout.tsx`
- **Description**: Show registration action for unauthenticated users and cart access for authenticated users.
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - header behavior changes from auth state only
  - other layout structure stays intact
- **Validation**:
  - UI state test or integration smoke check

### Task 3.2: Prepare route split

- **Location**: `src/app/router.tsx`
- **Description**: Keep auth pages public and prepare the app structure for closed routes without overengineering guards yet.
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - login and registration stay public
  - app can distinguish future private routes cleanly
- **Validation**:
  - route navigation check

## Sprint 4: Auth Tests and Verification

**Goal**: Lock auth behavior before moving to other blocks.

**Demo/Validation**:

- auth helpers pass unit tests
- auth screens pass behavior tests
- core flow can be verified against the current project data

### Task 4.1: Add helper tests

- **Location**: `src/**/*.test.ts`
- **Description**: Cover duplicate detection, credential matching, and payload normalization.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - tests focus on behavior, not implementation details
  - important auth branches are covered
- **Validation**:
  - `npm test`

### Task 4.2: Add auth page tests

- **Location**: `src/pages/auth/**/*.test.tsx`
- **Description**: Cover registration success/failure and login success/failure.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - submit flows are tested
  - error states are tested
  - success navigation is tested
- **Validation**:
  - `npm test`

## Testing Strategy

- TDD for auth helpers first.
- Behavior tests for forms and flow transitions.
- Mock only browser APIs and store boundaries if needed.
- Use real project data shape from `db.json` as baseline.

## Risks & Gotchas

- Passwords are stored in plain text in `db.json`; this is acceptable only for current mock backend setup.
- Duplicate user definition must be explicit:
  - email only
  - or email + login, if login field stays meaningful
- Login field in UI currently says `email or login`, but data model uses `email`; this needs a final rule before implementation.
- Header auth behavior must stay minimal now so later pages do not get entangled with unfinished auth design.

