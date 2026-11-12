import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Input } from '../../app/componentes/form/input';
import { Textarea } from '../../app/componentes/form/textarea';

describe.each([
  ['Input', Input],
  ['Textarea', Textarea],
] as const)('%s', (_name, Field) => {
  it('links a visible label via htmlFor', () => {
    render(<Field label="Nome" />);
    const field = screen.getByLabelText('Nome');
    expect(screen.getByRole('textbox', { name: 'Nome' })).toBe(field);
  });

  it('uses a provided id for the label link', () => {
    render(<Field label="Nome" id="custom" />);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('id', 'custom');
  });

  it('links helper text with aria-describedby', () => {
    render(<Field label="Nome" helper="Como devo te chamar" />);
    const field = screen.getByLabelText('Nome');
    const helper = screen.getByText('Como devo te chamar');
    expect(helper.id).not.toBe('');
    expect(field.getAttribute('aria-describedby')).toContain(helper.id);
    expect(field).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('shows the error together with the helper, links both and sets aria-invalid', () => {
    render(<Field label="Nome" helper="Ajuda" error="Campo obrigatorio" />);
    const field = screen.getByLabelText('Nome');
    const error = screen.getByText('Campo obrigatorio');
    const helper = screen.getByText('Ajuda');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field.getAttribute('aria-describedby')).toBe(`${error.id} ${helper.id}`);
    expect(error.className).toMatch(/text-danger/);
    expect(helper.className).toMatch(/text-text-muted/);
  });

  it('has no aria-describedby when there is no helper or error', () => {
    render(<Field label="Nome" />);
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-describedby');
  });

  it('has a line underline with an accent overlay that grows on focus', () => {
    const { container } = render(<Field label="Nome" />);
    const field = screen.getByLabelText('Nome');
    expect(field.className).toMatch(/peer/);
    const lines = container.querySelectorAll('[aria-hidden="true"]');
    expect(lines.length).toBe(2);
    expect(lines[0].className).toMatch(/bg-line/);
    expect(lines[1].className).toMatch(/bg-accent/);
    expect(lines[1].className).toMatch(/origin-left/);
    expect(lines[1].className).toMatch(/scale-x-0/);
    expect(lines[1].className).toMatch(/peer-focus:scale-x-100/);
  });

  it('turns the line danger on error and keeps a danger focus overlay', () => {
    const { container } = render(<Field label="Nome" error="Erro" />);
    const lines = container.querySelectorAll('[aria-hidden="true"]');
    expect(lines[0].className).toMatch(/bg-danger/);
    expect(lines[1].className).not.toMatch(/(^|\s)hidden(\s|$)/);
    expect(lines[1].className).toMatch(/(^|\s)bg-danger(\s|$)/);
    expect(lines[1].className).not.toMatch(/bg-accent/);
    expect(lines[1].className).toMatch(/peer-focus:scale-x-100/);
  });

  it('keeps the label muted, text on focus-within and on error', () => {
    const { rerender } = render(<Field label="Nome" />);
    const label = screen.getByText('Nome');
    expect(label.className).toMatch(/text-text-muted/);
    expect(label.className).toMatch(/group-focus-within:text-text/);
    expect(label.parentElement?.className).toMatch(/(^|\s)group(\s|$)/);
    rerender(<Field label="Nome" error="Erro" />);
    expect(screen.getByText('Nome').className).toMatch(/(^|\s)text-text(\s|$)/);
  });

  it('merges a caller aria-describedby with the helper id', () => {
    render(<Field label="Nome" helper="Ajuda" aria-describedby="extra" />);
    const field = screen.getByLabelText('Nome');
    const helper = screen.getByText('Ajuda');
    expect(field.getAttribute('aria-describedby')).toBe(`extra ${helper.id}`);
  });

  it('keeps only the caller aria-describedby when there is no message', () => {
    render(<Field label="Nome" aria-describedby="extra" />);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-describedby', 'extra');
  });
});

describe('react-hook-form integration', () => {
  type Values = { name: string; message: string };
  const onSubmit = jest.fn();

  const Form = () => {
    const { register, handleSubmit } = useForm<Values>();
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nome" {...register('name')} />
        <Textarea label="Mensagem" {...register('message')} />
        <button type="submit">Enviar</button>
      </form>
    );
  };

  it('register() reads values through the ref', async () => {
    render(<Form />);
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Mensagem'), { target: { value: 'Oi' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({ name: 'Ana', message: 'Oi' });
  });
});
