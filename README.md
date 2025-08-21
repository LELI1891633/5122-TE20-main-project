## High-level Architecture

The diagram below shows the core components and how they connect at a glance.

```mermaid
graph TD
  U[User Browser] -->|HTTP/HTTPS| FE[Vue Frontend<br/>Static Hosting: GitHub Pages / Netlify / AWS Amplify]
  FE -->|Fetch API| APIGW[Amazon API Gateway]
  APIGW --> LBD[AWS Lambda<br/>Business Logic]
  LBD --> MYSQL[(MySQL Database)]
  classDef svc fill:#eef,stroke:#88a,stroke-width:1px,color:#222;
  class FE,APIGW,LBD,MYSQL svc;
