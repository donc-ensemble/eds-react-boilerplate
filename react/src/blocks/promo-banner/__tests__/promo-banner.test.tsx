import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PromoBanner, PromoBannerProps } from '@/blocks/promo-banner/promo-banner';
import { describe, it } from '@jest/globals';

describe('Promo Banner Component', function () {
  it('should render promo banner with picture sources and texts', function () {
    // Arrange
    const promoBannerProps: PromoBannerProps = {
      pictureSources: [
        {
          type: 'image',
          src: 'https://example.com/image.jpg',
        },
      ],
      texts: ['Text 1', 'Text 2'],
    };
    render(<PromoBanner {...promoBannerProps} />);

    // Act

    // Assert
    const paragraphs = screen.getAllByRole('paragraph');
    expect(paragraphs).toHaveLength(2);
    paragraphs.forEach((paragraph, index) => {
      expect(paragraph).toHaveTextContent(['Text 1', 'Text 2'][index]);
    });
  });

  it('rendered promo banner matches snapshot', function () {
    // Arrange
    const promoBannerProps: PromoBannerProps = {
      pictureSources: [
        {
          type: 'image',
          src: 'https://example.com/image.jpg',
        },
      ],
      texts: ['Snapshot text 1', 'Snapshot text 2'],
    };
    const { asFragment } = render(<PromoBanner {...promoBannerProps} />);

    // Act

    // Assert
    expect(asFragment()).toMatchSnapshot();
  });
});
