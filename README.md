## System Diagram

The diagram below combines both the architecture (frontend, backend, database) and the request flow (user interactions and API calls).

```mermaid
sequenceDiagram
  autonumber
  participant U as User Browser (Vue)
  participant FE as Frontend (Static Hosting/CDN)
  participant API as API Gateway
  participant L as AWS Lambda
  participant DB as DynamoDB (optional)
  participant S3 as S3 (optional)

  U->>FE: Open website (GET index.html, JS, CSS)
  FE-->>U: Return static assets (HTML, JS, CSS)

  U->>API: Request /hello
  API->>L: Trigger Lambda (event)
  alt Needs data
    L->>DB: Query / Write
    DB-->>L: Data response
  end
  alt Needs file storage
    L->>S3: Read / Write file
    S3-->>L: File response
  end
  L-->>API: { statusCode, body(JSON) }
  API-->>U: JSON response
