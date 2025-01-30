interface Symbol {
  id: number;
  symbol: string;
}

interface Section {
  id: number;
  data: Symbol[];
}

export const sideBarSymbols: Section[] = [
  {
    id: 0,
    data: [
      { id: 0, symbol: 'Δ' },
      { id: 1, symbol: '≙' },
      { id: 2, symbol: '⨟' },
      { id: 3, symbol: '⨠' },
      { id: 4, symbol: 'Ξ' },
      { id: 5, symbol: '⧹' },
      { id: 6, symbol: '⨡' },
      { id: 7, symbol: 'pre' },
      { id: 8, symbol: '′' },
      { id: 9, symbol: 'θ' },
      { id: 10, symbol: '⦉' },
      { id: 11, symbol: '⦊' },
    ],
  },
  {
    id: 1,
    data: [
      { id: 0, symbol: '∧' },
      { id: 1, symbol: '∨' },
      { id: 2, symbol: '¬' },
      { id: 3, symbol: '⇒' },
      { id: 4, symbol: '⊢' },
      { id: 5, symbol: '∀' },
      { id: 6, symbol: '∃' },
      { id: 7, symbol: '∃1' },
      { id: 8, symbol: '⇔' },
      { id: 9, symbol: '≠' },
    ],
  },
  {
    id: 2,
    data: [
      { id: 0, symbol: '∅' },
      { id: 1, symbol: 'ℙ' },
      { id: 2, symbol: 'ℙ1' },
      { id: 3, symbol: '⦁' },
      { id: 4, symbol: '∈' },
      { id: 5, symbol: '∉' },
      { id: 6, symbol: '⊆' },
      { id: 7, symbol: '⊂' },
      { id: 8, symbol: '⟪' },
      { id: 9, symbol: '⟫' },
      { id: 10, symbol: '∖' },
      { id: 11, symbol: '⊖' },
      { id: 12, symbol: '∪' },
      { id: 13, symbol: '∩' },
      { id: 14, symbol: '⋃' },
      { id: 15, symbol: '⋂' },
    ],
  },
  {
    id: 3,
    data: [
      { id: 0, symbol: '↔' },
      { id: 1, symbol: '↦' },
      { id: 2, symbol: '×' },
      { id: 3, symbol: '⨾' },
      { id: 4, symbol: '∘' },
      { id: 5, symbol: '⊕' },
      { id: 6, symbol: '∼' },
      { id: 7, symbol: '+' },
      { id: 8, symbol: '*' },
      { id: 9, symbol: '⦇' },
      { id: 10, symbol: '⦈' },
      { id: 11, symbol: '◁' },
      { id: 12, symbol: '▷' },
      { id: 13, symbol: '⩤' },
      { id: 14, symbol: '⩥' },
    ],
  },
  {
    id: 4,
    data: [
      { id: 0, symbol: '⇸' },
      { id: 1, symbol: '⤔' },
      { id: 2, symbol: '⤀' },
      { id: 3, symbol: '⤗' },
      { id: 4, symbol: '→' },
      { id: 5, symbol: '↣' },
      { id: 6, symbol: '↠' },
      { id: 7, symbol: '⤖' },
      { id: 8, symbol: '⇻' },
      { id: 9, symbol: '⤕' },
      { id: 10, symbol: 'λ' },
      { id: 11, symbol: 'μ' },
    ],
  },
  {
    id: 5,
    data: [
      { id: 0, symbol: 'ℤ' },
      { id: 1, symbol: 'ℚ' },
      { id: 2, symbol: 'ℝ' },
      { id: 3, symbol: 'ℕ' },
      { id: 4, symbol: 'ℕ1' },
      { id: 5, symbol: '≤' },
      { id: 6, symbol: '≥' },
      { id: 7, symbol: '÷' },
      { id: 8, symbol: '−' },
      { id: 9, symbol: 'mod' },
    ],
  },
  {
    id: 6,
    data: [
      { id: 0, symbol: '⟨' },
      { id: 1, symbol: '⟩' },
      { id: 2, symbol: '↿' },
      { id: 3, symbol: '↾' },
      { id: 4, symbol: '⁀' },
      { id: 5, symbol: '⁀/' },
    ],
  },
  {
    id: 7,
    data: [
      { id: 0, symbol: '⟦' },
      { id: 1, symbol: '⟧' },
      { id: 2, symbol: '⊎' },
      { id: 3, symbol: '⩁' },
      { id: 4, symbol: '⊗' },
      { id: 5, symbol: '⋿' },
      { id: 6, symbol: '⊑' },
      { id: 7, symbol: '♯' },
    ],
  },
];
