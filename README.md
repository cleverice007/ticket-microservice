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













