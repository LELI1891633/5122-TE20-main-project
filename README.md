## System Diagram

The diagram below combines both the architecture (frontend, backend, database) and the request flow (user interactions and API calls).

```mermaid
sequenceDiagram
  autonumber
  participant U as User Browser (Vue)
  participant FE as Frontend (Static Hosting/CDN)
  participant API as API Gateway
  participant L as AWS Lambda
  participant DB as MySQL Database

  U->>FE: Open website (GET index.html, JS, CSS)
  FE-->>U: Return static assets (HTML, JS, CSS)

  U->>API: Request /hello
  API->>L: Trigger Lambda (event)
  L->>DB: Query / Insert / Update
  DB-->>L: Return data
  L-->>API: { statusCode, body(JSON) }
  API-->>U: JSON response
