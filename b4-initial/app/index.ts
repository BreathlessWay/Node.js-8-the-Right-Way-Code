import 'bootstrap';
import '~/bootstrap-social/bootstrap-social.css'
import '~/font-awesome/css/font-awesome.min.css'
import '~/bootstrap/dist/css/bootstrap.min.css';

import {main, welcome, alert, list, add, detail} from './templates';

document.body.innerHTML = main('');

const oMainElement = document.querySelector('.b4-main');

const oAlertsElement = document.querySelector('.b4-alerts');

const showAlert = (message, type = 'danger') => {
	const html = alert({
		type,
		message
	});

	oAlertsElement.insertAdjacentHTML('beforeend', html);
};

const getBundles = async () => {
	const esRes = await fetch('/es/b4/bundle/_search?size=1000');
	const esResBody = await esRes.json();

	return esResBody.hits.hits.map(hit => {
		return {
			id: hit._id,
			name: hit._source.name
		};
	});
};

const addBundle = async (name) => {
	try {

		const bundles = await getBundles();

		const url = `/api/bundle?name=${encodeURIComponent(name)}`;
		const res = await fetch(url, {method: 'POST'});
		const resBody = await res.json();

		bundles.push({id: resBody._id, name});
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

		await fetch(`/api/bundle/${bundleId}`, {method: 'DELETE'});

		bundles.splice(idx, 1);

		listBundles(bundles);

		showAlert(`Bundle deleted`, 'success');
	} catch (err) {
		showAlert(err);
	}
};

const listBundles = bundles => {
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

		const res = await fetch(`/api/bundle/${bundleId}`);
		const resBody = await res.json();
		oMainElement.innerHTML = detail({
			name: resBody._source.name
		});

		showAlert('Bundle found', 'success');

	} catch (err) {
		showAlert(err);
	}

};

const showView = async () => {
	const [view, ...params] = window.location.hash.split('/');

	switch (view) {
		case '#welcome': {
			oMainElement.innerHTML = welcome('');
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

window.addEventListener('hashchange', showView);

showView()
	.catch(() => window.location.hash = '#welcome');
