export {};

declare global {
  interface Window {
    api: {
      products: {
        getAll: () => Promise<any[]>;
        create: (data: any) => Promise<any>;
      };
    };
  }
}