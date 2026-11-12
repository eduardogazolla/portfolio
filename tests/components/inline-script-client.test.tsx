import { render } from '@testing-library/react';
import { InlineScript } from '../../app/componentes/inline-script';

describe('InlineScript on the client', () => {
  it('is inert text/plain so React does not warn about a script tag', () => {
    const { container } = render(<InlineScript html="window.__x=1" />);
    expect(container.querySelector('script')).toHaveAttribute('type', 'text/plain');
  });
});
