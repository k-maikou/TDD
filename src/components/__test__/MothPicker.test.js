import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import MothPicker from '../MothPicker';

let props = {
  year: 2019,
  moth: 12,
  onChange: jest.fn()
}

let wrapper;

describe('test MonthPicker component', () => {
  beforeEach(() => {
    wrapper = mount(<MothPicker {...props}/>)
  })
  it('should render the component to match the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('render the correct year and month, show correct dropdown status', () => {
    const text = wrapper.find('.dropdown-toggle').first().text()
    expect(text).toEqual('2019年 12月')
    expect(wrapper.find('.dropdown-menu').length).toEqual(0)
    expect(wrapper.state('isHidden')).toEqual(false)
    expect(wrapper.state('selectedYear')).toEqual(props.year)
    expect(wrapper.state('selectedMonth')).toEqual(props.moth)
  })
  it('after click the button, dropdown should show, year list&moth list should have the correct items', () => {
    wrapper.find('.dropdown-toggle').simulate('click')
    expect(wrapper.state('isHidden')).toEqual(true)
    expect(wrapper.find('.dropdown-menu').length).toEqual(1)
    expect(wrapper.find('.years-range .dropdown-item').length).toEqual(9)
    expect(wrapper.find('.month-range .dropdown-item').length).toEqual(12)
    expect(wrapper.find('.years-range .dropdown-item.active').text()).toEqual('2019年')
    expect(wrapper.find('.month-range .dropdown-item.active').text()).toEqual('12月')
    //test first year should be the current year minus 4
    expect(wrapper.find('.years-range .dropdown-item').first().text()).toEqual(props.year - 4 + '年')
    // expect(wrapper.find('month-range .dropdown-item').first().text()).toEqual('01月')
  })
  it('click the year&month item, should trigger the right status change', () => {
    wrapper.find('.dropdown-toggle').simulate('click')
    wrapper.find('.years-range .dropdown-item').first().simulate('click')
    expect(wrapper.find('.years-range .dropdown-item').first().hasClass('active')).toEqual(true)
    expect(wrapper.state('selectedYear')).toEqual(2015)
    expect(wrapper.find('.month-range .dropdown-item').first().hasClass('active')).toEqual(false)
    expect(wrapper.state('selectedMonth')).toEqual(12)
  })
  it('after the dropdown is shown, click the document should close the dropdown', () => {
    let eventMap = {}
    document.addEventListener = jest.fn((e, cb) => {
      eventMap[e] = cb
    })
    const wrapper = mount(<MothPicker {...props} />)
    wrapper.find('.dropdown-toggle').simulate('click')
    expect(wrapper.state('isHidden')).toEqual(true)
    expect(wrapper.find('.dropdown-menu').length).toEqual(1)
    eventMap.click({
      target: ReactDOM.findDOMNode(wrapper.instance())
    })
    expect(wrapper.state('isHidden')).toEqual(true)
    eventMap.click({
      target: document
    })
  })
})
