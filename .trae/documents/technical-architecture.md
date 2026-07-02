## 1. 架构设计
```mermaid
graph TD
    subgraph Frontend [前端应用]
        UI[React UI 组件库 - Shadcn UI / Tailwind CSS]
        State[React Hooks / Context 状态管理]
        Router[React Router 页面路由]
        API[Fetch/Axios 请求层]
    end
    subgraph Backend [后端服务 (Mock)]
        Controllers[API 控制器]
        Services[业务逻辑处理]
        Data[JSON Mock 数据源]
    end
    UI --> State
    State --> API
    API -->|HTTP 请求| Controllers
    Controllers --> Services
    Services --> Data
```

## 2. 技术说明
- 前端框架：React@18 (Vite)
- 样式方案：Tailwind CSS @3
- UI 组件库：Shadcn UI (包含 Radix UI primitives), Lucide Icons
- 状态管理：React Context / Hooks (如 `useReducer`, `useState`)
- 表格组件：自定义的高密度树形数据表格组件，或者使用 `@tanstack/react-table` (这里为了还原 UI 建议自定义或使用适合高密度数据的方案)
- 初始化工具：`npm create vite@latest . -- --template react-ts`

## 3. 路由定义
| 路由路径 | 页面说明 |
|----------|----------|
| `/` | 默认跳转至 `/purchase-suggestions` |
| `/purchase-suggestions` | 采购建议页面 (备货建议与缺货建议 Tab) |
| `/purchase-plans` | 采购计划页面 (采购计划列表) |

## 4. API 定义 (Mock)
- `GET /api/suggestions`: 获取采购建议数据（按供应商分组）
  ```typescript
  interface SuggestionResponse {
    supplierName: string;
    totalProducts: number;
    totalPurchaseQuantity: number;
    totalPurchasePrice: number;
    items: Array<{
      id: string;
      buyer: string;
      sku: string;
      name: string;
      status: string; // e.g. "正常销售"
      warehouse: string;
      brand: string;
      dailySales: number;
      sales7Days: number;
      sales28Days: number;
      sales42Days: number;
      stockQuantity: number;
      transitQuantity: number;
      unshippedQuantity: number;
      availableStock: number;
      availableDays: number;
      transitAvailableDays: number;
      deliveryDays: number;
      purchasePrice: number;
      suggestedQuantity: number;
      totalPrice: number;
      notes: string;
    }>;
  }
  ```

- `POST /api/purchase-plans`: 将建议加入采购计划
  ```typescript
  interface CreatePlanRequest {
    skuIds: string[];
  }
  ```

- `GET /api/purchase-plans`: 获取采购计划数据（按计划号分组）
  ```typescript
  interface PlanResponse {
    planNumber: string;
    supplierName: string;
    totalSupplierProducts: number;
    totalPurchaseQuantity: number;
    totalPurchasePrice: number;
    items: Array<{
      id: string;
      buyer: string;
      sku: string;
      name: string;
      warehouse: string;
      purchaseQuantity: number;
      inboundQuantity: number;
      lossQuantity: number;
      notes: string;
      logistics: string;
      status: string; // e.g. "未采购"
      source: string; // e.g. "备货建议"
      creator: string;
      createTime: string;
    }>;
  }
  ```

## 5. 组件划分
- `Layout`: 侧边栏菜单，顶部导航条
- `Sidebar`: 左侧的多级菜单 (订单, 生产, 商品, 采购等)
- `Header`: 顶部的 Breadcrumb，用户操作区
- `PurchaseSuggestions`: 采购建议页面
  - `SuggestionsFilter`: 筛选区表单
  - `SuggestionsTable`: 嵌套分组的数据表格
- `PurchasePlans`: 采购计划页面
  - `PlansFilter`: 搜索及筛选区
  - `PlansTable`: 按计划号分组的数据表格
