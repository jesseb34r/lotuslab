import { list_parse_from_string } from "../utils/card_list";

console.log("Starting test...");
test_list_parsing()
  .then(() => console.log("Test completed"))
  .catch((err) => console.error("Test failed:", err));

// Tests list parsing and fetching from the Scryfall API. Currently just a manual check, probably
// need to implement actual testing at some point to confirm that I don't break shit.
async function test_list_parsing() {
  const sample_card_list = `
# Mainboard
4x Lightning Bolt
3 Birds of Paradise
Island
2x Black Lotus`;

  try {
    console.log("Parsing card list...");
    const parsed_list = await list_parse_from_string(sample_card_list);
    console.log("Successfully parsed list:");
    console.log(JSON.stringify(parsed_list, null, 2));
    console.log(`Found ${parsed_list.list.length} unique cards`);

    // Count total cards
    const total_cards = parsed_list.list.reduce((total, card) => total + card.quantity, 0);
    console.log(`Total cards in the list: ${total_cards}`);
  } catch (error) {
    console.error("Error parsing card list:", error);
  }
}
