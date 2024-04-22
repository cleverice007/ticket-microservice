# Ticket microservice

## Description
此項目是一個full stack application，
實現了一個具有用戶註冊、登入、訂票和結帳功能的微服務架構。前端部分使用 JavaScript 和 Next.js 開發，後端採用 TypeScript 和 Express。
此外，整個應用被容器化並部署在 Kubernetes 集群中，使用 Stripe 進行支付處理。

## Tech Stack
- **前端**: JavaScript, Next.js
- **後端**: TypeScript, Express
- **資料庫**: MongoDB
- **支付服務**: Stripe
- **Container**: Docker, Kubernetes
- **Communication**: Nats-Streaming
- **訂單過期處理(Worker Service)**: Redis

## Project Structure
專案根據不同的功能劃分成多個資料夾：
- `auth`：處理登入相關功能。
- `ticket`：訂票相關功能。
- `order`：訂單管理功能。
- `payment`：支付功能。
- `client`：前端界面。
- `infra`：包含所有 Kubernetes 配置文件。
- `common`：包含跨微服務共用的程式碼，如event、errors、middlewares。

每個Service都是獨立部署的，並通過Event-driven的方式互相溝通，確保服務之間的松耦合。

### 安裝步驟

```
git clone https://github.com/cleverice007/ticket-microservice.git
```
```
cd ticket-microservice
```
```
skaffold dev
```

修改 hosts 文件,將 ticketing.dev 指向本地地址
Windows
```
C:\Windows\System32\drivers\etc\hosts。
```
MacOS or Linux
```
sudo nano /etc/hosts
```
添加以下行
```
127.0.0.1       ticketing.dev
```
Application 網址
```
https://ticketing.dev/
```

### 功能說明

### Common Folder Structure

`common` 資料夾包含了多個微服務共用的邏輯和組件，這有助於保持代碼的DRY原則（不重複自己）並且提高了代碼的可維護性。以下是包含在此資料夾中的主要元件：

- **Events**：
-   `Event`：定義了NATS Streaming用於事件發布和訂閱的接口，確保事件處理的類型安全和一致性,ex: order-created,ticket-updated,payment-created
  - `Publisher`和`Listener`：這些接口和抽象類定義了事件發布者和監聽者的基本結構，使得事件驅動的架構更加模塊化和易於管理。

- **Errors**：自行定義的error type，例如，bad-request-error,not-found-error, request-validation-error

- **Middlewares**：
  - `requireAuth`：這個中間件檢查請求是否包含有效的JWT。如果不包含，將阻止請求繼續處理。
  - `currentUser`：解析request中的JWT，將userpayload附加到req上，以便後續使用。
  - `validateRequest`：結合`express-validator`來驗證和清理請求數據，保證後續處理的數據正確性。
  - `errorHandler`：捕獲middleware& route拋出的錯誤，並將它們轉換為一致的response格式回傳給client。 

### Auth Folder Structure

`auth` 資料夾是microservice中負責處理身份驗證相關功能。此資料夾結構確保用戶管理流程如註冊、登入、登出和身份驗證。以下是該資料夾的說明：

- **Dockerfile 和 Kubernetes 配置**：
  - `Dockerfile`：定義了用於建立 auth 服務container的所有步驟。
  -`auth-depl.yaml`: 使用k8s Deployment` 和 `Service` 服務將 auth 部署並提供網絡訪問。
  -`auth-mongo-depl.yaml`: 部署mongodb instance


- **Routes**：
  - `signin`：處理用戶登入，驗證用戶並發送含有 JWT 的 session。
  - `signout`：清除用戶 session，實現登出功能。
  - `signup`：允許新用戶註冊並在數據庫中儲存加密後的密碼。
  - `currentUser`：檢查用戶是否已登入並回傳當前用戶資訊。

- **Models**：
  - `User`：定義用戶模型，包括email & password，並使用 Mongoose 與 MongoDB 交互。

- **Services**：
  - `Password`：提供 toHash 和 compare 函數，用於密碼的加密和驗證。

- **Tests**：
  - 對所有路由進行單元測試，確保每個功能按預期運作，使用 Jest 和 Supertest 框架進行測試。
 

### Ticket Folder Structure

`ticket` 資料夾負責管理ticket:

- **Dockerfile 和 Kubernetes 配置**：
  - `Dockerfile`：用於建構 ticket 服務的 Docker 容器。
  - Kubernetes `depl & service：負責部署和網路訪問。
  - MongoDB 的 Deployment 設置：用於存儲 ticket 資料。

- **Routes**：
  - `index`：展示所有ticket information。
  - `new`：提供創建new ticket的接口。
  - `show`：顯示單個ticket詳情。
  - `update`：更新已存在的ticket information。

- **Models**：
  - `Ticket`：定義了與ticket相關的數據結構和與 MongoDB 的交互邏輯。
  - 使用 `version` 欄位來追蹤version，處理concurrency。
  - 採用 `mongoose-update-if-current` 自動管理version，每次更新時檢查和更新 `version` 欄位，確保更新操作的原子性和一致性。

- **Events**：
  - `ticket-created` 和 `ticket-updated`：處理ticket創建和更新的事件發布。
  - `order-created` 和 `order-cancelled`：從其他服務處理訂單創建和取消的事件。

- **Services**：
  - `queueGroupName`：用於設定 NATS Streaming 的queue name，確保消息正確分發。

- **Tests**：
  - 使用 Jest 和 Supertest 對所有功能進行單元測試。
  - `__mocks__`：包含假的 NATS-wrapper 以便於測試中模擬事件處理。

# K8s 環境變數設定說明
請確保在 Kubernetes 集群中事先創建必要的 secrets，例如 `jwt-secret`。使用以下指令創建所需的 secret:

kubectl create secret generic jwt-secret --from-literal=JWT_KEY='your-jwt-key-here'











