
export enum AppMode {
  HOME = 'HOME',
  MISTAKE_EXPLANATION = 'MISTAKE_EXPLANATION',
  PROBLEM_PRACTICE = 'PROBLEM_PRACTICE',
  KEY_POINTS = 'KEY_POINTS'
}

export interface AnalysisResult {
  question: string;
  explanation: string;
  answer: string;
  mnemonics?: string; // For lively memory aids
  keyPoints?: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface InfographicData {
  mainTitle: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    color: string;
  }[];
}
