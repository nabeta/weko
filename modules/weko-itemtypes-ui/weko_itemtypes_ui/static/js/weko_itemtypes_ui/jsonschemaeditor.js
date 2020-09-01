/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	window.JSONSchemaEditor = function (element, options) {
		if (!(element instanceof Element)) {
			throw new Error('element should be an instance of Element');
		}
		options = options || {};
		this.element = element;
		this.options = options;
		this.init();
	};

	JSONSchemaEditor.prototype = {
		// necessary since we remove the ctor property by doing a literal assignment. Without this
		// the $isplainobject function will think that this is a plain object.
		constructor: JSONSchemaEditor,
		init: function init() {
			var self = this;
			var startval = self.options.startval || {};
			var editor = self.options.editor || false;

			var data = JSON.parse(JSON.stringify(startval));

			this.react = ReactDOM.render(React.createElement(SchemaObject, { onChange: self.onChange, data: data, editor: editor }), self.element);
			this.callbacks = {};
		},
		on: function on(event, callback) {
			this.react.on(event, callback);
		},
		onChange: function onChange() {},
		exportForm: function exportForm() {
			var parentkey = 'parentkey';
			var parentkey_pre = parentkey + '.';
			var parentkeys_pre = parentkey + '[].';
			var item = this.react.exportForm(parentkey_pre);
			var items = this.react.exportForm(parentkeys_pre);
			return { form: {
					items: item,
					key: parentkey,
					type: "fieldset"
				}, forms: {
					items: items,
					key: parentkey,
					add: "New",
					style: {
						add: "btn-success"
					}
				} };
		},
		getValue: function getValue() {
			return this.react.export();
		},
		setValue: function setValue(options) {
			this.options = options;
			this.init();
		}
	};

	var SchemaText = React.createClass({
		displayName: 'SchemaText',

		render: function render() {
			return React.createElement('div', null);
		}
	});

	var SchemaTextarea = React.createClass({
		displayName: 'SchemaTextarea',

		render: function render() {
			return React.createElement('div', null);
		}
	});

	var SchemaDateTime = React.createClass({
		displayName: 'SchemaDateTime',

		render: function render() {
			return React.createElement('div', null);
		}
	});

	var SchemaCheckboxes = React.createClass({
		displayName: 'SchemaCheckboxes',

		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(props) {
			var data = props.data; //get enum for checkboxes
			if (data.hasOwnProperty('enum') && data.enum.length > 0) {
				data.enum = data.enum.join('|');
			} else {
				data.enum = '';
			}
			return data;
		},
		componentDidUpdate: function componentDidUpdate() {
			this.props.onChange();
		},
		handleChange: function handleChange(event) {
			this.state.enum = event.target.value;
			this.setState(this.state);
		},
		exportTitleMap: function exportTitleMap() {
			var titleMap = [];
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			arr.forEach(function (element) {
				titleMap.push({ value: element, name: element });
			});
			return titleMap;
		},
		export: function _export() {
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			return {
				type: "array",
				format: "checkboxes",
				enum: arr
			};
		},
		render: function render() {
			var self = this;
			let is_write = self.state.hasOwnProperty('editAble') ? self.state.editAble : false;
			is_write = is_write || self.props.editor;
			return React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-md-10 col-lg-10' },
					React.createElement('input', {
						type: 'text', name: 'titlemap', className: 'form-control', disabled: !is_write,
						onChange: self.handleChange, value: self.state.enum,
						placeholder: 'Separate options with the | character ' })
				)
			);
		}
	});

	var SchemaRadios = React.createClass({
		displayName: 'SchemaRadios',

		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(props) {
			var data = props.data;
			if (data.hasOwnProperty('enum') && data.enum.length > 0) {
				data.enum = data.enum.join('|');
			} else {
				data.enum = '';
			}
			return data;
		},
		componentDidUpdate: function componentDidUpdate() {
			this.props.onChange();
		},
		handleChange: function handleChange(event) {
			this.state.enum = event.target.value;
			this.setState(this.state);
		},
		exportTitleMap: function exportTitleMap() {
			var titleMap = [];
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			arr.forEach(function (element) {
				titleMap.push({ value: element, name: element });
			});
			return titleMap;
		},
		export: function _export() {
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			return {
				type: "string",
				format: "radios",
				enum: arr
			};
		},
		render: function render() {
			var self = this;
			let is_write = self.state.hasOwnProperty('editAble') ? self.state.editAble : false;
			is_write = is_write || self.props.editor;
			return React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-md-10 col-lg-10' },
					React.createElement('input', {
						type: 'text', name: 'titlemap', className: 'form-control', disabled: !is_write,
						onChange: self.handleChange, value: self.state.enum,
						placeholder: 'Separate options with the | character ' }
					)
				)
			);
		}
	});

	var SchemaSelect = React.createClass({
		displayName: 'SchemaSelect',

		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(props) {
			var data = props.data;
			if (data.hasOwnProperty('enum') && data.enum.length > 0) {
				data.enum_original = data.enum;
				data.enum = data.enum.join('|');
			} else {
				data.enum = '';
			}
			return data;
		},
		componentDidUpdate: function componentDidUpdate() {
			this.props.onChange();
		},
		handleChange: function handleChange(event) {
			this.state.enum = event.target.value;
			this.props.currentEnum = this.state.enum ? this.state.enum.split('|') : [];
			this.setState({
				enum: event.target.value
			});
		},
		exportTitleMap: function exportTitleMap() {
			var titleMap = [];
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			arr.forEach(function (element) {
				titleMap.push({ value: element, name: element });
			});
			return titleMap;
		},
		export: function _export() {
			var arr = [];
			if (this.state.enum.length > 0) {
				arr = this.state.enum.split('|');
			}
			return {
				type: this.state.type,
				format: "select",
				enum: this.state.enum_original ? this.state.enum_original : arr,
				currentEnum: arr
			};
		},
		render: function render() {
			var self = this;
			let is_write = self.state.hasOwnProperty('editAble') ? self.state.editAble : false;
			is_write = is_write || self.props.editor;
			return React.createElement(
				'div',
				{ className: 'row' },
				React.createElement(
					'div',
					{ className: 'col-md-10 col-lg-10' },
					React.createElement('input', {
						type: 'text', name: 'titlemap', className: 'form-control', disabled: !is_write, value: self.state.enum,
						onChange: self.handleChange,
						placeholder: 'Separate options with the | character '
					})
				)
			);
		}
	});

	var mapping = function mapping(name, data, editor, changeHandler) {
		return {
			text: React.createElement(SchemaText, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			textarea: React.createElement(SchemaTextarea, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			checkboxes: React.createElement(SchemaCheckboxes, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			radios: React.createElement(SchemaRadios, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			select: React.createElement(SchemaSelect, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			datetime: React.createElement(SchemaDateTime, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			array: React.createElement(SchemaArray, { onChange: changeHandler, ref: name, data: data, editor: editor }),
			object: React.createElement(SchemaObject, { onChange: changeHandler, ref: name, data: data, editor: editor })
		}[data.format];
	};

	var SchemaArray = React.createClass({
		displayName: 'SchemaArray',

		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(props) {
			var data = props.data;
			data.refname = "obj_array";
			data.onChange = props.onChange;
			data.editor = props.editor;
			return data;
		},
		exportForm: function exportForm(parent_Key) {
			var self = this;
			return self.refs[self.state.refname].exportForm(parent_Key);
		},
		export: function _export() {
			var self = this;
			return self.refs[self.state.refname].export();
		},
		render: function render() {
			return React.createElement(SchemaObject, { onChange: this.state.changeHandler, ref: this.state.refname, data: this.state.items, editor: this.state.editor });
		}
	});

	var SchemaObject = React.createClass({
		displayName: 'SchemaObject',

		jsonDeepCopy: function jsonDeepCopy(src_json) {
			return JSON.parse(JSON.stringify(src_json));
		},
		getInitialState: function getInitialState() {
			return this.propsToState(this.props);
		},
		propsToState: function propsToState(schema) {
			var data = schema;
			if (schema.hasOwnProperty('data')) {
				data = schema.data;
			}
			//data.properties = data.properties || {};
			data.propertyNames = [];
			data.required = data.required || [];
			data.propertyItems = []; // data.propertyItems || [];
			data.propertyDels = []; // data.propertyDels || [];
			// convert from object to array
			data.propertyNames = Object.keys(data.properties).map(function (name, index) {
				data.propertyItems.push(name);
				data.propertyDels.push(false);
				var item = data.properties[name];
				return item;
			});
			data.inputErrs = []; // error input element
			if (schema.hasOwnProperty('editor')) {
				data.editor = schema.editor;
			} else {
				data.editor = true;
			}
			return data;
		},

		componentWillReceiveProps: function componentWillReceiveProps(newProps) {
			this.setState(this.propsToState(newProps));
		},
		deleteItem: function deleteItem(event) {
			// parentElement
			// dataset H5 custom property data-xxx
			var i = event.target.parentElement.dataset.index;
			var requiredIndex = this.state.required.indexOf(this.state.propertyItems[i]);
			if (requiredIndex !== -1) {
				this.state.required.splice(requiredIndex, 1);
			}
			this.state.propertyDels[i] = true;
			//this.state.properties.splice(i, 1);
			//this.state.propertyItems.splice(i, 1);
			this.state = this.propsToState(this.export());
			this.setState(this.state);
		},
		changeItem: function changeItem(event) {
			var i = event.target.parentElement.dataset.index;
			if (event.target.name == 'type') {
				if ('object' === event.target.value) {
					this.state.propertyNames[i].type = event.target.value;
					this.state.propertyNames[i].properties = {};
					this.state.propertyNames[i].properties['subitem_' + Date.now()] = {
						type: "string",
						format: "text",
						title: ""
					};
				} else if ('checkboxes' === event.target.value || 'radios' === event.target.value || 'select' === event.target.value) {
					this.state.propertyNames[i].enum = [];
				} else if ('array' === event.target.value) {
					this.state.propertyNames[i].type = event.target.value;
					this.state.propertyNames[i].format = event.target.value;
					this.state.propertyNames[i].items = {
						type: "object",
						format: "object",
						properties: {}
					};
					this.state.propertyNames[i].items.properties['subitem_' + Date.now()] = {
						type: "string",
						format: "text",
						title: ""
					};
				} else {
					this.state.propertyNames[i].type = 'string';
				}
				this.state.propertyNames[i].format = event.target.value;
				this.state.properties[this.state.propertyItems[i]] = this.state.propertyNames[i];
			} else if (event.target.name == 'field') {
				this.state.propertyNames[i].title = event.target.value;
				this.state.properties[this.state.propertyItems[i]].title = event.target.value;
				if (event.target.value.length == 0) {
					this.state.inputErrs.push(this.state.propertyItems[i]);
				} else if (this.state.inputErrs.indexOf(this.state.propertyItems[i]) != -1) {
					this.state.inputErrs.splice(this.state.inputErrs.indexOf(this.state.propertyItems[i]), 1);
				}
			} else if(event.target.name == 'title_i18n_ja') {
				this.state.propertyNames[event.target.dataset.index].title_i18n.ja = event.target.value;
				this.state.properties[this.state.propertyItems[event.target.dataset.index]].title_i18n.ja = event.target.value;
			} else if(event.target.name == 'title_i18n_en') {
				this.state.propertyNames[event.target.dataset.index].title_i18n.en = event.target.value;
				this.state.properties[this.state.propertyItems[event.target.dataset.index]].title_i18n.en = event.target.value;
			}
			this.setState(this.state);
		},
		changeRequired: function changeRequired(event) {
			if (event.target.checked) {
				this.state.required.push(event.target.name);
			} else {
				var i = this.state.required.indexOf(event.target.name);
				this.state.required.splice(i, 1);
			}

			let index = event.target.dataset.index;
			let propertyItem = this.state.propertyItems[index];
			this.state.propertyNames[index].isRequired = event.target.checked;
			this.state.properties[propertyItem].isRequired = event.target.checked;

			//this.state = this.propsToState(this.export());
			this.setState(this.state);
		},
		changeShowList: function changeShowList(event) {
			let index = event.target.dataset.index;
			let propertyItem = this.state.propertyItems[index];
			this.state.propertyNames[index].isShowList = event.target.checked;
			this.state.properties[propertyItem].isShowList = event.target.checked;
			//this.state = this.propsToState(this.export());
			this.setState(this.state);
		},
		changeSpecifyNewline: function changeSpecifyNewline(event) {
			let index = event.target.dataset.index;
			let propertyItem = this.state.propertyItems[index];
			this.state.propertyNames[index].isSpecifyNewline = event.target.checked;
			this.state.properties[propertyItem].isSpecifyNewline = event.target.checked;
			//this.state = this.propsToState(this.export());
			this.setState(this.state);
		},
		changeHide: function changeHide(event) {
			let index = event.target.dataset.index;
			let propertyItem = this.state.propertyItems[index];
			this.state.propertyNames[index].isHide = event.target.checked;
			this.state.properties[propertyItem].isHide = event.target.checked;
			//this.state = this.propsToState(this.export());
			this.setState(this.state);
		},
		onChange: function onChange() {
			//if(undefined != this.props.onChange) {
			//  this.props.onChange();
			//}
			this.trigger('change');
		},

		componentDidUpdate: function componentDidUpdate() {
			this.onChange();
		},
		add: function add() {
			var newKey = 'subitem_' + Date.now();
			//this.state = this.propsToState(this.export());
			this.state.propertyNames.push({ type: 'string', format: 'text', title: '' });
			this.state.propertyItems.push(newKey);
			this.state.properties[newKey] = { type: 'string', format: 'text', title: '' };
			this.setState(this.state);
		},
		exportForm: function exportForm(parent_Key) {
			var _this = this;

			var self = this;
			var parentkey = parent_Key;
			var form = [];
			var forms = [];
			var rename_subitem_config = false;

			self.state.propertyNames.map(function (value, index) {
				if (_this.state.propertyDels[index]) return;
				var itemKey = self.state.propertyItems[index];
				if (value.title.length > 0) {
					let subKey = itemKey.split("_");
					if (rename_subitem_config && subKey.length > 1 && !isNaN(Number(subKey[1]))) {
						itemKey = self.createSubItemName(value.title);
					}
					var sub_form = {};
					if ('text' === value.format || 'textarea' === value.format) {
						sub_form = {
							key: parentkey + itemKey,
							type: value.format,
							title: value.title
						};
					} else if ('datetime' === value.format) {
						sub_form = {
							key: parentkey + itemKey,
							type: "template",
							format: "yyyy-MM-dd",
							templateUrl: "/static/templates/weko_deposit/datepicker.html",
							title: value.title
						};
					} else if ('checkboxes' === value.format) {
			  sub_form = {
				key: parentkey + itemKey,
				type: "template",
				templateUrl: "/static/templates/weko_deposit/checkboxes.html",
				title: value.title,
				titleMap: self.refs['subitem' + index].exportTitleMap()
			  };
					}else if ('select' === value.format) {
						sub_form = {
							key: parentkey + itemKey,
							type: value.format,
							title: value.title,
							titleMap: self.refs['subitem' + index].exportTitleMap()
						};
					}
					 else if ('radios' === value.format ) {
						sub_form = {
							key: parentkey + itemKey,
							type: "template",
							title: value.title,
						  templateUrl: "/static/templates/weko_deposit/datepicker.html",
							titleMap: self.refs['subitem' + index].exportTitleMap()
						};
					}  else if ('array' === value.format) {
						sub_form = {
							key: parentkey + itemKey,
							add: "New",
							style: {
								add: "btn-success"
							},
							title: value.title,
							items: self.refs['subitem' + index].exportForm(parentkey + itemKey + '[].')
						};
					} else {
						// Object
						if (typeof self.refs['subitem' + index] != 'undefined') {
							sub_form = {
								key: parentkey + itemKey,
								type: "fieldset",
								title: value.title,
								items: self.refs['subitem' + index].exportForm(parentkey + itemKey + '.')
							};
						}
					}
					form.push(sub_form);
				}
			});
			return form;
		},
		export: function _export() {
			var _this2 = this;

			var self = this;
			var properties = {};
			var rename_subitem_config = false;

			self.state.propertyNames.map(function (value, index) {
				if (_this2.state.propertyDels[index]) return;
				var itemKey = self.state.propertyItems[index];
				if (value.title.length > 0) {
					let subKey = itemKey.split("_");
					if (rename_subitem_config && subKey.length > 1 && !isNaN(Number(subKey[1]))) {
						itemKey = self.createSubItemName(value.title);
					}
					if ('text' === value.format || 'textarea' === value.format || 'datetime' === value.format) {
						properties[itemKey] = value;
					} else if ('checkboxes' === value.format || 'radios' === value.format || 'select' === value.format) {
						properties[itemKey] = self.refs['subitem' + index].export();
						properties[itemKey].title = value.title;
						if (typeof value.default != 'undefined') {
							properties[itemKey].default = value.default;
						}
					} else if ('array' === value.format) {
						properties[itemKey] = { type: "array", format: "array", items: {}, title: value.title };
						properties[itemKey].items = self.refs['subitem' + index].export();
					} else {
						// Object
						if (typeof self.refs['subitem' + index] != 'undefined') {
							properties[itemKey] = self.refs['subitem' + index].export();
							properties[itemKey].title = value.title;
						}
					}
				}
			});

			let result = {
				type: 'object',
				format: 'object',
				properties: properties,
				required: this.state.required
			};

			if(!result.required.length){
				delete result.required;
			}

			return result;
		},
		// Defined prefix for sub item name
		prefixSubitemname: 'subitem_',
		customSuffixSubItemName: function customSuffixSubItemName(suffix){
			// Replace all space to _
			suffix = suffix.replace(/ /g, '_');
			// convert to lower case character
			suffix = suffix.toLowerCase();
			return suffix;
		},
		createSubItemName: function createSubItemName(suffix){
			return this.prefixSubitemname + this.customSuffixSubItemName(suffix);
		},
		on: function on(event, callback) {
			this.callbacks = this.callbacks || {};
			this.callbacks[event] = this.callbacks[event] || [];
			this.callbacks[event].push(callback);

			return this;
		},
		trigger: function trigger(event) {
			if (this.callbacks && this.callbacks[event] && this.callbacks[event].length) {
				for (var i = 0; i < this.callbacks[event].length; i++) {
					this.callbacks[event][i]();
				}
			}

			return this;
		},
		expandProp: function expandProp() {
			var _this3 = this;

			var self = this;
			return (
				//this.state.propertyNames.map((value, index) => {
				Object.keys(self.state.properties).map(function (name, index) {
					if (_this3.state.propertyDels[index]) return;
					var value = self.state.properties[name];
					if(!value.title_i18n) {
						value['title_i18n'] = {ja: '', en: ''};
					}
					var itemKey = self.state.propertyItems[index];
					var copiedState = self.state.properties[name]; // JSON.parse(JSON.stringify(self.state.properties[index]));
					var optionForm = mapping('subitem' + index, copiedState, self.state.editor, self.onChange);
					let classEdit = self.state.editor ? "form-group media-right" : "hide";
					let allowedChangeArray = ['checkboxes', 'radios', 'select'];
					let isDisabledFormat = !allowedChangeArray.includes(value.format);
					let disabledFormatSelect = isDisabledFormat && !self.state.editor;
					let isList = allowedChangeArray.includes(value.format);
					let isEditor = self.state.editor ? ' hide' : '';
					return React.createElement('div', { key: index },
						React.createElement('div', { className: 'col-md-12 col-lg-12' },
							React.createElement('div', { className: 'form-inline' },
								React.createElement('div', { className: self.state.inputErrs.indexOf(itemKey) != -1 ? "form-group has-error" : "form-group", 'data-index': index },
									React.createElement('label', { className: 'sr-only', htmlFor: "input_" + itemKey}, 'input'),
									React.createElement('input', {
										type: 'text', name: 'field', className: 'form-control', id: "input_" + itemKey, onChange: self.changeItem, value: value.title, disabled: !self.state.editor
									})
								),
								React.createElement('div', { className: 'form-group media-right', 'data-index': index },
									React.createElement('label', { className: 'sr-only', htmlFor: "select_" + itemKey}, 'input'),
									React.createElement('select', {
										name: 'type', className: 'form-control', id: "select_" + itemKey, onChange: self.changeItem, value: value.format, disabled: disabledFormatSelect
									},
										React.createElement('option', {className: self.state.editor ? '' : 'hide', value: 'text'}, 'Text'),
										React.createElement('option', {className: self.state.editor ? '' : 'hide', value: 'textarea'}, 'Textarea'),
										React.createElement('option', {value: 'checkboxes'}, 'Checkboxes'),
										React.createElement('option', {value: 'radios'}, 'Radios'),
										React.createElement('option', {value: 'select'}, 'Select'),
										React.createElement('option', {className: self.state.editor ? '' : 'hide', value: 'datetime'}, 'Datetime'),
										React.createElement('option', {className: self.state.editor ? '' : 'hide', value: 'array'}, 'List'),
										React.createElement('option', {className: self.state.editor ? '' : 'hide', value: 'object'}, 'Object')
									)
								),
								React.createElement('p', {className: isEditor}),
								React.createElement('div', {id: "text_title_JaEn_item_" + value.uniqueKey, className: "collapse" + isEditor},
									React.createElement('p', null, 'Japanese：'),
									React.createElement('input', {
											type: 'text',
											name: 'title_i18n_ja',
											className: 'form-control',
											id: "txt_title_ja_item_" + itemKey,
											'data-index': index,
											disabled: false,
											defaultValue: value.title_i18n.ja,
											onChange: self.changeItem,
											style: {width: "305px !important"}
										}
									),
									React.createElement('p', null, 'English：'),
									React.createElement('input', {
											type: 'text',
											name: 'title_i18n_en',
											className: 'form-control',
											id: "txt_title_en_item_" + itemKey,
											'data-index': index,
											disabled: false,
											defaultValue: value.title_i18n.en,
											onChange: self.changeItem,
											style: {width: "305px !important"}
										}
									),
								),
								React.createElement('p', {className: isEditor},
									React.createElement('button', {
											type: 'button',
											className: 'btn btn-link',
											disabled: false,
											"data-toggle": "collapse",
											"data-target": "#text_title_JaEn_item_" + value.uniqueKey
										},
										'Localization Settings')
								),
								React.createElement('div', { className: 'checkbox  media-right'},
									React.createElement('label', null,
										React.createElement('input', { type: 'checkbox', name: itemKey, disabled: false, 'data-index': index,
										onChange: self.changeRequired, checked: value.isRequired}),
										' Required  '
									)
								),
								React.createElement('div', { className: 'checkbox  media-right' + isEditor},
									React.createElement('label', null,
										React.createElement('input', {
											type: 'checkbox', name: itemKey, disabled: false, 'data-index': index,
											onChange: self.changeShowList, checked: value.isShowList
										}),
										' Show List  '
									)
								),
								React.createElement('div', { className: 'checkbox  media-right' + isEditor},
									React.createElement('label', null,
										React.createElement('input', {
											type: 'checkbox', name: itemKey, disabled: false, 'data-index': index,
											onChange: self.changeSpecifyNewline, checked: value.isSpecifyNewline
										}),
										' Specify Newline  '
									)
								),
								React.createElement('div', { className: 'checkbox  media-right' + isEditor},
									React.createElement('label', null,
										React.createElement('input', {
											type: 'checkbox', name: itemKey, disabled: false, 'data-index': index,
											onChange: self.changeHide, checked: value.isHide
										}),
										' Hide  '
									)
								),
								React.createElement('div', { className: self.state.editor ? "form-group media-right" : "hide", 'data-index': index},
									React.createElement('button', { type: 'button', id: 'btn_' + itemKey, className: 'btn btn-default', 'data-index': index, onClick: self.deleteItem, disabled: false},
										React.createElement('span', { className: 'glyphicon glyphicon-remove' })
									)
								)
							)
						),
						React.createElement('div', { className: 'col-md-12 col-lg-12 h6' },
							optionForm
						),
						React.createElement('hr', { className: 'col-md-10 col-lg-10 h6' })
					);
				})
			);
		},
		render: function render() {
			var self = this;
			if (self.state.editor) {
				return React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						this.expandProp(),
						React.createElement(
							'div',
							{ className: self.state.editor ? "col-md-6 col-lg-6" : "hide" },
							React.createElement(
								'button',
								{ className: 'btn btn-light pull-right add-button', onClick: self.add },
								React.createElement(
									'span',
									{ className: 'glyphicon glyphicon-plus' },
									''
								),
								' Add'
							)
						)
					)
				);
			} else {
				return React.createElement(
					'div',
					{ className: 'panel panel-default' },
					React.createElement(
						'div',
						{ className: 'panel-body' },
						React.createElement(
							'fieldset',
							{ disabled: false },
							this.expandProp(),
							React.createElement(
								'div',
								{ className: self.state.editor ? "col-md-6 col-lg-6" : "hide" },
								React.createElement(
									'button',
									{ className: 'btn btn-light pull-right add-button', onClick: self.add },
									React.createElement(
										'span',
										{ className: 'glyphicon glyphicon-plus' },
										''
									),
									' Add'
								)
							)
						)
					)
				);
			}
		}
	});

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = window.JSONSchemaEditor;

	/***/ })
	/******/ ]);
