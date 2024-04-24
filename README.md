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
  - MongoDB 的 Deployment 設置：用於儲存 ticket 資料。

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

 **K8s 環境變數設定說明** 
在 Kubernetes 集群中事先創建必要的 secrets，例如 `jwt-secret`。使用以下指令創建所需的 secret:
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY='your-jwt-key-here'
```

### Orders Folder Structure

`orders` 資料夾是微服務架構中處理訂單相關功能。此資料夾結構確保訂單管理流程如創造、查詢、取消訂單。以下是該資料夾的主要說明：

- **Dockerfile 和 Kubernetes 配置**：
  - `Dockerfile`：用於建構 order 服務的 Docker 容器。
  - Kubernetes `orders-depl.yaml`：用於部署 order 服務和設定網路訪問。
  - MongoDB 的 Deployment 設置：用於儲存 order 資料。


- **Routes**：
  - `index`：列出所有訂單。
  - `new`：創建新訂單。
  - `show`：顯示單個訂單的詳情。
  - `delete`：取消訂單。

- **Models**：
  - `Order`：定義了與訂單相關的數據結構，包括用戶ID、狀態、過期時間和相關的票券。

- **Events**：
  - 發布事件：`order-created`, `order-cancelled`。
  - 監聽事件：`ticket-created`, `ticket-updated`, `expiration-completed`。
  - 使用 NATS Streaming 來處理事件的發布和訂閱。
  - `queueGroupName`：用於設定 NATS Streaming 的隊列名稱，確保消息正確分發。

- **Tests**：
  - 對所有路由和事件監聽功能進行單元測試。
  - 使用 Jest 和 Supertest 框架進行測試。
  - `__mocks__`：包含模擬的 NATS-wrapper 以方便在測試中模擬事件處理。

 **K8s 環境變數設定說明** 
在 Kubernetes 集群中事先創建必要的 secrets，例如 `jwt-secret`。使用以下指令創建所需的 secret:
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY='your-jwt-key-here'
```
### Expiration Service Folder Structure

`expiration` 資料夾負責管理訂單的過期邏輯：
- **Dockerfile 和 Kubernetes 配置**：
  - `Dockerfile`：用於建構 expiration service的 Docker image。
  - Kubernetes `expiration-depl.yaml`：用於部署 expiration 服務和引用redis image。

- **主要檔案和功能**：
  - `expiration-queue.js`：使用 `bull` 和 `Redis` 建立一個隊列來處理訂單的過期時間。
  - 當訂單到達設定的過期時間時，會觸發一個 `expiration-complete` 事件，publish。

- **Events**：
  - `expiration-complete-publisher`：當訂單過期時發布 `expiration-complete` event。
  - `OrderCreatedListener`：監聽來自其他服務的 `order-created` event，將新創建的訂單及其過期時間添加到 `expiration queue` 中。

- **設定和測試**：
  - 使用 `Redis` 來儲存queue data。
  - 確保queue正確設定延時時間，並在時間到時觸發 `ExpirationComplete` 事件。

### Payment Service Structure

`payment` 資料夾負責處理所有與付款相關的功能。這包括處理實際的付款交易和與其他服務的事件溝通。以下是該資料夾的結構說明：

- **Models**：
  - `Payment`：儲存與付款相關的資訊，包括 `orderId` 和 `stripeId`。`orderId` 是與付款相關的訂單 ID，而 `stripeId` 是 Stripe 付款確認的唯一標識。

- **Routes**：
  - `new.ts`：這個路由處理新的付款請求。它使用 Stripe API 來處理實際的信用卡交易。

- **Events**：
  - `PaymentCreatedPublisher`：當一個新的付款在系統中被創建並成功處理後，這個 publisher 會發布付款創建事件。
  - `OrderCreated` 和 `OrderCancelled Listener`：這些 listeners 處理來自訂單服務的事件，確保付款服務可以適當響應訂單的創建和取消。

- **Kubernetes and Docker**：
  - 使用 Docker 容器來封裝付款服務，並通過 Kubernetes 配置以確保高可用性和擴展性。
  - 部署配置包括環境變數設定如下，以確保服務能夠正確連接到必要的外部資源（如 Stripe）。
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY='your-jwt-key-here'
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY='your-stripe-key-here'
```
### Client Folder Structure

**Next.js + React**:
- **使用 Next.js 框架**：支持服務端渲染（SSR），提高應用性能和 SEO。
- **React**：用於建構互動式的用戶界面組件。

**Hooks**:
- **use-request**：自定義 Hook，用於從前端向後端發送 HTTP 請求，處理請求與響應的邏輯。

**API**:
- 根據運行環境（伺服器或瀏覽器）有不同的 API URL 設置，確保 API 請求根據環境正確地指向服務器或客戶端。

**Components**:
- **Header**：顯示導航欄，包括登入、登出、註冊、銷售門票和我的訂單連結。根據用戶的登入狀態動態調整。

**Pages**:
- **auth**：包含登入和註冊相關的頁面。
- **orders**：展示用戶的訂單信息。
- **tickets**：用於購買和查看票務信息的頁面。

### CI/CD
使用GitHub Actions 在pull request時，觸發test&deployment

**CI**
- **執行環境**：在最新的 Ubuntu 環境下運行。
- **Steps**：
  - **Checkout**：從 GitHub repo 獲取code。
  - **Setup**：進入 diretory，使用 `npm install` isntall dependency。
  - **test**：使用 `npm run test:ci` 執行測試。

**CD**
- Trigger: The CD workflow is triggered when changes are pushed to the main branch and include modifications within the auth directory.
- Environment: Runs on the latest Ubuntu environment.

-**Steps**
- Checkout: Retrieves the latest code from the main branch.
- Docker Build: Constructs a Docker image.
- Docker Login: Authenticates to Docker Hub using secrets stored in GitHub (DOCKER_USERNAME and DOCKER_PASSWORD).
- Docker Push: Pushes the built image to Docker Hub.
- Kubernetes Deployment:
  Uses doctl to interact with DigitalOcean Kubernetes services.
  Updates kubeconfig for connection.
  Restarts the deployment to update the pods with the new Docker image.
