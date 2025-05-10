# 📄 通用型 CMS - PRD（Product Requirements Document）

## 🧾 1. 產品簡介

**產品名稱**：UniversalCMS（暫名）  
**開發目標**：建立一套模組化、高擴充性、API 驅動的內容管理系統，提供使用者自由定義資料模型與管理內容。  

**應用場景**：

- 行銷頁面內容管理（Landing Pages）
- 企業網站內容維護
- 多語系產品說明、FAQ 管理
- 部落格或文章發布系統

---

## 🛠️ 2. 技術架構（技術選型）

| 項目         | 技術                          |
|--------------|------------------------------|
| Backend      | Nest.js                      |
| API          | RESTful API（OpenAPI 文件）   |
| ORM          | Drizzle ORM                  |
| 資料庫        | MySQL                        |
| 前端          | Vite + React                 |
| UI 框架       | TailwindCSS + Zag            |
| 認證          | JWT + Refresh Token 機制     |
| 部署方式       | Docker + Docker Compose     |

---

## 📦 3. 功能模組說明

### 3.1 內容模型管理（Content Model）

**功能描述**：

- 後台 UI 提供建立/編輯/刪除內容模型的能力
- 每個模型可定義欄位、類型、是否必填、是否唯一、是否可篩選/搜尋

**支援欄位型別**：

- Text（單行、多行）
- Number（整數、浮點數）
- Boolean
- Date / DateTime
- Media（圖片 / 檔案）
- Relation（單向/多向關聯其他內容模型）
- Select / Multi-select（靜態選項或 API 動態來源）
- JSON（進階欄位）

---

### 3.2 內容管理（Content CRUD）

**功能描述**：

- 對所有已定義的模型，生成 CRUD 管理介面
- 支援草稿與發布狀態切換
- 支援篩選、搜尋、排序、分頁

---

### 3.3 媒體管理（Media Manager）

**功能描述**：

- 上傳圖片/影片/檔案（預設儲存在本地，可切換至雲端）
- 支援標籤分類、預覽圖、URL 生成

---

### 3.4 使用者與權限管理

**功能描述**：

- 使用者註冊、登入、登出（JWT）
- Token Refresh 機制
- 使用者角色系統（Admin / Editor / Viewer 等）
- 每個角色可設定 CRUD 權限（可用於每個模型）

---

### 3.5 API 提供（RESTful）

**功能描述**：

- 所有內容皆透過 REST API 提供資料
- 支援模型結構與欄位動態查詢
- 支援 API Token 認證（未來可擴充用於外部整合）
- 自動產出 OpenAPI 規格（Swagger）

---

## 🧩 4. 模組細節：欄位系統（Field System）

| 欄位型別    | 支援功能                     |
|-------------|------------------------------|
| Text        | 必填 / 唯一 / 多行 / Regex 驗證 |
| Number      | 整數/浮點、最小/最大值限制     |
| Boolean     | Toggle                        |
| DateTime    | 自動時間戳、自訂格式           |
| Media       | 單張 / 多張，上傳/刪除/重命名   |
| Reference   | 內容模型之間的關聯（1-1、1-N）   |
| Select      | 靜態選項 / 動態來源            |
| JSON        | 進階資料結構（Developer Friendly） |

---

## 🧑‍💻 5. 認證與權限（JWT）

- **Access Token**：短效（15 分鐘），內含 UserID 與角色
- **Refresh Token**：長效（7 天），儲存在 HttpOnly Cookie
- **Token Refresh 機制**：登入後自動刷新，API 失效時自動 retry（前端實作）
- **角色權限系統**：
  - Admin：管理一切
  - Editor：內容模型與內容項目 CRUD
  - Viewer：僅可查看內容與媒體

---

## 📈 6. 擴充機制（Extension Strategy）

- 支援自定義欄位與 UI Component 插件註冊
- 提供 hook/event 機制（onCreate, onUpdate, onDelete）
- 預留 webhook 系統（未來版本）

---

## 📂 7. 前端後台 UI 頁面規劃（React + Vite + Zag）

| 頁面              | 功能簡介                             |
|-------------------|--------------------------------------|
| 登入 / 註冊        | JWT Auth、表單驗證                     |
| Dashboard          | 快速入口、系統統計、最新更新項目         |
| Content Models     | 新增 / 編輯 / 刪除模型，動態欄位設定      |
| Content List       | 各模型內容列表、支援篩選搜尋、狀態切換    |
| Content Editor     | 編輯單筆內容，支援多欄位、自動儲存草稿     |
| Media Manager      | 上傳 / 編輯 / 搜尋媒體資源               |
| User Management    | 使用者列表、角色編輯、權限配置            |
| Settings（可擴充） | API Token、Webhook、語系、樣板等未來設定 |
