/**
 * FRaphael
 * 	An extension for Raphael.js to make it easier to work with Filter Effects
 * 
 * Copyright © 2013 Chris Scott <chris.scott@factmint.com>
 * Delivered with and licensed under the MIT licence
 * 
 */

// Create the global FRaphael object
(function(scope) {
	var	version = "0.0.1",
	license = "MIT";
	
	var	ns = "http://www.w3.org/2000/svg",
	idCounter = 0;
	
	var FR = {
		// Object prototype for a filter
		Filter: function(id) {
			if (id == undefined) {
				id = "filter-" + idCounter++;
				while(FR.filters[id] != undefined) {
					id = "filter-" + idCounter++;
				}
			}
			
			if (FR.filters[id] != undefined) {
				throw "A filter with id " + id + " already exists";
			}
			
			this.element = document.createElementNS(ns, "filter");
			this.element.setAttribute("id", id);
			this.element.setAttribute("x", "-25%");
			this.element.setAttribute("y", "-25%");
			this.element.setAttribute("width", "150%");
			this.element.setAttribute("height", "150%");
			
			this.lastFEResult = null;
			
			FR.filters[id] = this;
			this.id = id;
		},
 
		// Object prototype for an effect
		FilterEffect: function(type, attributes) {
			this.element = document.createElementNS(ns, type);
			for (var key in attributes) {
				this.element.setAttribute(key, attributes[key]);
			}
		},
 
		// Return the filter applied to an element or a new filter if none are currently applied
		getFilter: function(element) {
			var filterId = element.data("filterId");
			var filter = null;
			
			if (filterId == undefined) {
				filterId = "element-filter-" + element.id;
				filter = element.paper.createFilter(filterId);
				element.filter(filterId);
			} else {
				filter = FR.filters[filterId];
			}
			
			return filter;
		},
 
		// maintain a list of filters by id
		filters: {}
	};
	
	FR.Filter.prototype = {
		addEffect: function(type, attributes, children) {
			var effect = new FR.FilterEffect(type, attributes);
			
			if (children) {
				if (children instanceof Array) {
					for (var x in children) {
						if (!children.hasOwnProperty(x)) continue;

						effect.element.appendChild(children[x].element);
					}
				} else {
					effect.element.appendChild(children.element);
				}
			}
			
			this.element.appendChild(effect.element);
			
			return this;
		},
 
		chainEffect: function(type, attributes, children) {
			if (attributes == undefined) {
				attributes = {};
			}
 
			var inId;
			var outId;
			if (attributes.in == undefined) {
				inId = this.getLastResult();
			} else {
				inId = attributes.in;
			}
			if (attributes.result == undefined) {
				outId = idCounter++;
			} else {
				outId = attributes.result;
			}
			
			this.lastFEResult = outId;
			
			attributes.in = inId;
			attributes.result = outId;
			
			this.addEffect(type, attributes, children);
			
			return this;
		},
 
		getLastResult: function() {
			return (this.lastFEResult == undefined) ? "SourceGraphic" : this.lastFEResult;
		},
 
		merge: function(in1, in2, attributes) {
			var mergeNode1 = new FR.FilterEffect("feMergeNode", {
				in: in1
			});
			var mergeNode2 = new FR.FilterEffect("feMergeNode", {
				in: in2
			});
			
			this.chainEffect("feMerge", attributes, [mergeNode1, mergeNode2]);
			
			return this;
		},
 
		compose: function(in1, in2, operator, attributes) {
			if (attributes == undefined) {
				attributes = {};
			}
			
			if (operator == undefined) {
				operator = "over";
			}
			
			attributes.in = in1;
			attributes.in2 = in2;
			attributes.operator = operator;
			
			this.chainEffect("feComposite", attributes);
			
			return this;
		},
 
		arithmeticCompose: function(in1, in2, k1, k2, k3, k4) {
			if (k1 == undefined) {
				k1 = 0;
			}
			if (k2 == undefined) {
				k2 = 0;
			}
			if (k3 == undefined) {
				k3 = 0;
			}
			if (k4 == undefined) {
				k4 = 0;
			}
			
			this.compose(in1, in2, "arithmetic", {
				k1: k1,
				k2: k2,
				k3: k3,
				k4: k4
			});
			
			return this;
		},
 
		addBlur: function(stdDeviation, attributes) {
			if (!stdDeviation) {
				throw "Standard deviation is required to perform a blur filter";
			}
			
			if (attributes == undefined) {
				attributes = {};
			}
			attributes.stdDeviation = stdDeviation;
			
			this.chainEffect("feGaussianBlur", attributes);
			
			return this;
		},
 
		addOffset: function(dx, dy, attributes) {
			if (dx == undefined | dy == undefined) {
				throw "dx and dy values are required to perform an offset FE";
			}
			
			if (attributes == undefined) {
				attributes = {};
			}
			attributes.dx = dx;
			attributes.dy = dy;
			
			this.chainEffect("feOffset", attributes);
			
			return this;
		},
 
		addLighting: function(x, y, z, color, type, attributes) {
			if (x == undefined | y == undefined | z == undefined) {
				throw "Three co-ordinates are required to create a light source";
			}
			
			var previousResult = this.getLastResult();
			
			var id = idCounter++;
			
			if (attributes == undefined) {
				attributes = {};
			}
			
			attributes.result = id;
			if (color != undefined) {
				attributes["lighting-color"] = color;
			}
			
			if (type == undefined || type == "diffuse") {
				type = "feDiffuseLighting";
			} else if (type == "specular") {
				type = "feSpecularLighting";
			}
			
			var lightSource = new FR.FilterEffect("fePointLight", {
				x: x,
				y: y,
				z: z
			});
			
			this.chainEffect(type, attributes, lightSource).arithmeticCompose(previousResult, id, 3, 0.2, 0, 0);
			
			return this;
		},
 
		addShiftToColor: function(color, moveBy, attributes) {
			if (color == undefined) {
				throw "A colour string is a required argument to create a colorMatrix";
			}
			if (moveBy == undefined) {
				moveBy = 0.5;
			}
			
			var remainingColor = 1 - moveBy, x = remainingColor;
			
			if (attributes == undefined) {
				attributes = {};
			}
			
			var colorObject = Raphael.color(color);
			var	r = colorObject.r * moveBy / 255,
			g = colorObject.g * moveBy / 255,
			b = colorObject.b * moveBy / 255;
			
			/**
			 * r'	x 0 0 0 r		r 
			 * g'	0 x 0 0 g		g
			 * b' =	0 0 x 0 b	.	b
			 * a'	0 0 0 1 0		o
			 * 1					1
			 */
			attributes.values = x + " 0 0 0 " + r + " 0 " + x + " 0 0 " + g + " 0 0 " + x + " 0 " + b + " 0 0 0 1 0 ";
			
			this.chainEffect("feColorMatrix", attributes);
			
			return this;
		},
 
		addRecolor: function(color, opacity, attributes) {
			if (color == undefined) {
				throw "A colour string is a required argument to create a colorMatrix";
			}
			if (opacity == undefined) {
				opacity = 1;
			}
			
			if (attributes == undefined) {
				attributes = {};
			}
			
			var colorObject = Raphael.color(color);
			var	r = colorObject.r / 255,
			g = colorObject.g / 255,
			b = colorObject.b / 255;
			
			/**
			 * r'	0 0 0 0 r		r 
			 * g'	0 0 0 0 g		g
			 * b' =	0 0 0 0 b	.	b
			 * a'	0 0 0 a 0		a
			 * 1					1
			 */
			attributes.values = "0 0 0 0 " + r + " 0 0 0 0 " + g + " 0 0 0 0 " + b + " 0 0 0 " + opacity + " 0 ";
			
			this.chainEffect("feColorMatrix", attributes);
			
			return this;
		},
	
		addDesaturate: function(saturation, attributes) {
			if (saturation == undefined) {
				saturnation = 0;
			}

			if (attributes == undefined) {
				attributes = {};
			}

            attributes.values = saturation;
			attributes.type = "saturate";

			this.chainEffect("feColorMatrix", attributes);

			return this;
		},
 
		addConvolveMatrix: function(matrix, attributes) {
			if (matrix == undefined) {
				throw "A matrix (usually 9 numbers) must be provided to apply a convolve matrix transform";
			}
			
			if (attributes == undefined) {
				attributes = {};
			}
			
			attributes.kernelMatrix = matrix;
			
			this.chainEffect("feConvolveMatrix", attributes);
			
			return this;
		},
 
		createShadow: function(dx, dy, blur, opacity, color) {
			if (dx == undefined) {
				throw "dx is required for the shadow effect";
			}
			if (dy == undefined) {
				throw "dy is required for the shadow effect";
			}
			if (blur == undefined) {
				throw "blur (stdDeviation) is required for the shadow effect";
			}
			
			if (opacity == undefined) {
				opacity = 0.6;
			}
			
			var previousResult = this.getLastResult();
			
			if (color == undefined) {
				color = "#000000";
			}
			
			this.addOffset(dx, dy, {
				in: "SourceAlpha"
			});
			
			this.addRecolor(color, opacity);
			
			this.addBlur(blur);
			
			this.merge(this.getLastResult(), previousResult);
			
			return this;
		},
 
		createEmboss: function(height, x, y, z) {
			if (height == undefined) {
				height = 2;
			}
			if (x == undefined) {
				x = -1000;
			}
			if (y == undefined) {
				y = -5000;
			}
			if (z == undefined) {
				z = 300;
			}
			
			// Create the highlight
			
			this.addOffset(height * x / (x + y), height * y / (x + y), {
				in: "SourceAlpha"
			});
			
			this.addBlur(height * 0.5);
						
			var whiteLightSource = new FR.FilterEffect("fePointLight", {
				x: x,
				y: y,
				z: z
			});
			
			this.chainEffect("feSpecularLighting", {
				surfaceScale: height,
				specularConstant: 0.8,
				specularExponent: 15
			}, whiteLightSource);
			
			this.compose(this.getLastResult(), "SourceAlpha", "in");
			var whiteLight = this.getLastResult();
			
			// Create the lowlight
			
			this.addOffset(height * -1 * x / (x + y), height * -1 * y / (x + y), {
				in: "SourceAlpha"
			});
			
			this.addBlur(height * 0.5);
						
			var darkLightSource = new FR.FilterEffect("fePointLight", {
				x: -1 * x,
				y: -1 * y,
				z:      z
			});
			
			this.chainEffect("feSpecularLighting", {
				surfaceScale: height,
				specularConstant: 1.8,
				specularExponent: 6
			}, darkLightSource);
			
			this.compose(this.getLastResult(), "SourceAlpha", "in");
			this.chainEffect("feColorMatrix", {
				values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
			});
			var darkLight = this.getLastResult();
			
			this.arithmeticCompose(whiteLight, darkLight, 0, 0.8, 0.5, 0);
			
			this.merge("SourceGraphic", this.getLastResult());
						
			return this;
		}
	};
	
	scope.FRaphael = FR;
})(this);

