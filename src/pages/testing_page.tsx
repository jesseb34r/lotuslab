import { Button } from "../components/ui/button";

export function TestingPage() {
  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <section>
        <h2 class="text-4xl leading-tight">Database</h2>
        <Button>re parse default_cards and load into temp database</Button>
      </section>
    </main>
  );
}
