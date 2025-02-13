import React, { StrictMode, useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getMetadata } from '../../../../scripts/aem.js';
import { loadFragment } from '../../../../blocks/fragment/fragment.js';
import './header.scss';

export type HeaderProps = {
  brandItems: BrandItem[];
  headerItems: HeaderItem[];
  navItems: NavItem[];
};
export type BrandItem = {
  link: string;
  imgSrc: string;
  source: string;
  text: string;
};
export type HeaderItem = {
  link: string;
  imgSrc: string;
  source?: string;
  text: string;
};
export type NavItem = {
  link: string;
  text: string;
};

async function extractContentFromDOM(): Promise<HeaderProps> {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const [brandsContainer, headerItemsContainer, navItemsContainer] = fragment.children;

  const brandItems: BrandItem[] = [...brandsContainer.querySelectorAll('p')].map((p) => ({
    link: p.querySelector('a')!.getAttribute('href')!,
    source: p.querySelector('picture source:nth-of-type(2)')!.getAttribute('srcset')!,
    imgSrc: p.querySelector('img')!.getAttribute('src')!.replace('format=png', 'format=webply'),
    text: p.querySelector('img')!.getAttribute('alt')!,
  }));
  const headerItems: HeaderItem[] = [
    {
      link: headerItemsContainer.querySelector('p:first-child a')!.getAttribute('href')!,
      source: headerItemsContainer
        .querySelector('p:first-child a picture source:nth-of-type(2)')!
        .getAttribute('srcset')!,
      imgSrc: headerItemsContainer.querySelector('p:first-child a img')!.getAttribute('src')!,
      text: 'Logo',
    },
    {
      link: '',
      imgSrc: headerItemsContainer.querySelector('p:nth-of-type(2) img')!.getAttribute('src')!,
      text: 'SearchIcon',
    },
    ...[...headerItemsContainer.querySelectorAll('ul li')].map((li) => ({
      link: '',
      imgSrc: li.querySelector('img')!.getAttribute('src')!,
      text: li.querySelector('img')!.getAttribute('data-icon-name')!,
    })),
  ];
  const navItems: NavItem[] = [...navItemsContainer.querySelectorAll<HTMLLIElement>('ul li')].map((li) => ({
    link: li.querySelector('a')?.getAttribute('href') ?? '',
    text: li.outerText,
  }));

  return {
    brandItems: brandItems,
    headerItems: headerItems,
    navItems: navItems,
  };
}

export const Header: React.FC<HeaderProps> = ({ brandItems, headerItems, navItems }: HeaderProps) => {
  const [expanded, setExpanded] = useState(false);
  const [menuLabel, setMenuLabel] = useState('Close navigation');

  const brands = useMemo(
    () =>
      brandItems.map((item, index) => (
        <p key={index}>
          <a href={item.link} title="link">
            <picture>
              <source type="image/webp" srcSet={item.source} />
              <img loading="lazy" alt="{item.text}" src={item.imgSrc} width="54" height="10" />
            </picture>
          </a>
        </p>
      )),
    [brandItems],
  );

  const headerLeftSection = useMemo(
    () => (
      <>
        <p>
          <a href={headerItems[0].link} title={'link'}>
            <picture>
              <source type="image/webp" srcSet={headerItems[0].source}></source>
              <img
                alt={headerItems[0].text}
                src={headerItems[0].imgSrc.replace('format=png', 'format=webply')}
                width={'614'}
                height={'201'}
              ></img>
            </picture>
          </a>
        </p>
        <p>
          <input type={'text'} placeholder={'What are you looking for?'} />
          <span className={'icon icon-search'}>
            <img data-icon-name={'search'} src={headerItems[1].imgSrc} alt={headerItems[1].text} loading="lazy" />
          </span>
        </p>
      </>
    ),
    [headerItems],
  );

  const profileListItem = useCallback(
    (item: HeaderItem, index: number) => (
      <li key={index}>
        <span className={'icon icon-user-profile'}>
          <img data-icon-name="user-profile" src={item.imgSrc} alt={item.text} loading="lazy" />
        </span>
        <div className="tool-link-register">
          <div>
            Welcome <span>⌄</span>
          </div>
          <div className={'links'}>
            <span>Sign In</span> or <span>Register</span>
          </div>
          <div className={'mobile-label'}>Account</div>
        </div>
      </li>
    ),
    [],
  );

  const listItem = useCallback(
    (item: HeaderItem, index: number) => (
      <li key={index}>
        <span className={`icon icon-${item.text}`}>
          <img data-icon-name={item.text} src={item.imgSrc} alt={item.text + 'image'} loading="lazy" />
        </span>
        {item.text === 'shoppingbag' ? 'bag' : 'support'}
      </li>
    ),
    [],
  );

  const headerRightSection = useMemo(
    () =>
      headerItems
        .slice(2)
        .map((item, index) => (item.text === 'userprofile' ? profileListItem(item, index) : listItem(item, index))),
    [headerItems, listItem, profileListItem],
  );

  const navItemsList = useMemo(
    () =>
      navItems.map((item, index) => (
        <li aria-expanded={expanded} key={index}>
          <a href={item.link} title={item.text}>
            {item.text}
          </a>
        </li>
      )),
    [expanded, navItems],
  );

  const toggleMenu = useCallback(() => {
    setMenuLabel(expanded ? 'Close navigation' : 'Open navigation');
    setExpanded(!expanded);
  }, [expanded, setExpanded, setMenuLabel]);

  return (
    <div className={'nav-wrapper'}>
      <nav id="nav" aria-expanded={expanded}>
        <div className={'section nav-brand'} data-section-status={'loaded'}>
          <div className={'default-content-wrapper'}>{brands}</div>
        </div>
        <div className={'section nav-tools'} data-section-status={'loaded'}>
          <div className={'default-content-wrapper'}>
            <div className={'nav-hamburger'}>
              <button type={'button'} aria-controls={'nav'} aria-label={menuLabel} onClick={() => toggleMenu()}>
                <span className={'nav-hamburger-icon'}></span>
              </button>
            </div>
            {headerLeftSection}
            <ul>{headerRightSection}</ul>
          </div>
        </div>
        <div className={'section nav-sections'} data-sections-status={'loaded'}>
          <div className={'default-content-wrapper'}>
            <ul>{navItemsList}</ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
Header.displayName = 'Header';

const decorate = async (block: HTMLElement) => {
  const headerProps = await extractContentFromDOM();

  ReactDOM.createRoot(block).render(
    <StrictMode>
      <Header {...headerProps} />
    </StrictMode>,
  );
};

export default decorate;
