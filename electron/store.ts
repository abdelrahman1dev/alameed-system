import Store from "electron-store";

type User = {
  id: number;

  username: string;

  role: string;
};

type Session = {
  user: User;

  expiresAt: number;
};

export const store = new Store<{
  session: Session | null;
}>({
  defaults: {
    session: null,
  },
});