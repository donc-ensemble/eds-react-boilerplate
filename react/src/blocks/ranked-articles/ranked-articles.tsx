import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './ranked-articles.scss';

export type RankedArticlesProps = {
  filterBy: string;
  filterByQuery: string;
};

const extractContentFromDOM = (block: HTMLElement): RankedArticlesProps => {
  const div = block.querySelector('div')!;
  const filteredBy = div.querySelector<HTMLDivElement>('div:first-child')!.innerText;
  const filteredByWord = div
    .querySelector<HTMLDivElement>('div:last-child')!
    .innerText.toLowerCase()
    .replaceAll(' ', '-');

  return {
    filterBy: filteredBy,
    filterByQuery: filteredByWord,
  };
};

export const RankedArticles: React.FC<RankedArticlesProps> = ({ filterBy, filterByQuery }: RankedArticlesProps) => {
  return (
    <div className={'ranked-articles-text'}>
      <div className={'ranked-articles-left'}>{filterByQuery}</div>
      <div className="ranked-articles-right">
        <div className="ranked-articles-view">
          <a href={`/${filterBy}/${filterByQuery}`} aria-label="VIEW ALL">
            VIEW ALL
          </a>
        </div>
        <div className="ranked-articles-arrow">
          <a href={`/${filterBy}/${filterByQuery}`}>
            <img src="/icons/hot-topic-arrow.svg" alt="Orange arrow" width="23px" height="16px" />
          </a>
        </div>
      </div>
    </div>
  );
};
RankedArticles.displayName = 'RankedArticles';

const decorate = async (block: HTMLElement) => {
  const rankedArticlesProps = extractContentFromDOM(block);

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <RankedArticles {...rankedArticlesProps} />
    </StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
