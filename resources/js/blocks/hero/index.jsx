import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
import edit from './edit.jsx';

registerBlockType('pacamara/hero', {
	edit,
	save: () => <InnerBlocks.Content />,
});
