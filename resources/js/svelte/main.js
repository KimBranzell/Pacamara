import { mount } from 'svelte';
import PostSearch from './components/PostSearch.svelte';

document.querySelectorAll('[data-svelte-post-search]').forEach((target) => {
  mount(PostSearch, {
    target,
    props: {
      endpoint: target.dataset.endpoint || '/wp-json/wp/v2/posts?per_page=5&_embed'
    }
  });
});