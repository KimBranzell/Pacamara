<script>
  import { onMount, onDestroy } from 'svelte';

  export let endpoint = '/wp-json/wp/v2/posts?per_page=5&_embed';

  let query = '';
  let posts = [];
  let loading = false;
  let error = '';

  let debounceTimer;

  function debounce(fn, delay = 300) {
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedLoadPosts = debounce(loadPosts, 300);

  async function loadPosts() {
    loading = true;
    error = '';

    try {
      const url = query
        ? `/wp-json/wp/v2/posts?search=${encodeURIComponent(query)}&per_page=5&_embed`
        : endpoint;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Request failed');
      }

      posts = await response.json();
    } catch {
      error = 'Could not load posts.';
      posts = [];
    } finally {
      loading = false;
    }
  }

  onMount(loadPosts);

  onDestroy(() => {
    clearTimeout(debounceTimer);
  });
</script>

<div class="svelte-post-search">
  <label for="post-search">Search posts</label>
  <input
    id="post-search"
    type="search"
    bind:value={query}
    placeholder="Type to search..."
    on:input={debouncedLoadPosts}
  />

  {#if loading}
    <p>Loading…</p>
  {/if}

  {#if error}
    <p>{error}</p>
  {/if}

  {#if !loading && !error}
    <ul>
      {#each posts as post}
        <li>
          <a href={post.link}>{post.title.rendered}</a>
        </li>
      {/each}
    </ul>
  {/if}
</div>