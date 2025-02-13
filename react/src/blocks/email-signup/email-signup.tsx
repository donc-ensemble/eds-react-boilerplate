import ReactDOM from 'react-dom/client';
import React, { StrictMode, useId } from 'react';
import './email-signup.scss';

export type EmailSignupProps = {
  label?: string;
  checkboxLabel?: string;
  additionalText?: string;
  policy?: string;
};

const extractContentFromDOM = (block: HTMLElement): EmailSignupProps => {
  const label = block.querySelector('div:first-child div p')?.innerHTML;
  const checkboxLabel = block.querySelector('div:nth-of-type(2) div p')?.innerHTML;
  const additionalText = block.querySelector('div:nth-of-type(3) div p:first-child')?.innerHTML;
  const policy = block.querySelector('div:nth-of-type(3) div p:first-child')?.innerHTML;

  return {
    label,
    checkboxLabel,
    additionalText,
    policy,
  };
};

export const EmailSignup: React.FC<EmailSignupProps> = ({
  label,
  checkboxLabel,
  additionalText,
  policy,
}: EmailSignupProps) => {
  const checkboxId = useId();

  return (
    <>
      <div className="label">
        <div>{label}</div>
      </div>
      <div className="input-fields">
        <div className="text-input">
          <label>Email Sign Up</label>
          <input type="text" placeholder="Email Sign Up" />
          <button>Sign Up</button>
        </div>
        <div className="checkbox-input">
          <input type="checkbox" id={checkboxId} />
          <label htmlFor={checkboxId}>{checkboxLabel}</label>
        </div>
      </div>
      <div className="information">
        <div>
          <p>{additionalText}</p>
          <p>{policy}</p>
        </div>
      </div>
    </>
  );
};
EmailSignup.displayName = 'EmailSignup';

const decorate = async (block: HTMLElement) => {
  const emailSignupProps = extractContentFromDOM(block);

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <EmailSignup {...emailSignupProps} />
    </StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
