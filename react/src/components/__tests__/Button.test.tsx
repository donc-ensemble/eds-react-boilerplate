import { describe, it, jest } from '@jest/globals';
import { cleanup, render, screen } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('should not call onClick callback if not clicked', () => {
    const callback = jest.fn();

    render(<Button onClick={callback}>Click me</Button>);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call onClick callback when clicked', () => {
    const callback = jest.fn();

    render(<Button onClick={callback}>Click me</Button>);
    screen.getByText('Click me').click();

    expect(callback).toHaveBeenCalled();
  });
});
