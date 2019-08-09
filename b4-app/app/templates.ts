import {compile} from 'handlebars';

export const main = compile(`
	<div class="container">
		<h1>B4 - Book Bundler</h1>
		<p>${new Date}</p>
		<div class="b4-alerts"></div>
		<div class="b4-main"></div>
	</div>
`);

export const welcome = compile(`
	<div class="jumbotron">
		<h1>Welcome</h1>
		<p>B4 is an application for creating book bundles.</p>
	</div>
`);

export const alert = compile(`
	<div class="alert alert-{{type}} alert-dismissible fade show" role="alert">
		<button class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		{{message}}
	</div>
`);

export const list = compile(`
	<div class="card">
		<div class="card-header">Your Bundles</div>
		{{#if bundles.length}}
			<table class="table">
				<tr>
					<th>Bundle Name</th>
					<th>Actions</th>
				</tr>
				{{#each bundles}}
				<tr>
					<td>
						<a href="#view-bundle/{{id}}">{{name}}</a>
					</td>
					<td>
						<button class="btn btn-warning delete" data-bundle-id="{{id}}">Delete</button>
					</td>
				</tr>
				{{/each}}
			</table>
		{{else}}
		<div class="card-body">
			<p>None yet!</p>
		</div>
		{{/if}}
	</div>
`);

export const add = compile(`
	<div class="card mb-5">
		<div class="card-header">Create a new bundle</div>
		<div class="card-body">
			<form>
				<div class="input-group">
					<input type="text" class="form-control" placeholder="Bundle Name">
					<div class="input-group-append">
						<button class="btn btn-primary" type="submit">Create</button>
					</div>
				</div>
			</form>
		</div>
	</div>
`);

export const detail = compile(`
	<div class="card">
		<div class="card-header">{{name}}</div>
	</div>
`);
