export type PixelColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'empty';
export interface PixelCommand { type: 'paint'; x: number; y: number; color: PixelColor }
export interface RepeatPixelCommand { type: 'repeat'; count: number; commands: PixelCommand[] }
export type AnyPixelCommand = PixelCommand | RepeatPixelCommand;

export interface PixelLevel {
  id: number; name: string; description: string; gridSize: number;
  target: (PixelColor | 'empty')[][];
  allowRepeat: boolean; optimalCommands: number;
  tutorial?: { title: string; content: string };
}
