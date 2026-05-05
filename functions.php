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