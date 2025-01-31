export default function HomePage() {
  return (
    <>
      <h1 class="text-teal-10 text-4xl mb-6">Moxcel</h1>
      <div class="flex flex-col gap-2">
        <div class="flex gap-20 items-end">
          <h2>Decks</h2>
          <button type="button" class="bg-grass-action border-grass-normal px-2 py-1 rounded">
            New
          </button>
        </div>
        <hr />
        <div>All my decks</div>
      </div>
    </>
  );
}
