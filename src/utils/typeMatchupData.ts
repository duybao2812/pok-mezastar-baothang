export type PokemonTypeId = 
  | 'Normal'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Steel'
  | 'Fire'
  | 'Water'
  | 'Electric'
  | 'Grass'
  | 'Ice'
  | 'Psychic'
  | 'Dragon'
  | 'Dark'
  | 'Fairy';

export type MatchupEffectiveness = 'super' | 'normal' | 'not_very' | 'no_effect';

export interface PokemonTypeInfo {
  id: PokemonTypeId;
  nameVi: string;
  nameEn: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconSymbol: string;
  description: string;
}

export const POKEMON_TYPES: PokemonTypeInfo[] = [
  {
    id: 'Normal',
    nameVi: 'Thường',
    nameEn: 'Normal',
    color: '#9CA3AF',
    bgColor: 'bg-stone-600',
    borderColor: 'border-stone-400',
    textColor: 'text-stone-200',
    iconSymbol: '⚪',
    description: 'Hệ cân bằng, không khắc chế hệ nào nhưng chỉ chịu x2 trước Fighting và miễn nhiễm với Ghost.'
  },
  {
    id: 'Fighting',
    nameVi: 'Giác Đấu',
    nameEn: 'Fighting',
    color: '#EF4444',
    bgColor: 'bg-red-700',
    borderColor: 'border-red-500',
    textColor: 'text-red-100',
    iconSymbol: '🥊',
    description: 'Khắc chế tới 5 hệ: Normal, Rock, Steel, Ice, Dark.'
  },
  {
    id: 'Poison',
    nameVi: 'Độc',
    nameEn: 'Poison',
    color: '#A855F7',
    bgColor: 'bg-purple-700',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-100',
    iconSymbol: '☠️',
    description: 'Khắc chế Grass và Fairy. Chống chịu tốt trước nhiều hệ tấn công cận chiến.'
  },
  {
    id: 'Ground',
    nameVi: 'Đất',
    nameEn: 'Ground',
    color: '#D97706',
    bgColor: 'bg-amber-700',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-100',
    iconSymbol: '🏜️',
    description: 'Khắc chế Fire, Electric, Poison, Rock, Steel. Hoàn toàn miễn nhiễm Electric.'
  },
  {
    id: 'Flying',
    nameVi: 'Bay',
    nameEn: 'Flying',
    color: '#38BDF8',
    bgColor: 'bg-sky-600',
    borderColor: 'border-sky-400',
    textColor: 'text-sky-100',
    iconSymbol: '🦅',
    description: 'Khắc chế Grass, Fighting, Bug. Miễn nhiễm Ground.'
  },
  {
    id: 'Bug',
    nameVi: 'Bọ',
    nameEn: 'Bug',
    color: '#84CC16',
    bgColor: 'bg-lime-600',
    borderColor: 'border-lime-400',
    textColor: 'text-lime-100',
    iconSymbol: '🐛',
    description: 'Khắc chế Grass, Psychic, Dark.'
  },
  {
    id: 'Rock',
    nameVi: 'Đá',
    nameEn: 'Rock',
    color: '#B45309',
    bgColor: 'bg-yellow-800',
    borderColor: 'border-yellow-600',
    textColor: 'text-yellow-100',
    iconSymbol: '🪨',
    description: 'Khắc chế Fire, Ice, Flying, Bug.'
  },
  {
    id: 'Ghost',
    nameVi: 'Ma',
    nameEn: 'Ghost',
    color: '#7C3AED',
    bgColor: 'bg-indigo-800',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-100',
    iconSymbol: '👻',
    description: 'Khắc chế Psychic và Ghost. Miễn nhiễm trước Normal và Fighting.'
  },
  {
    id: 'Steel',
    nameVi: 'Thép',
    nameEn: 'Steel',
    color: '#64748B',
    bgColor: 'bg-slate-600',
    borderColor: 'border-slate-400',
    textColor: 'text-slate-100',
    iconSymbol: '⚙️',
    description: 'Vua phòng thủ Pokémon! Kháng tới 10 hệ khác nhau và miễn nhiễm Poison. Khắc Ice, Rock, Fairy.'
  },
  {
    id: 'Fire',
    nameVi: 'Lửa',
    nameEn: 'Fire',
    color: '#F97316',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-400',
    textColor: 'text-orange-100',
    iconSymbol: '🔥',
    description: 'Khắc chế Grass, Ice, Bug, Steel.'
  },
  {
    id: 'Water',
    nameVi: 'Nước',
    nameEn: 'Water',
    color: '#3B82F6',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-100',
    iconSymbol: '💧',
    description: 'Hệ đa dụng phổ biến nhất, khắc chế Fire, Ground, Rock.'
  },
  {
    id: 'Electric',
    nameVi: 'Điện',
    nameEn: 'Electric',
    color: '#EAB308',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-950',
    iconSymbol: '⚡',
    description: 'Tấn công siêu hiệu quả lên Water và Flying. Chỉ có duy nhất 1 điểm yếu phòng thủ là Ground.'
  },
  {
    id: 'Grass',
    nameVi: 'Cỏ',
    nameEn: 'Grass',
    color: '#22C55E',
    bgColor: 'bg-green-600',
    borderColor: 'border-green-400',
    textColor: 'text-green-100',
    iconSymbol: '🌿',
    description: 'Khắc chế Water, Ground, Rock.'
  },
  {
    id: 'Ice',
    nameVi: 'Băng',
    nameEn: 'Ice',
    color: '#06B6D4',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-cyan-300',
    textColor: 'text-cyan-950',
    iconSymbol: '❄️',
    description: 'Sát thương cao, khắc chế Grass, Ground, Flying và Dragon.'
  },
  {
    id: 'Psychic',
    nameVi: 'Siêu Linh',
    nameEn: 'Psychic',
    color: '#EC4899',
    bgColor: 'bg-pink-600',
    borderColor: 'border-pink-400',
    textColor: 'text-pink-100',
    iconSymbol: '🔮',
    description: 'Khắc chế Fighting và Poison. Đòn đánh không hiệu quả lên Dark.'
  },
  {
    id: 'Dragon',
    nameVi: 'Rồng',
    nameEn: 'Dragon',
    color: '#8B5CF6',
    bgColor: 'bg-violet-700',
    borderColor: 'border-violet-400',
    textColor: 'text-violet-100',
    iconSymbol: '🐉',
    description: 'Khắc chế Dragon. Đòn đánh không gây sát thương lên Fairy.'
  },
  {
    id: 'Dark',
    nameVi: 'Bóng Tối',
    nameEn: 'Dark',
    color: '#475569',
    bgColor: 'bg-zinc-800',
    borderColor: 'border-zinc-500',
    textColor: 'text-zinc-100',
    iconSymbol: '🌑',
    description: 'Khắc chế Psychic và Ghost. Hoàn toàn miễn nhiễm trước chiêu thức Psychic.'
  },
  {
    id: 'Fairy',
    nameVi: 'Tiên',
    nameEn: 'Fairy',
    color: '#F472B6',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-950',
    iconSymbol: '✨',
    description: 'Khắc chế Fighting, Dragon, Dark. Miễn nhiễm trước các đòn đánh Dragon.'
  }
];

