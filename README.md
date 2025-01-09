# **Sammy API**

Sammy API is an easy and powerful way to make calls on the **client** or **server** in **Next.js** projects using the new **App Directory** structure (version 13+). It was designed to work with a well-defined modular architecture, providing a scalable and organized approach for fullstack development.

## **🚀 Benefits**

- 🌟 Compatible with Next.js **App Directory**.
- 🔒 Native support for authentication and authorization with **guards**.
- ⚙️ Modular architecture to facilitate maintenance and scalability.
- 💡 Simplifies communication between client and server.

---

## **📦 Installation**

You can install the Sammy API library in your project via npm or yarn:

`npm install sammy-api`

Or:

`yarn add sammy-api`

---

## **📂 Suggested Folder Structure**

Below is the suggested folder structure to organize the server modules and frontend:

```
my-next-app/
├── server/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts
│   │   │   ├── services/
│   │   │   │   └── user.service.ts
│   │   │   └── user.module.ts
│   │   ├── product/
│   │   │   ├── controllers/
│   │   │   │   └── product.controller.ts
│   │   │   ├── services/
│   │   │   │   └── product.service.ts
│   │   │   └── product.module.ts
│   │   └── app.module.ts
│   ├── api.ts
│   └── main.ts
├── src/
│   └── app/
│      ├── layout.tsx
│      └── page.tsx
└── package.json
```

---

## **💻 Usage Example**

### **1️0️⃣ Guard Layer**
```
import { ISammyGuard, SammyResponse } from 'sammy-api';

export class ApiGuard implements ISammyGuard<IUserLogged> {
  private _allowed?: ERoles[];

  constructor(...roles: ERoles[]) {
    this._allowed = roles;
  }

  async execute() {
    const user = {} as IUserLogged; // implement your logic to fetch the logged-in user
    if (!user) {
      throw SammyResponse.error('User not found');
    }

    const isAuthorized = !!user.roles?.find(role => this._allowed?.includes(role));
    if (!isAuthorized) {
      throw SammyResponse.error('User not authorized');
    }

    return user;
  }
}
```

### **1️⃣ Service Layer**

In the product.service.ts file:

```
export class ProductService implements IProductService {
  constructor(private readonly repository: IProductRepository) {}

  async findById(id: string) {
    const product = await this.repository.read(id);
    if (!product) {
      throw SammyResponse.warning('Product not found'');
    }
    return product;
  }
}
```

### **2️⃣ Controller Layer**

In the user.controller.ts file:

```
export class ProductController {
  constructor(private readonly service: IProductService) {}

  findById = new SammyProcedure()
    .protect(new ApiGuard(ERoles.USER))
    .execute(async ({ id }, currentUser): SammyResponseDto<ProductDto> => {
      try {
        const product = await this.service.findById(id);
        return SammyResponse.success(product);
      } catch (e) {
        return SammyResponse.error('Error fetching product', e);
      }
    });
}
```

### **3️⃣ Module Layer**

In the product.module.ts file:

```
const repo = new ProductRepository();
const service = new ProductService(repo);

const productModule = {
  ...new ProductController(service),
  // other controllers
};

export default productModule;
```

In the app.module.ts file:

```
export const serverModules = {
  productModule: import('@module/product'),
  // other modules
} as const;
```

### **4️⃣ Server Initialization**

In the main.ts file:

```
'use server'; // IMPORTANT!!!

import { serverModules } from '@module/app';
import { createServer } from 'sammy-api'

export type TApiModules = typeof serverModules;

export async function appServer(...args: any) {
  return createServer(serverModules, ...args);
}
```

In the api.ts file:

```
import { createSammy, TModules } from "sammy-api";
import { appServer, TApiModules } from "./main";

export const appApi = createSammy<TModules<TApiModules>>(appServer);
```

### **5️⃣ Usage in Frontend**

#### **Example on Server Side (page.tsx):**

```
export default async function Page() {
  const { content: product } = await appApi.productModule.findById({ id: "xpto" });
  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}
```

#### **Example on Client Side (page.tsx):**

```
'use client';
export default async function Page() {
  const [product, setProduct] = useState();

  useEffect(() => {
    appApi.productModule.findById({ id: "xpto" });
      .then(({ content: product }) => setProduct(product))
      .catch(e => console.log(e.message));
  }, []);

  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}
```

---

## **🛠️ Technologies Used**

- **Next.js** (App Directory \- version 13+)
- **Typescript** for type safety.

---


## **📝 License**

This project is under the **MIT** license. See the LICENSE file for more details.

---
