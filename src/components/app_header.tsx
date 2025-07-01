import { Button } from "@kobalte/core";
import { useNavigate } from "@solidjs/router";

export function AppHeader() {
  const navigate = useNavigate();

  return (
    <nav>
      <ul class="grid grid-cols-3 w-full items-center p-2">
        <li class="justify-self-start">
          <div class="inline-flex gap-2">
            <Button.Root
              class="inline-flex content-center items-center rounded p-2 gap-1 text-neutral-11 hover:text-neutral-12 outline-none transition duration-75 cursor-pointer"
              onMouseDown={() => navigate("/", { replace: true })}
            >
              <HomeIcon class="size-6 stroke-2" />
            </Button.Root>
            <Button.Root
              class="inline-flex content-center items-center rounded p-2 gap-1 text-neutral-11 hover:text-neutral-12 outline-none transition duration-75 cursor-pointer"
              onMouseDown={() => navigate("/theme_preview")}
            >
              Theme Preview
            </Button.Root>
          </div>
        </li>
        <li class="justify-self-center">
          <Button.Root
            class="inline-flex content-center items-center rounded py-1 px-2 gap-1 w-md text-neutral-11 bg-neutral-3 hover:bg-neutral-4 outline-none transition duration-75 cursor-pointer"
            onMouseDown={() => navigate("/search", { replace: true })}
          >
            <MagnifyingGlassIcon class="size-4 stroke-2" />
            Search all cards
          </Button.Root>
        </li>
        <li class="justify-self-end">
          <Button.Root
            class="inline-flex content-center items-center rounded p-2 gap-1 text-neutral-11 hover:text-neutral-12 outline-none transition duration-75 cursor-pointer"
            onMouseDown={() => navigate("/settings", { replace: true })}
          >
            <GearIcon class="size-6 stroke-2" />
          </Button.Root>
        </li>
      </ul>
    </nav>
  );
}

function MagnifyingGlassIcon(props: { class: string }) {
  return (
    <svg
      class={props.class}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Magnifying Glass</title>
      <path
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function HomeIcon(props: { class: string }) {
  return (
    <svg
      class={props.class}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Home</title>
      <path
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function GearIcon(props: { class: string }) {
  return (
    <svg
      class={props.class}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Cog</title>
      <path
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
