# CMS DDD Architecture

本專案是用來練習後端 Nest.js 相關功能與架構。

## Start

該系統基於 Docker 執行。首先需要複製環境變數，檢核相關變數都吃到正確通道口。但大部分均依賴內置設定，無需調整。

```bash
cp apps/api-nest-app/.env.example apps/api-nest-app/.env
```

確保對外 docker-compose.yaml 所有對外曝露的 Port 沒有佔用，也可以考慮全部關閉，只留 web-service 對外曝露。

```bash
docker-compose up
```

