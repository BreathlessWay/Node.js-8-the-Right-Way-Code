import 'bootstrap';
import '~/bootstrap-social/bootstrap-social.css';
import '~/font-awesome/css/font-awesome.min.css';
import '~/bootstrap/dist/css/bootstrap.min.css';

import {main, welcome, alert, list, add, detail} from './templates';

const fetchJSON = async (url, method = 'GET') => {
	try {
		// credentials确保cookie与请求一起发送，默认情况下fetch是不发送cookie的
		const response = await fetch(url, {method, credentials: 'same-origin'});
		return response.json();
	} catch (error) {
		return {error};
	}
};

const showAlert = (message, type = 'danger') => {
	const oAlertsElement = document.querySelector('.b4-alerts');

	const html = alert({
		type,
		message
	});

	oAlertsElement.insertAdjacentHTML('beforeend', html);
};

const getBundles = async () => {
	const bundles = await fetchJSON('/api/list-bundles');

	if (bundles.error) {
		throw bundles.error;
	}
	return bundles;
};

const addBundle = async (name) => {
	try {

		const bundles = await getBundles();

		const url = `/api/bundle?name=${encodeURIComponent(name)}`;
		const bundle = await fetchJSON(url, 'POST');
		if (bundle.error) {
			throw bundles.error;
		}
		bundles.push({id: bundle._id, name});
		listBundles(bundles);

		showAlert(`Bundle "${name}" created!`, 'success');

	} catch (err) {
		showAlert(err);
	}
};

const deleteBundle = async (bundleId) => {
	try {

		const bundles = await getBundles();

		const idx = bundles.findIndex(bundle => bundle.id === bundleId);

		if (idx === -1) {
			throw Error(`Bundle Not Found`);
		}

		await fetchJSON(`/api/bundle/${bundleId}`, 'DELETE');

		bundles.splice(idx, 1);

		listBundles(bundles);

		showAlert(`Bundle deleted`, 'success');
	} catch (err) {
		showAlert(err);
	}
};

const listBundles = bundles => {
	const oMainElement = document.querySelector('.b4-main');

	oMainElement.innerHTML = add('') + list({bundles});

	const oForm = document.querySelector('form');
	oForm.addEventListener('submit', event => {
		event.preventDefault();
		const name = oForm.querySelector('input').value;
		addBundle(name);
	});

	const deleteButtons = document.querySelectorAll('button.delete');
	for (let i = 0; i < deleteButtons.length; i++) {
		const deleteButton = deleteButtons[i];

		deleteButton.addEventListener('click', () => {
			deleteBundle(deleteButton.getAttribute('data-bundle-id'));
		});
	}
};

const detailBundle = async (bundleId) => {
	try {
		const oMainElement = document.querySelector('.b4-main');

		const bundle = await fetchJSON(`/api/bundle/${bundleId}`);
		if (bundle.error) {
			throw bundle.error;
		}
		oMainElement.innerHTML = detail({
			name: bundle.bundle.name
		});

		showAlert('Bundle found', 'success');

	} catch (err) {
		showAlert(err);
	}

};

const showView = async () => {
	const oMainElement = document.querySelector('.b4-main');

	const [view, ...params] = window.location.hash.split('/');

	switch (view) {
		case '#welcome': {
			try {
				const session = await fetchJSON('/api/session');
				oMainElement.innerHTML = welcome({session});
			} catch (error) {
				showAlert(error);
				window.location.hash = '#welcome';
			}
			break;
		}
		case '#list-bundles': {
			const bundles = await getBundles();
			listBundles(bundles);
			break;
		}
		case `#view-bundle`: {
			detailBundle(params[0]);
			break;
		}
		default:
			throw Error(`Unrecognized view ${view}`);
	}
};

(async () => {

	const session = await fetchJSON('/api/session');

	document.body.innerHTML = main({session});

	window.addEventListener('hashchange', showView);

	showView()
		.catch(() => window.location.hash = '#welcome');

})();
