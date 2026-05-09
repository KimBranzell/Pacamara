<?php

if ( ! defined( 'PACAMARA_THEME_DIR' ) ) {
	define( 'PACAMARA_THEME_DIR', dirname( __FILE__ ) );
}
if ( ! defined( 'PACAMARA_THEME_URL' ) ) {
	define( 'PACAMARA_THEME_URL', get_template_directory_uri() );
}

if ( file_exists( get_parent_theme_file_path( 'vendor/autoload.php' ) ) ) {
	require_once get_parent_theme_file_path( 'vendor/autoload.php' );
}


use Kucrut\Vite;

/**
 * Determine if the Svelte app should be loaded.
 *
 * @return bool
 * @since 1.0.0
 */
function pacamara_should_load_svelte_app(): bool {
	if ( is_front_page() ) {
		return true;
	}

	return apply_filters( 'pacamara_load_svelte_app', false );
}

add_action('wp_enqueue_scripts', function (): void {
	Vite\enqueue_asset(
		__DIR__ . '/public/build',
		'resources/js/app.js',
		[
			'handle'    => 'my-fse-theme-app',
			'in-footer' => true,
		]
	);

	// Only load Svelte app when needed
	if ( pacamara_should_load_svelte_app() ) {
		Vite\enqueue_asset(
			__DIR__ . '/public/build',
			'resources/js/svelte/main.js',
			[
				'handle'    => 'my-fse-theme-svelte',
				'in-footer' => true,
			]
		);
	}
});

// Add support for Post thumbnails.
add_theme_support( 'post-thumbnails' );
// Add support for responsive embedded content.
add_theme_support( 'responsive-embeds' );
// Add support for Block Styles.
add_theme_support( 'wp-block-styles' );

/**
 * Register block patterns category.
 *
 * @since 1.0.0
 */
function pacamara_register_block_patterns_category() {
	register_block_pattern_category(
		'pacamara',
		array(
			'label' => esc_html__( 'Pacamara', 'pacamara' ),
		)
	);
}

add_action( 'init', 'pacamara_register_block_patterns_category', 9 );

/**
 * Register custom block category.
 */
add_filter( 'block_categories_all', function ( array $categories ): array {
	return array_merge(
		array(
			array(
				'slug'  => 'pacamara',
				'title' => esc_html__( 'Pacamara', 'pacamara' ),
			),
		),
		$categories
	);
}, 10, 1 );

/**
 * Register the hero block with an explicit render callback.
 */
add_action( 'init', function (): void {
	register_block_type(
		PACAMARA_THEME_DIR . '/blocks/hero',
		array(
			'render_callback' => function ( array $attributes, ?string $content, WP_Block $block ): string {
				$inner_content = '';


				if ( ! empty( $content ) ) {
					$inner_content = $content;
				} elseif ( ! empty( $block->inner_blocks ) && count( $block->inner_blocks ) > 0 ) {
					foreach ( $block->inner_blocks as $inner ) {
						$inner_content .= $inner->render();
					}
				} elseif ( ! empty( $block->parsed_block['innerBlocks'] ) ) {
					$registry = WP_Block_Type_Registry::get_instance();
					foreach ( $block->parsed_block['innerBlocks'] as $inner_data ) {
						$inner = new WP_Block( $inner_data, $block->context, $registry );
						$inner_content .= $inner->render();
					}
				}

				$render_file = PACAMARA_THEME_DIR . '/blocks/hero/render.php';
				if ( ! file_exists( $render_file ) ) {
					return '';
				}
				ob_start();
				require $render_file;
				return (string) ob_get_clean();
			},
		)
	);
} );

/**
 * Enqueue the hero block editor script built by Vite.
 *
 * Loads directly from the manifest rather than using Vite\enqueue_asset
 * to avoid the type="module" attribute, since the production build
 * uses IIFE format with global wp.* references.
 */
add_action( 'enqueue_block_editor_assets', function (): void {
	$manifest_path = PACAMARA_THEME_DIR . '/public/build/manifest.json';

	if ( ! file_exists( $manifest_path ) ) {
		return;
	}

	$manifest = wp_json_file_decode( $manifest_path );

	if ( ! $manifest || ! isset( $manifest->{'resources/js/blocks/hero/index.jsx'} ) ) {
		return;
	}

	$entry = $manifest->{'resources/js/blocks/hero/index.jsx'};
	$script_url = PACAMARA_THEME_URL . '/public/build/' . $entry->file;

	wp_enqueue_script(
		'pacamara-hero-editor',
		$script_url,
		array(
			'wp-blocks',
			'wp-element',
			'wp-block-editor',
			'wp-components',
			'wp-i18n',
			'wp-primitives',
			'wp-compose',
			'wp-data',
		),
		null,
		true
	);
} );

add_action( 'wp_head', function (): void {
	if ( is_admin() ) {
		return;
	}
	?>
	<script>
	(function(){var s=localStorage.getItem('pacamara-color-scheme');if(!s)s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.style.colorScheme=s})();
	</script>
	<?php
}, 0 );

add_action( 'wp_footer', function (): void {
	if ( is_admin() ) {
		return;
	}
	?>
	<button id="dm-toggle" type="button" aria-label="Toggle dark mode"><span aria-hidden="true" id="dm-icon">☀️</span></button>
	<script>
	(function(){var b=document.getElementById('dm-toggle'),i=document.getElementById('dm-icon');if(!b)return;var u=function(s){document.documentElement.style.colorScheme=s;localStorage.setItem('pacamara-color-scheme',s);if(i)i.textContent=s==='dark'?'\u{1F319}':'\u{2600}\u{FE0F}'};b.addEventListener('click',function(){u(document.documentElement.style.colorScheme==='dark'?'light':'dark')});if(i&&!i.textContent||i.textContent==='☀️')i.textContent=document.documentElement.style.colorScheme==='dark'?'\u{1F319}':'\u{2600}\u{FE0F}'})();
	</script>
	<?php
} );
