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
    description: 'Hệ cân bằng, không khắc chế hệ nào nhưng chỉ chịu x2 trước Giác đấu và miễn nhiễm với Ma.'
  },
  {
    id: 'Fighting',
    nameVi: 'Giác đấu',
    nameEn: 'Fighting',
    color: '#EF4444',
    bgColor: 'bg-red-700',
    borderColor: 'border-red-500',
    textColor: 'text-red-100',
    iconSymbol: '🥊',
    description: 'Hệ tấn công cận chiến cực mạnh, khắc chế tới 5 hệ: Thường, Đá, Thép, Băng, Bóng tối.'
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
    description: 'Khắc chế Cỏ và Tiên. Chống chịu tốt trước nhiều hệ tấn công cận chiến.'
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
    description: 'Khắc chế Lửa, Điện, Độc, Đá, Thép. Hoàn toàn miễn nhiễm trước các đòn đánh hệ Điện.'
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
    description: 'Khắc chế Cỏ, Giác đấu, Côn trùng. Miễn nhiễm sát thương hệ Đất.'
  },
  {
    id: 'Bug',
    nameVi: 'Côn trùng',
    nameEn: 'Bug',
    color: '#84CC16',
    bgColor: 'bg-lime-600',
    borderColor: 'border-lime-400',
    textColor: 'text-lime-100',
    iconSymbol: '🐛',
    description: 'Khắc chế Cỏ, Siêu linh, Bóng tối.'
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
    description: 'Khắc chế Lửa, Băng, Bay, Côn trùng.'
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
    description: 'Khắc chế Siêu linh và chính hệ Ma. Miễn nhiễm hoàn toàn trước Thường và Giác đấu.'
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
    description: 'Vua phòng thủ trong Pokémon! Kháng tới 10 hệ khác nhau và miễn nhiễm với Độc. Khắc Băng, Đá, Tiên.'
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
    description: 'Khắc chế Cỏ, Băng, Côn trùng, Thép.'
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
    description: 'Hệ đa dụng phổ biến nhất, khắc chế Lửa, Đất, Đá.'
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
    description: 'Tấn công siêu hiệu quả lên Nước và Bay. Chỉ có duy nhất 1 điểm yếu phòng thủ là Đất.'
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
    description: 'Khắc chế Nước, Đất, Đá.'
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
    description: 'Hệ sát thương cao, khắc chế Cỏ, Đất, Bay và Rồng.'
  },
  {
    id: 'Psychic',
    nameVi: 'Siêu linh',
    nameEn: 'Psychic',
    color: '#EC4899',
    bgColor: 'bg-pink-600',
    borderColor: 'border-pink-400',
    textColor: 'text-pink-100',
    iconSymbol: '🔮',
    description: 'Khắc chế Giác đấu và Độc. Đòn đánh không hiệu quả lên Bóng tối.'
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
    description: 'Hệ huyền thoại mạnh mẽ, khắc chế chính hệ Rồng. Không gây sát thương lên Tiên.'
  },
  {
    id: 'Dark',
    nameVi: 'Bóng tối',
    nameEn: 'Dark',
    color: '#475569',
    bgColor: 'bg-zinc-800',
    borderColor: 'border-zinc-500',
    textColor: 'text-zinc-100',
    iconSymbol: '🌑',
    description: 'Khắc chế Siêu linh và Ma. Hoàn toàn miễn nhiễm trước chiêu thức Siêu linh.'
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
    description: 'Khắc chế Giác đấu, Rồng, Bóng tối. Miễn nhiễm trước các đòn đánh hệ Rồng.'
  }
];

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
