import { Query } from "../apiTypes";
import { User } from "./authTypes";

export const signUp = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<User | null> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const res = await fetch(process.env.NEXT_PUBLIC_API_LINK + "/user/register", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
    }),
  });

  const resData = await res.json();
  const user = resData.result;

  if (res.ok && user) {
    return user;
  } else return null;
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const res = await fetch(process.env.NEXT_PUBLIC_API_LINK + "/user/login", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  const resData = await res.json();
  const user = resData.result;

  if (res.ok && user) {
    document.cookie = "id=" + user.id + "; path=/";
    document.cookie = "username=" + user.username + "; path=/";
    document.cookie = "email=" + user.email + "; path=/";
    document.cookie = "role=" + user.role + "; path=/";
    document.cookie = "accessToken=" + user.accessToken + "; path=/";

    window.location.assign("/");

    return user;
  } else return null;
};

export function signOut() {
  const cookies: string[] = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i];
    const eqPos: number = cookie.indexOf("=");
    const name: string = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  }

  window.location.assign("/auth/login");
}

export const getQueryUserByID = (userID: string): Query => ({
  endpoint: `/user/${userID}`,
  method: "GET",
});
