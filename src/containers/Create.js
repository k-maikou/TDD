import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import CategorySelect from '../components/CategorySelect';
import { Tabes, Tab } from '../components/Tabes';
import { TYPE_INCOME, TYPE_OUTCOME} from '../utility';
import PriceForm from '../components/PriceForm';
import withContext from '../WithContext';

const tabesText = [TYPE_INCOME, TYPE_OUTCOME];

export class Create extends PureComponent {

  constructor(props) {
    super(props)

    const { id } = props.match.params;
    const { categories, items } = props.data;

    this.state = {
      selectedTab: (id && items[id]) ? categories[items[id].cid].type : TYPE_INCOME,
      selectedCategory: (id && items[id]) ? categories[items[id].cid] : null,
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.actions.getEditData(id).then(data => {
      const { editItem, categories } = data
      this.setState({
        selectedTab: (id && editItem) ? categories[editItem.cid].type : TYPE_OUTCOME,
        selectedCategory: (id && editItem) ? categories[editItem.cid] : null,        
      })
    })
  }

  changeView = (index) => {
    this.setState({
      selectedTab: tabesText[index]
    })
  }

  cancelSubmit = () => {
    this.props.history.push('/')
  }

  submitForm = (data, isEditMode) => {
    if (!isEditMode) {
      // create
      this.props.actions.createItem(data, this.state.selectedCategory.id).then(() => {
        this.props.history.push('/')
      })
    } else {
      // update
      this.props.actions.updateItem(data, this.state.selectCategory.id).then(() => {
        this.props.history.push('/')
      })
    }
  }

  selectCategory = (category) => {
    this.setState({
      selectedCategory: category
    })
  }

  render() {
    const { data } = this.props;
    const { items, categories } = data;
    const { id } = this.props.match.params;
    const { selectedTab, selectedCategory } = this.state;

    const editItem = (id && items[id]) ? items[id] : {};
    const tabIndex = tabesText.findIndex(text => text === selectedTab);
    
    const filterCategories = Object.keys(categories)
    .filter(id => categories[id].type === selectedTab)
    .map(id => categories[id]);

    return (
      <div className='create-page py-3 px-3 rounded mt-3 border-black' style={{background: '#fff'}}>
        <Tabes activeIndex={tabIndex} onTabChange={this.changeView}>
          <Tab>收入</Tab>
          <Tab>支出</Tab>
        </Tabes>
          <CategorySelect
            category={filterCategories} 
            onSelectCategory={this.selectCategory}
            selectedCategory={selectedCategory}
          />
        <PriceForm 
          onFormSubmit={this.submitForm}
          onCancelSubmit={this.cancelSubmit}
          item={editItem}
        />
      </div>
    )
  }
}

export default withRouter(withContext(Create));
