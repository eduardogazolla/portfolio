/** @jest-environment node */
import { renderToString } from 'react-dom/server';
import { InlineScript } from '../../app/componentes/inline-script';

describe('InlineScript', () => {
  it('is an executable script in the server HTML, with the code inline', () => {
    const html = renderToString(<InlineScript html="window.__x=1" />);
    expect(html).toContain('type="text/javascript"');
    expect(html).toContain('window.__x=1');
  });
});
