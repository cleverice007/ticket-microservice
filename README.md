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













