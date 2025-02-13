import React, { StrictMode, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './columns.scss';

type ColumnsProps = {
  leftImageSources?: ImageSource[];
  leftListItems?: ListItem[];
  leftText?: string;
  rightImageSources?: ImageSource[];
};

type ImageSource = { type: string; src: string };
type ListItem = { link: string; text: string };

const extractLeftImageSources = (mainDiv: HTMLDivElement): ImageSource[] => {
  const leftImg = mainDiv.querySelector('picture')!;
  const leftImgSource = leftImg.querySelectorAll('source');
  const leftImgTag = leftImg.querySelector('img')!;

  const sources: ImageSource[] = [];
  leftImgSource.forEach((item) => {
    const sourceItem = {
      type: item.getAttribute('type')!,
      src: item.getAttribute('srcset')!,
    };
    sources.push(sourceItem);
  });

  const pictureItem = {
    type: 'image',
    src: leftImgTag.getAttribute('src')!,
  };
  sources.push(pictureItem);

  return sources.map((item) => ({
    ...item,
    src: item.src.replace('format=png', 'format=webply'),
  }));
};

const extractLeftListItems = (mainDiv: HTMLDivElement): ListItem[] => {
  const list = mainDiv.querySelectorAll('ul li a');
  const leftListItems: ListItem[] = [];
  list.forEach((item) => {
    const listItem = {
      link: item.getAttribute('href')!,
      text: item.getAttribute('title')!,
    };
    leftListItems.push(listItem);
  });

  return leftListItems;
};

const extractRightImageSources = (mainDiv: HTMLDivElement): ImageSource[] => {
  const picture = mainDiv.querySelector('div:nth-of-type(2) picture')!;
  const sources = picture.querySelectorAll('source');
  const img = picture.querySelector('img')!;

  const sourcesList: ImageSource[] = [];
  sources.forEach((item) => {
    const sourceItem = {
      type: item.getAttribute('type')!,
      src: item.getAttribute('srcset')!,
    };
    sourcesList.push(sourceItem);
  });

  const pictureItem = {
    type: 'image',
    src: img.getAttribute('src')!,
  };
  sourcesList.push(pictureItem);

  return sourcesList.map((item) => ({
    ...item,
    src: item.src.replace('format=png', 'format=webply'),
  }));
};

const extractContentFromDOM = (block: HTMLElement): ColumnsProps => {
  const mainDiv = block.querySelector('div')!;

  const leftImageSources = extractLeftImageSources(mainDiv);
  const leftText = mainDiv.querySelector('p:nth-of-type(2)')?.innerHTML;
  const leftListItems = extractLeftListItems(mainDiv);
  const rightImageSources = extractRightImageSources(mainDiv);

  return {
    leftImageSources,
    leftListItems,
    leftText,
    rightImageSources,
  };
};

export const Columns: React.FC<ColumnsProps> = ({ leftImageSources, leftListItems, leftText, rightImageSources }) => {
  const leftListElements = useMemo(
    () =>
      (leftListItems ?? []).map((item, index) => (
        <li key={index}>
          <a href={item.link} title={item.text}>
            {item.text}
          </a>
        </li>
      )),
    [leftListItems],
  );

  const leftImgElements = useMemo(
    () =>
      (leftImageSources ?? []).map((item, index) =>
        item.type !== 'image' ? (
          <source key={index} type={item.type} srcSet={item.src} media="(min-width: 600px)" />
        ) : (
          <img key={index} loading="eager" alt="picture" src={item.src} width="801" height="251" />
        ),
      ),
    [leftImageSources],
  );

  const rightImgElements = useMemo(
    () =>
      (rightImageSources ?? []).map((item, idx) =>
        item.type !== 'image' ? (
          <source key={idx} type={item.type} srcSet={item.src} media="(min-width: 600px)" />
        ) : (
          <img key={idx} loading="lazy" alt="picture" src={item.src} width="533" height="349" />
        ),
      ),
    [rightImageSources],
  );

  return (
    <div>
      <div>
        <p>
          <picture>{leftImgElements}</picture>
        </p>
        <p>{leftText}</p>
        <ul>{leftListElements}</ul>
      </div>
      <div className="columns-img-col">
        <picture>{rightImgElements}</picture>
      </div>
    </div>
  );
};
Columns.displayName = 'Columns';

const decorate = async (block: HTMLElement) => {
  const columnsProps = extractContentFromDOM(block);

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <Columns {...columnsProps} />
    </StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
