import { describe, it, expect, vi } from 'vitest';
import webUpdateNotice from '../src/vite';

describe('vite plugin', () => {
  it('should return a vite plugin object', () => {
    const plugin: any = webUpdateNotice();
    
    expect(plugin.name).toBe('vite-plugin-web-update-notice');
    expect(typeof plugin.configResolved).toBe('function');
    expect(typeof plugin.generateBundle).toBe('function');
    expect(typeof plugin.transformIndexHtml).toBe('function');
  });

  it('should generate version and inject script', () => {
    const plugin: any = webUpdateNotice();
    
    // Simulate configResolved
    plugin.configResolved();
    
    // Simulate generateBundle
    const emitFile = vi.fn();
    plugin.generateBundle.call({ emitFile });
    
    expect(emitFile).toHaveBeenCalledWith(expect.objectContaining({
      type: 'asset',
      fileName: 'version.json'
    }));
    
    const arg = emitFile.mock.calls[0][0];
    const source = JSON.parse(arg.source);
    expect(source).toHaveProperty('version');
    
    // Simulate transformIndexHtml
    const result = plugin.transformIndexHtml('<html><body></body></html>');
    expect(result.html).toBe('<html><body></body></html>');
    expect(result.tags).toHaveLength(1);
    expect(result.tags[0].tag).toBe('script');
    expect(result.tags[0].injectTo).toBe('body');
    expect(result.tags[0].children).toContain(source.version);
  });
});
