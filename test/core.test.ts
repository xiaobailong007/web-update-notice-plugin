import { describe, it, expect } from 'vitest';
import { generateScript } from '../src/core';

describe('core', () => {
  it('should generate a script with version and default options', () => {
    const version = '1.0.0';
    const options = {};
    const script = generateScript(version, options);
    
    expect(script).toContain('function scriptTemplate(version, options)');
    expect(script).toContain('1.0.0');
    expect(script).toContain('{}');
  });

  it('should include custom options in the generated script', () => {
    const version = '2.0.0';
    const options = {
      checkInterval: 120000,
      base: '/test/',
      autoRefresh: false,
      showButtons: false,
      text: {
        title: 'New Update',
        desc: 'Please refresh',
        cancel: 'Cancel',
        confirm: 'Refresh'
      }
    };
    const script = generateScript(version, options);
    
    expect(script).toContain('2.0.0');
    expect(script).toContain('120000');
    expect(script).toContain('/test/');
    expect(script).toContain('New Update');
    expect(script).toContain('Please refresh');
    expect(script).toContain('Cancel');
    expect(script).toContain('Refresh');
    expect(script).toContain('"autoRefresh":false');
    expect(script).toContain('"showButtons":false');
  });
});
