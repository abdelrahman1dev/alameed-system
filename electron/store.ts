import Store from "electron-store";

type Session = {
  id: number;
  username: string;
  role: string;
};

export const store = new Store<{
  session: Session | null;
}>({
  defaults: {
    session: null,
  },
});