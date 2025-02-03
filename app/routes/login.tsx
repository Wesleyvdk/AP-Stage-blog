import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { data, Form, redirect } from "@remix-run/react";
import { authenticator } from "~/auth.server";

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function Screen() {
  return (
    <Form method="post">
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object
  let user = await authenticator.authenticate("user-pass", request);

  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  session.set("user", user);

  throw redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
};

// Finally, we need to export a loader function to check if the user is already
// authenticated and redirect them to the dashboard
export let loader: LoaderFunction = async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (user) throw redirect("/dashboard");
  return data(null);
};
