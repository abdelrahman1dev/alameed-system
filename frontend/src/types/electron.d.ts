export { };

declare global {
  interface Window {
    api: {
      // products

      products: {
        getAll: () => Promise<any[]>;
        create: (data: any) => Promise<any>;
        update: (id: number, data: any) => Promise<any>;
        delete: (id: number) => Promise<any>;
        getByCategory: (id: number) => Promise<any>;
      };

      //print

      invoice: {
        print: () => Promise<boolean>;
      };

      // sales
      sales: {
        create: (sale: any, items: any[]) => Promise<any>;
      };

      // purchases
      purchases: {
        getAll: () => Promise<any[]>;
        getById: (id: number) => Promise<any>;
        create: (purchase: any, items: any[]) => Promise<any>;
      };
      auth: {
        login: (username: string, password: string) => Promise<any>;

        getSession: () => Promise<any>;

        logout: () => Promise<boolean>;
      };
      categories: {
        getAll: () => promise<any>;
      }
    };
  }
}
