import React from 'react';
import ReactDOM from 'react-dom/client';
import './promo-banner.scss';

export type PromoBannerProps = {
  pictureSources: SourceItem[];
  texts: string[];
};

export type SourceItem = {
  type: string | null;
  src: string | null;
};

const extractPictureSources = (picture: HTMLPictureElement): SourceItem[] => {
  const sources = Array.from(picture.querySelectorAll('source')).map((source) => ({
    type: source.getAttribute('type'),
    src: source.getAttribute('srcset'),
  }));

  const img = picture.querySelector('img');
  if (img) {
    sources.push({
      type: 'image',
      src: img.getAttribute('src'),
    });
  }

  return sources.map((item) => ({
    ...item,
    src: item.src?.replace('format=png', 'format=webply') ?? null,
  }));
};

const extractText = (element: HTMLElement | null): string => {
  return element?.innerHTML || '';
};

const extractContentFromDOM = (block: HTMLElement): PromoBannerProps => {
  const wrapper = block.querySelector('div');
  const picture = wrapper?.querySelector('picture');
  const paragraph = wrapper?.querySelector('p');

  const pictureSources = picture ? extractPictureSources(picture) : [];
  const texts = paragraph
    ? extractText(paragraph)
        .split('<br>')
        .map((p) => p)
    : [];

  return { pictureSources, texts };
};

export const PromoBanner: React.FC<PromoBannerProps> = ({ pictureSources, texts }) => {
  return (
    <div className="wrapper">
      <div>
        <picture>
          {pictureSources.map((source, index) =>
            source.type !== 'image' ? (
              <source key={index} type={source.type || ''} srcSet={source.src || ''} />
            ) : (
              <img key={index} loading="lazy" alt="" src={source.src || ''} width="1600" height="333" />
            ),
          )}
        </picture>
      </div>
      <div>
        {texts.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};
PromoBanner.displayName = 'PromoBanner';

const decorate = async (block: HTMLElement) => {
  const promoBannerProps = extractContentFromDOM(block);

  ReactDOM.createRoot(block).render(
    <React.StrictMode>
      <PromoBanner {...promoBannerProps} />
    </React.StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
