import { describe, it, expect } from 'vitest';
import nuxtModule from '../src/nuxt';

describe('nuxt module', () => {
  it('should be defined', () => {
    expect(nuxtModule).toBeDefined();
    // Nuxt module is a bit tricky to mock fully without nuxt test utils, 
    // so a basic sanity check is fine here.
    expect(typeof nuxtModule).toBe('function');
  });
});
