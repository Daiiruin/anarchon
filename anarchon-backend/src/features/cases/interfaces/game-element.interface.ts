import { ElementType } from '../enums/element-type.enum';

export interface GameElement {
  id: string;
  type: ElementType;
  title: string;
  description?: string;
  imageUrl?: string;
  requiredDiscoveries?: string[];
  data?: Record<string, unknown>;
}
