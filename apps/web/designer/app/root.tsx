import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "react-router";
import { AuthProvider, useAuth } from "react-oidc-context";
import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { 
    rel: "stylesheet",
    href: "/govuk-frontend-5.9.0.min.css"
  }
];

declare global {
  interface Window {
    RUNTIME_CONFIG: {
      VITE_OIDC_CLIENT_AUTHORITY: string;
      VITE_OIDC_CLIENT_ID: string;
      VITE_OIDC_CALLBACK: string;
      VITE_APP_API_URL: string;
      VITE_APP_RUNNER_URL: string;
      VITE_APP_CHAT_URL: string;
    };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="/config.js"></script>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const cognitoAuthConfig = {
    authority: window.RUNTIME_CONFIG.VITE_OIDC_CLIENT_AUTHORITY,
    client_id: window.RUNTIME_CONFIG.VITE_OIDC_CLIENT_ID,
    redirect_uri: window.RUNTIME_CONFIG.VITE_OIDC_CALLBACK,
    response_type: "code",
    scope: "phone openid email",
  };
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <OidcWrapper />
    </AuthProvider>
  );
}

export function OidcWrapper() {
  const auth = useAuth();
  
  if (auth.isLoading) {
      return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  if (!auth.isAuthenticated) {
      auth.signinRedirect(); // Redirect to the OIDC login page
      return null;
  }

  return (
    <Outlet />
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}