export const TYPE_TRANSLATIONS: Record<string, { en: string; vi: string }> = {
  'Normal': { en: 'Normal', vi: 'Thường' },
  'Fighting': { en: 'Fighting', vi: 'Giác Đấu' },
  'Poison': { en: 'Poison', vi: 'Độc' },
  'Ground': { en: 'Ground', vi: 'Đất' },
  'Flying': { en: 'Flying', vi: 'Bay' },
  'Bug': { en: 'Bug', vi: 'Bọ' },
  'Rock': { en: 'Rock', vi: 'Đá' },
  'Ghost': { en: 'Ghost', vi: 'Ma' },
  'Steel': { en: 'Steel', vi: 'Thép' },
  'Fire': { en: 'Fire', vi: 'Lửa' },
  'Water': { en: 'Water', vi: 'Nước' },
  'Electric': { en: 'Electric', vi: 'Điện' },
  'Grass': { en: 'Grass', vi: 'Cỏ' },
  'Ice': { en: 'Ice', vi: 'Băng' },
  'Psychic': { en: 'Psychic', vi: 'Siêu Linh' },
  'Dragon': { en: 'Dragon', vi: 'Rồng' },
  'Dark': { en: 'Dark', vi: 'Bóng Tối' },
  'Fairy': { en: 'Fairy', vi: 'Tiên' },

  // Vietnamese aliases
  'Thường': { en: 'Normal', vi: 'Thường' },
  'Giác Đấu': { en: 'Fighting', vi: 'Giác Đấu' },
  'Độc': { en: 'Poison', vi: 'Độc' },
  'Đất': { en: 'Ground', vi: 'Đất' },
  'Bay': { en: 'Flying', vi: 'Bay' },
  'Bọ': { en: 'Bug', vi: 'Bọ' },
  'Đá': { en: 'Rock', vi: 'Đá' },
  'Ma': { en: 'Ghost', vi: 'Ma' },
  'Thép': { en: 'Steel', vi: 'Thép' },
  'Lửa': { en: 'Fire', vi: 'Lửa' },
  'Nước': { en: 'Water', vi: 'Nước' },
  'Điện': { en: 'Electric', vi: 'Điện' },
  'Cỏ': { en: 'Grass', vi: 'Cỏ' },
  'Băng': { en: 'Ice', vi: 'Băng' },
  'Siêu Linh': { en: 'Psychic', vi: 'Siêu Linh' },
  'Rồng': { en: 'Dragon', vi: 'Rồng' },
  'Bóng Tối': { en: 'Dark', vi: 'Bóng Tối' },
  'Tiên': { en: 'Fairy', vi: 'Tiên' }
};

