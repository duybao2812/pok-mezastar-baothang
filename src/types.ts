export type TagGrade = 6 | 5 | 4 | 3 | 2;

export type SpecialMechanic = 
  | 'Dynamax' 
  | 'Gigantamax' 
  | 'Mega' 
  | 'Z-Move' 
  | 'Terastal' 
  | 'Double' 
  | 'Chain' 
  | 'None';

export type TagColorTheme = 'black' | 'red' | 'blue' | 'yellow' | 'green' | 'white' | 'purple' | 'special';

export interface MezastarTag {
  id: string; // e.g. "1-2-001"
  name: string; // e.g. "Kyogre"
  vietnameseName?: string;
  japaneseName?: string;
  grade: TagGrade;
  gradeName: 'Superstar' | 'Star' | 'Regular' | 'Special Starter';
  type: string; // Primary type e.g. "Nước"
  typeEn: string; // e.g. "Water"
  secondaryType?: string;
  secondaryTypeEn?: string;
  image: string; // Artwork / Tag visual URL
  energy: number; // Meza Energy / Poke Power e.g. 156
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  moveName: string; // Chiêu thức e.g. "Origin Pulse"
  moveType: string;
  specialMechanic: SpecialMechanic;
  tagColor: TagColorTheme;
  setCode: string; // e.g. "Set 2 (1-2)" or "Promo"
  releaseSeason: string; // e.g. "Double Chain 2" or "Super Series 2"
  description: string;
  quantity: number; // User inventory count
  notes?: string;
  isFavorite?: boolean;
}

export type GradeFilterOption = 'all' | '6' | '5' | '2-4' | 'owned' | 'duplicates' | 'unowned' | 'special';

export type SortOption = 'id' | 'grade-desc' | 'energy-desc' | 'name-asc' | 'quantity-desc';

export interface CollectionStats {
  totalOwnedTags: number;
  totalUniqueTags: number;
  totalCatalogTags: number;
  completionPercentage: number;
  superstarOwned: number;
  superstarTotal: number;
  starOwned: number;
  starTotal: number;
  regularOwned: number;
  regularTotal: number;
  duplicateCount: number;
}

export interface ScanResult {
  is_valid_tag: boolean;
  tag_id?: string;
  name?: string;
  grade?: number;
  special_mechanic?: string;
  confidence?: number;
  detected_features?: string;
  raw_message?: string;
}
