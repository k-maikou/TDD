import React, { PureComponent, lazy, Suspense, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { testItems, testCategories } from './testData';
import { flatterArr, ID, parseToYearAndMonth } from './utility';

const Home = lazy(() => import('./containers/Home'));
const Create = lazy(() => import('./containers/Create'));

export const AppContext = createContext();

class App extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      items: flatterArr(testItems),
      categories: flatterArr(testCategories)
    }
    this.actions = {
      deletesItem: (item) => {
        delete this.state.items[item.id]
        this.setState({
          items: this.state.items
        })
      },
      createItem: (data, categoryId) => {
        const newId = ID();
        const parsedDate = parseToYearAndMonth(data.date);
        data.monthCategory = `${parsedDate.year}-${parsedDate.month}`
        data.timestamp = new Date(data.date).getTime()
        const newItem = { ...data, id: newId, cid: categoryId }
        this.setState({
          items: {...this.state.items, [newId]: newItem}
        })
      },
      updateItem: (item, updatedCategoryId) => {
        const modifiedItem = {
          ...item,
          cid: updatedCategoryId,
          timestamp: new Date(item.date).getTime()
        }
        this.setState({
          items: { ...this.state.items, [modifiedItem.id]: modifiedItem }
        })
      }
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
            <Link to='/'><button className='btn btn-primary mr-2'>home</button></Link>
            <Link to='/create'><button className='btn btn-primary mr-2'>create</button></Link>
            <Link to={'/edit/' + 222}><button className='btn btn-primary mr-2'>edit</button></Link>
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