export function formatTypeName(type: string | undefined | null, lang: 'en' | 'vi' | string = 'en'): string {
  if (!type) return '';
  const currentLang = lang === 'vi' ? 'vi' : 'en';
  const clean = type.trim();
  const entry = TYPE_TRANSLATIONS[clean];
  if (entry) {
    return entry[currentLang];
  }
  const norm = normalizePokemonType(clean);
  if (norm) {
    const item = POKEMON_TYPES.find(t => t.id === norm);
    if (item) return currentLang === 'vi' ? item.nameVi : item.nameEn;
  }
  return clean;
}

// 18x18 Matchup Matrix (Attacker rows x Defender cols)
// Returns: 'super' (2x, 🔴), 'not_very' (0.5x, 🔺), 'no_effect' (0x, ❌), or 'normal' (1x, ⚪)
// Note: Attacker is the move type, Defender is the target Pokemon's type.
export const TYPE_CHART_MATRIX: Record<PokemonTypeId, Partial<Record<PokemonTypeId, MatchupEffectiveness>>> = {
  Normal: {
    Rock: 'not_very',
    Ghost: 'no_effect',
    Steel: 'not_very',
  },
  Fighting: {
    Normal: 'super',
    Rock: 'super',
    Steel: 'super',
    Ice: 'super',
    Dark: 'super',
    Flying: 'not_very',
    Poison: 'not_very',
    Bug: 'not_very',
    Psychic: 'not_very',
    Fairy: 'not_very',
    Ghost: 'no_effect',
  },
  Poison: {
    Grass: 'super',
    Fairy: 'super',
    Poison: 'not_very',
    Ground: 'not_very',
    Rock: 'not_very',
    Ghost: 'not_very',
    Steel: 'no_effect',
  },
  Ground: {
    Fire: 'super',
    Electric: 'super',
    Poison: 'super',
    Rock: 'super',
    Steel: 'super',
    Grass: 'not_very',
    Bug: 'not_very',
    Flying: 'no_effect',
  },
  Flying: {
    Grass: 'super',
    Fighting: 'super',
    Bug: 'super',
    Electric: 'not_very',
    Rock: 'not_very',
    Steel: 'not_very',
  },
  Bug: {
    Grass: 'super',
    Psychic: 'super',
    Dark: 'super',
    Fire: 'not_very',
    Fighting: 'not_very',
    Poison: 'not_very',
    Flying: 'not_very',
    Ghost: 'not_very',
    Steel: 'not_very',
    Fairy: 'not_very',
  },
  Rock: {
    Fire: 'super',
    Ice: 'super',
    Flying: 'super',
    Bug: 'super',
    Fighting: 'not_very',
    Ground: 'not_very',
    Steel: 'not_very',
  },
  Ghost: {
    Psychic: 'super',
    Ghost: 'super',
    Normal: 'no_effect',
    Dark: 'not_very',
  },
  Steel: {
    Ice: 'super',
    Rock: 'super',
    Fairy: 'super',
    Fire: 'not_very',
    Water: 'not_very',
    Electric: 'not_very',
    Steel: 'not_very',
  },
  Fire: {
    Grass: 'super',
    Ice: 'super',
    Bug: 'super',
    Steel: 'super',
    Fire: 'not_very',
    Water: 'not_very',
    Rock: 'not_very',
    Dragon: 'not_very',
  },
  Water: {
    Fire: 'super',
    Ground: 'super',
    Rock: 'super',
    Water: 'not_very',
    Grass: 'not_very',
    Dragon: 'not_very',
  },
  Electric: {
    Water: 'super',
    Flying: 'super',
    Electric: 'not_very',
    Grass: 'not_very',
    Dragon: 'not_very',
    Ground: 'no_effect',
  },
  Grass: {
    Water: 'super',
    Ground: 'super',
    Rock: 'super',
    Fire: 'not_very',
    Grass: 'not_very',
    Poison: 'not_very',
    Flying: 'not_very',
    Bug: 'not_very',
    Dragon: 'not_very',
    Steel: 'not_very',
  },
  Ice: {
    Grass: 'super',
    Ground: 'super',
    Flying: 'super',
    Dragon: 'super',
    Fire: 'not_very',
    Water: 'not_very',
    Ice: 'not_very',
    Steel: 'not_very',
  },
  Psychic: {
    Fighting: 'super',
    Poison: 'super',
    Psychic: 'not_very',
    Steel: 'not_very',
    Dark: 'no_effect',
  },
  Dragon: {
    Dragon: 'super',
    Steel: 'not_very',
    Fairy: 'no_effect',
  },
  Dark: {
    Psychic: 'super',
    Ghost: 'super',
    Fighting: 'not_very',
    Dark: 'not_very',
    Fairy: 'not_very',
  },
  Fairy: {
    Fighting: 'super',
    Dragon: 'super',
    Dark: 'super',
    Fire: 'not_very',
    Poison: 'not_very',
    Steel: 'not_very',
  },
};

