export {};

declare global {
  interface Window {
    api: {
      products: {
        getAll: () => Promise<any[]>;
        create: (data: any) => Promise<any>;
        update: (id: number, data: any) => Promise<any>;
        delete: (id: number) => Promise<any>;
      };

      invoice: {
        print: () => Promise<boolean>;
      };

      sales: {
        create: (
          sale: any,
          items: any[],
        ) => Promise<any>;
      };
    };
  }
}
