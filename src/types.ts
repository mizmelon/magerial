/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Substance {
  id: string;
  nameJa: string;
  nameEn: string;
  color: string;
  state: 'solid' | 'liquid' | 'gas' | 'transient' | 'special';
  description: string;
  unlockedAtStart: boolean;
  era?: 'primitive' | 'ancient' | 'industrial' | 'modern' | 'biotech' | 'cosmic';
}

export interface Reaction {
  id: string;
  a: string; // Reactant A (alphabetically sorted <= B)
  b: string; // Reactant B
  products: string[]; // 1 or 2 products
  description: string; // Brief chemistry text
}

export interface Cell {
  type: string;
  age: number;
}

export interface DiscoveredData {
  discoveredSubstances: string[]; // List of discovered substance IDs
  triedReactions: string[]; // List of reaction IDs that have been executed
}