// Helper to get interaction between attacker and defender
export function getEffectiveness(attacker: PokemonTypeId, defender: PokemonTypeId): MatchupEffectiveness {
  const row = TYPE_CHART_MATRIX[attacker];
  if (!row) return 'normal';
  return row[defender] || 'normal';
}

// Map English/Vietnamese type strings from Mezastar tags to PokemonTypeId
export function normalizePokemonType(typeStr?: string): PokemonTypeId | null {
  if (!typeStr) return null;
  const clean = typeStr.trim().toLowerCase();
  
  const mapping: Record<string, PokemonTypeId> = {
    // English
    'normal': 'Normal',
    'fighting': 'Fighting',
    'poison': 'Poison',
    'ground': 'Ground',
    'flying': 'Flying',
    'bug': 'Bug',
    'rock': 'Rock',
    'ghost': 'Ghost',
    'steel': 'Steel',
    'fire': 'Fire',
    'water': 'Water',
    'electric': 'Electric',
    'grass': 'Grass',
    'ice': 'Ice',
    'psychic': 'Psychic',
    'dragon': 'Dragon',
    'dark': 'Dark',
    'fairy': 'Fairy',
    // Vietnamese
    'thường': 'Normal',
    'thuong': 'Normal',
    'giác đấu': 'Fighting',
    'giac dau': 'Fighting',
    'đấu vật': 'Fighting',
    'độc': 'Poison',
    'doc': 'Poison',
    'đất': 'Ground',
    'dat': 'Ground',
    'bay': 'Flying',
    'sâu bọ': 'Bug',
    'côn trùng': 'Bug',
    'con trung': 'Bug',
    'đá': 'Rock',
    'da': 'Rock',
    'ma': 'Ghost',
    'thép': 'Steel',
    'thep': 'Steel',
    'lửa': 'Fire',
    'lua': 'Fire',
    'hỏa': 'Fire',
    'nước': 'Water',
    'nuoc': 'Water',
    'thủy': 'Water',
    'điện': 'Electric',
    'dien': 'Electric',
    'lôi': 'Electric',
    'cỏ': 'Grass',
    'co': 'Grass',
    'mộc': 'Grass',
    'băng': 'Ice',
    'bang': 'Ice',
    'siêu linh': 'Psychic',
    'sieu linh': 'Psychic',
    'tâm linh': 'Psychic',
    'rồng': 'Dragon',
    'rong': 'Dragon',
    'bóng tối': 'Dark',
    'bong toi': 'Dark',
    'tối': 'Dark',
    'tiên': 'Fairy',
    'tien': 'Fairy'
  };

  return mapping[clean] || null;
}

// Get attacking breakdown for a given type
export function getAttackingProfile(attacker: PokemonTypeId) {
  const supers: PokemonTypeInfo[] = [];
  const normals: PokemonTypeInfo[] = [];
  const notVeries: PokemonTypeInfo[] = [];
  const noEffects: PokemonTypeInfo[] = [];

  POKEMON_TYPES.forEach((def) => {
    const eff = getEffectiveness(attacker, def.id);
    if (eff === 'super') supers.push(def);
    else if (eff === 'not_very') notVeries.push(def);
    else if (eff === 'no_effect') noEffects.push(def);
    else normals.push(def);
  });

  return { supers, normals, notVeries, noEffects };
}

// Get defending breakdown for a given type
export function getDefendingProfile(defender: PokemonTypeId) {
  const weaknesses: PokemonTypeInfo[] = []; // Take 2x damage (super)
  const normals: PokemonTypeInfo[] = []; // Take 1x
  const resistances: PokemonTypeInfo[] = []; // Take 0.5x (not_very)
  const immunities: PokemonTypeInfo[] = []; // Take 0x (no_effect)

  POKEMON_TYPES.forEach((att) => {
    const eff = getEffectiveness(att.id, defender);
    if (eff === 'super') weaknesses.push(att);
    else if (eff === 'not_very') resistances.push(att);
    else if (eff === 'no_effect') immunities.push(att);
    else normals.push(att);
  });

  return { weaknesses, normals, resistances, immunities };
}
