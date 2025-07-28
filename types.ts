
export type InputType = 'file' | 'text';

export interface KeyIndicator {
  indicator: string;
  status: 'Pass' | 'Fail' | 'Warning';
  details: string;
}

export interface AnalysisResult {
  isGenuine: boolean;
  reason: string;
  keyIndicators: KeyIndicator[];
}
