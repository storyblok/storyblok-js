import {
  apiPlugin,
  isRichTextEmpty,
  renderRichText,
  storyblokEditable,
  storyblokInit,
} from '../src';
import { afterEach, describe, expect, it, vi } from 'vitest';

import richTextFixture from './fixtures/richTextObject.json';
import emptyRichTextFixture from './fixtures/emptyRichTextObject.json';

describe('@storyblok/js', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('api', () => {
    it('is not loaded by default', () => {
      const result = storyblokInit({
        accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt',
      });

      expect(result).toEqual({});
    });

    it('is loaded correctly when using the apiPlugin', async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt',
        use: [apiPlugin],
      });

      const result = await storyblokApi.getAll('cdn/stories');

      expect(result.length).toBeGreaterThan(0);
    });

    it('logs an error if no access token is provided', () => {
      const spy = vi.spyOn(console, 'error');
      storyblokInit({
        accessToken: null,
        apiOptions: { accessToken: null },
        use: [apiPlugin],
      });

      expect(spy).toBeCalledWith(
        'You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication',
      );
    });
  });

  describe('editable', () => {
    it('gets data-blok-c and data-blok-uid', async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt',
        use: [apiPlugin],
      });

      const { data } = await storyblokApi.get('cdn/stories/demo');

      const blok = data.story.content;
      blok._editable = `<!--#storyblok#{"id":${data.story.id},"uid":"${data.story.uid}"}-->`;

      const editableResult = storyblokEditable(blok);

      expect(editableResult['data-blok-c']).toBeDefined();
      expect(editableResult['data-blok-uid']).toBeDefined();
    });
  });

  describe('isRichTextEmpty', () => {
    it('should return true when passing an empty or invalid RichText object', () => {
      storyblokInit({ accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt', bridge: false });
      expect(isRichTextEmpty(emptyRichTextFixture)).toBe(true);
    });
    it('should return false when passing a valid RichText object', () => {
      storyblokInit({ accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt', bridge: false });
      expect(isRichTextEmpty(richTextFixture)).toBe(false);
    });
    it('should return true when passing a falsy value', () => {
      storyblokInit({ accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt', bridge: false });
      expect(isRichTextEmpty('')).toBe(true);
    });
  });

  // TODO: This might change when legacy rich text resolver is removed and
  // the new rich text resolver is implemented instead
  describe('legacy Rich Text Resolver', () => {
    it('should return the rendered HTML when passing a valid RichText object', () => {
      storyblokInit({ accessToken: 'wANpEQEsMYGOwLxwXQ76Ggtt', bridge: false });
      expect(renderRichText(richTextFixture)).toMatchSnapshot();
    });
  });
});
