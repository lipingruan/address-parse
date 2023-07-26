'use strict';

var provinces = require('../assets/areas_township.json');

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

console.log(genArea(provinces));