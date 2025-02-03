import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { auth } from "~/auth.server";

export let action: ActionFunction = async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  console.log("Logging out");
  return await auth.logout(request, { redirectTo: "/" });
};
