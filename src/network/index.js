import { request } from './request';

class Axios {
  static getInitDataList = (year, month) => {
    return request({
      url: '/items',
      params: {
        monthCategory: year + '-' + month,
        _sort: 'timestamp',
        _order: 'desc'
      }
    })
  }

  static getCategoriesData = () => {
    return request({
      url: '/categories'
    })
  }
}

export default Axios;
