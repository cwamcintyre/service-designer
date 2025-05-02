import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication, EventType, type AuthenticationResult } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import { useState, useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";

const msalInstance = new PublicClientApplication(msalConfig);

// Ensure msalInstance is initialized before rendering the app
async function initializeMsal() {
  try {
    await msalInstance.initialize();
  } catch (error) {
    console.error("Failed to initialize MSAL instance:", error);
  }
}

initializeMsal();

function AppWrapper({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}

export const links: Route.LinksFunction = () => [
  { 
    rel: "stylesheet",
    href: "/govuk-frontend-5.9.0.min.css"
  }
];

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, instance } = useMsal();
  const [isRedirectHandled, setIsRedirectHandled] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await instance.handleRedirectPromise();
      } catch (error) {
        console.error("Error handling redirect:", error);
      } finally {
        setIsRedirectHandled(true);
      }
    };

    handleRedirect();
  }, [instance]);

  useEffect(() => {
    if (isRedirectHandled && accounts.length === 0) {
      instance.loginRedirect();
    }
  }, [accounts, instance, isRedirectHandled]);

  if (!isRedirectHandled || accounts.length === 0) {
    return <p>Redirecting to login...</p>; // Show a message while redirecting
  }

  return <>{children}</>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <RequireAuth>{children}</RequireAuth>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </AppWrapper>
  );
}

export default function App() {
  return <Outlet />;
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
