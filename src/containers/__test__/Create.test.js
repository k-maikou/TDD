import React from 'react';
import { Create } from '../Create';
import { mount } from 'enzyme';
import { parseToYearAndMonth, flatterArr, TYPE_OUTCOME } from '../../utility';
import Loader from '../../components/loading';
import CategorySelect from '../../components/CategorySelect';
import PriceForm from '../../components/PriceForm';
import { testCategories, testItems } from '../../testData';

const testItem = testItems[0];
const match = { params: { id: testItem.id } };
const history = { push: () => {} };
const createMatch = { params: { id: '' } };

const initData = {
  categories: {},
  items: {},
  isLoading: false,
  currentDate: parseToYearAndMonth()
}

const withLoadedData = {
  categories: flatterArr(testCategories),
  items: flatterArr(testItems),
  isLoading: false,
  currentDate: parseToYearAndMonth()
}

const loadingData = {
  ...initData,
  isLoading: true
}

const actions = {
  getEditData: jest.fn().mockReturnValue(Promise.resolve({editItem: testItems, categories: flatterArr(testCategories)})),
  createItem: jest.fn().mockReturnValue(Promise.resolve('')),
  updateItem: jest.fn().mockReturnValue(Promise.resolve(''))
}

describe('test component init behavior', () => {
  it('test Create page for the first render, getEditData should be called with the right params', () => {
    const wrapper = mount(
      <Create data={initData} actions={actions} match={match} />
    )
    expect(actions.getEditData).toHaveBeenCalledWith(testItem.id)
  })
  it('should show loading component when isLoading is true', () => {
    const wrapper = mount(
      <Create data={loadingData} actions={actions} match={match} />
    )
    expect(wrapper.find(Loader).length).toEqual(0)
  })
})

describe('test component when in create mode', () => {
  const wrapper = mount(
    <Create data={withLoadedData} actions={actions} match={createMatch} history={history} />
  )
  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }
  it('should pass null to props selectedCategory for CategorySelect', () => {
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(null)
  })
  it('should pass empty object for PriceForm', () => {
    expect(wrapper.find(PriceForm).props().item).toEqual({})
  })
  it('submit the form, the createItem action should not be triggered', () => {
    wrapper.find('form').simulate('submit')
    expect(actions.createItem).not.toHaveBeenCalled()
  })
  it('fill all inputs, and select the category, submit the form, createItem should be called', () => {
    setInputValue('#title', 'new title')
    setInputValue('#price', '200')
    setInputValue('#date', '2019-12-30')
    wrapper.find('.category-item').first().simulate('click')
    wrapper.find('form').simulate('submit')
    const testData = {
      title: 'new title',
      price: 200,
      date: '2019-12-30'
    }
    expect(actions.createItem).toHaveBeenCalledWith(testData, testCategories[0].id)
  })
})

describe('test component when in edit mode', () => {
  const wrapper = mount(
    <Create data={withLoadedData} actions={actions} match={match} history={history} />
  )
  const setInputValue = (selector, newValue) => {
    wrapper.find(selector).instance().value = newValue
  }
  const selectedCategory = testCategories.find(category => testItem.cid === category.id)
  it('should pass the right category to props selectedCategory for CategorySelect', () => {
    wrapper.update()
    expect(wrapper.find(CategorySelect).props().selectedCategory).toEqual(selectedCategory)
  })
  it('modify some inputs, submit the form, modifyItem should be called', () => {
    setInputValue('#title', 'new title')
    wrapper.find('form').simulate('submit')
    const testData = { ...testItem, title: 'new title' }
    expect(actions.updateItem).toHaveBeenCalledWith(testData, selectedCategory.id)
  })
})