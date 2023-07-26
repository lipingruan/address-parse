'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _area2 = require('../area');

var _area3 = _interopRequireDefault(_area2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 通过地区编码返回省市区对象
 * @param code
 * @returns {{code: *, province: (*|string), city: (*|string), area: (*|string)}}
 */
function getAreaByCode(code) {
  var pCode = code.slice(0, 2) + '0000',
      cCode = code.slice(0, 4) + '00';
  return {
    code: code,
    province: _area3.default.province_list[pCode] || '',
    city: _area3.default.city_list[cCode] || '',
    area: _area3.default.area_list[code] || ''
  };
}

/**
 * 通过地区编码返回省市区街道对象
 * @param code
 * @returns {{code: *, province: (*|string), city: (*|string), area: (*|string), street: (*|string)}}
 */
/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
function getStreetByCode(code) {
  var pCode = code.slice(0, 2) + '0000',
      cCode = code.slice(0, 4) + '00',
      aCode = code.slice(0, 6);
  return {
    code: code,
    province: _area3.default.province_list[pCode] || '',
    city: _area3.default.city_list[cCode] || '',
    area: _area3.default.area_list[aCode] || '',
    street: _area3.default.street_list[code] || ''
  };
}

/**
 * 通过code取父省市对象
 * @param target province/city/area/street
 * @param code
 * @returns {Array} [province, city, area,street]
 */
function getTargetParentAreaListByCode(target, code) {
  var result = [];
  if (target === 'street') {
    result.unshift({
      code: code,
      name: _area3.default.street_list[code] || ''
    });
  }

  if (['area', 'city', 'province'].includes(target)) {
    code = code.slice(0, 6);
    result.unshift({
      code: code,
      name: _area3.default.area_list[code] || ''
    });
  }
  if (['city', 'province'].includes(target)) {
    code = code.slice(0, 4) + '00';
    result.unshift({
      code: code,
      name: _area3.default.city_list[code] || ''
    });
  }
  if (target === 'province') {
    code = code.slice(0, 2) + '0000';
    result.unshift({
      code: code,
      name: _area3.default.province_list[code] || ''
    });
  }
  return result;
}

/**
 * 根据省市县类型和对应的`code`获取对应列表
 * 只能逐级获取 province->city->area->street OK  province->area->street ERROR
 * @param target String province city area
 * @param code
 * @param parent 默认获取子列表 如果要获取的是父对象 传true
 * @returns {*}
 */
function getTargetAreaListByCode(target, code, parent) {
  if (parent) return getTargetParentAreaListByCode(target, code);
  var result = [];
  var list = _area3.default[{
    city: 'city_list',
    area: 'area_list',
    street: 'street_list'
  }[target]];
  if (code && list) {
    code = code.toString();
    var provinceCode = code.slice(0, 2);
    var cityCode = code.slice(2, 4);
    var areaCode = code.slice(4, 6);
    if (target === 'street') {
      code = '' + provinceCode + cityCode + areaCode;
      for (var j = 0; j < 1000; j++) {
        var _code = '' + code + (j < 10 ? '00' : j < 100 ? '0' : '') + j;
        if (list[_code]) {
          result.push({
            code: _code,
            name: list[_code]
          });
        }
      }
    } else if (target === 'area' && cityCode !== '00') {
      code = '' + provinceCode + cityCode;
      for (var _j = 0; _j < 100; _j++) {
        var _code2 = '' + code + (_j < 10 ? '0' : '') + _j;
        if (list[_code2]) {
          result.push({
            code: _code2,
            name: list[_code2]
          });
        }
      }
    } else {
      for (var i = 0; i < 99; i++) {
        //最大city编码只到91
        //只有city跟area
        code = '' + provinceCode + (i < 10 ? '0' : '') + i + (target === 'city' ? '00' : '');
        if (target === 'city') {
          if (list[code]) {
            result.push({
              code: code,
              name: list[code]
            });
          }
        } else {
          for (var _j2 = 0; _j2 < 100; _j2++) {
            var _code3 = '' + code + (_j2 < 10 ? '0' : '') + _j2;
            if (list[_code3]) {
              result.push({
                code: _code3,
                name: list[_code3]
              });
            }
          }
        }
      }
    }
  } else {
    for (var _code4 in list) {
      result.push({
        code: _code4,
        name: list[_code4]
      });
    }
  }
  return result;
}

/**
 * 通过省市区非标准字符串准换为标准对象
 * 旧版识别的隐藏省份后缀的对象可通过这个函数转换为新版支持对象
 * @param province
 * @param city
 * @param area
 * @param street
 * @returns {{code: string, province: string, city: string, area: string, street: string}}
 */
function getAreaByAddress(_ref) {
  var province = _ref.province,
      city = _ref.city,
      area = _ref.area,
      street = _ref.street;
  var province_list = _area3.default.province_list,
      city_list = _area3.default.city_list,
      area_list = _area3.default.area_list,
      street_list = _area3.default.street_list;

  var result = {
    code: '',
    province: '',
    city: '',
    area: '',
    street: ''
  };
  for (var _code in province_list) {
    var _province = province_list[_code];
    if (_province.indexOf(province) === 0) {
      result.code = _code;
      result.province = _province;
      _code = _code.substr(0, 2);
      for (var _code_city in city_list) {
        if (_code_city.indexOf(_code) === 0) {
          var _city = city_list[_code_city];
          if (_city.indexOf(city) === 0) {
            result.code = _code_city;
            result.city = _city;
            if (area) {
              _code_city = _code_city.substr(0, 4);
              for (var _code_area in area_list) {
                if (_code_area.indexOf(_code_city) === 0) {
                  var _area = area_list[_code_area];
                  if (_area.indexOf(area) === 0) {
                    result.code = _code_area;
                    result.area = _area;
                    if (street) {
                      for (var _code_street in street_list) {
                        if (_code_street.indexOf(_code_area) === 0) {
                          var _street = street_list[_code_street];
                          if (_street.indexOf(street) === 0) {
                            result.code = _code_street;
                            result.street = _street;
                            break;
                          }
                        }
                      }
                    }
                    break;
                  }
                }
              }
            }
            break;
          }
        }
      }
      break;
    }
  }
  return result;
}

/**
 * 字符串占位长度
 * @param str
 * @returns {number}
 */
function strLen(str) {
  var l = str.length,
      len = 0;
  for (var i = 0; i < l; i++) {
    len += (str.charCodeAt(i) & 0xff00) !== 0 ? 2 : 1;
  }
  return len;
}

var Reg = {
  mobile: /(86-[1][3-9][0-9]{9})|(86[1][3-9][0-9]{9})|([1][3-9][0-9]{9})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g
};

function shortIndexOf(address, shortName, name) {
  var index = address.indexOf(shortName);
  var matchName = shortName;
  if (index > -1) {
    for (var i = shortName.length; i <= name.length; i++) {
      var _name = name.substr(0, i);
      var _index = address.indexOf(_name);
      if (_index > -1) {
        index = _index;
        matchName = _name;
      } else {
        break;
      }
    }
  }
  return { index: index, matchName: matchName };
}

function genArea(provinces) {

  var area = {
    province_list: {},
    city_list: {},
    area_list: {},
    street_list: {}
  };

  for (var province_code in provinces) {
    var _provinces$province_c = provinces[province_code],
        n = _provinces$province_c.n,
        cities = _provinces$province_c.s;

    area.province_list[province_code] = n;

    for (var city_code in cities) {
      var _cities$city_code = cities[city_code],
          _n = _cities$city_code.n,
          areas = _cities$city_code.s;

      area.city_list[city_code] = _n;

      for (var area_code in areas) {
        var _areas$area_code = areas[area_code],
            _n2 = _areas$area_code.n,
            streets = _areas$area_code.s;

        area.area_list[area_code] = _n2;

        for (var street_code in streets) {
          var _n3 = streets[street_code].n;

          area.street_list[street_code] = _n3;
        }
      }
    }
  }

  return area;
}

var Utils = {
  shortIndexOf: shortIndexOf,
  strLen: strLen,
  getAreaByCode: getAreaByCode,
  getAreaByAddress: getAreaByAddress,
  getTargetAreaListByCode: getTargetAreaListByCode,
  Reg: Reg,
  genArea: genArea
};

exports.default = Utils;