/**
 * add a filter to the paper by id
 */
Raphael.fn.createFilter = function(id) {
	var paper = this;
	var filter = new FRaphael.Filter(id);
	paper.defs.appendChild(filter.element);
	
	return filter;
};

/**
 * Apply a filter to an element by id
 */
Raphael.el.filter = function(filter) {
	var id = (filter instanceof FRaphael.Filter) ? filter.id : filter;
	
	this.node.setAttribute("filter", "url(#" + id + ")");
	this.data("filterId", id);
	
	return this;
};

/**
 * Get the current filter for an element or a new one if not
 */
Raphael.el.getFilter = function() {
	return FRaphael.getFilter(this);
};

/**
 * A shorthand method for applying blur
 */
Raphael.el.blur = function(stdDeviation) {
	if (stdDeviation == undefined) {
		stdDeviation = 3;
	}
	
	this.getFilter().addBlur(stdDeviation);
	
	return this;
};

/**
 * A shorthand method for applying a drop shadow
 */
Raphael.el.shadow = function(dx, dy, blur, opacity, color) {
	if (dx == undefined) {
		dx = 3;
	}
	if (dy == undefined) {
		dy = 3;
	}
	if (blur == undefined) {
		blur = 3;
	}
	
	this.getFilter().createShadow(dx, dy, blur, opacity, color);
	
	return this;
};

/**
 * A shorthand method for applying lighting
 */
Raphael.el.light = function(x, y, z, color, type) {
	if (x == undefined) {
		x = this.paper.width;
	}
	if (y == undefined) {
		y = 0;
	}
	if (z == undefined) {
		z = 20;
	}
	
	this.getFilter().addLighting(x, y, z, color, type);
	
	return this;
};

/**
 * A shorthand method for applying a colour shift
 */
Raphael.el.colorShift = function(color, shift) {
	if (color == undefined) {
		color = "black";
	}
	if (shift == undefined) {
		shift = 0.5;
	}
	
	this.getFilter().addShiftToColor(color, shift);
	
	return this;
};

/**
 * A shorthand method for embossing
 */
Raphael.el.emboss = function(height) {
	this.getFilter().createEmboss(height);
	
	return this;
};

/**
 * A shorthand method for desaturating
 */
Raphael.el.desaturate = function(saturation) {
	this.getFilter().addDesaturate(saturation);
	
	return this;
};

/**
 * A shorthand method for complete desaturation
 */
Raphael.el.greyScale = function() {
	this.getFilter().addDesaturate(0);
	
	return this;
};
