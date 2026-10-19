/** Produces the secret order in which the bars have to be opened. */
export class CodeGenerator {
  constructor(private readonly length: number) {}

  /** Random permutation of 1..length (Fisher-Yates shuffle). */
  generate(): number[] {
    const code = Array.from({ length: this.length }, (_, i) => i + 1);

    for (let i = code.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [code[i], code[j]] = [code[j], code[i]];
    }

    return code;
  }
}
