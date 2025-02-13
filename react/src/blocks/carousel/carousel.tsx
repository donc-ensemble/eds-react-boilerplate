/* eslint-disable */
import React, { StrictMode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { readBlockConfig } from '../../../../scripts/aem.js';
import './carousel.scss';

type CarouselProps = {
  block: HTMLElement;
  blockConfig: [];
};

export const Carousel: React.FC<CarouselProps> = ({ block, blockConfig }: CarouselProps) => {
  const [title, setTitle] = useState<any | null>(null);
  const [carouselData, setCarouselData] = useState<any | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousel = useRef(null);

  useEffect(() => {
    setTitle(blockConfig?.title);
    fetch(blockConfig?.service)
      .then((res) => res.json())
      .then((json) => {
        const carouselItems = json.data;
        setCarouselData(carouselItems);
      });
  }, []);

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  useEffect(() => {
    maxScrollWidth.current = carousel.current ? carousel.current.scrollWidth - carousel.current.offsetWidth : 0;
  }, []);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (carousel.current !== null && carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction) => {
    if (direction === 'prev') {
      setIsPrevDisabled(currentIndex <= 0);
      return currentIndex <= 0;
    }

    if (direction === 'next' && carousel.current !== null && currentIndex > 0) {
      return carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current;
    }

    return false;
  };

  const carouselElements = carouselData?.map((item, index) => {
    return (
      <div className="slider-item" key={index}>
        <a href={item.url}>
          {item.bestseller ? (
            <div className="best-seller">
              <span>Best Seller</span>
            </div>
          ) : (
            ''
          )}
          <div className="slider-image">
            <div className="image-wrapper">
              <picture>
                <source type="image/webp" srcSet={item.image + '?width=200&amp;format=webply&amp;optimize=medium'} />
                <img
                  loading="eager"
                  alt={item.name}
                  src={item.image + '?width=200&amp;format=webply&amp;optimize=medium'}
                  width="200"
                  height="200"
                />
              </picture>
            </div>
          </div>
          <div className="slider-text">
            <strong>{item.name}</strong>
          </div>
          <div className="price">{item.price}</div>
        </a>
      </div>
    );
  });

  return (
    <>
      <div className="default-content-wrapper">
        <h3 id="new-arrivalstop-picks">{title}</h3>
      </div>
      <section className={'slider'}>
        <span className="slider-control prev" onClick={movePrev} disabled={isDisabled('prev')}>
          <i className="gg-chevron-left-o"></i>
        </span>
        <span className="slider-control next" onClick={moveNext} disabled={isDisabled('next')}>
          <i className="gg-chevron-right-o"></i>
        </span>
        <div className="slider-container" data-multislide="false" data-step="sm" ref={carousel}>
          {carouselElements}
        </div>
      </section>
    </>
  );
};
Carousel.displayName = 'Carousel';

const decorate = async (block: HTMLElement) => {
  const blockConfig = readBlockConfig(block);
  block.parentElement?.classList.add('section');
  block.parentElement?.classList.add('carousel-container');

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <Carousel block={block} blockConfig={blockConfig} />
    </StrictMode>,
  );

  return await Promise.resolve();
};

export default decorate;
