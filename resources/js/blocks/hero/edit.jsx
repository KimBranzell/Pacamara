import { useBlockProps, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck, useSetting } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	RadioControl,
	ColorPalette,
	FocalPointPicker,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/buttons',
	'core/button',
	'core/image',
	'core/list',
	'core/shortcode',
];

const TEMPLATE = [
	['core/heading', { level: 1, placeholder: 'Hero Heading' }],
	['core/paragraph', { placeholder: 'Hero subheading text...' }],
	['core/buttons', {}, [
		['core/button', { placeholder: 'Get Started' }],
	]],
];

function getContentWidthLabel(value) {
	const labels = {
		narrow: '640px',
		default: '800px',
		wide: '1200px',
		full: '100%',
	};
	return labels[value] || '800px';
}

function getEntranceAnimationTypeLabel(value) {
	const labels = {
		fadeIn: 'Fade In',
		fadeInUp: 'Fade In Up',
		slideInLeft: 'Slide In Left',
		slideInRight: 'Slide In Right',
	};
	return labels[value] || 'Fade In Up';
}

export default function HeroEdit(props) {
	const { attributes, setAttributes } = props;
	const colors = useSetting('color.palette');

	const blockProps = useBlockProps({
		className: [
			'wp-block-pacamara-hero',
			`has-layout-${attributes.layoutStyle}`,
			`has-content-position-${attributes.contentPosition}`,
			`has-min-height-${attributes.minHeight}`,
			`has-overlay-${attributes.overlayType}`,
			attributes.parallax ? 'has-parallax' : '',
			attributes.showScrollIndicator ? 'has-scroll-indicator' : '',
			attributes.mediaUrl ? 'has-background-image' : '',
			attributes.entranceAnimation ? 'has-entrance-animation' : '',
			attributes.entranceAnimation
				? `has-entrance-${attributes.entranceAnimationType}`
				: '',
			`has-divider-${attributes.dividerStyle}`,
		]
			.filter(Boolean)
			.join(' '),
		style: {
			'--hero-min-height':
				attributes.minHeight !== 'auto' ? attributes.minHeight : undefined,
			'--hero-overlay-opacity': attributes.overlayOpacity / 100,
			'--hero-overlay-color': attributes.overlayColor,
			'--hero-content-max-width': getContentWidthLabel(attributes.contentWidth),
			'--hero-bg-image': attributes.mediaUrl
				? `url(${attributes.mediaUrl})`
				: undefined,
			'--hero-bg-position':
				attributes.mediaUrl && attributes.focalPoint
					? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%`
					: undefined,
		},
	});

	const overlayColorValue = colors?.find(
		(c) => c.color === attributes.overlayColor
	)?.color;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Layout', 'pacamara')} initialOpen={true}>
					<RadioControl
						label={__('Layout Style', 'pacamara')}
						selected={attributes.layoutStyle}
						options={[
							{
								label: __('Centered', 'pacamara'),
								value: 'centered',
							},
							{
								label: __('Split (Image + Content)', 'pacamara'),
								value: 'split',
							},
						]}
						onChange={(value) =>
							setAttributes({ layoutStyle: value })
						}
					/>
					<SelectControl
						label={__('Minimum Height', 'pacamara')}
						value={attributes.minHeight}
						options={[
							{ label: __('Auto', 'pacamara'), value: 'auto' },
							{ label: __('50vh', 'pacamara'), value: '50vh' },
							{ label: __('75vh', 'pacamara'), value: '75vh' },
							{ label: __('100vh', 'pacamara'), value: '100vh' },
						]}
						onChange={(value) =>
							setAttributes({ minHeight: value })
						}
					/>
					<SelectControl
						label={__('Content Width', 'pacamara')}
						value={attributes.contentWidth}
						options={[
							{
								label: __('Narrow (640px)', 'pacamara'),
								value: 'narrow',
							},
							{
								label: __('Default (800px)', 'pacamara'),
								value: 'default',
							},
							{
								label: __('Wide (1200px)', 'pacamara'),
								value: 'wide',
							},
							{
								label: __('Full', 'pacamara'),
								value: 'full',
							},
						]}
						onChange={(value) =>
							setAttributes({ contentWidth: value })
						}
					/>
					<SelectControl
						label={__('Content Vertical Position', 'pacamara')}
						value={attributes.contentPosition}
						options={[
							{
								label: __('Top', 'pacamara'),
								value: 'top',
							},
							{
								label: __('Center', 'pacamara'),
								value: 'center',
							},
							{
								label: __('Bottom', 'pacamara'),
								value: 'bottom',
							},
						]}
						onChange={(value) =>
							setAttributes({ contentPosition: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Background', 'pacamara')}
					initialOpen={false}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									mediaId: media.id,
									mediaUrl: media.url,
								})
							}
							allowedTypes={['image']}
							value={attributes.mediaId}
							render={({ open }) => (
								<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
									<Button onClick={open} variant="secondary">
										{attributes.mediaId
											? __('Change Image', 'pacamara')
											: __('Select Image', 'pacamara')}
									</Button>
									{attributes.mediaUrl && (
										<Button
											onClick={() =>
												setAttributes({
													mediaId: 0,
													mediaUrl: '',
												})
											}
											variant="link"
											isDestructive
										>
											{__('Remove', 'pacamara')}
										</Button>
									)}
								</div>
							)}
						/>
					</MediaUploadCheck>

					{attributes.mediaUrl && (
						<>
							<div style={{ marginTop: '12px' }}>
								<FocalPointPicker
									label={__('Focal Point', 'pacamara')}
									url={attributes.mediaUrl}
									value={attributes.focalPoint}
									onChange={(value) =>
										setAttributes({ focalPoint: value })
									}
								/>
							</div>
							<ToggleControl
								label={__('Parallax Effect', 'pacamara')}
								checked={attributes.parallax}
								onChange={(value) =>
									setAttributes({ parallax: value })
								}
							/>
						</>
					)}
				</PanelBody>

				<PanelBody
					title={__('Overlay', 'pacamara')}
					initialOpen={false}
				>
					<RadioControl
						label={__('Overlay Type', 'pacamara')}
						selected={attributes.overlayType}
						options={[
							{
								label: __('Solid Color', 'pacamara'),
								value: 'solid',
							},
							{
								label: __('Gradient', 'pacamara'),
								value: 'gradient',
							},
						]}
						onChange={(value) =>
							setAttributes({ overlayType: value })
						}
					/>
					<ColorPalette
						label={__('Overlay Color', 'pacamara')}
						colors={colors}
						value={overlayColorValue || attributes.overlayColor}
						onChange={(value) =>
							setAttributes({ overlayColor: value })
						}
						clearable={false}
					/>
					<RangeControl
						label={__('Overlay Opacity', 'pacamara')}
						value={attributes.overlayOpacity}
						onChange={(value) =>
							setAttributes({ overlayOpacity: value })
						}
						min={0}
						max={100}
						step={5}
					/>
				</PanelBody>

				<PanelBody
					title={__('Animation', 'pacamara')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable Entrance Animation', 'pacamara')}
						checked={attributes.entranceAnimation}
						onChange={(value) =>
							setAttributes({ entranceAnimation: value })
						}
					/>
					{attributes.entranceAnimation && (
						<SelectControl
							label={__('Animation Type', 'pacamara')}
							value={attributes.entranceAnimationType}
							options={[
								{
									label: __('Fade In', 'pacamara'),
									value: 'fadeIn',
								},
								{
									label: __('Fade In Up', 'pacamara'),
									value: 'fadeInUp',
								},
								{
									label: __('Slide In Left', 'pacamara'),
									value: 'slideInLeft',
								},
								{
									label: __('Slide In Right', 'pacamara'),
									value: 'slideInRight',
								},
							]}
							onChange={(value) =>
								setAttributes({ entranceAnimationType: value })
							}
						/>
					)}
				</PanelBody>

				<PanelBody
					title={__('Bottom Divider', 'pacamara')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Divider Shape', 'pacamara')}
						value={attributes.dividerStyle}
						options={[
							{
								label: __('None', 'pacamara'),
								value: 'none',
							},
							{
								label: __('Wave', 'pacamara'),
								value: 'wave',
							},
							{
								label: __('Slanted', 'pacamara'),
								value: 'slanted',
							},
							{
								label: __('Curve', 'pacamara'),
								value: 'curve',
							},
						]}
						onChange={(value) =>
							setAttributes({ dividerStyle: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Scroll Indicator', 'pacamara')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Show Scroll Indicator', 'pacamara')}
						checked={attributes.showScrollIndicator}
						onChange={(value) =>
							setAttributes({ showScrollIndicator: value })
						}
					/>
				</PanelBody>

				<PanelBody
					title={__('Advanced', 'pacamara')}
					initialOpen={false}
				>
					<SelectControl
						label={__('Content Source', 'pacamara')}
						help={__(
							'Post mode auto-pulls featured image on single posts.',
							'pacamara'
						)}
						value={attributes.contextMode}
						options={[
							{
								label: __('Manual', 'pacamara'),
								value: 'manual',
							},
							{
								label: __('Post Context', 'pacamara'),
								value: 'post',
							},
						]}
						onChange={(value) =>
							setAttributes({ contextMode: value })
						}
					/>
				</PanelBody>
			</InspectorControls>

			<section {...blockProps}>
				{!!attributes.mediaUrl && (
					<div className="wp-block-pacamara-hero__media">
						{attributes.layoutStyle === 'split' && (
							<img
								className="wp-block-pacamara-hero__image"
								src={attributes.mediaUrl}
								alt=""
								style={{
									objectPosition: attributes.focalPoint
										? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%`
										: '50% 50%',
								}}
							/>
						)}
						<div className="wp-block-pacamara-hero__overlay"></div>
					</div>
				)}

				<div className="wp-block-pacamara-hero__content">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
					/>
				</div>
			</section>
		</>
	);
}
