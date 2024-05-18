export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SignInSnippet = {
  success: boolean;
  data: User;
};

export type GetQueryUserByIDSnippet = {
  message: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};
