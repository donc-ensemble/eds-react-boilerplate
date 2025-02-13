import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EmailSignup, EmailSignupProps } from '@/blocks/email-signup/email-signup';
import { describe, it } from '@jest/globals';

describe('Email Sign-up Component', function () {
  it('should render promo banner with label, checkbox label, additionalText and policy', function () {
    // Arrange
    const emailSignupProps: Required<EmailSignupProps> = {
      label: 'Label',
      checkboxLabel: 'Checkbox label',
      additionalText: 'Additional text',
      policy: 'Policy',
    };
    render(<EmailSignup {...emailSignupProps} />);

    // Act

    // Assert
    const label = screen.getByText(emailSignupProps.label);
    expect(label).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    const checkboxLabel = checkbox.nextElementSibling;
    expect(checkboxLabel).toHaveTextContent(emailSignupProps.checkboxLabel);

    const additionalText = screen.getByText(emailSignupProps.additionalText);
    expect(additionalText).toBeInTheDocument();

    const policy = screen.getByText(emailSignupProps.policy);
    expect(policy).toBeInTheDocument();
  });
});
