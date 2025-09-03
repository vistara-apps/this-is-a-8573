# VerifyVote API Documentation

This document provides detailed information about the VerifyVote API, including endpoints, request/response formats, and authentication.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.verifyvote.com
```

## Authentication

API requests require authentication using a JWT token. To authenticate, include the token in the `Authorization` header:

```
Authorization: Bearer YOUR_TOKEN
```

You can obtain a token by authenticating with your Solana wallet.

## Endpoints

### Polls

#### Create Poll

Creates a new poll.

- **URL**: `/polls`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "gitRepo": "https://github.com/username/repo" // Optional
}
```

**Response**:

```json
{
  "id": "poll_abc123",
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "creatorAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
  "votes": {},
  "totalVotes": 0,
  "status": "draft",
  "programId": null,
  "metadataHash": null,
  "createdAt": "2023-09-01T12:00:00Z",
  "deployedAt": null
}
```

#### Get Poll

Retrieves a poll by ID.

- **URL**: `/polls/:pollId`
- **Method**: `GET`
- **Auth Required**: No

**Response**:

```json
{
  "id": "poll_abc123",
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "creatorAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
  "votes": {
    "Red": 5,
    "Blue": 10,
    "Green": 3,
    "Yellow": 2
  },
  "totalVotes": 20,
  "status": "deployed",
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "metadataHash": "ipfs_abc123",
  "createdAt": "2023-09-01T12:00:00Z",
  "deployedAt": "2023-09-01T13:00:00Z"
}
```

#### Get Polls by Creator

Retrieves all polls created by a specific address.

- **URL**: `/polls/creator/:creatorAddress`
- **Method**: `GET`
- **Auth Required**: No

**Response**:

```json
[
  {
    "id": "poll_abc123",
    "question": "What is your favorite color?",
    "options": ["Red", "Blue", "Green", "Yellow"],
    "creatorAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
    "votes": {
      "Red": 5,
      "Blue": 10,
      "Green": 3,
      "Yellow": 2
    },
    "totalVotes": 20,
    "status": "deployed",
    "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "metadataHash": "ipfs_abc123",
    "createdAt": "2023-09-01T12:00:00Z",
    "deployedAt": "2023-09-01T13:00:00Z"
  }
]
```

#### Vote on Poll

Casts a vote on a poll.

- **URL**: `/polls/:pollId/vote`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "option": "Blue"
}
```

**Response**:

```json
{
  "id": "vote_def456",
  "pollId": "poll_abc123",
  "voterAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
  "option": "Blue",
  "optionIndex": 1,
  "timestamp": "2023-09-01T14:00:00Z"
}
```

### Deployments

#### Deploy Poll

Deploys a poll to the Solana blockchain.

- **URL**: `/deployments`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "pollId": "poll_abc123",
  "gitRepo": "https://github.com/username/repo" // Optional
}
```

**Response**:

```json
{
  "id": "deploy_ghi789",
  "pollId": "poll_abc123",
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitCommit": "git_abc123",
  "buildArtifactsHash": "build_def456",
  "ipfsHash": "ipfs_ghi789",
  "arweaveTxId": "arweave_jkl012",
  "creatorAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
  "timestamp": "2023-09-01T13:00:00Z"
}
```

#### Get Deployment Metadata

Retrieves deployment metadata for a poll.

- **URL**: `/deployments/poll/:pollId`
- **Method**: `GET`
- **Auth Required**: No

**Response**:

```json
{
  "id": "deploy_ghi789",
  "pollId": "poll_abc123",
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitCommit": "git_abc123",
  "buildArtifactsHash": "build_def456",
  "ipfsHash": "ipfs_ghi789",
  "arweaveTxId": "arweave_jkl012",
  "creatorAddress": "5xGZGQCULb2sFUdvV7Ja9Cqnx7K2qc1reaQEBFSMqZH2",
  "timestamp": "2023-09-01T13:00:00Z"
}
```

### Verification

#### Verify Program

Verifies a deployed program against its source code.

- **URL**: `/verification/verify`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123"
}
```

**Response**:

```json
{
  "verified": true,
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123",
  "timestamp": "2023-09-01T15:00:00Z",
  "matchingBuild": true,
  "buildArtifactsHash": "build_def456"
}
```

#### Get Verification Metadata

Retrieves verification metadata from IPFS.

- **URL**: `/verification/metadata/:ipfsHash`
- **Method**: `GET`
- **Auth Required**: No

**Response**:

```json
{
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123",
  "buildArtifactsHash": "build_def456",
  "buildTimestamp": "2023-09-01T13:00:00Z",
  "buildCommand": "anchor build",
  "rustVersion": "1.68.0",
  "anchorVersion": "0.28.0",
  "solanaVersion": "1.16.0"
}
```

### Payments

#### Get Pricing

Retrieves pricing information.

- **URL**: `/payments/pricing`
- **Method**: `GET`
- **Auth Required**: No

**Response**:

```json
{
  "initialDeployment": 5,
  "subsequentUpdate": 2,
  "analyticsMonthly": 10
}
```

#### Create Payment Session

Creates a payment session.

- **URL**: `/payments/session`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "amount": 5,
  "metadata": {
    "pollId": "poll_abc123",
    "type": "initialDeployment"
  }
}
```

**Response**:

```json
{
  "id": "session_mno345",
  "amount": 5,
  "currency": "USD",
  "status": "pending",
  "createdAt": "2023-09-01T16:00:00Z",
  "metadata": {
    "pollId": "poll_abc123",
    "type": "initialDeployment"
  }
}
```

#### Get Payment History

Retrieves payment history for a user.

- **URL**: `/payments/history`
- **Method**: `GET`
- **Auth Required**: Yes

**Response**:

```json
[
  {
    "id": "payment_pqr678",
    "amount": 5,
    "currency": "USD",
    "status": "completed",
    "createdAt": "2023-09-01T16:30:00Z",
    "metadata": {
      "pollId": "poll_abc123",
      "type": "initialDeployment"
    }
  }
]
```

## Error Responses

All API endpoints return standard HTTP status codes. In case of an error, the response body will contain an error message:

```json
{
  "error": "Error message"
}
```

Common error codes:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are rate-limited to 100 requests per minute per user. If you exceed this limit, you will receive a `429 Too Many Requests` response.

## Webhook Notifications

VerifyVote can send webhook notifications for various events, such as poll creation, deployment, and votes. To set up webhooks, contact our support team.

## SDK

We provide SDKs for JavaScript and Python to simplify API integration. See the [SDK documentation](sdk.md) for more information.

