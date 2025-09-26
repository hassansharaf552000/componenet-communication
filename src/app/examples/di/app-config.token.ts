import { InjectionToken } from '@angular/core';

export interface AppFeatureConfig { apiBase: string; enableDebug: boolean }

export const APP_FEATURE_CONFIG = new InjectionToken<AppFeatureConfig>('APP_FEATURE_CONFIG');
