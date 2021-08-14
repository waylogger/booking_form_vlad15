import path from 'path';
import { Configuration } from 'webpack';
import 'webpack-dev-server';

const IS_DEV: boolean = process.env.NODE_ENV === 'development' ? true : false;
const IS_PROD: boolean = !IS_DEV;
const mode: string = IS_DEV ? 'development' : 'production';

const config: Configuration = {
	target: "web",
	mode: IS_PROD ? 'production' : 'development',
	entry: './dist/bundle.js',
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: 'bundle.pack.js',
	},
}



export default config;
