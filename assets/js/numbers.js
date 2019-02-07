/**
 * A module for the electronic Manual of the Church of the Nazarene.
 */
var manualNumbers = (function () {

	'use strict'

	// Initial object for returning publicly available methods.
	var publicMethods = {};

	/**
	 * Convert a number into a Roman numeral.
	 * @private
	 * @param  {number|string} The number to convert
	 * @return {string}        A Roman numeral
	 */
	var toRomanNumeral = function (num) {
		var uni = ["","I","II","III","IV","V","VI","VII","VIII","IX"];
		var dec = ["","X","XX","XXX","XL","L","LX","LXX","LXXX","XC"];
		var cen = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"];
		var mil = ["","M","MM","MMM","MMMM","MMMMM","MMMMMM","MMMMMMM","MMMMMMMM","MMMMMMMMMM"]
		var res = []
		if(num / 1000 > 0)
		  res = res.concat(mil[Math.floor(num / 1000)])
		if(num / 100 > 0)
		  res = res.concat(cen[Math.floor((num % 1000) / 100)])
		if(num / 10 > 0)
		  res = res.concat(dec[Math.floor(((num % 1000) % 100) / 10)])
		res = res.concat(uni[Math.floor(((num % 1000) % 100) % 10)])
		return res.join('')
	}

	/**
	 * Insert Manual numbers before the following content:
	 *    - Parts
	 *    - Articles
	 *    - Paragraphs
	 *    - Subparagraphs
	 * @private
	 * @param  {nodeList} A list of one of one the above types of content
	 * @return {object}   HTML using `insertAdjacentHTML()`
	 */
	var numberItems = function (nodeList) {
		var arr = Array.from(nodeList)
		return arr.forEach(function (item) {
			var html
			var index = arr.indexOf(item) + 1
			var parent = item.parentNode.tagName.toLowerCase()
			var parentIndex = function (item) {
				return item.parentNode.parentNode.firstElementChild.firstElementChild.textContent
			}
			if(parent === 'header')
				item.parentNode.classList.contains('part-title')
				? html = '<span>Part ' + toRomanNumeral(index) + '</span>'
				: html = 'Article ' + toRomanNumeral(index) + '. '
			if(parent === 'section')
				html = '<strong>' + index + '.</strong> '
			if(parent === 'article')
				html = '<strong>' + parentIndex(item) + index + '.</strong> '
			return item.insertAdjacentHTML('afterbegin', html)
		})
	}

	/**
	 * Select subparagraphs according to their parent paragraph.
	 * @private
	 * @param  {nodeList} The paragraphs in a given page view
	 * @return {function} Iterate over the subparagraphs by paragraph
	 */
	var getSubparagraphs = function (paragraphs) {
		return paragraphs.forEach(function (paragraph) {
			var paragraph = paragraph.parentNode
			var subparagraphs = paragraph.querySelectorAll('article > p:first-of-type')
			if(subparagraphs.length <= 0 ) return
			return numberItems(subparagraphs)
		})
	}

	/**
	 * Call private `numberItems()` for a given category of content.
	 * @param  {string} The number to convert
	 * @return {function} A Roman numeral
	 */
	publicMethods.insert = function (items) {
		if(!items) return
		if(items === 'parts') {
			var items = document.querySelectorAll('.part-title > h2')
			if(items === undefined) return
			return numberItems(items)
		}
		if(items === 'headings') {
			var items = document.querySelectorAll('.article-title > h3')
			if(items === undefined) return
			return numberItems(items)
		}
		if(items === 'paragraphs') {
			var items = document.querySelectorAll('.content > p:first-of-type')
			if(items === undefined) return
			return numberItems(items) +
				getSubparagraphs(items)
		}
	}

	return publicMethods
})()
