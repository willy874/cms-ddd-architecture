# 📄 RBAC 權限系統 DB Schema 文件（Drizzle ORM + MySQL）

## 🔧 資料表一覽

| 資料表名稱        | 說明                         |
|------------------|------------------------------|
| users            | 使用者資料表                  |
| roles            | 角色資料表（如 admin, editor） |
| permissions      | 權限項目表（如 content.read） |
| role_permissions | 角色與權限對應表              |
| user_roles       | 使用者與角色對應表（多對多）   |

---

## 📁 users

| 欄位名稱     | 型別           | 限制             | 說明                 |
|--------------|----------------|------------------|----------------------|
| id           | UUID / INT     | PK, AUTO_INCREMENT | 使用者 ID           |
| email        | VARCHAR(255)   | UNIQUE, NOT NULL | 登入 Email           |
| password     | VARCHAR(255)   | NOT NULL         | 密碼（經過 hash）     |
| name         | VARCHAR(100)   | NULLABLE         | 使用者名稱           |
| created_at   | DATETIME       | DEFAULT now()    | 建立時間             |
| updated_at   | DATETIME       | ON UPDATE now()  | 更新時間             |

---

## 📁 roles

| 欄位名稱     | 型別           | 限制             | 說明               |
|--------------|----------------|------------------|--------------------|
| id           | UUID / INT     | PK, AUTO_INCREMENT | 角色 ID         |
| name         | VARCHAR(100)   | UNIQUE, NOT NULL | 角色名稱（如 admin） |
| description  | TEXT           | NULLABLE         | 說明文字             |

---

## 📁 permissions

| 欄位名稱     | 型別           | 限制             | 說明                         |
|--------------|----------------|------------------|------------------------------|
| id           | UUID / INT     | PK, AUTO_INCREMENT | 權限 ID                     |
| action       | VARCHAR(100)   | NOT NULL         | 權限代碼，如 content.read    |
| description  | TEXT           | NULLABLE         | 權限說明                     |

---

## 📁 role_permissions

| 欄位名稱     | 型別       | 限制         | 說明                       |
|--------------|------------|--------------|----------------------------|
| role_id      | FK (roles) | NOT NULL     | 角色 ID                    |
| permission_id| FK (permissions) | NOT NULL | 權限 ID                  |
| PRIMARY KEY  | (role_id, permission_id) | | 多對多主鍵組合 |

---

## 📁 user_roles

| 欄位名稱     | 型別       | 限制         | 說明                     |
|--------------|------------|--------------|--------------------------|
| user_id      | FK (users) | NOT NULL     | 使用者 ID                |
| role_id      | FK (roles) | NOT NULL     | 角色 ID                  |
| PRIMARY KEY  | (user_id, role_id) |        | 多對多主鍵組合       |

---

## 🧠 權限邏輯

- 一位使用者可以擁有多個角色
- 一個角色可以有多個權限
- 權限採 string-based（ex: `content.create`, `media.read`），未來可動態擴充
- 實作時可用權限前綴分類（如 `content.*` 表示所有內容相關操作）

---

## ✅ 權限範例建議列表（可依功能擴充）

| 權限代碼         | 說明                       |
|------------------|----------------------------|
| content.read     | 查看內容項目               |
| content.create   | 新增內容項目               |
| content.update   | 編輯內容項目               |
| content.delete   | 刪除內容項目               |
| model.manage     | 編輯內容模型               |
| media.upload     | 上傳媒體                   |
| user.manage      | 編輯使用者與角色           |

---

## 💡 後續擴充方向建議

- 加入 `group` / `team` 概念（user 群組）
- 支援 API Token（應用於 headless 前台）
- Audit Log（操作紀錄）
