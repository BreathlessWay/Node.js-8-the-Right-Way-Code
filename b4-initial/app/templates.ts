import {compile} from 'handlebars';

export const main = compile(`
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#welcome">B4</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
		    <span class="navbar-toggler-icon"></span>
		  </button>
     {{#if session.auth}}
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
          	<a class="nav-link" href="#list-bundles">My Bundles</a>
          </li>
          <li class="nav-item">
          	<a  class="nav-link" href="/auth/signout">Sign Out</a>
          </li>
        </ul>
      </div>
      {{/if}}
    </div>
  </nav>
  <div class="container mt-5">
    <div class="b4-alerts"></div>
    <div class="b4-main"></div>
  </div>
`);

export const welcome = compile(`
	<div class="jumbotron">
		<h1>Welcome</h1>
		<p>B4 is an application for creating book bundles.</p>
		<p>Sign in with any of these services to begin.</p>
		{{#if session.auth}}
		<p>View your <a href="#list-bundles">bundles</a>.</p>
		{{else}}
		<div class="row">
			<div class="col-sm-6">
				<a href="/auth/facebook" class="btn btn-block btn-social btn-facebook">
					Sign in with Facebook
					<span class="fa fa-facebook"></span>
				</a>
				<a href="/auth/twitter" class="btn btn-block btn-social btn-twitter">
					Sign in with Twitter
					<span class="fa fa-twitter"></span>
				</a>
				<a href="/auth/google" class="btn btn-block btn-social btn-google">
					Sign in with Google
					<span class="fa fa-google"></span>
				</a>
			</div>
		</div>
		{{/if}}
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
