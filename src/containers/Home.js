import React, { PureComponent, Fragment } from 'react';
import Ionicon from 'react-ionicons';
import PriceList from '../components/PriceList';
import MothPicker from '../components/MothPicker';
import CreateBtn from '../components/CreateBtn';
import TotalPrice from '../components/TotalPrice';
import PieCharts from '../components/PieCharts';
import { withRouter } from 'react-router-dom';  
import { Tabes, Tab } from '../components/Tabes';
import withContext from '../WithContext';
import Loader from '../components/loading';
import { LIST_VIEW, TYPE_INCOME, TYPE_OUTCOME, parseToYearAndMonth, CHART_VIEW, padLeft, Colors } from '../utility';

const tabesText = [LIST_VIEW, CHART_VIEW];
const generateChartDataByCategory = (items, type = TYPE_INCOME) => {
  let categoryMap = {};
  items.filter(item => item.category.type === type).forEach(item => {
    if (categoryMap[item.cid]) {
      categoryMap[item.cid].value += (item.price * 1)
      categoryMap[item.cid].items.push(item.id)
    } else {
      categoryMap[item.cid] = {
        name: item.category.name,
        value: item.price * 1,
        items: [item.id]
      }
    }
  })
  console.log(Object.keys(categoryMap), categoryMap)
  return Object.keys(categoryMap).map(mapKey => ({ ...categoryMap[mapKey] }));
};

class Home extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      tabView: tabesText[0]
    }
  }

  componentDidMount() {
    this.props.actions.getInitAlData()
  }

  changeView = (index) => {
    this.setState({
      tabView: tabesText[index]
    })
  }

  changeDate = (year, month) => {
    this.props.actions.selectNewMonth(year, month)
  }

  modifyItem = (modifiedItem) => {
    this.props.history.push(`/edit/${modifiedItem.id}`)
  }

  createItem = () => {
    this.props.history.push('/create')
  }

  deleteItem = (item) => {
    this.props.actions.deletesItem(item);
  }

  render() {
    const { data } = this.props;
    const { items, categories, currentDate, isLoading } = data;
    const { tabView } = this.state;
    const itemsWithCategory = Object.keys(items).map(id => {
      items[id].category = categories[items[id].cid]
      return items[id]
    })

    const chartOutcomeDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_OUTCOME);
    const chartIncomeDataByCategory = generateChartDataByCategory(itemsWithCategory, TYPE_INCOME);

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
          {
            isLoading && <Loader />
          }
          {
            !isLoading &&
            <Fragment>
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
              <CreateBtn onClick={ this.createItem }/>
              { tabView === LIST_VIEW && itemsWithCategory.length > 0 &&
                <PriceList
                  items={itemsWithCategory}
                  onModifyItem={this.modifyItem}
                  onDeleteItem={this.deleteItem}
                />
              }
              { tabView === LIST_VIEW && itemsWithCategory.length === 0 &&
                  <div className="alert alert-light text-center no-record">
                    您还没有任何记账记录
                  </div>
                }
              { tabView === CHART_VIEW &&
                <Fragment>
                  <PieCharts title='本月支出' categoryData={chartOutcomeDataByCategory} />
                  <PieCharts title='本月收入' categoryData={chartIncomeDataByCategory} />
                </Fragment>
              }
            </Fragment>
          }
        </div>
      </Fragment>
    )
  }
}

export default withRouter(withContext(Home));
