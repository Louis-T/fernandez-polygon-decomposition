(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.fernandezPolygonDecomposition = {})));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var twoProduct_1 = twoProduct;

	var SPLITTER = +(Math.pow(2, 27) + 1.0);

	function twoProduct(a, b, result) {
	  var x = a * b;

	  var c = SPLITTER * a;
	  var abig = c - a;
	  var ahi = c - abig;
	  var alo = a - ahi;

	  var d = SPLITTER * b;
	  var bbig = d - b;
	  var bhi = d - bbig;
	  var blo = b - bhi;

	  var err1 = x - (ahi * bhi);
	  var err2 = err1 - (alo * bhi);
	  var err3 = err2 - (ahi * blo);

	  var y = alo * blo - err3;

	  if(result) {
	    result[0] = y;
	    result[1] = x;
	    return result
	  }

	  return [ y, x ]
	}

	var robustSum = linearExpansionSum;

	//Easy case: Add two scalars
	function scalarScalar(a, b) {
	  var x = a + b;
	  var bv = x - a;
	  var av = x - bv;
	  var br = b - bv;
	  var ar = a - av;
	  var y = ar + br;
	  if(y) {
	    return [y, x]
	  }
	  return [x]
	}

	function linearExpansionSum(e, f) {
	  var ne = e.length|0;
	  var nf = f.length|0;
	  if(ne === 1 && nf === 1) {
	    return scalarScalar(e[0], f[0])
	  }
	  var n = ne + nf;
	  var g = new Array(n);
	  var count = 0;
	  var eptr = 0;
	  var fptr = 0;
	  var abs = Math.abs;
	  var ei = e[eptr];
	  var ea = abs(ei);
	  var fi = f[fptr];
	  var fa = abs(fi);
	  var a, b;
	  if(ea < fa) {
	    b = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    b = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	      fa = abs(fi);
	    }
	  }
	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
	    a = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    a = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	      fa = abs(fi);
	    }
	  }
	  var x = a + b;
	  var bv = x - a;
	  var y = b - bv;
	  var q0 = y;
	  var q1 = x;
	  var _x, _bv, _av, _br, _ar;
	  while(eptr < ne && fptr < nf) {
	    if(ea < fa) {
	      a = ei;
	      eptr += 1;
	      if(eptr < ne) {
	        ei = e[eptr];
	        ea = abs(ei);
	      }
	    } else {
	      a = fi;
	      fptr += 1;
	      if(fptr < nf) {
	        fi = f[fptr];
	        fa = abs(fi);
	      }
	    }
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	  }
	  while(eptr < ne) {
	    a = ei;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	    }
	  }
	  while(fptr < nf) {
	    a = fi;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    } 
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	    }
	  }
	  if(q0) {
	    g[count++] = q0;
	  }
	  if(q1) {
	    g[count++] = q1;
	  }
	  if(!count) {
	    g[count++] = 0.0;  
	  }
	  g.length = count;
	  return g
	}

	var twoSum = fastTwoSum;

	function fastTwoSum(a, b, result) {
		var x = a + b;
		var bv = x - a;
		var av = x - bv;
		var br = b - bv;
		var ar = a - av;
		if(result) {
			result[0] = ar + br;
			result[1] = x;
			return result
		}
		return [ar+br, x]
	}

	var robustScale = scaleLinearExpansion;

	function scaleLinearExpansion(e, scale) {
	  var n = e.length;
	  if(n === 1) {
	    var ts = twoProduct_1(e[0], scale);
	    if(ts[0]) {
	      return ts
	    }
	    return [ ts[1] ]
	  }
	  var g = new Array(2 * n);
	  var q = [0.1, 0.1];
	  var t = [0.1, 0.1];
	  var count = 0;
	  twoProduct_1(e[0], scale, q);
	  if(q[0]) {
	    g[count++] = q[0];
	  }
	  for(var i=1; i<n; ++i) {
	    twoProduct_1(e[i], scale, t);
	    var pq = q[1];
	    twoSum(pq, t[0], q);
	    if(q[0]) {
	      g[count++] = q[0];
	    }
	    var a = t[1];
	    var b = q[1];
	    var x = a + b;
	    var bv = x - a;
	    var y = b - bv;
	    q[1] = x;
	    if(y) {
	      g[count++] = y;
	    }
	  }
	  if(q[1]) {
	    g[count++] = q[1];
	  }
	  if(count === 0) {
	    g[count++] = 0.0;
	  }
	  g.length = count;
	  return g
	}

	var robustDiff = robustSubtract;

	//Easy case: Add two scalars
	function scalarScalar$1(a, b) {
	  var x = a + b;
	  var bv = x - a;
	  var av = x - bv;
	  var br = b - bv;
	  var ar = a - av;
	  var y = ar + br;
	  if(y) {
	    return [y, x]
	  }
	  return [x]
	}

	function robustSubtract(e, f) {
	  var ne = e.length|0;
	  var nf = f.length|0;
	  if(ne === 1 && nf === 1) {
	    return scalarScalar$1(e[0], -f[0])
	  }
	  var n = ne + nf;
	  var g = new Array(n);
	  var count = 0;
	  var eptr = 0;
	  var fptr = 0;
	  var abs = Math.abs;
	  var ei = e[eptr];
	  var ea = abs(ei);
	  var fi = -f[fptr];
	  var fa = abs(fi);
	  var a, b;
	  if(ea < fa) {
	    b = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    b = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	      fa = abs(fi);
	    }
	  }
	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
	    a = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    a = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	      fa = abs(fi);
	    }
	  }
	  var x = a + b;
	  var bv = x - a;
	  var y = b - bv;
	  var q0 = y;
	  var q1 = x;
	  var _x, _bv, _av, _br, _ar;
	  while(eptr < ne && fptr < nf) {
	    if(ea < fa) {
	      a = ei;
	      eptr += 1;
	      if(eptr < ne) {
	        ei = e[eptr];
	        ea = abs(ei);
	      }
	    } else {
	      a = fi;
	      fptr += 1;
	      if(fptr < nf) {
	        fi = -f[fptr];
	        fa = abs(fi);
	      }
	    }
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	  }
	  while(eptr < ne) {
	    a = ei;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	    }
	  }
	  while(fptr < nf) {
	    a = fi;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    } 
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	    }
	  }
	  if(q0) {
	    g[count++] = q0;
	  }
	  if(q1) {
	    g[count++] = q1;
	  }
	  if(!count) {
	    g[count++] = 0.0;  
	  }
	  g.length = count;
	  return g
	}

	var orientation_1 = createCommonjsModule(function (module) {






	var NUM_EXPAND = 5;

	var EPSILON     = 1.1102230246251565e-16;
	var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
	var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

	function cofactor(m, c) {
	  var result = new Array(m.length-1);
	  for(var i=1; i<m.length; ++i) {
	    var r = result[i-1] = new Array(m.length-1);
	    for(var j=0,k=0; j<m.length; ++j) {
	      if(j === c) {
	        continue
	      }
	      r[k++] = m[i][j];
	    }
	  }
	  return result
	}

	function matrix(n) {
	  var result = new Array(n);
	  for(var i=0; i<n; ++i) {
	    result[i] = new Array(n);
	    for(var j=0; j<n; ++j) {
	      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("");
	    }
	  }
	  return result
	}

	function sign(n) {
	  if(n & 1) {
	    return "-"
	  }
	  return ""
	}

	function generateSum(expr) {
	  if(expr.length === 1) {
	    return expr[0]
	  } else if(expr.length === 2) {
	    return ["sum(", expr[0], ",", expr[1], ")"].join("")
	  } else {
	    var m = expr.length>>1;
	    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
	  }
	}

	function determinant(m) {
	  if(m.length === 2) {
	    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
	  } else {
	    var expr = [];
	    for(var i=0; i<m.length; ++i) {
	      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""));
	    }
	    return expr
	  }
	}

	function orientation(n) {
	  var pos = [];
	  var neg = [];
	  var m = matrix(n);
	  var args = [];
	  for(var i=0; i<n; ++i) {
	    if((i&1)===0) {
	      pos.push.apply(pos, determinant(cofactor(m, i)));
	    } else {
	      neg.push.apply(neg, determinant(cofactor(m, i)));
	    }
	    args.push("m" + i);
	  }
	  var posExpr = generateSum(pos);
	  var negExpr = generateSum(neg);
	  var funcName = "orientation" + n + "Exact";
	  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("");
	  var proc = new Function("sum", "prod", "scale", "sub", code);
	  return proc(robustSum, twoProduct_1, robustScale, robustDiff)
	}

	var orientation3Exact = orientation(3);
	var orientation4Exact = orientation(4);

	var CACHED = [
	  function orientation0() { return 0 },
	  function orientation1() { return 0 },
	  function orientation2(a, b) { 
	    return b[0] - a[0]
	  },
	  function orientation3(a, b, c) {
	    var l = (a[1] - c[1]) * (b[0] - c[0]);
	    var r = (a[0] - c[0]) * (b[1] - c[1]);
	    var det = l - r;
	    var s;
	    if(l > 0) {
	      if(r <= 0) {
	        return det
	      } else {
	        s = l + r;
	      }
	    } else if(l < 0) {
	      if(r >= 0) {
	        return det
	      } else {
	        s = -(l + r);
	      }
	    } else {
	      return det
	    }
	    var tol = ERRBOUND3 * s;
	    if(det >= tol || det <= -tol) {
	      return det
	    }
	    return orientation3Exact(a, b, c)
	  },
	  function orientation4(a,b,c,d) {
	    var adx = a[0] - d[0];
	    var bdx = b[0] - d[0];
	    var cdx = c[0] - d[0];
	    var ady = a[1] - d[1];
	    var bdy = b[1] - d[1];
	    var cdy = c[1] - d[1];
	    var adz = a[2] - d[2];
	    var bdz = b[2] - d[2];
	    var cdz = c[2] - d[2];
	    var bdxcdy = bdx * cdy;
	    var cdxbdy = cdx * bdy;
	    var cdxady = cdx * ady;
	    var adxcdy = adx * cdy;
	    var adxbdy = adx * bdy;
	    var bdxady = bdx * ady;
	    var det = adz * (bdxcdy - cdxbdy) 
	            + bdz * (cdxady - adxcdy)
	            + cdz * (adxbdy - bdxady);
	    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
	                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
	                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
	    var tol = ERRBOUND4 * permanent;
	    if ((det > tol) || (-det > tol)) {
	      return det
	    }
	    return orientation4Exact(a,b,c,d)
	  }
	];

	function slowOrient(args) {
	  var proc = CACHED[args.length];
	  if(!proc) {
	    proc = CACHED[args.length] = orientation(args.length);
	  }
	  return proc.apply(undefined, args)
	}

	function generateOrientationProc() {
	  while(CACHED.length <= NUM_EXPAND) {
	    CACHED.push(orientation(CACHED.length));
	  }
	  var args = [];
	  var procArgs = ["slow"];
	  for(var i=0; i<=NUM_EXPAND; ++i) {
	    args.push("a" + i);
	    procArgs.push("o" + i);
	  }
	  var code = [
	    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
	  ];
	  for(var i=2; i<=NUM_EXPAND; ++i) {
	    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");");
	  }
	  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation");
	  procArgs.push(code.join(""));

	  var proc = Function.apply(undefined, procArgs);
	  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
	  for(var i=0; i<=NUM_EXPAND; ++i) {
	    module.exports[i] = CACHED[i];
	  }
	}

	generateOrientationProc();
	});

	var robustPnp = robustPointInPolygon;



	function robustPointInPolygon(vs, point) {
	  var x = point[0];
	  var y = point[1];
	  var n = vs.length;
	  var inside = 1;
	  var lim = n;
	  for(var i = 0, j = n-1; i<lim; j=i++) {
	    var a = vs[i];
	    var b = vs[j];
	    var yi = a[1];
	    var yj = b[1];
	    if(yj < yi) {
	      if(yj < y && y < yi) {
	        var s = orientation_1(a, b, point);
	        if(s === 0) {
	          return 0
	        } else {
	          inside ^= (0 < s)|0;
	        }
	      } else if(y === yi) {
	        var c = vs[(i+1)%n];
	        var yk = c[1];
	        if(yi < yk) {
	          var s = orientation_1(a, b, point);
	          if(s === 0) {
	            return 0
	          } else {
	            inside ^= (0 < s)|0;
	          }
	        }
	      }
	    } else if(yi < yj) {
	      if(yi < y && y < yj) {
	        var s = orientation_1(a, b, point);
	        if(s === 0) {
	          return 0
	        } else {
	          inside ^= (s < 0)|0;
	        }
	      } else if(y === yi) {
	        var c = vs[(i+1)%n];
	        var yk = c[1];
	        if(yk < yi) {
	          var s = orientation_1(a, b, point);
	          if(s === 0) {
	            return 0
	          } else {
	            inside ^= (s < 0)|0;
	          }
	        }
	      }
	    } else if(y === yi) {
	      var x0 = Math.min(a[0], b[0]);
	      var x1 = Math.max(a[0], b[0]);
	      if(i === 0) {
	        while(j>0) {
	          var k = (j+n-1)%n;
	          var p = vs[k];
	          if(p[1] !== y) {
	            break
	          }
	          var px = p[0];
	          x0 = Math.min(x0, px);
	          x1 = Math.max(x1, px);
	          j = k;
	        }
	        if(j === 0) {
	          if(x0 <= x && x <= x1) {
	            return 0
	          }
	          return 1 
	        }
	        lim = j+1;
	      }
	      var y0 = vs[(j+n-1)%n][1];
	      while(i+1<lim) {
	        var p = vs[i+1];
	        if(p[1] !== y) {
	          break
	        }
	        var px = p[0];
	        x0 = Math.min(x0, px);
	        x1 = Math.max(x1, px);
	        i += 1;
	      }
	      if(x0 <= x && x <= x1) {
	        return 0
	      }
	      var y1 = vs[(i+1)%n][1];
	      if(x < x0 && (y0 < y !== y1 < y)) {
	        inside ^= 1;
	      }
	    }
	  }
	  return 2 * inside - 1
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	var objectWithoutProperties = function (obj, keys) {
	  var target = {};

	  for (var i in obj) {
	    if (keys.indexOf(i) >= 0) continue;
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
	    target[i] = obj[i];
	  }

	  return target;
	};

	var slicedToArray = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (Symbol.iterator in Object(arr)) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	/**
	 * Useful to avoid floating point problems.
	 * May change in the future (maybe something greater than Number.EPSILON ?)
	 */
	var EPSILON = Number.EPSILON;

	/**
	 * Compares two vertices of the same polygon. Both of the vertex must be defined by an unique id.
	 *
	 * @param {{ x: number, y: number, id: number }} vertex1
	 * @param {{ x: number, y: number, id: number }} vertex2
	 * @returns {boolean}
	 */
	function vertexEquality(vertex1, vertex2) {
	  if (vertex1.id === undefined || vertex2.id === undefined) {
	    throw new Error('A vertex must be defined by an unique id.');
	  }
	  return vertex1.id === vertex2.id;
	}

	/**
	 * @param {{ x: number, y: number }} point1
	 * @param {{ x: number, y: number }} point2
	 * @returns {boolean}
	 */
	function pointEquality(point1, point2) {
	  return point1.x === point2.x && point1.y === point2.y;
	}

	/**
	 * @param {{ x: number, y: number }} point1
	 * @param {{ x: number, y: number }} point2
	 * @returns {number}
	 */
	function squaredDistance(point1, point2) {
	  return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
	}

	/**
	 * See https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order.
	 * The sum is negative when clockwise ordered because we are on the web (y is inversed)
	 *
	 * @param {{ x: number, y: number}[]} polygon
	 * @returns {boolean}
	 */
	function isClockwiseOrdered(polygon) {
	  var polygonLength = polygon.length;
	  var sum = 0;
	  for (var i = 0; i < polygonLength; i++) {
	    var a = polygon[i];
	    var b = polygon[(i + 1) % polygonLength];
	    sum += (b.x - a.x) * (b.y + a.y);
	  }
	  return sum < 0;
	}

	/**
	 * @param {{ x: number, y: number}[]} polygon
	 * @returns {{ x: number, y: number}[]}
	 */
	function orderClockwise(polygon) {
	  if (!isClockwiseOrdered(polygon)) {
	    return polygon.reverse();
	  }
	  return polygon;
	}

	/**
	 * See https://stackoverflow.com/questions/38856588/given-three-coordinate-points-how-do-you-detect-when-the-angle-between-them-cro.
	 * The three points are in clockwise order.
	 * If the result if positive, then it is a clockwise turn, if it is negative, a ccw one.
	 * If the result is 0, the points are collinear.
	 *
	 * @param {{ x: number, y: number}} point1
	 * @param {{ x: number, y: number}} point2
	 * @param {{ x: number, y: number}} point3
	 * @returns {number}
	 */
	function turnDirection(point1, point2, point3) {
	  return (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
	}

	/**
	 * Checks on which side of the line (point2, point3) the point point1 is.
	 *
	 * @param {{ x: number, y: number}} point1
	 * @param {{ x: number, y: number}} point2
	 * @param {{ x: number, y: number}} point3
	 * @returns {number}
	 */
	function sideOfLine(point1, point2, point3) {
	  return (point1.x - point3.x) * (point2.y - point3.y) - (point2.x - point3.x) * (point1.y - point3.y);
	}

	/*

	function inPoly1 (point, polygon) {
	  const { x, y } = point;
	  var inside = false;
	  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
	      const xi = polygon[i].x, yi = polygon[i].y;
	      const xj = polygon[j].x, yj = polygon[j].y;

	      console.log(x, (xj - xi) * (y - yi) / (yj - yi) + xi)

	      if( ((yi > y) != (yj > y)) &&
	          (x < (xj - xi) * (y - yi) / (yj - yi) + xi) ) {
	          inside = !inside;
	      }
	  }
	  return inside;
	}

	function inPoly2 (point, polygon) {
	  let isInside = false;
	  let minX = polygon[0].x, maxX = polygon[0].x;
	  let minY = polygon[0].y, maxY = polygon[0].y;
	  for (let n = 1; n < polygon.length; n++) {
	    const q = polygon[n];
	    minX = Math.min(q.x, minX);
	    maxX = Math.max(q.x, maxX);
	    minY = Math.min(q.y, minY);
	    maxY = Math.max(q.y, maxY);
	  }

	  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
	    return false;
	  }

	  let i = 0, j = polygon.length - 1;
	  for (i, j; i < polygon.length; j = i++) {
	    if ((polygon[i].y > point.y) != (polygon[j].y > point.y) &&
	        (point.x <= (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
	      isInside = !isInside;
	    }
	  }

	  return isInside;
	}

	*/

	/**
	 * Checks if the point is inside (or on the edge) of the polygon.
	 *
	 * @param {{ x: number, y: number}} point
	 * @param {{ x: number, y: number}[]} polygon
	 * @returns {boolean}
	 */
	function inPolygon(point, polygon) {
	  return robustPnp(polygon.map(function (_ref) {
	    var x = _ref.x,
	        y = _ref.y;
	    return [x, y];
	  }), [point.x, point.y]) <= 0;
	}

	/**
	 * Check if the polygon polygon2 is (at least partially) contained by the polygon polygon1.
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon1
	 * @param {{ x: number, y: number, id: number }[]} polygon2
	 * @returns {boolean}
	 */
	function containsPolygon(polygon1, polygon2) {
	  return polygon2.some(function (vertex) {
	    return inPolygon(vertex, polygon1);
	  });
	}
	/**
	 * Check if the polygon polygon2 is totally contained by the polygon polygon1.
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon1
	 * @param {{ x: number, y: number, id: number }[]} polygon2
	 * @returns {boolean}
	 */
	function containsEntirePolygon(polygon1, polygon2) {
	  return polygon2.every(function (vertex) {
	    return inPolygon(vertex, polygon1);
	  });
	}
	/**
	 * Given a vertex of one polygon, returns the next vertex (in clockwise order) of this polygon.
	 *
	 * @param {{ x: number, y: number, id: number }} vertex
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {{ x: number, y: number, id: number }}
	 */
	function nextVertex(vertex, polygon) {
	  var polygonLength = polygon.length;
	  var vertexIndex = polygon.findIndex(function (v) {
	    return vertexEquality(vertex, v);
	  });
	  if (vertexIndex === -1) {
	    throw new Error('could not find vertex');
	  }
	  return polygon[(vertexIndex + 1) % polygonLength];
	}

	/**
	 * Given a vertex of one polygon, returns the previous vertex (in clockwise order) of this polygon.
	 *
	 * @param {{ x: number, y: number, id: number }} vertex
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {{ x: number, y: number, id: number }}
	 */
	function previousVertex(vertex, polygon) {
	  var polygonLength = polygon.length;
	  var vertexIndex = polygon.findIndex(function (v) {
	    return vertexEquality(vertex, v);
	  });
	  if (vertexIndex === -1) {
	    throw new Error('could not find vertex');
	  }
	  return polygon[(vertexIndex - 1 + polygonLength) % polygonLength];
	}

	/**
	 * Checks if a point is one of the vertex of a polygon.
	 *
	 * @param {{ x: number, y: number }} point
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {boolean}
	 */
	function isAVertex(point, polygon) {
	  return polygon.some(function (v) {
	    return pointEquality(v, point);
	  });
	}

	/**
	 * Returns all the notches of a given polygon.
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {{ x: number, y: number, id: number }[]}
	 */
	function getNotches(polygon) {
	  var polygonLength = polygon.length;
	  return polygon.filter(function (vertex, vertexIndex) {
	    return turnDirection(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) < 0;
	  });
	}

	/**
	 * Returns all the edges of a given polygon.
	 * An edge is one segment between two consecutive vertex of the polygon.
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {{ a: { x: number, y: number, id: number }, b: { x: number, y: number, id: number }}[]}
	 */
	function getEdges(polygon) {
	  var edges = [];
	  var polygonLength = polygon.length;
	  for (var i = 0; i < polygonLength; i++) {
	    edges.push({
	      a: polygon[i],
	      b: polygon[(i + 1) % polygonLength]
	    });
	  }
	  return edges;
	}
	/**
	 * Given a vertex of one polygon, returns the next notch (in clockwise order) of this polygon.
	 * Returns null if there are no notch in the polygon.
	 *
	 * @param {{ x: number, y: number, id: number }} vertex
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {({ x: number, y: number, id: number }|null)}
	 */
	function nextNotch(vertex, polygon) {
	  var polygonLength = polygon.length;
	  var vertexIndex = polygon.findIndex(function (v) {
	    return vertexEquality(vertex, v);
	  });
	  var notchIndex = (vertexIndex + 1) % polygonLength;
	  while (notchIndex !== vertexIndex) {
	    if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
	      return polygon[notchIndex];
	    }
	    notchIndex = (notchIndex + 1) % polygonLength;
	  }
	  // if we started by the only notch, it will return the notch.
	  if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
	    return polygon[notchIndex];
	  }
	  return null;
	}

	/**
	 * Given a vertex of one polygon, returns the previous notch (in clockwise order) of this polygon.
	 * Returns null if there are no notch in the polygon.
	 *
	 * @param {{ x: number, y: number, id: number }} vertex
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {({ x: number, y: number, id: number }|null)}
	 */
	function previousNotch(vertex, polygon) {
	  var polygonLength = polygon.length;
	  var vertexIndex = polygon.findIndex(function (v) {
	    return vertexEquality(vertex, v);
	  });
	  var notchIndex = (vertexIndex - 1 + polygonLength) % polygonLength;
	  while (notchIndex !== vertexIndex) {
	    if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
	      return polygon[notchIndex];
	    }
	    notchIndex = (notchIndex - 1 + polygonLength) % polygonLength;
	  }
	  // if we started by the only notch, it will return the notch.
	  if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
	    return polygon[notchIndex];
	  }
	  return null;
	}

	/**
	 * Removes polygon2 from polygon1.
	 * polygon2 vertices must be a subset of polygon1 vertices
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon1
	 * @param {{ x: number, y: number, id: number }[]} polygon2
	 * @returns {{ x: number, y: number, id: number }[]}
	 */
	function substractPolygons(polygon1, polygon2) {
	  // const firstIndex = polygon1.findIndex(p => pointEquality(p, polygon2[0]));
	  // const lastIndex = polygon1.findIndex(p => pointEquality(p, polygon2[polygon2.length - 1]));
	  var firstIndex = polygon1.findIndex(function (p) {
	    return vertexEquality(p, polygon2[0]);
	  });
	  var lastIndex = polygon1.findIndex(function (p) {
	    return vertexEquality(p, polygon2[polygon2.length - 1]);
	  });
	  if (firstIndex < lastIndex) {
	    return [].concat(toConsumableArray(polygon1.slice(0, firstIndex)), [polygon1[firstIndex]], toConsumableArray(polygon1.slice(lastIndex)));
	  } else {
	    return [].concat(toConsumableArray(polygon1.slice(lastIndex, firstIndex + 1)));
	  }
	}

	/**
	 * @param {{{ x: number, y: number, id: number }[]}} polygon
	 * @return {boolean}
	 */
	function isConvex(polygon) {
	  var polygonLength = polygon.length;
	  return polygon.every(function (vertex, vertexIndex) {
	    return turnDirection(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) >= 0;
	  });
	}

	/**
	 * See http://paulbourke.net/geometry/pointlineplane/
	 *
	 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line1
	 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line2
	 * @returns {{ x: number, y: number, ua: number, ub: number }}
	 */
	function lineIntersection(line1, line2) {
	  var _line1$a = line1.a,
	      x1 = _line1$a.x,
	      y1 = _line1$a.y,
	      _line1$b = line1.b,
	      x2 = _line1$b.x,
	      y2 = _line1$b.y;
	  var _line2$a = line2.a,
	      x3 = _line2$a.x,
	      y3 = _line2$a.y,
	      _line2$b = line2.b,
	      x4 = _line2$b.x,
	      y4 = _line2$b.y;


	  var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
	  if (Math.abs(denom) < 0.000001) {
	    return null;
	  }
	  var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
	  var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
	  return {
	    x: x1 + ua * (x2 - x1),
	    y: y1 + ua * (y2 - y1),
	    ua: ua, // in segment1 : ua >= 0 && ua <= 1
	    ub: ub // in segment2 : ub >= 0 && ub <= 1
	  };
	}
	/**
	 * Checks if the polygon is simple.
	 * See https://en.wikipedia.org/wiki/Simple_polygon
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @returns {boolean}
	 */
	function isSimple(polygon) {
	  var segments = [];
	  for (var i = 0; i < polygon.length - 1; i++) {
	    segments.push({
	      a: polygon[i],
	      b: polygon[i + 1]
	    });
	  }
	  segments.push({
	    a: polygon[polygon.length - 1],
	    b: polygon[0]
	  });
	  return !segments.some(function (segment1) {
	    return segments.some(function (segment2) {
	      if (segment1 === segment2) {
	        return false;
	      }

	      var intersection = lineIntersection(segment1, segment2);
	      if (intersection === null) {
	        return false;
	      }

	      var ua = intersection.ua,
	          ub = intersection.ub;

	      return ua > 0 && ua < 1 && ub > 0 && ub < 1;
	    });
	  });
	}

	/**
	 * Checks if the polygon is flat (its area is 0).
	 * See https://en.wikipedia.org/wiki/Shoelace_formula
	 *
	 * @param {{{ x: number, y: number, id: number }[]}} polygon
	 * @returns {boolean}
	 */
	function isFlat(polygon) {
	  var polygonLength = polygon.length;
	  return polygon.reduce(function (sum, _ref2, index) {
	    var x = _ref2.x,
	        y = _ref2.y;
	    var _polygon = polygon[(index + 1) % polygonLength],
	        nextX = _polygon.x,
	        nextY = _polygon.y;

	    sum += x * nextY - y * nextX;
	    return sum;
	  }, 0) === 0;
	}

	// P is a polygon (vertices are clockwise ordered)
	/**
	 * This is the MP1 procedure taken from "Algorithms for the decomposition of a polygon into convex polygons" by J. Fernandez et al.
	 * The variable names (for the most part) are named according to the publication.
	 *
	 * @param {{ x: number, y: number, id: number }[]} P P is a polygon with clockwise ordered vertices.
	 * @param {{ x: number, y: number, id: number }[]} initialLVertices The initial vertices for the polygon L
	 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
	 */
	function MP1(P, initialLVertices) {
	  if (P.length < 4) {
	    return { L: [].concat(toConsumableArray(P)), end: true };
	  }

	  var L = [].concat(toConsumableArray(initialLVertices));
	  if (L.length < 1) {
	    L.push(P[0]);
	  }
	  if (L.length < 2) {
	    L.push(nextVertex(L[0], P));
	  }

	  var v1 = L[0];
	  var v2 = L[1];
	  var vim1 = v1;
	  var vi = v2;
	  var vip1 = nextVertex(vi, P);
	  while (L.length < P.length) {
	    if (turnDirection(vim1, vi, vip1) >= 0 && turnDirection(vi, vip1, v1) >= 0 && turnDirection(vip1, v1, v2) >= 0) {
	      L.push(vip1);
	    } else {
	      break;
	    }
	    vim1 = vi;
	    vi = vip1;
	    vip1 = nextVertex(vi, P);
	  }

	  if (P.length === L.length) {
	    return { L: L, end: true };
	  } else if (L.length < 2) {
	    return { L: L, end: true };
	  } else {
	    var _loop = function _loop() {
	      var PmL = substractPolygons(P, L);
	      // filter on L's bounding rectangle first ?
	      var notches = getNotches(PmL).filter(function (point) {
	        return !isAVertex(point, L);
	      }).filter(function (point) {
	        return inPolygon(point, L);
	      });
	      if (notches.length === 0) {
	        return 'break';
	      }
	      var v1 = L[0];
	      var k = L.length;
	      var vk = L[k - 1];

	      L = L.slice(0, -1); // L.filter(point => !vertexEquality(point, vk));
	      notches.forEach(function (notch) {
	        var sideOfVk = Math.sign(sideOfLine(vk, v1, notch));
	        if (sideOfVk !== 0) {
	          L = L.filter(function (point) {
	            return Math.sign(sideOfLine(point, v1, notch)) !== sideOfVk;
	          });
	        }
	      });
	    };

	    while (L.length > 2) {
	      var _ret = _loop();

	      if (_ret === 'break') break;
	    }
	    return { L: L, end: false };
	  }
	}

	/**
	 * This is the MP1' procedure taken from "Algorithms for the decomposition of a polygon into convex polygons" by J. Fernandez et al.
	 * The variable names (for the most part) are named according to the publication.
	 *
	 * @param {{ x: number, y: number, id: number }[]} P P is a polygon with clockwise ordered vertices.
	 * @param {{ x: number, y: number, id: number }[]} initialLVertices The initial vertices for the polygon L
	 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
	 */
	function MP1Prime(P, initialLVertices) {
	  if (P.length < 4) {
	    return { L: [].concat(toConsumableArray(P)), end: true };
	  }

	  var L = [].concat(toConsumableArray(initialLVertices));
	  if (L.length < 1) {
	    L.unshift(P[0]);
	  }
	  if (L.length < 2) {
	    L.unshift(previousVertex(L[0], P));
	  }

	  var vk = L[L.length - 1];
	  var vkm1 = L[L.length - 2];
	  var vim1 = L[1];
	  var vi = L[0];
	  var vip1 = previousVertex(vi, P);
	  while (L.length < P.length) {
	    if (turnDirection(vim1, vi, vip1) <= 0 && turnDirection(vi, vip1, vk) <= 0 && turnDirection(vip1, vk, vkm1) <= 0) {
	      L.unshift(vip1);
	    } else {
	      break;
	    }
	    vim1 = vi;
	    vi = vip1;
	    vip1 = previousVertex(vi, P);
	  }

	  if (P.length === L.length) {
	    return { L: L, end: true };
	  } else if (L.length < 2) {
	    return { L: L, end: true };
	  } else {
	    var _loop2 = function _loop2() {
	      var PmL = substractPolygons(P, L);
	      var notches = getNotches(PmL).filter(function (point) {
	        return !isAVertex(point, L);
	      }).filter(function (point) {
	        return inPolygon(point, L);
	      });
	      if (notches.length === 0) {
	        return 'break';
	      }

	      // CCW order
	      var v1 = L[L.length - 1];
	      var vk = L[0];

	      L = L.slice(1); // L.filter(point => !vertexEquality(point, vk));
	      notches.forEach(function (notch) {
	        var sideOfVk = Math.sign(sideOfLine(vk, v1, notch));
	        if (sideOfVk !== 0) {
	          L = L.filter(function (point) {
	            return Math.sign(sideOfLine(point, v1, notch)) !== sideOfVk;
	          });
	        }
	      });
	    };

	    while (L.length > 2) {
	      var _ret2 = _loop2();

	      if (_ret2 === 'break') break;
	    }
	    return { L: L, end: false };
	  }
	}

	function rotateRight(arr, n) {
	  var length = arr.length;
	  return [].concat(toConsumableArray(arr.slice(length - n)), toConsumableArray(arr.slice(0, length - n)));
	}

	/**
	 * Merges two polygons.
	 * polygon1 and polygon2 should be convex and share an edge (= two consecutive vertices)
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon1
	 * @param {{ x: number, y: number, id: number }[]} polygon2
	 * @returns {{ x: number, y: number, id: number }[]}
	 */
	function mergePolygons(polygon1, polygon2) {
	  var sharedVertices = polygon1.map(function (v1, index) {
	    return [index, polygon2.findIndex(function (v2) {
	      return pointEquality(v1, v2);
	    })];
	  }).filter(function (_ref) {
	    var _ref2 = slicedToArray(_ref, 2),
	        _ = _ref2[0],
	        v2Index = _ref2[1];

	    return v2Index > -1;
	  });
	  var polygon1Length = polygon1.length;

	  if (sharedVertices.length !== 2) {
	    throw new Error('sharedVertices length should be 2 : ' + JSON.stringify(sharedVertices));
	  }

	  if ((sharedVertices[0][0] + 1) % polygon1Length === sharedVertices[1][0]) {
	    return [].concat(toConsumableArray(rotateRight(polygon1, polygon1Length - sharedVertices[1][0])), toConsumableArray(rotateRight(polygon2, polygon2.length - sharedVertices[0][1]).slice(1, -1)));
	  } else {
	    return [].concat(toConsumableArray(rotateRight(polygon1, polygon1Length - sharedVertices[0][0])), toConsumableArray(rotateRight(polygon2, polygon2.length - sharedVertices[1][1]).slice(1, -1)));
	  }
	}

	/**
	 * Procedure to remove inessential diagonals from the partition of convex polygons.
	 *
	 * @params {{ x: number, y: number, id: number }[][]} polygons
	 * @params {{ i2: { x: number, y: number, id: number }, j2: { x: number, y: number, id: number }, rightPolygon: { x: number, y: number, id: number }[][], leftPolygon: { x: number, y: number, id: number }[][] }[]}
	 * @returns {{ x: number, y: number, id: number }[][]}
	 */
	function mergingAlgorithm(polygons, LLE) {
	  if (polygons.length < 2) {
	    return polygons;
	  }

	  // LDP[poly] = true means that the polygon `poly` is one of the definitive polygons of the partition after the merging process.
	  var LDP = new Map();
	  // LUP[poly1] = poly2 means that the polygon `poly1` is part of the polygon `poly2`.
	  var LUP = new Map();
	  polygons.forEach(function (poly) {
	    LDP.set(poly, true);
	    LUP.set(poly, poly);
	  });

	  if (LLE.length + 1 !== polygons.length) {
	    throw new Error('wtf ? LLE + 1 !== polygons.length (' + (LLE.length + 1) + ', ' + polygons.length + ')');
	  }

	  var _loop = function _loop(j) {
	    var _LLE$j = LLE[j],
	        i2 = _LLE$j.i2,
	        j2 = _LLE$j.j2,
	        rightPolygon = _LLE$j.rightPolygon,
	        leftPolygon = _LLE$j.leftPolygon;

	    var Pj = LUP.get(leftPolygon);
	    var Pu = LUP.get(rightPolygon);
	    var PjLength = Pj.length;
	    var PuLength = Pu.length;

	    // custom nextVertex & previousVertex to take into account the originalId (for absHol)
	    var i1 = Pu[(Pu.findIndex(function (v) {
	      return (v.originalId || v.id) === (i2.originalId || i2.id);
	    }) + PuLength - 1) % PuLength]; // previousVertex(i2, Pu);
	    var i3 = Pj[(Pj.findIndex(function (v) {
	      return (v.originalId || v.id) === (i2.originalId || i2.id);
	    }) + 1) % PjLength]; // nextVertex(i2, Pj);
	    var j1 = Pj[(Pj.findIndex(function (v) {
	      return (v.originalId || v.id) === (j2.originalId || j2.id);
	    }) + PjLength - 1) % PjLength]; // previousVertex(j2, Pj)
	    var j3 = Pu[(Pu.findIndex(function (v) {
	      return (v.originalId || v.id) === (j2.originalId || j2.id);
	    }) + 1) % PuLength]; //  nextVertex(j2, Pu);

	    if (turnDirection(i1, i2, i3) >= 0 && turnDirection(j1, j2, j3) >= 0) {
	      var P = mergePolygons(Pj, Pu);
	      if (!isConvex(P)) {
	        throw new Error('mergePolygons is not convex !');
	      }
	      LDP.set(Pj, false);
	      LDP.set(Pu, false);
	      LDP.set(P, true);

	      LUP.set(P, P);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = LUP.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var poly = _step.value;

	          if (LUP.get(poly) === Pj || LUP.get(poly) === Pu) {
	            LUP.set(poly, P);
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  };

	  for (var j = 0; j < LLE.length; j++) {
	    _loop(j);
	  }

	  return [].concat(toConsumableArray(LDP.entries())).filter(function (_ref3) {
	    var _ref4 = slicedToArray(_ref3, 2),
	        _ = _ref4[0],
	        inPartition = _ref4[1];

	    return inPartition;
	  }).map(function (_ref5) {
	    var _ref6 = slicedToArray(_ref5, 1),
	        polygon = _ref6[0];

	    return polygon;
	  });
	}

	function preprocessPolygon(polygon) {
	  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	  var polygonLength = polygon.length;
	  return polygon.filter(function (vertex, index) {
	    return !pointEquality(vertex, polygon[(index + 1) % polygonLength]);
	  }).map(function (vertex, index) {
	    return _extends({}, vertex, { id: index + offset });
	  });
	}

	/**
	 * This is the MP5 procedure taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
	 *
	 * @param {{ x: number, y: number, id: number }[]} polygon
	 * @param {{ x: number, y: number, id: number }} startingVertex
	 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
	 */
	function MP5Procedure(polygon) {
	  var startingVertex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : polygon[0];

	  if (polygon.length < 4) {
	    return {
	      convexPolygon: [].concat(toConsumableArray(polygon)),
	      end: true
	    };
	  }

	  var startingNotch = nextNotch(startingVertex, polygon);
	  if (startingNotch === null) {
	    // the polygon is convex if there is no notch in it
	    return {
	      convexPolygon: [].concat(toConsumableArray(polygon)),
	      end: true
	    };
	  }
	  var currentNotch = startingNotch;

	  var _loop = function _loop() {
	    var _MP = MP1(polygon, [currentNotch]),
	        cwL = _MP.L,
	        cwEnd = _MP.end;

	    if (cwEnd) {
	      return {
	        v: {
	          convexPolygon: cwL,
	          end: true
	        }
	      };
	    }
	    // MP1 + notch checking = MP3
	    if (cwL.length > 2 && getNotches(polygon).some(function (vertex) {
	      return vertexEquality(vertex, cwL[0]) || vertexEquality(vertex, cwL[cwL.length - 1]);
	    })) {
	      return {
	        v: {
	          convexPolygon: cwL,
	          end: false
	        }
	      };
	    }

	    currentNotch = nextNotch(currentNotch, polygon);
	  };

	  do {
	    var _ret = _loop();

	    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	  } while (!vertexEquality(currentNotch, startingNotch));

	  currentNotch = startingNotch;

	  var _loop2 = function _loop2() {
	    var _MP1Prime = MP1Prime(polygon, [currentNotch]),
	        ccwL = _MP1Prime.L,
	        ccwEnd = _MP1Prime.end;

	    if (ccwEnd) {
	      return {
	        v: {
	          convexPolygon: ccwL,
	          end: true
	        }
	      };
	    }
	    // MP1 + notch checking = MP3
	    if (ccwL.length > 2 && getNotches(polygon).some(function (vertex) {
	      return vertexEquality(vertex, ccwL[0]) || vertexEquality(vertex, ccwL[ccwL.length - 1]);
	    })) {
	      return {
	        v: {
	          convexPolygon: ccwL,
	          end: false
	        }
	      };
	    }

	    currentNotch = previousNotch(currentNotch, polygon);
	  };

	  do {
	    var _ret2 = _loop2();

	    if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
	  } while (!vertexEquality(currentNotch, startingNotch));

	  throw new Error('ERROR MP5Procedure 3');
	}

	/**
	 * This is the full MP5 algorithm taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
	 *
	 * @param {{ x: number, y: number }[]} polygon
	 * @returns {{ x: number, y: number }[][]} The partition of convex polygons
	 */
	function MP5(polygon) {
	  if (!Array.isArray(polygon)) {
	    throw new Error('MP5 can only take an array of points {x, y} as input');
	  }
	  if (polygon.length <= 2) {
	    return [polygon];
	  }
	  if (!isClockwiseOrdered(polygon)) {
	    throw new Error('MP5 can only work with clockwise ordered polygon');
	  }

	  // L is containing the convex polygons.
	  var L = [];
	  // LLE is a list containing the diagonals of the partition. It will be used to merge inessential diagonals.
	  var LLE = [];

	  // Adds an id to each vertex.
	  var P = preprocessPolygon(polygon);

	  var _loop3 = function _loop3() {
	    var _MP5Procedure = MP5Procedure(P),
	        convexPolygon = _MP5Procedure.convexPolygon,
	        end = _MP5Procedure.end;

	    var diagonal = { a: convexPolygon[0], b: convexPolygon[convexPolygon.length - 1] };

	    L.push(convexPolygon);

	    getEdges(convexPolygon).forEach(function (edge) {
	      for (var i = 0; i < LLE.length; i++) {
	        var _LLE$i = LLE[i],
	            i2 = _LLE$i.i2,
	            j2 = _LLE$i.j2;

	        if (vertexEquality(i2, edge.b) && vertexEquality(j2, edge.a)) {
	          LLE[i].leftPolygon = convexPolygon;
	          break;
	        }
	      }
	    });

	    if (end) {
	      return 'break';
	    }

	    LLE.push({
	      i2: diagonal.b,
	      j2: diagonal.a,
	      rightPolygon: convexPolygon
	    });

	    P = substractPolygons(P, convexPolygon);
	  };

	  while (true) {
	    var _ret3 = _loop3();

	    if (_ret3 === 'break') break;
	  }

	  return mergingAlgorithm(L, LLE).map(function (poly) {
	    return poly.map(function (_ref) {
	      var x = _ref.x,
	          y = _ref.y;
	      return { x: x, y: y };
	    });
	  });
	}

	/**
	 * Checks if the given segment instersects the polygon
	 *
	 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} segment
	 * @param {{ x: number, y: number }[]} polygon
	 * @returns {boolean}
	 */
	var segmentIntersectsPolygon = function segmentIntersectsPolygon(segment, polygon) {
	  var polygonLength = polygon.length;
	  for (var i = 0; i < polygonLength; i++) {
	    var edge = {
	      a: polygon[(i - 1 + polygonLength) % polygonLength],
	      b: polygon[i]
	    };

	    var intersection = lineIntersection(segment, edge);
	    if (intersection === null) {
	      continue;
	    }

	    var ua = intersection.ua,
	        ub = intersection.ub;

	    if (ua > EPSILON && ub >= 0 && ua < 1 - EPSILON && ub <= 1) {
	      return true;
	    } else if (ua === 0 && (ub === 0 || ub === 1)) {
	      console.log('beginning of segment on a vertex');
	      return true;
	    } else if (ua === 1 && (ub === 0 || ub === 1)) {
	      console.log('end of segment on a vertex');
	      return true;
	    } else if (ua >= 0 && ub >= 0 && ua <= 1 && ub <= 1) {
	      console.error('whaaaat ?');
	    }
	  }
	  return false;
	};

	/**
	 * Returns all the edges of the given hole that intersects the given segment.
	 *
	 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} segment
	 * @param {{ x: number, y: number, id: number }[]} hole
	 * @returns {{ x: number, y: number, edge: { a: { x: number, y: number }, b: { x: number, y: number }}, hole: { x: number, y: number, id: number }[] }[]}
	 */
	var getSegmentHoleIntersectionEdges = function getSegmentHoleIntersectionEdges(segment, hole) {
	  var edges = [];
	  var holeLength = hole.length;
	  for (var i = 0; i < holeLength; i++) {
	    var edge = {
	      a: hole[(i - 1 + holeLength) % holeLength],
	      b: hole[i]
	    };

	    var intersection = lineIntersection(segment, edge);
	    if (intersection === null) {
	      continue;
	    }

	    var x = intersection.x,
	        y = intersection.y,
	        ua = intersection.ua,
	        ub = intersection.ub;

	    if (ua > EPSILON && ub >= 0 && ua < 1 - EPSILON && ub <= 1) {
	      edges.push({
	        x: x,
	        y: y,
	        edge: edge,
	        hole: hole
	      });
	    }
	  }
	  return edges;
	};

	var rotateLeft = function rotateLeft(a) {
	  var i = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

	  return [].concat(toConsumableArray(a.slice(i)), toConsumableArray(a.slice(0, i)));
	};

	/**
	 * This is the DrawTrueDiagonal procedure taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
	 *
	 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} diagonal
	 * @param {{ x: number, y: number, id: number }[]} C
	 * @param {{ x: number, y: number, id: number }[][]} holesInC
	 * @returns {{ a: { x: number, y: number }, b: { x: number, y: number }, hole: { x: number, y: number, id: number }[]}}
	 */
	var drawTrueDiagonal = function drawTrueDiagonal(diagonal, C, holesInC) {
	  var comparator = function comparator(a, b) {
	    return squaredDistance(diagonal.a, a) - squaredDistance(diagonal.a, b);
	  };

	  var edges = [];
	  var holesInCLength = holesInC.length;
	  for (var i = 0; i < holesInCLength; i++) {
	    var _edges;

	    (_edges = edges).push.apply(_edges, toConsumableArray(getSegmentHoleIntersectionEdges(diagonal, holesInC[i])));
	  }

	  while (edges.length > 0) {
	    var closestEdge = edges.sort(comparator)[0];
	    var closestVertex = Object.values(closestEdge.edge).filter(function (v) {
	      return inPolygon(v, C);
	    }).sort(comparator)[0];
	    // is it possible that we have to take another edge ??
	    if (closestVertex === undefined) {
	      throw new Error('ERROR drawTrueDiagonal');
	    }

	    diagonal = { a: diagonal.a, b: closestVertex, hole: closestEdge.hole };

	    edges = [];
	    for (var _i = 0; _i < holesInCLength; _i++) {
	      var _edges2;

	      (_edges2 = edges).push.apply(_edges2, toConsumableArray(getSegmentHoleIntersectionEdges(diagonal, holesInC[_i])));
	    }
	  }
	  return diagonal;
	};

	/**
	 * This is the AbsHol algorithm taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
	 *
	 * @param {{ x: number, y: number, id: number }[]} P
	 * @param {{ x: number, y: number, id: number }[][]} holes
	 * @param {number} idOffset
	 * @returns {{ LPCP: { x: number, y: number, id: number }[][], trueDiagonals: { a: { x: number, y: number, id: number }, b: { x: number, y: number, id: number } }[] , LLE: { i2: { x: number, y: number, id: number }, j2: { x: number, y: number, id: number }, rightPolygon: { x: number, y: number, id: number }[][], leftPolygon: { x: number, y: number, id: number }[][] }[] }} The partition of convex polygons
	 */
	function absHolProcedure(P, holes, idOffset) {
	  var LLE = [];
	  var trueDiagonals = [];
	  var LPCP = [];

	  var Q = [].concat(toConsumableArray(P));

	  var _loop = function _loop() {
	    var _MP5Procedure = MP5Procedure(Q),
	        C = _MP5Procedure.convexPolygon,
	        end = _MP5Procedure.end;

	    var diagonal = { a: C[0], b: C[C.length - 1], hole: null };

	    var holesLength = holes.length;
	    var diagonalIsCutByAHole = false;
	    var holesInC = [];
	    for (var i = 0; i < holesLength; i++) {
	      var hole = holes[i];
	      if (!diagonalIsCutByAHole && segmentIntersectsPolygon(diagonal, hole)) {
	        diagonalIsCutByAHole = true;
	        diagonal.hole = hole;
	      }
	      if (containsPolygon(C, hole)) {
	        holesInC.push(hole);
	      }
	    }

	    if (diagonalIsCutByAHole || holesInC.length > 0) {
	      if (!diagonalIsCutByAHole) {
	        diagonal = { a: C[0], b: holesInC[0][0], hole: holesInC[0] };
	      }

	      var _drawTrueDiagonal = drawTrueDiagonal(diagonal, C, holesInC),
	          HPrime = _drawTrueDiagonal.hole,
	          dPrime = objectWithoutProperties(_drawTrueDiagonal, ['hole']);

	      trueDiagonals.push(dPrime);

	      // Absorption of H'
	      holes = holes.filter(function (hole) {
	        return hole !== HPrime;
	      });
	      var vi = C[0];
	      var id1 = ++idOffset;
	      var id2 = ++idOffset;
	      var rotatedHPrime = rotateLeft(HPrime, HPrime.findIndex(function (v) {
	        return vertexEquality(v, dPrime.b);
	      }) + 1).reverse();

	      var viIndexInQ = Q.findIndex(function (v) {
	        return vertexEquality(v, vi);
	      });
	      Q = [].concat(toConsumableArray(Q.slice(0, viIndexInQ + 1)), toConsumableArray(rotatedHPrime), [_extends({}, rotatedHPrime[0], { id: id1, originalId: rotatedHPrime[0].id.originalId || rotatedHPrime[0].id }), _extends({}, vi, { id: id2, originalId: vi.originalId || vi.id })], toConsumableArray(Q.slice(viIndexInQ + 1)));
	    } else {
	      LPCP.push(C);

	      getEdges(C).forEach(function (edge) {
	        for (var _i2 = 0; _i2 < LLE.length; _i2++) {
	          var _LLE$_i = LLE[_i2],
	              diagonalA = _LLE$_i.i2,
	              diagonalB = _LLE$_i.j2;

	          if ((diagonalA.originalId || diagonalA.id) === (edge.b.originalId || edge.b.id) && (diagonalB.originalId || diagonalB.id) === (edge.a.originalId || edge.a.id)) {
	            LLE[_i2].leftPolygon = C;
	            break;
	          }
	        }
	      });

	      if (end) {
	        return 'break';
	      }

	      LLE.push({
	        i2: diagonal.b,
	        j2: diagonal.a,
	        rightPolygon: C
	      });

	      Q = substractPolygons(Q, C);
	    }
	  };

	  while (true) {
	    var _ret = _loop();

	    if (_ret === 'break') break;
	  }

	  return { LPCP: LPCP, trueDiagonals: trueDiagonals, LLE: LLE };
	}

	/**
	 * An implementation of the algorithm presented in "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
	 * It will decompose a polygon (with or without holes) in a partition of convex polygons.
	 *
	 * @param {{ x: number, y: number }[]} polygon
	 * @param {{ x: number, y: number }[][]} holes
	 * @returns {{ x: number, y: number }[][]} The partition of convex polygons
	 */
	function absHol(polygon) {
	  var holes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	  if (!Array.isArray(polygon)) {
	    throw new Error('absHol can only take an array of points {x, y} as input');
	  }
	  if (polygon.length <= 2) {
	    return [polygon];
	  }
	  if (!isClockwiseOrdered(polygon)) {
	    throw new Error('absHol can only work with clockwise ordered vertices');
	  }
	  // en mode dev : vérifier que les holes sont bien tous dans polygon
	  if (!holes.every(function (hole) {
	    return containsEntirePolygon(polygon, hole);
	  })) {
	    throw new Error('One or more holes are not totally inside the polygon !');
	  }

	  // Starting the ids at 1 to ensure there are no problem when computing the diagonals (originalId || id)
	  var preprocessedPolygon = preprocessPolygon(polygon, 1);
	  var offset = preprocessedPolygon.length + 1;

	  var preprocessedHoles = holes.map(function (hole) {
	    var preprocessedHole = preprocessPolygon(hole, offset);
	    offset += preprocessedHole.length;
	    return preprocessedHole;
	  });

	  var _absHolProcedure = absHolProcedure(preprocessedPolygon, preprocessedHoles, offset),
	      LPCP = _absHolProcedure.LPCP,
	      trueDiagonals = _absHolProcedure.trueDiagonals,
	      LLE = _absHolProcedure.LLE;

	  // Removing "flat" polygons


	  var mergedPoly = mergingAlgorithm(LPCP, LLE).filter(function (poly) {
	    return !isFlat(poly);
	  });

	  // Merging the inessentials true diagonals
	  trueDiagonals.forEach(function (_ref) {
	    var i2 = _ref.a,
	        j2 = _ref.b;

	    var Pj = void 0,
	        Pu = void 0,
	        i1 = void 0,
	        i3 = void 0,
	        j1 = void 0,
	        j3 = void 0;

	    for (var i = 0; i < mergedPoly.length; i++) {
	      var poly = mergedPoly[i];
	      var polyLength = poly.length;
	      var edges = getEdges(poly);

	      var _loop2 = function _loop2(j) {
	        var _edges$j = edges[j],
	            edgeA = _edges$j.a,
	            edgeB = _edges$j.b;
	        // TODO : ici je pense qu'on peut passer previous/nextVertex, a verifier

	        if ((i2.originalId || i2.id) === (edgeA.originalId || edgeA.id) && (j2.originalId || j2.id) === (edgeB.originalId || edgeB.id)) {
	          i1 = poly[(poly.findIndex(function (v) {
	            return (v.originalId || v.id) === (edgeA.originalId || edgeA.id);
	          }) + polyLength - 1) % polyLength]; // previousVertex(edgeA, poly);
	          j3 = poly[(poly.findIndex(function (v) {
	            return (v.originalId || v.id) === (edgeB.originalId || edgeB.id);
	          }) + 1) % polyLength]; // nextVertex(edgeB, poly);
	          Pu = poly;
	          return 'break';
	        } else if ((i2.originalId || i2.id) === (edgeB.originalId || edgeB.id) && (j2.originalId || j2.id) === (edgeA.originalId || edgeA.id)) {
	          i3 = poly[(poly.findIndex(function (v) {
	            return (v.originalId || v.id) === (edgeB.originalId || edgeB.id);
	          }) + 1) % polyLength]; // nextVertex(edgeB, poly);
	          j1 = poly[(poly.findIndex(function (v) {
	            return (v.originalId || v.id) === (edgeA.originalId || edgeA.id);
	          }) + polyLength - 1) % polyLength]; // previousVertex(edgeA, poly);
	          Pj = poly;
	          return 'break';
	        }
	      };

	      for (var j = 0; j < edges.length; j++) {
	        var _ret2 = _loop2(j);

	        if (_ret2 === 'break') break;
	      }

	      if (Pu && Pj) {
	        if (turnDirection(i1, i2, i3) >= 0 && turnDirection(j1, j2, j3) >= 0) {
	          mergedPoly = mergedPoly.filter(function (poly) {
	            return poly !== Pu && poly !== Pj;
	          }).concat([mergePolygons(Pj, Pu)]);
	        }
	        break;
	      }
	    }
	  });

	  return mergedPoly.map(function (poly) {
	    return poly.map(function (_ref2) {
	      var x = _ref2.x,
	          y = _ref2.y;
	      return { x: x, y: y };
	    });
	  });
	}

	exports.absHol = absHol;
	exports.MP5 = MP5;
	exports.isSimple = isSimple;
	exports.orderClockwise = orderClockwise;
	exports.isConvex = isConvex;
	exports.default = absHol;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
