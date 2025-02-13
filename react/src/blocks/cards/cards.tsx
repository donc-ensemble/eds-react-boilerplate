import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './cards.scss';

type CardsProps = {
  cards: Card[];
  showSecondButton: boolean;
};

type Card = {
  bodySide: {
    title: string | undefined;
    textBody: string | undefined;
    firstButtonText: string;
    firstButtonHref: string;
    secondButtonHref?: string | null;
    secondButtonText?: string | null;
  };
  imageSide: {
    imgSrc: string;
    imgSourceSrc: string;
    imgSourceType: string;
    text: string | undefined;
  };
};

const extractContentFromDOM = (block: HTMLElement): CardsProps => {
  const cards: Card[] = [];

  [...block.children].forEach((row) => {
    if (row.firstElementChild) {
      const firstChild = row.firstElementChild;
      const secondChild = firstChild.nextElementSibling!;
      const imgSourceType = firstChild.querySelector('source')!.getAttribute('type')!;
      const imgSourceSrc = firstChild.querySelector('source')!.getAttribute('srcset')!;
      const img = firstChild.querySelector('img')!.getAttribute('src')!.replace('format=png', 'format=webply');
      const text = firstChild.querySelector('p:nth-of-type(2)')?.innerHTML;
      const title = secondChild?.querySelector('p strong')?.innerHTML;
      const textBody = secondChild?.querySelector('p:nth-of-type(2)')?.innerHTML;
      const [firstButton, secondButton] = secondChild.querySelectorAll('p.button-container a');
      const firstButtonHref = firstButton.getAttribute('href')!;
      const firstButtonText = firstButton.innerHTML;
      const secondButtonHref = secondButton?.getAttribute('href');
      const secondButtonText = secondButton?.innerHTML;

      const card: Card = {
        imageSide: {
          imgSourceType: imgSourceType,
          imgSourceSrc: imgSourceSrc,
          imgSrc: img,
          text,
        },
        bodySide: {
          title: title,
          textBody: textBody,
          firstButtonHref: firstButtonHref,
          firstButtonText: firstButtonText,
          secondButtonHref: secondButtonHref,
          secondButtonText: secondButtonText,
        },
      };
      cards.push(card);
    }
  });

  return {
    cards,
    showSecondButton: block.classList.contains('grid-3'),
  };
};

export const Cards: React.FC<CardsProps> = ({ cards, showSecondButton }: CardsProps) => {
  return (
    <div className={'cards-container'}>
      {cards?.map((card, index) => (
        <div className={'cards-element'} key={index}>
          <div className={'cards-card-image'}>
            <p>
              <picture>
                <source type={card.imageSide.imgSourceType} srcSet={card.imageSide.imgSourceSrc}></source>
                <img loading="lazy" alt="" src={card.imageSide.imgSrc.replace('format=png', 'format=webply')} />
              </picture>
            </p>
            <p>{card.imageSide.text}</p>
          </div>
          <div className={'cards-card-body'}>
            <p>
              <strong>{card.bodySide.title}</strong>
            </p>
            <p>{card.bodySide.textBody}</p>
            <p className="button-container">
              <a href={card.bodySide.firstButtonHref} title={card.bodySide.firstButtonText} className="button">
                {card.bodySide.firstButtonText}
              </a>
            </p>
            {showSecondButton && (
              <p className="button-container">
                <a href={card.bodySide.secondButtonHref!} title={card.bodySide.secondButtonText!} className="button">
                  {card.bodySide.secondButtonText}
                </a>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
Cards.displayName = 'Cards';

const decorate = async (block: HTMLElement) => {
  const cardsProps = extractContentFromDOM(block);

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <Cards {...cardsProps} />
    </StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
