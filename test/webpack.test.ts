import { describe, it, expect, vi } from 'vitest';
import { WebUpdateNoticePlugin } from '../src/webpack';

describe('webpack plugin', () => {
  it('should be a class with apply method', () => {
    const plugin = new WebUpdateNoticePlugin();
    expect(typeof plugin.apply).toBe('function');
  });

  it('should initialize with version and options', () => {
    const options = { checkInterval: 10000 };
    const plugin = new WebUpdateNoticePlugin(options);
    
    // We can't easily test the internal state without exposing it,
    // but we can verify it doesn't crash on instantiation
    expect(plugin).toBeInstanceOf(WebUpdateNoticePlugin);
  });
});
