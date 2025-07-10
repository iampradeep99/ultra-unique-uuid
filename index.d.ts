declare class UltraUniqueUUID {
  constructor();
  generate(): string;
  generateV4(): string;
  generateBatch(count: number): string[];
  generateShort(): string;
}

export declare function generate(): string;
export declare function generateV4(): string;
export declare function generateBatch(count: number): string[];
export declare function generateShort(): string;
export declare const UltraUniqueUUID: typeof UltraUniqueUUID;

declare const _default: {
  generate: () => string;
  generateV4: () => string;
  generateBatch: (count: number) => string[];
  generateShort: () => string;
  UltraUniqueUUID: typeof UltraUniqueUUID;
};

export default _default;