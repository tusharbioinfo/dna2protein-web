# 🧬 DNA2Protein Web — DNA Sequence Translator

**From nucleotide sequence to amino-acid chain, codon by codon.**

DNA2Protein Web is a browser-based bioinformatics tool that translates DNA nucleotide sequences into amino-acid sequences using the standard genetic code. Built with React and TypeScript, it offers an interactive interface for exploring codon-based translation without requiring users to install bioinformatics software.

## Workflow

```text
DNA Sequence / FASTA Input
          ↓
Sequence Normalization
          ↓
Reading Frame Selection (+1, +2, +3)
          ↓
Codon-by-Codon Translation
          ↓
Protein Sequence + Codon Breakdown
```

## Features

- **DNA sequence input:** Paste a raw DNA sequence or FASTA record.
- **Three forward reading frames:** Explore translation in frames +1, +2, and +3.
- **Standard genetic code:** Translate codons into their corresponding amino acids.
- **Codon breakdown:** Inspect each codon, its amino-acid abbreviation, and amino-acid name.
- **Stop-codon handling:** Translation ends at the first stop codon.
- **Ambiguous and incomplete codons:** These are represented as `X`.
- **Copy output:** Copy the translated protein sequence to the clipboard.
- **No separate backend:** Translation runs in the web application.

## Example Input

```text
ATGCGTACGTTAG
```

Enter the sequence in the input area, select a reading frame, and inspect the resulting protein sequence and codon breakdown.

## Run Locally

### Requirements

- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/tusharbioinfo/dna2protein-web.git
cd dna2protein-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Technology Stack

- React
- TypeScript
- Vite
- CSS

## Applications

- Learning the fundamentals of DNA translation and the genetic code
- Exploring how reading-frame selection changes codon interpretation
- Introductory bioinformatics and molecular biology education
- Demonstrating a practical browser-based sequence-analysis workflow

## Project Objective

This project connects molecular biology with computational tool development by making a core bioinformatics concept accessible through a clean, interactive web interface.

## Author

**Tushar Sain**  
Bioinformatics · Genomics · Computational Biology

- **GitHub:** [@tusharbioinfo](https://github.com/tusharbioinfo)
- **Source repository:** [dna2protein-web](https://github.com/tusharbioinfo/dna2protein-web)
- **Related Python project:** [dna2protein](https://github.com/tusharbioinfo/dna2protein)

---

*Note: This application currently provides the three forward reading frames (+1, +2, +3); reverse-strand translation is not listed as a feature.*
