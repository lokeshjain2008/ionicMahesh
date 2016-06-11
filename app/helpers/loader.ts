import {Component} from '@angular/core';

import {Loading,LoadingOptions} from 'ionic-angular';

export class Loader{
	static create(){
		let appLoaderOptions: LoadingOptions = {
			showBackdrop: false,
			dismissOnPageChange: true,
			spinner: 'hide',
			content: 'Loading...'
		};
		return Loading.create(appLoaderOptions);
	}
}