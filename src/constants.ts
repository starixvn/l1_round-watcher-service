const GameRoundSpecialMapper: { [key: string]: string } = {
  oeturbo: "chanleturbo_phiens",
  dragontiger: "minidragontiger_phiens",
};

const GameRoundOldSuffixMapper = [
  "taixiu",
  "xocxoc",
  "baucua",
  "txturbo",
  "kenopromax",
  "minisedie",
  "baccarat",
  "kenomax",
  "kenomax2",
  "kenomini",
  "kenomini2",
  "kenoeast",
  "kenowest",
  "kenosouth",
  "kenonorth",
  "roulette",
  "vipsedie",
  "blackjack",
  "specialsedie",
  "sicbo",
  "vipfishprawncrab",
  "vipbaccarat",
  "vipsediewar",
  "lottery",
  "kenomatch1",
  "kenomatch2",
  "casinoholdempoker",
  "kenopower1",
  "kenopower2",
  "texasholdempoker",
];

const OperationType: { [key: string]: string } = {
  INSERT: "insert" as const,
};

const StreamWatcherEvent: { [key: string]: string } = {
  CHANGE: "change" as const,
  ERROR: "error" as const,
};

const RoundCollectionMapper = (gameName: string) => {
  const specialMap = GameRoundSpecialMapper[gameName];
  const oldSuffix = GameRoundOldSuffixMapper.includes(gameName) ? `${gameName}_phiens` : undefined;

  return specialMap ?? oldSuffix ?? `${gameName}_rounds`;
};

export { RoundCollectionMapper, OperationType, StreamWatcherEvent };
