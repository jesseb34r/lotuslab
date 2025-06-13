import { A } from "@solidjs/router";

export function NotFound() {
  return (
    <main class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-4xl mb-4">404 - Page Not Found</h1>
      <p class="text-gray-dim mb-8">
        The page you're looking for doesn't exist.
      </p>
      <A
        href="/"
        class="
          px-4 py-2 rounded cursor-pointer
          bg-grass-4 dark:bg-grassdark-4
          hover:bg-grass-5 dark:hover:bg-grassdark-5
        "
      >
        Return Home
      </A>
    </main>
  );
}
