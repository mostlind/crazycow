import { clearAuthData } from "../auth/auth";

interface URLOptions {
  path: string;
  params?: { [key: string]: any };
  headers?: { [key: string]: string };
}

interface Context {
  idToken: string;
  baseUrl: string;
}

const createUrl = (
  base: string,
  path: string,
  params: {
    [key: string]: any;
  } = {}
) => {
  let url = base;
  if (path) {
    url = base + path;
  }

  if (Object.keys(params).length > 0) {
    const paramString = Object.entries(params)
      .map(([key, val]) => [key, val].join("="))
      .join("&");
    url = `${url}?${paramString}`;
  }

  return url;
};

const checkError = async (res: Response): Promise<Response> => {
  if (!res.ok) {
    const error = await res.json();

    if (res.status === 401 && error.message === "JWT Expired") {
      clearAuthData();
      window.location.reload();
    }

    throw new Error(
      JSON.stringify({
        statusCode: res.status,
        statusText: res.statusText,
        ...error
      })
    );
  }

  return res;
};

const parseJson = async <T>(res: Response): Promise<T> => {
  return await res.json();
};

const get = ({ baseUrl, idToken }: Context) => <T>({
  path,
  params,
  headers = {}
}: URLOptions): Promise<T> => {
  return fetch(createUrl(baseUrl, path, params), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Authorization: `Bearer ${idToken}`
    }
  })
    .then(checkError)
    .then(res => parseJson<T>(res));
};

const post = ({ baseUrl, idToken }: Context) => <T>(
  { path, params, headers = {} }: URLOptions,
  body: any
): Promise<T> => {
  return fetch(createUrl(baseUrl, path, params), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Prefer: "return=representation",
      Authorization: `Bearer ${idToken}`
    },
    method: "POST",
    body: JSON.stringify(body)
  })
    .then(checkError)
    .then(res => parseJson<T>(res));
};

const patch = ({ baseUrl, idToken }: Context) => <T>(
  { path, params, headers = {} }: URLOptions,
  body: any
): Promise<T> => {
  return fetch(createUrl(baseUrl, path, params), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Prefer: "return=representation",
      Authorization: `Bearer ${idToken}`
    },
    method: "PATCH",
    body: JSON.stringify(body)
  })
    .then(checkError)
    .then(res => parseJson<T>(res));
};

const remove = ({ baseUrl, idToken }: Context) => <T>({
  path,
  params,
  headers = {}
}: URLOptions): Promise<T> => {
  return fetch(createUrl(baseUrl, path, params), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Authorization: `Bearer ${idToken}`
    },
    method: "DELETE"
  })
    .then(checkError)
    .then(res => parseJson<T>(res));
};

export const Api = {
  init: (context: Context) => ({
    get: get(context),
    post: post(context),
    patch: patch(context),
    delete: remove(context)
  })
};

export type Api = ReturnType<typeof Api.init>;
