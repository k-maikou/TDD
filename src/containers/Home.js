import React, { PureComponent, Fragment } from 'react';
import Ionicon from 'react-ionicons';
import PriceList from '../components/PriceList';
import ViewTab from '../components/ViewTab';
import MothPicker from '../components/MothPicker';
import CreateBtn from '../components/CreateBtn';
import TotalPrice from '../components/TotalPrice';
import { withRouter } from 'react-router-dom';
import { Tabes, Tab } from '../components/Tabes';
import { LIST_VIEW, TYPE_OUTCOME, parseToYearAndMonth, CHART_VIEW, padLeft } from '../utility';
import withContext from '../WithContext';

export const items = [
  {
    "id": 1,
    "title": "去云南旅游",
    "price": 300,
    "date": "2019-11-12",
    "cid": 1
  },
  {
    "id": 2,
    "title": "去东门打工",
    "price": 200,
    "date": "2019-10-12",
    "cid": 2
  },
  {
    "id": 3,
    "title": "理财收入",
    "price": 300,
    "date": "2019-12-12",
    "cid": 3
  }
]
export const category = {
  "1": {
    "id": 1,
    "name": "旅行",
    "type": "outcome",
    "iconName": "ios-plane"
  },
  "2": {
    "id": 2,
    "name": "赚钱",
    "type": "income",
    "iconName": "ios-plane"
  },
  "3": {
    "id": 3,
    "name": "理财",
    "type": "outcome",
    "iconName": "ios-plane"
  }
}
const newItem = {
  "id": 4,
  "title": "新加的项目",
  "price": 300,
  "date": "2019-9-12",
  "cid": 1
}
const tabesText = [LIST_VIEW, CHART_VIEW];

class Home extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      items,
      currentDate: parseToYearAndMonth(),
      tabView: tabesText[0]
    }
  }

  changeView = (index) => {
    this.setState({
      tabView: tabesText[index]
    })
  }

  changeDate = (year, month) => {
    this.setState({
      currentDate: { year, month }
    })
  }

  modifyItem = (modifiedItem) => {
    this.props.history.push(`/edit/${modifiedItem.id}`)
  }

  createItem = () => {
    this.props.history.push('/create')
  }

  deleteItem = (deleted) => {
    const filteredItem = this.state.items.filter(item => item.id !== deleted.id);
    console.log(filteredItem)
    this.setState({
      items: filteredItem
    })
  }

  render() {
    const { data, action } = this.props;
    console.log(action)
    const { items, currentDate, tabView } = this.state;
    const itemsWithCategory = items.map(item => {
      item.category = category[item.cid];
      return item;
    }).filter(item => {
      return item.date.includes(`${currentDate.year}-${padLeft(currentDate.month)}`)
    })
    console.log(itemsWithCategory)

    let totalIncome = 0, totalOutcome = 0;
    itemsWithCategory.forEach(item => {
      if (item.category.type === TYPE_OUTCOME) {
        totalOutcome += item.price
      } else {
        totalIncome += item.price
      }
    })

    return(
      <Fragment >
        <div className='row ml-0' style={{width: '100%', padding: '20px', background: 'skyBlue'}}>
          <div className='col'>
            <MothPicker
              year={currentDate.year}
              moth={currentDate.month}
              onChange={(year, month) => { this.changeDate(year, month) }}
            />
          </div>
          <div className='col d-flex justify-content-between align-items-center'>
            <TotalPrice 
              income={totalIncome}
              outcome={totalOutcome}
            />
          </div>
        </div>
        <div className='content-area py-3 px-3'>
          <Tabes 
            activeIndex={0}
            onTabChange={this.changeView}
          >
            <Tab>
              <Ionicon
                className='rounded-circle mr-2'
                fontSize='25px'
                color={'#007bff'}
                icon='ios-paper'
              />
              列表模式
            </Tab>
            <Tab>
              <Ionicon
                className='rounded-circle mr-2'
                fontSize='25px'
                color={'#007bff'}
                icon='ios-pie'
              />
              图标模式
            </Tab>
          </Tabes>
          { tabView === LIST_VIEW &&
            <PriceList
              items={itemsWithCategory}
              onModifyItem={this.modifyItem}
              onDeleteItem={this.deleteItem}
            />
          }
          { tabView === CHART_VIEW &&
            <h1>这里是图表区域</h1>
          }
          <CreateBtn 
            onClick={ this.createItem }
          />
        </div>
      </Fragment>
    )
  }
}

export default withRouter(withContext(Home));
