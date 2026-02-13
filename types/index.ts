// Skaitch Core Types

export interface SkaitchCanvasState {
  id: string;
  version: string;
  projectName: string;
  width: number;
  height: number;
  layers: Layer[];
  history: HistoryEntry[];
  metadata: ProjectMetadata;
}

export interface ProjectMetadata {
  created: Date;
  modified: Date;
  ai_assists_count: number;
  skaitch_version: string;
  thumbnail?: string;
}

export interface Layer {
  id: string;
  name: string;
  type: 'raster' | 'vector' | 'ai-generated';
  data: string; // base64 or fabric.js JSON
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
  visible: boolean;
  position: number;
}

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface HistoryEntry {
  id: string;
  type: 'draw' | 'ai-assist' | 'erase' | 'transform' | 'layer-change';
  timestamp: Date;
  before: string; // snapshot
  after: string;  // snapshot
  aiPrompt?: string;
  description?: string;
}

// AI Assist Types
export interface AssistRequest {
  type: AssistType;
  canvas: string; // base64 image
  selection?: SelectionArea;
  prompt: string;
  parameters: AssistParameters;
}

export type AssistType =
  | 'SKETCH_TO_ART'
  | 'INPAINT'
  | 'PERFECT_SHAPE'
  | 'STYLE_TRANSFER'
  | 'ENHANCE_DETAIL'
  | 'STRAIGHTEN_LINE'
  | 'COLOR_SUGGESTION'
  | 'CLEAN_SKETCH';

export interface SelectionArea {
  x: number;
  y: number;
  width: number;
  height: number;
  mask?: string; // base64 mask image
}

export interface AssistParameters {
  strength?: number; // 0-100
  preserveColors?: boolean;
  style?: string;
  detailLevel?: 'low' | 'medium' | 'high';
  colorPalette?: string[];
}

export interface AssistResponse {
  success: boolean;
  resultImage: string; // base64
  metadata: {
    model: string;
    processingTime: number;
    prompt: string;
  };
  error?: string;
}

// Drawing Tools
export type ToolType =
  | 'brush'
  | 'eraser'
  | 'shape'
  | 'select'
  | 'fill'
  | 'eyedropper'
  | 'text'
  | 'ai-assist';

export interface Tool {
  type: ToolType;
  size: number;
  color: string;
  opacity: number;
}

export interface BrushSettings extends Tool {
  type: 'brush';
  hardness: number;
  spacing: number;
  pressureSensitive: boolean;
}

export interface ShapeSettings extends Tool {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'line' | 'polygon';
  fill: boolean;
  strokeWidth: number;
}

// NFT Types
export interface SkaitchNFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  properties: NFTProperties;
  skaitch_provenance: SkaitchProvenance;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTProperties {
  category: 'image';
  files: Array<{
    uri: string;
    type: string;
  }>;
  creators: Array<{
    address: string;
    share: number;
  }>;
}

export interface SkaitchProvenance {
  version: string;
  assist_count: number;
  prompts_used: string[];
  models: string[];
  creation_date: string;
  ai_contribution_percent: number;
}

// User Types
export interface User {
  id: string;
  wallet_address: string;
  username?: string;
  created_at: Date;
}

export interface SkaitchProject {
  id: string;
  user_id: string;
  title: string;
  canvas_data: SkaitchCanvasState;
  thumbnail_url?: string;
  width: number;
  height: number;
  created_at: Date;
  updated_at: Date;
  is_public: boolean;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
