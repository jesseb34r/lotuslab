export async function download_mtgjson_allprintings(): Promise<AllPrintingsFile> {
  const response = await fetch(
    "https://mtgjson.com/api/v5/AllPrintings.json.gz",
  );
  if (!response.body) {
    throw new Error("Response body is null");
  }

  const unzip_stream = new DecompressionStream("gzip");
  const unzipped_stream = response.body.pipeThrough(unzip_stream);
  const unzipped_response = new Response(unzipped_stream);
  return (await unzipped_response.json()) as AllPrintingsFile;
}

export type AllPrintingsFile = { meta: Meta; data: Record<string, Set> };
type Meta = {
  date: string;
  version: string;
};
export type Set = {
  baseSetSize: number;
  cards: MTGJsonCardSet[];
  code: string;
  codeV3?: string; // used for a few duel decks I guess?
  parentCode?: string; // is this different from code?
  decks?: MTGJsonDeckSet[];
  // isPartialPreview?: boolean;
  // keyruneCode: string; // maybe use later, this is for the set symbol assets
  languages?: MTGJsonLanguages[];
  // mtgoCode?: string;
  name: string;
  releaseDate: string;
  tokens: MTGJsonCardToken[];
  tokenSetCode?: string;
  // totalSetSize: number; // don't think i need this?
  type: string;
};
export type MTGJsonCardSet = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  attractionLights?: number[];
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  convertedManaCost: number;
  defense?: string;
  duelDeck?: string;
  edhrecRank?: number;
  edhrecSaltiness?: number;
  faceConvertedManaCost?: number;
  faceFlavorName?: string;
  faceManaValue?: number;
  faceName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  frameEffects?: string[];
  frameVersion: string;
  hand?: string;
  hasAlternativeDeckLimit?: boolean;
  hasContentWarning?: boolean;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: MTGJsonIdentifiers;
  isAlternative?: boolean;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isRebalanced?: boolean;
  isReprint?: boolean;
  isReserved?: boolean;
  isStarter?: boolean;
  isStorySpotlight?: boolean;
  isTextless?: boolean;
  isTimeshifted?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  leadershipSkills?: MTGJsonLeadershipSkills;
  legalities: MTGJsonLegalities;
  life?: string;
  loyalty?: string;
  manaCost?: string;
  manaValue: number;
  name: string;
  number: string;
  originalPrintings?: string[];
  originalReleaseDate?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  power?: string;
  printings?: string[];
  promoTypes?: string[];
  rarity: string;
  relatedCards?: MTGJsonRelatedCards;
  rebalancedPrintings?: string[];
  rulings?: MTGJsonRulings[];
  securityStamp?: string;
  setCode: string;
  side?: string;
  signature?: string;
  sourceProducts?: MTGJsonSourceProducts;
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  variations?: string[];
  watermark?: string;
};
export type MTGJsonIdentifiers = {
  mtgArenaId?: string;
  mtgoId?: string;
  multiverseId?: string;
  scryfallId?: string;
  // scryfallCardBackId?: string; // maybe use?
  scryfallOracleId?: string;
  scryfallIllustrationId?: string;
};
export type MTGJsonLeadershipSkills = {
  brawl: boolean;
  commander: boolean;
  oathbreaker: boolean;
};
export type MTGJsonLegalities = {
  alchemy?: string;
  brawl?: string;
  commander?: string;
  duel?: string;
  explorer?: string;
  future?: string;
  gladiator?: string;
  historic?: string;
  historicbrawl?: string;
  legacy?: string;
  modern?: string;
  oathbreaker?: string;
  oldschool?: string;
  pauper?: string;
  paupercommander?: string;
  penny?: string;
  pioneer?: string;
  predh?: string;
  premodern?: string;
  standard?: string;
  standardbrawl?: string;
  timeless?: string;
  vintage?: string;
};

export type MTGJsonRelatedCards = {
  reverseRelated?: string[];
  spellbook?: string[];
};
export type MTGJsonRulings = {
  date: string;
  text: string;
};
export type MTGJsonSourceProducts = {
  etched: string[];
  foil: string[];
  nonfoil: string[];
};

export type MTGJsonDeckSet = {
  code: string;
  commander?: MTGJsonCardSetDeck[];
  mainBoard: MTGJsonCardSetDeck[];
  name: string;
  releaseDate: string | null;
  sealedProductUuids: string[] | null;
  sideBoard: MTGJsonCardSetDeck[];
  type: string;
};
export type MTGJsonCardSetDeck = {
  count: number;
  isFoil?: boolean;
  uuid: string;
};
export type MTGJsonCardToken = {
  artist?: string;
  artistIds?: string[];
  asciiName?: string;
  availability: string[];
  boosterTypes?: string[];
  borderColor: string;
  cardParts?: string[];
  colorIdentity: string[];
  colorIndicator?: string[];
  colors: string[];
  edhrecSaltiness?: number;
  faceName?: string;
  faceFlavorName?: string;
  finishes: string[];
  flavorName?: string;
  flavorText?: string;
  frameEffects?: string[];
  frameVersion: string;
  hasFoil: boolean;
  hasNonFoil: boolean;
  identifiers: MTGJsonIdentifiers;
  isFullArt?: boolean;
  isFunny?: boolean;
  isOnlineOnly?: boolean;
  isOversized?: boolean;
  isPromo?: boolean;
  isReprint?: boolean;
  isTextless?: boolean;
  keywords?: string[];
  language: string;
  layout: string;
  loyalty?: string;
  manaCost?: string;
  name: string;
  number: string;
  orientation?: string;
  originalText?: string;
  originalType?: string;
  otherFaceIds?: string[];
  power?: string;
  promoTypes?: string[];
  relatedCards?: MTGJsonRelatedCards;
  reverseRelated?: string[];
  securityStamp?: string;
  setCode: string;
  side?: string;
  signature?: string;
  sourceProducts?: string[];
  subsets?: string[];
  subtypes: string[];
  supertypes: string[];
  text?: string;
  toughness?: string;
  type: string;
  types: string[];
  uuid: string;
  watermark?: string;
};

export type MTGJsonLanguages =
  | "Ancient Greek"
  | "Arabic"
  | "Chinese Simplified"
  | "Chinese Traditional"
  | "English"
  | "French"
  | "German"
  | "Hebrew"
  | "Italian"
  | "Japanese"
  | "Korean"
  | "Latin"
  | "Phyrexian"
  | "Portuguese (Brazil)"
  | "Russian"
  | "Sanskrit"
  | "Spanish";
