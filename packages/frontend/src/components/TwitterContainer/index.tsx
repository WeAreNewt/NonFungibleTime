import { useEffect } from 'react';

type Props = {
  content: string;
};

export function TwitterContainer({ content }: Props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    document.getElementsByClassName('twitter-embed')[0].appendChild(script);
  }, []);

  return (
    <section className="twitterContainer">
      <div className="twitter-embed">
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          className="twitter-share-button"
          data-text={content}
          data-show-count="false"
          data-size="large"
        >
          Share
        </a>
      </div>
    </section>
  );
}
