import React, { StrictMode, useCallback, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getMetadata } from '../../../../scripts/aem.js';
import { loadFragment } from '../../../../blocks/fragment/fragment.js';
import './footer.scss';

const CLASS_NAME = 'className';
const SRC_SET = 'srcSet';
const STYLE = 'style';
const COLEMAN_URL = 'https://www.coleman.com/';

enum TagName {
  P = 'P',
  PICTURE = 'PICTURE',
  IMG = 'IMG',
  SOURCE = 'SOURCE',
}

const countryFlags: Record<string, string> = {
  'United States': '/icons/american-flag.svg',
};

export type FooterProps = {
  footerFragment: HTMLElement;
};

const Footer: React.FC<FooterProps> = ({ footerFragment }) => {
  const [firstImageRendered, setFirstImageRendered] = useState(false);

  const parseStyle = useCallback((style: string) => {
    return style
      .split(';')
      .filter((style) => style.trim())
      .reduce((styleObj: Record<string, string>, style) => {
        const [key, value] = style.split(':').map((s) => s.trim());
        if (key && value) {
          const camelCaseKey = key.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
          styleObj[camelCaseKey] = value;
        }
        return styleObj;
      }, {});
  }, []);

  const mapAttributes = useCallback(
    (element: HTMLElement) => {
      return Array.from(element.attributes).reduce(
        (acc, attr) => {
          let name = attr.name;

          if (name === 'class') name = CLASS_NAME;
          if (name === 'srcset') name = SRC_SET;
          if (name === STYLE) {
            acc[name] = parseStyle(attr.value);
          } else {
            acc[name] = attr.value;
          }

          return acc;
        },
        {} as Record<string, string | Record<string, string>>,
      );
    },
    [parseStyle],
  );

  const renderCountryFlag = useCallback(
    (countryName: string, key: string) => (
      <p key={key}>
        <span className="icon icon-country-flag">
          <img
            data-icon-name={`${countryName.toLowerCase().replace(' ', '-')}-flag`}
            src={countryFlags[countryName]}
            alt={`${countryName} Flag`}
            loading="lazy"
          />
        </span>
        {countryName}
      </p>
    ),
    [],
  );

  const renderContent = useCallback(
    (node: ChildNode, key: string): React.ReactNode => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const attributes = mapAttributes(element);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (element.tagName === TagName.P) {
          const countryName = element.textContent?.trim();
          if (countryName && countryFlags[countryName]) {
            return renderCountryFlag(countryName, key);
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (element.tagName === TagName.PICTURE && !firstImageRendered) {
          setFirstImageRendered(true);
          return (
            <a href={COLEMAN_URL} key={`link-${key}`}>
              {React.createElement(
                element.tagName.toLowerCase(),
                { ...attributes, key },
                Array.from(element.childNodes).map((child, idx) => renderContent(child, `${key}-${idx}`)),
              )}
            </a>
          );
        }

        if ([TagName.IMG, TagName.SOURCE].includes(element.tagName as TagName)) {
          return React.createElement(element.tagName.toLowerCase(), {
            ...attributes,
            key,
          });
        }

        return React.createElement(
          element.tagName.toLowerCase(),
          { ...attributes, key },
          Array.from(element.childNodes).map((child, idx) => renderContent(child, `${key}-${idx}`)),
        );
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      return null;
    },
    [firstImageRendered, mapAttributes, renderCountryFlag],
  );

  return (
    <>{Array.from(footerFragment.children).map((child, index) => renderContent(child, `footer-child-${index}`))}</>
  );
};

Footer.displayName = 'Footer';

const decorate = async (block: HTMLElement) => {
  const footerMeta: string | null = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta).pathname : '/footer';
  const footerFragment = await loadFragment(footerPath);

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <Footer footerFragment={footerFragment} />
    </StrictMode>,
  );
};

export default decorate;
