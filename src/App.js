import React, { PureComponent, lazy, Suspense, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
// import axios from './network';
import { flatterArr, ID, parseToYearAndMonth } from './utility';

const Home = lazy(() => import('./containers/Home'));
const Create = lazy(() => import('./containers/Create'));
export const AppContext = createContext();

class App extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      items: {},
      categories: {},
      isLoading: false,
      currentDate: parseToYearAndMonth(),
    }
    const withLoading = (cb) => ((...args) => {
      this.setState({
        isLoading: true
      })
      return cb(...args);
    })

    this.actions = {
      // 请求数据
      getInitAlData: async () => {
        this.setState({
          isLoading: true
        })
        const { currentDate } = this.state;
        const getUrlWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
        const result = await Promise.all([axios.get('/categories'), axios.get(getUrlWithData)]);
        // const result = await Promise.all([axios.getCategoriesData(), axios.getInitDataList(currentDate.year, currentDate.month)])
        const [ categories, items ] = result;
        this.setState({
          items: flatterArr(items.data),
          categories: flatterArr(categories.data),
          isLoading: false
        })
        return items;
      },
      // 创建页面
      getEditData: withLoading(async (id) => {
        const { items, categories } = this.state;

        let promiseArr = [];
        if (Object.keys(categories).length === 0) {
          promiseArr.push(axios.get('/categories'))
        }
        const itemAlreadyFecHed = (Object.keys(items).indexOf(id) > -1);
        if (id && !itemAlreadyFecHed) {
          const getUrlWithId = `/items/${id}`;
          promiseArr.push(axios.get(getUrlWithId));
        }
        const [ fetchedCategories, editItem ] = await Promise.all(promiseArr);
        const finalCategories = fetchedCategories ? flatterArr(fetchedCategories.data) : categories;
        const finalItem = editItem ? editItem.data : items[id];
        if (id) {
          this.setState({
            categories: finalCategories,
            items: { ...this.state.items, [id]: finalItem },
            isLoading: false
          })
        } else {
          this.setState({
            categories: finalCategories,
            isLoading: false,
          })
        }
        return {
          categories: finalCategories,
          editItem: finalItem
        }
      }),
      // 年月下拉菜单
      selectNewMonth: withLoading(async (year, month) => {
        const getUrlWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
        const items = await axios.get(getUrlWithData);
        this.setState({
          items: flatterArr(items.data),
          currentDate: { year, month },
          isLoading: false
        })
        return items;
      }),
      // 删除按钮
      deletesItem: async (item) => {
        this.setState({
          isLoading: true
        })
        const deleteItem = await axios.delete(`/items/${item.id}`);
        delete this.state.items[item.id];
        this.setState({
          items: this.state.items,
          isLoading: false
        })
        return deleteItem;
      },
      // 创建按钮
      createItem: withLoading(async (data, categoryId) => {
        const newId = ID();
        const parsedDate = parseToYearAndMonth(data.date);
        data.monthCategory = `${parsedDate.year}-${parsedDate.month}`
        data.timestamp = new Date(data.date).getTime()
        const newItem = await axios.post('/items', { ...data, id: newId, cid: categoryId })
        this.setState({
          items: {...this.state.items, [newId]: newItem.data},
          isLoading: false
        })
        return newItem.data;
      }),
      // 编辑按钮
      updateItem: withLoading(async (item, updatedCategoryId) => {
        const updatedData = {
          ...item,
          cid: updatedCategoryId,
          timestamp: new Date(item.date).getTime()
        }
        const modifiedItem = await axios.put(`/items/${item.id}`, updatedData)
        this.setState({
          items: { ...this.state.items, [modifiedItem.id]: modifiedItem.data },
          isLoading: false
        })
        console.log(modifiedItem)
        return modifiedItem.data;
      })
    }
    
  }

  render() {
    return (
      <AppContext.Provider value={{
        state: this.state,
        actions: this.actions
      }}>
        <Router>
          <div>
            <Suspense fallback={<div>...loading</div>}>
              <Route exact={true} path='/' component={Home} />
              <Route path='/create' component={Create} />
              <Route path='/edit/:id' component={Create} />
            </Suspense>
          </div>
        </Router>
      </AppContext.Provider>
    )
  }
}

export default App;
