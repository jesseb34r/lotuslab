import type { ScryfallCard } from "@scryfall/api-types";

export async function download_scryfall_defaultcards(): Promise<
  ScryfallCard.Any[]
> {
  // get download url
  const download_url_response = await fetch(
    "https://api.scryfall.com/bulk-data/default-cards",
  );
  if (!download_url_response.body) {
    throw new Error("Response body is null");
  }

  const unzip_stream = new DecompressionStream("gzip");
  const unzipped_download_url_response = new Response(
    download_url_response.body.pipeThrough(unzip_stream),
  );
  const download_url = (await unzipped_download_url_response.json()).uri;

  // download default cards
  const default_cards_response = await fetch(download_url);
  if (!default_cards_response.body) {
    throw new Error("Response body is null");
  }

  const unzipped_default_cards_response = new Response(
    default_cards_response.body.pipeThrough(unzip_stream),
  );
  return (await unzipped_default_cards_response.json()) as ScryfallCard.Any[];
}
