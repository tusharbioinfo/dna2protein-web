export type ReadingFrame = 1 | 2 | 3;

export type Residue = {
  codon: string;
  code: string;
  threeLetter: string;
  name: string;
  position: number;
  kind: "amino-acid" | "ambiguous" | "partial";
};

export type TranslationResult = {
  protein: string;
  residues: Residue[];
  stopCodon: string | null;
};

export const SAMPLE_SEQUENCE = "ATGCGTACGTTAG";

const GENETIC_CODE: Record<string, string> = {
  ATA: "I", ATC: "I", ATT: "I", ATG: "M",
  ACA: "T", ACC: "T", ACG: "T", ACT: "T",
  AAC: "N", AAT: "N", AAA: "K", AAG: "K",
  AGC: "S", AGT: "S", AGA: "R", AGG: "R",
  CTA: "L", CTC: "L", CTG: "L", CTT: "L",
  CCA: "P", CCC: "P", CCG: "P", CCT: "P",
  CAC: "H", CAT: "H", CAA: "Q", CAG: "Q",
  CGA: "R", CGC: "R", CGG: "R", CGT: "R",
  GTA: "V", GTC: "V", GTG: "V", GTT: "V",
  GCA: "A", GCC: "A", GCG: "A", GCT: "A",
  GAC: "D", GAT: "D", GAA: "E", GAG: "E",
  GGA: "G", GGC: "G", GGG: "G", GGT: "G",
  TCA: "S", TCC: "S", TCG: "S", TCT: "S",
  TTC: "F", TTT: "F", TTA: "L", TTG: "L",
  TAC: "Y", TAT: "Y", TAA: "*", TAG: "*",
  TGC: "C", TGT: "C", TGA: "*", TGG: "W",
};

const AMINO_ACIDS: Record<string, { threeLetter: string; name: string }> = {
  A: { threeLetter: "Ala", name: "Alanine" },
  R: { threeLetter: "Arg", name: "Arginine" },
  N: { threeLetter: "Asn", name: "Asparagine" },
  D: { threeLetter: "Asp", name: "Aspartic acid" },
  C: { threeLetter: "Cys", name: "Cysteine" },
  Q: { threeLetter: "Gln", name: "Glutamine" },
  E: { threeLetter: "Glu", name: "Glutamic acid" },
  G: { threeLetter: "Gly", name: "Glycine" },
  H: { threeLetter: "His", name: "Histidine" },
  I: { threeLetter: "Ile", name: "Isoleucine" },
  L: { threeLetter: "Leu", name: "Leucine" },
  K: { threeLetter: "Lys", name: "Lysine" },
  M: { threeLetter: "Met", name: "Methionine" },
  F: { threeLetter: "Phe", name: "Phenylalanine" },
  P: { threeLetter: "Pro", name: "Proline" },
  S: { threeLetter: "Ser", name: "Serine" },
  T: { threeLetter: "Thr", name: "Threonine" },
  W: { threeLetter: "Trp", name: "Tryptophan" },
  Y: { threeLetter: "Tyr", name: "Tyrosine" },
  V: { threeLetter: "Val", name: "Valine" },
};

export function normalizeSequence(rawSequence: string): string {
  return rawSequence
    .split(/\r?\n/)
    .filter((line) => !line.trimStart().startsWith(">"))
    .join("")
    .replace(/\s+/g, "")
    .toUpperCase();
}

export function translateSequence(
  sequence: string,
  frame: ReadingFrame,
): TranslationResult {
  const residues: Residue[] = [];
  let stopCodon: string | null = null;
  const framedSequence = sequence.slice(frame - 1);

  for (let offset = 0; offset < framedSequence.length; offset += 3) {
    const codon = framedSequence.slice(offset, offset + 3);

    if (codon.length < 3) {
      residues.push({
        codon,
        code: "X",
        threeLetter: "Xaa",
        name: "Incomplete codon",
        position: residues.length + 1,
        kind: "partial",
      });
      break;
    }

    const code = GENETIC_CODE[codon] ?? "X";
    if (code === "*") {
      stopCodon = codon;
      break;
    }

    const aminoAcid = AMINO_ACIDS[code];
    residues.push({
      codon,
      code,
      threeLetter: aminoAcid?.threeLetter ?? "Xaa",
      name: aminoAcid?.name ?? "Ambiguous codon",
      position: residues.length + 1,
      kind: aminoAcid ? "amino-acid" : "ambiguous",
    });
  }

  return {
    protein: residues.map((residue) => residue.code).join(""),
    residues,
    stopCodon,
  };
}