'use strict';

import 'bootstrap';
import '~/bootstrap/dist/css/bootstrap.min.css';

document.body.innerHTML = `
	<div class="container">
		<h1>B4 - Book Bundler</h1>
		<p>${new Date}</p>
		<div class="b4-alerts"></div>
		<div class="b4-main"></div>
	</div>
`;
const oMainElement = document.querySelector('.b4-main');

oMainElement.innerHTML = `
	<div class="jumbotron">
		<h1>Welcome</h1>
		<p>B4 is an application for creating book bundles.</p>
	</div>
`;

const oAlertsElement = document.querySelector('.b4-alerts');

oAlertsElement.innerHTML = `
	<div class="alert alert-success alert-dismissible fade show" role="alert">
		<button class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<strong>Success!</strong> Bootstrap is working.
	</div>
`;
