import { useMemo, useState } from "react";
import {
  normalizeSequence,
  SAMPLE_SEQUENCE,
  translateSequence,
  type ReadingFrame,
} from "./utils/translation";

type CopyState = "idle" | "copied" | "failed";

function HelixMark() {
  return (
    <svg className="helix-mark" viewBox="0 0 38 38" fill="none" aria-hidden="true">
      <path className="helix-strand helix-strand-a" d="M10 4c19 7 19 23 0 30" />
      <path className="helix-strand helix-strand-b" d="M28 4C9 11 9 27 28 34" />
      <path className="helix-rung" d="M13 7h12M9 13h20M9 25h20M13 31h12" />
      <circle cx="10" cy="4" r="2" fill="currentColor" />
      <circle cx="28" cy="34" r="2" fill="currentColor" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="m3.5 9.2 3.4 3.3 7.6-7.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="9" height="9" rx="1.5" />
      <path d="M12 6V4.5A1.5 1.5 0 0 0 10.5 3h-6A1.5 1.5 0 0 0 3 4.5v6A1.5 1.5 0 0 0 4.5 12H6" />
    </svg>
  );
}

export default function App() {
  const [rawSequence, setRawSequence] = useState(SAMPLE_SEQUENCE);
  const [frame, setFrame] = useState<ReadingFrame>(1);
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const sequence = useMemo(() => normalizeSequence(rawSequence), [rawSequence]);
  const invalidCharacters = useMemo(
    () => [...new Set(sequence.match(/[^ACGTN]/g) ?? [])],
    [sequence],
  );
  const errorMessage = invalidCharacters.length
    ? `Unsupported character${invalidCharacters.length > 1 ? "s" : ""}: ${invalidCharacters.join(", ")}. Use A, C, G, T or N.`
    : null;
  const translation = useMemo(
    () => (sequence && !errorMessage ? translateSequence(sequence, frame) : null),
    [sequence, frame, errorMessage],
  );
  const partialCount =
    translation?.residues.filter((residue) => residue.kind === "partial").length ?? 0;

  function updateSequence(value: string) {
    setRawSequence(value);
    setCopyState("idle");
  }

  async function copyProtein() {
    if (!translation?.protein) return;

    try {
      await navigator.clipboard.writeText(translation.protein);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  const proteinLabel = translation?.protein
    ? `Protein sequence: ${translation.protein}`
    : "No amino acids translated";

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="DNA2Protein home">
          <HelixMark />
          <span className="brand-name">
            dna<span>2</span>protein
          </span>
        </a>
        <div className="header-right">
          <span className="header-caption">A CODON TRANSLATOR</span>
          <a
            className="source-link"
            href="https://github.com/tusharbioinfo/dna2protein"
            target="_blank"
            rel="noreferrer"
          >
            <span>View source</span>
            <ArrowUpRight />
          </a>
        </div>
      </header>

      <main id="top" className="page-content">
        <section className="hero-copy" aria-labelledby="page-title">
          <p className="eyebrow"><span className="eyebrow-mark" />BIOINFORMATICS / SEQUENCE TOOL</p>
          <h1 id="page-title">
            DNA <span className="hero-to">to</span> <span className="hero-protein">protein</span><span className="title-period">.</span>
          </h1>
          <p className="hero-description">
            Translate a nucleotide sequence into its amino-acid chain, codon by codon.
          </p>
        </section>

        <section className="workbench" aria-label="DNA to protein translator">
          <div className="input-pane">
            <div className="section-heading">
              <div className="section-title">
                <span className="step-number">01</span>
                <h2>DNA sequence</h2>
              </div>
              <span className="base-count">{sequence.length} nt</span>
            </div>

            <div className="sequence-editor">
              <div className="editor-topline">
                <span className="editor-title"><span className="editor-light" />SEQUENCE INPUT</span>
                <span className="editor-format">RAW / FASTA</span>
              </div>
              <label className="visually-hidden" htmlFor="dna-sequence">DNA sequence</label>
              <textarea
                id="dna-sequence"
                value={rawSequence}
                onChange={(event) => updateSequence(event.target.value)}
                placeholder="Paste a DNA sequence or FASTA record..."
                spellCheck={false}
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
              />
              <div className="editor-footer">
                <span>Line breaks and FASTA headers are ignored.</span>
                <span>A C G T N</span>
              </div>
            </div>

            <div className="input-actions">
              <button className="text-action sample-action" onClick={() => updateSequence(SAMPLE_SEQUENCE)}>
                <span className="plus-mark">+</span>
                Load repo example
              </button>
              <button className="text-action clear-action" onClick={() => updateSequence("")}>
                Clear sequence
              </button>
            </div>
            {errorMessage ? (
              <p className="validation-message" role="alert">{errorMessage}</p>
            ) : (
              <p className="input-note">Ambiguous bases (N) translate as X.</p>
            )}
          </div>

          <div className="output-pane">
            <div className="section-heading output-heading">
              <div className="section-title">
                <span className="step-number">02</span>
                <h2>Protein output</h2>
              </div>
              <button
                className="copy-action"
                onClick={copyProtein}
                disabled={!translation?.protein}
                aria-label={copyState === "copied" ? "Protein sequence copied" : "Copy protein sequence"}
              >
                <CopyIcon copied={copyState === "copied"} />
                <span>{copyState === "copied" ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy"}</span>
              </button>
            </div>

            <div className="frame-row">
              <span className="frame-label">READING FRAME</span>
              <div className="frame-switch" role="group" aria-label="Reading frame">
                {([1, 2, 3] as const).map((frameOption) => (
                  <button
                    key={frameOption}
                    className={frame === frameOption ? "frame-button is-active" : "frame-button"}
                    type="button"
                    aria-pressed={frame === frameOption}
                    onClick={() => {
                      setFrame(frameOption);
                      setCopyState("idle");
                    }}
                  >
                    +{frameOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="translated-output" aria-live="polite" aria-atomic="true">
              <p className="output-kicker">AMINO-ACID SEQUENCE</p>
              {translation ? (
                <>
                  {translation.protein ? (
                    <div className="protein-sequence" role="img" aria-label={proteinLabel}>
                      {translation.residues.map((residue) => (
                        <span
                          className={residue.kind === "amino-acid" ? "residue" : "residue residue-unknown"}
                          key={`${residue.position}-${residue.codon}`}
                          title={`${residue.codon} - ${residue.name}`}
                          aria-hidden="true"
                        >
                          {residue.code}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-protein">No amino acids before the stop codon.</p>
                  )}
                  <div className="translation-note">
                    <span>{translation.residues.length} {translation.residues.length === 1 ? "residue" : "residues"}</span>
                    <span className="note-divider" />
                    {translation.stopCodon ? (
                      <span>Stopped at <strong>{translation.stopCodon}</strong></span>
                    ) : partialCount ? (
                      <span><strong>X</strong> marks an incomplete codon</span>
                    ) : (
                      <span>Frame +{frame}</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-output">
                  <span className="empty-sequence">---</span>
                  <p>{errorMessage ? "Correct the DNA input to see a translation." : "Enter a DNA sequence to begin."}</p>
                </div>
              )}
            </div>

            {translation && translation.residues.length + (translation.stopCodon ? 1 : 0) > 0 && (
              <details className="codon-breakdown">
                <summary>
                  <span>View codon breakdown</span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
                </summary>
                <div className="codon-table" role="table" aria-label="Codon translation breakdown">
                  <div className="codon-row codon-header" role="row">
                    <span role="columnheader">CODON</span>
                    <span role="columnheader">AA</span>
                    <span role="columnheader">AMINO ACID</span>
                  </div>
                  {translation.residues.map((residue) => (
                    <div className="codon-row" role="row" key={`${residue.position}-${residue.codon}-row`}>
                      <span className="codon-value" role="cell">{residue.codon}</span>
                      <span className={residue.kind === "amino-acid" ? "codon-code" : "codon-code residue-unknown"} role="cell">{residue.code}</span>
                      <span className="codon-name" role="cell">{residue.name}</span>
                    </div>
                  ))}
                  {translation.stopCodon && (
                    <div className="codon-row stop-row" role="row">
                      <span className="codon-value" role="cell">{translation.stopCodon}</span>
                      <span className="codon-code" role="cell">*</span>
                      <span className="codon-name" role="cell">Stop codon</span>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </section>

        <footer className="page-footer">
          <p><span className="footer-mark">i</span>Translation ends at the first stop codon. Incomplete or ambiguous codons appear as X.</p>
          <span className="footer-code">STANDARD GENETIC CODE</span>
        </footer>
      </main>
    </div>
  );
}