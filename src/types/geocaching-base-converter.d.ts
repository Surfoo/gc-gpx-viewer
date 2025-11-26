declare module "geocaching-base-converter" {
  export function encode(value: number, prefix: string): string;
  export function decode(value: string): number;
}
