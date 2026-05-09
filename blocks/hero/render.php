<?php
$minHeight = $attributes['minHeight'] ?? '75vh';
$contentWidth = $attributes['contentWidth'] ?? 'default';
$contentPosition = $attributes['contentPosition'] ?? 'center';
$overlayOpacity = $attributes['overlayOpacity'] ?? 40;
$overlayColor = $attributes['overlayColor'] ?? 'light-dark(#C9C1B1, #5E758C)';
$overlayType = $attributes['overlayType'] ?? 'solid';
$mediaUrl = $attributes['mediaUrl'] ?? '';
$mediaId = $attributes['mediaId'] ?? 0;
$focalPoint = $attributes['focalPoint'] ?? array('x' => 0.5, 'y' => 0.5);
$parallax = $attributes['parallax'] ?? false;
$showScrollIndicator = $attributes['showScrollIndicator'] ?? false;
$layoutStyle = $attributes['layoutStyle'] ?? 'centered';
$entranceAnimation = $attributes['entranceAnimation'] ?? true;
$entranceAnimationType = $attributes['entranceAnimationType'] ?? 'fadeInUp';
$dividerStyle = $attributes['dividerStyle'] ?? 'none';
$contextMode = $attributes['contextMode'] ?? 'manual';

if ($contextMode === 'post' && is_singular()) {
	$post_id = get_queried_object_id();
	if (has_post_thumbnail($post_id)) {
		$mediaUrl = get_the_post_thumbnail_url($post_id, 'full');
		$mediaId = get_post_thumbnail_id($post_id);
	}
}

$content_width_map = array(
	'narrow' => '640px',
	'default' => '800px',
	'wide' => '1200px',
	'full' => '100%',
);
$content_max_width = $content_width_map[$contentWidth] ?? '800px';

$css_vars = array(
	'--hero-overlay-opacity: ' . ($overlayOpacity / 100),
	'--hero-overlay-color: ' . $overlayColor,
	'--hero-content-max-width: ' . $content_max_width,
);

if ($minHeight !== 'auto') {
	$css_vars[] = '--hero-min-height: ' . $minHeight;
}

if ($mediaUrl) {
	$bg_pos = ($focalPoint['x'] * 100) . '% ' . ($focalPoint['y'] * 100) . '%';
	$css_vars[] = '--hero-bg-image: url(' . esc_url($mediaUrl) . ')';
	$css_vars[] = '--hero-bg-position: ' . $bg_pos;
}

$classes = array(
	'wp-block-pacamara-hero',
	'has-layout-' . $layoutStyle,
	'has-content-position-' . $contentPosition,
	'has-overlay-' . $overlayType,
	'has-divider-' . $dividerStyle,
);

if ($parallax) {
	$classes[] = 'has-parallax';
}

if ($showScrollIndicator) {
	$classes[] = 'has-scroll-indicator';
}

if ($mediaUrl) {
	$classes[] = 'has-background-image';
}

if ($entranceAnimation) {
	$classes[] = 'has-entrance-animation';
	$classes[] = 'has-entrance-' . $entranceAnimationType;
}

if ($contextMode === 'post') {
	$classes[] = 'is-context-post';
}

$wrapper_attributes = get_block_wrapper_attributes(array(
	'class' => implode(' ', $classes),
	'style' => implode('; ', $css_vars),
));
?>
<section <?php echo $wrapper_attributes; ?>>
	<?php if ($mediaUrl) : ?>
	<div class="wp-block-pacamara-hero__media">
		<?php if ($layoutStyle === 'split') : ?>
			<img
				class="wp-block-pacamara-hero__image"
				src="<?php echo esc_url($mediaUrl); ?>"
				alt=""
				loading="lazy"
				style="object-position: <?php echo esc_attr($bg_pos ?? '50% 50%'); ?>"
			/>
		<?php endif; ?>
		<div class="wp-block-pacamara-hero__overlay"></div>
	</div>
	<?php endif; ?>

	<div class="wp-block-pacamara-hero__content">
		<?php
		echo $inner_content;
		if (empty($inner_content) && isset($block) && ! empty($block->parsed_block['innerBlocks'])) {
			foreach ($block->parsed_block['innerBlocks'] as $inner_data) {
				$inner = new WP_Block($inner_data, $block->available_context ?? array(), $block->registry);
				echo $inner->render();
			}
		}
		?>
	</div>

	<?php if ($showScrollIndicator) : ?>
		<div class="wp-block-pacamara-hero__scroll-indicator" aria-hidden="true">
			<span></span>
		</div>
	<?php endif; ?>

	<?php if ($dividerStyle !== 'none') : ?>
		<div class="wp-block-pacamara-hero__divider" aria-hidden="true">
			<?php if ($dividerStyle === 'wave') : ?>
				<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M0,0 C300,100 700,0 1200,60 L1200,120 L0,120 Z" />
				</svg>
			<?php elseif ($dividerStyle === 'slanted') : ?>
				<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M1200,0 L0,120 L0,0 Z" />
				</svg>
			<?php elseif ($dividerStyle === 'curve') : ?>
				<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" />
				</svg>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</section>
