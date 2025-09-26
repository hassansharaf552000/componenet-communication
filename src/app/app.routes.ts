import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'docs', pathMatch: 'full' },
	{ path: 'docs', loadComponent: () => import('./docs/docs.component').then(m => m.DocsComponent) },

	// Input/Output
	{ path: 'examples/input-output', loadComponent: () => import('./examples/input-output/input-output.page').then(m => m.InputOutputPageComponent) },

	// ViewChild
	{ path: 'examples/view-child', loadComponent: () => import('./examples/view-child/view-child.page').then(m => m.ViewChildPageComponent) },

	// Shared Service
	{ path: 'examples/shared-service', loadComponent: () => import('./examples/shared-service/shared-service.page').then(m => m.SharedServicePageComponent) },

	// Router Params & Query Params
	{ path: 'examples/router-params/:id', loadComponent: () => import('./examples/router-params/user-detail.component').then(m => m.UserDetailExampleComponent) },

	// Router State
	{ path: 'examples/router-state', loadComponent: () => import('./examples/router-state/source').then(m => m.RouterStateSourceComponent) },
	{ path: 'examples/router-state/destination', loadComponent: () => import('./examples/router-state/destination').then(m => m.RouterStateDestinationComponent) },

	// Signals
	{ path: 'examples/signals', loadComponent: () => import('./examples/signals/signals.page').then(m => m.SignalsPageComponent) },

	// Content Projection
	{ path: 'examples/content-projection', loadComponent: () => import('./examples/content-projection/content-projection.page').then(m => m.ContentProjectionPageComponent) },

	// InjectionToken
	{ path: 'examples/injection-token', loadComponent: () => import('./examples/di/injection-token.page').then(m => m.InjectionTokenPageComponent) },

	// Storage
	{ path: 'examples/storage', loadComponent: () => import('./examples/storage/storage.page').then(m => m.StoragePageComponent) },

	// RxJS Event Bus
	{ path: 'examples/event-bus', loadComponent: () => import('./examples/event-bus/event-bus.page').then(m => m.EventBusPageComponent) },
	{ path: '**', redirectTo: 'docs' }
];
