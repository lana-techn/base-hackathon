# Create signer

> Creates a signer and returns the signer status. 

**Note**: While tesing please reuse the signer, it costs money to approve a signer.

## OpenAPI

````yaml post /v2/farcaster/signer/
openapi: 3.0.4
info:
  title: Neynar API
  version: 3.110.0
  description: >-
    The Neynar API allows you to interact with the Farcaster protocol among
    other things. See the [Neynar docs](https://docs.neynar.com/reference) for
    more details.
  contact:
    name: Neynar
    url: https://neynar.com/
    email: team@neynar.com
servers:
  - url: https://api.neynar.com
security:
  - ApiKeyAuth: []
tags:
  - name: User
    description: Operations related to user
    externalDocs:
      description: More info about user
      url: https://docs.neynar.com/reference/user-operations
  - name: Signer
    description: Operations related to signer
    externalDocs:
      description: More info about signer
      url: https://docs.neynar.com/reference/signer-operations
  - name: Cast
    description: Operations related to cast
    externalDocs:
      description: More info about cast
      url: https://docs.neynar.com/reference/cast-operations
  - name: Feed
    description: Operations related to feed
    externalDocs:
      description: More info about feed
      url: https://docs.neynar.com/reference/feed-operations
  - name: Reaction
    description: Operations related to reaction
    externalDocs:
      description: More info about reaction
      url: https://docs.neynar.com/reference/reaction-operations
  - name: Notifications
    description: Operations related to notifications
    externalDocs:
      description: More info about notifications
      url: https://docs.neynar.com/reference/notifications-operations
  - name: Channel
    description: Operations related to channels
    externalDocs:
      description: More info about channels
      url: https://docs.neynar.com/reference/channel-operations
  - name: Follows
    description: Operations related to follows
    externalDocs:
      description: More info about follows
      url: https://docs.neynar.com/reference/follows-operations
  - name: Storage
    description: Operations related to storage
    externalDocs:
      description: More info about storage
      url: https://docs.neynar.com/reference/storage-operations
  - name: Frame
    description: Operations related to mini apps
  - name: Agents
    description: Operations for building AI agents
  - name: fname
    description: Operations related to fname
  - name: Webhook
    description: Operations related to a webhook
  - name: Action
    description: >-
      Securely communicate and perform actions on behalf of users across
      different apps
    externalDocs:
      description: More info about farcaster actions
      url: https://docs.neynar.com/docs/farcaster-actions-spec
  - name: Subscribers
    description: Operations related to a subscriptions
  - name: Mute
    description: Operations related to a mute
  - name: Block
    description: Operations related to a block
  - name: Ban
    description: Operations related to a ban
  - name: Onchain
    description: Operations related to onchain data
  - name: Login
    description: Operations related to login
  - name: Metrics
    description: Operations related to retrieving metrics
  - name: App Host
    description: Operations related to mini app host notifications
    externalDocs:
      description: More info about mini app host notifications
      url: https://docs.neynar.com/docs/app-host-notifications
paths:
  /v2/farcaster/signer/:
    post:
      tags:
        - Signer
      summary: Create signer
      description: >-
        Creates a signer and returns the signer status. 


        **Note**: While tesing please reuse the signer, it costs money to
        approve a signer.
      operationId: create-signer
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Signer'
        '500':
          description: Server Error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorRes'
      externalDocs:
        url: https://docs.neynar.com/reference/create-signer
components:
  schemas:
    Signer:
      type: object
      properties:
        object:
          type: string
          enum:
            - signer
        signer_uuid:
          $ref: '#/components/schemas/SignerUUID'
        public_key:
          $ref: '#/components/schemas/Ed25519PublicKey'
        status:
          type: string
          enum:
            - generated
            - pending_approval
            - approved
            - revoked
        signer_approval_url:
          type: string
        fid:
          $ref: '#/components/schemas/Fid'
        permissions:
          type: array
          items:
            $ref: '#/components/schemas/SharedSignerPermission'
      required:
        - signer_uuid
        - public_key
        - status
      title: Signer
    ErrorRes:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        property:
          type: string
        status:
          type: integer
          format: int32
      required:
        - message
      title: ErrorRes
      description: Details for the error response
    SignerUUID:
      type: string
      example: 19d0c5fd-9b33-4a48-a0e2-bc7b0555baec
      title: SignerUUID
      description: >-
        UUID of the signer.

        `signer_uuid` is paired with API key, can't use a `uuid` made with a
        different API key.
    Ed25519PublicKey:
      type: string
      pattern: ^0x[a-fA-F0-9]{64}$
      example: '0x3daa8f99c5f760688a3c9f95716ed93dee5ed5d7722d776b7c4deac957755f22'
      description: Ed25519 public key
      title: Ed25519PublicKey
    Fid:
      type: integer
      minimum: 0
      description: The unique identifier of a farcaster user or app (unsigned integer)
      example: 3
      title: Fid
      format: int32
    SharedSignerPermission:
      type: string
      enum:
        - WRITE_ALL
        - READ_ONLY
        - NONE
        - PUBLISH_CAST
        - DELETE_CAST
        - PUBLISH_REACTION
        - DELETE_REACTION
        - UPDATE_PROFILE
        - FOLLOW_USER
        - UNFOLLOW_USER
        - FOLLOW_CHANNEL
        - UNFOLLOW_CHANNEL
        - ADD_VERIFICATION
        - REMOVE_VERIFICATION
        - WRITE_FRAME_ACTION
      title: SharedSignerPermission
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: API key to authorize requests
      x-default: NEYNAR_API_DOCS

````

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.neynar.com/llms.txt