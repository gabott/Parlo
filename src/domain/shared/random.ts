export interface RandomSource {
  next(): number;
}

export const systemRandom: RandomSource = {
  next: () => Math.random(),
};

export class SequenceRandom implements RandomSource {
  private index = 0;

  constructor(private readonly values: readonly number[]) {
    if (values.length === 0 || values.some((value) => value < 0 || value >= 1)) {
      throw new Error("Random sequence values must be in the range [0, 1).");
    }
  }

  next(): number {
    const value = this.values[this.index % this.values.length];
    this.index += 1;
    return value;
  }
}
