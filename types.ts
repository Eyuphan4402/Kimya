
export enum UnitType {
  KG = 'kg',
  L = 'L',
  GR = 'gr',
  ML = 'ml'
}

export interface Chemical {
  id: string;
  name: string;
  currentStock: number;
  unit: UnitType;
  minThreshold: number;
  isInfinite: boolean;
  color?: string;
}

export interface RecipeIngredient {
  chemicalId: string;
  amountPer1000L: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
}

export interface ProductionLog {
  id: string;
  recipeId: string;
  recipeName: string;
  amountProduced: number;
  timestamp: number;
  consumedIngredients: {
    chemicalName: string;
    amount: number;
    unit: string;
  }[];
}

export type TabType = 'dashboard' | 'inventory' | 'recipes' | 'history' | 'settings';
