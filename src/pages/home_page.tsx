export default function HomePage() {
  return (
    <main class="flex flex-col pt-10 mx-auto w-[80%]">
      <h1 class="text-teal-10 text-4xl mb-6 text-center">Moxcel</h1>
      <div class="flex flex-col gap-2">
        <div class="flex gap-20 items-end justify-between">
          <h2 class="text-xl text-gray-dim">Decks</h2>
          <button type="button" class="bg-grass-action px-2 py-1 rounded">
            New
          </button>
        </div>
        <hr class="text-gray-dim" />
        <div>All my decks</div>
      </div>
    </main>
  );
}
