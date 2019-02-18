// ==UserScript==
// @name        GitHub Download ZIP
// @version     0.1.2
// @description A userscript adds download links so that downloaded filenames include the SHA
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @include     https://github.com/*
// @run-at      document-idle
// @grant       none
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=666427
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://raw.githubusercontent.com/Mottie/Github-userscripts/master/github-download-zip.user.js
// @downloadURL https://raw.githubusercontent.com/Mottie/Github-userscripts/master/github-download-zip.user.js
// ==/UserScript==
(() => {
	"use strict";

	const zipIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" class="octicon" style="vertical-align:text-top">
		<path d="M28.7 7.2a28.4 28.4 0 0 0-5.9-5.9C21.2.1 20.4 0 20 0H4.5A2.5 2.5 0 0 0 2 2.5v27C2 30.9 3.1 32 4.5 32h23c1.4 0 2.5-1.1 2.5-2.5V10c0-.4-.1-1.2-1.3-2.8zm-4.2-1.7c1 1 1.8 1.8 2.3 2.5H22V3.2c.7.5 1.6 1.3 2.5 2.3zm3.5 24c0 .3-.2.5-.5.5h-23a.5.5 0 0 1-.5-.5v-27c0-.3.2-.5.5-.5H20v7c0 .6.4 1 1 1h7v19.5z"/>
		<path d="M8 2h4v2H8V2zM12 4h4v2h-4V4zM8 6h4v2H8V6zM12 8h4v2h-4V8zM8 10h4v2H8v-2zM12 12h4v2h-4v-2zM8 14h4v2H8v-2zM12 16h4v2h-4v-2zM8 26.5c0 .8.7 1.5 1.5 1.5h5c.8 0 1.5-.7 1.5-1.5v-5c0-.8-.7-1.5-1.5-1.5H12v-2H8v8.5zm6-2.5v2h-4v-2h4z"/>
	</svg>`;
	const span = document.createElement("span");
	span.innerHTML = zipIcon;

	const link = document.createElement("a");
	link.className = "btn btn-outline BtnGroup-item tooltipped tooltipped-s ghdz-btn";
	link.setAttribute("aria-label", "Download ZIP");
	link.innerHTML = zipIcon;

	function buildURL(part) {
		const [, user, repo] = window.location.pathname.split("/");
		return `https://api.github.com/repos/${user}/${repo}/zipball/${part}`;
	}

	function updateLinks() {
		// Branch dropdown on main repo page
		const branch = $("summary[data-hotkey='w'] span");
		// Download link in "Clone or Download" dropdown
		const downloadLink = $("a[data-ga-click*='download zip']");
		// Repo commits page
		const commits = $(".commits-listing");

		if (downloadLink && branch) {
			downloadLink.href = buildURL(branch.textContent.trim());
			downloadLink.appendChild(span.cloneNode(true));
		}
		// Branch doesn't matter when you're using the SHA (first 7 values)
		if (commits) {
			[...document.querySelectorAll(".commit-group .commit .commit-links-group")].forEach(group => {
				if (!$(".ghdz-btn", group)) {
					const sha = $(".sha", group).textContent.trim();
					const a = link.cloneNode(true);
					a.href = buildURL(sha);
					group.appendChild(a);
				}
			});
		}
	}

	function $(selector, el) {
		return (el || document).querySelector(selector);
	}

	// DOM targets - to detect GitHub dynamic ajax page loading
	document.addEventListener("ghmo:container", updateLinks);
	updateLinks();

})();