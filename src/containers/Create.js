import React, { PureComponent } from 'react';
import CategorySelect from '../components/CategorySelect';
import { Tabes, Tab } from '../components/Tabes';
import { testCategories } from '../testData';
import { TYPE_INCOME, TYPE_OUTCOME } from '../utility';
import PriceForm from '../components/PriceForm';
import withContext from '../WithContext';

class Create extends PureComponent {

  render() {
    const { data } = this.props;
    const filterCategories = testCategories.filter(item => item.type === TYPE_OUTCOME);
    return (
      <div className='create-page py-3 px-3 rounded mt-3 border-black' style={{background: '#fff'}}>
        <Tabes activeIndex={0} onChange={() => {}}>
          <Tab>支出</Tab>
          <Tab>收入</Tab>
        </Tabes>
        <CategorySelect category={filterCategories} onSelectCategory={() => {}}/>
        <PriceForm 
          onFormSubmit={() => {}}
          onCancelSubmit={() => {}}
          item={testCategories}
        />
      </div>
    )
  }
}

export default withContext(Create);
