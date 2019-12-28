import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padLeft, range } from '../utility';

class MothPicker extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isHidden: false,
      selectedYear: this.props.year,
      selectedMonth: this.props.moth
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.handleHtml, false)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.handleHtml, false)
  }

  handleHtml = (e) => {
    if (this.ym.contains(e.target)) {
      return;
    }
    this.setState({
      isHidden: false
    })
  }

  handleClick = (e) => {
    e.preventDefault();
    // e.nativeEvent.stopImmediatePropagation();
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  selectYear = (e, yearNumber) => {
    e.preventDefault();
    // e.nativeEvent.stopImmediatePropagation();
    this.setState({
      selectedYear: yearNumber
    })
  }

  selectMonth = (e, monthNumber) => {
    e.preventDefault();
    // e.nativeEvent.stopImmediatePropagation();
    this.setState({
      selectedMonth: monthNumber,
      isHidden: false
    })
    this.props.onChange(this.state.selectedYear, monthNumber)
  }

  render() {
    const { year } = this.props;
    const { isHidden, selectedYear, selectedMonth } = this.state;
    const monthRange = range(12, 1);
    const yearRange = range(9, -4).map(number => number + year);
    return (
      <div className='dropdown moth-picker-component' ref={(ins) => this.ym = ins}>
        <h4>选择月份</h4>
        <button className='btn btn-secondary btn-lg dropdown-toggle' onClick={this.handleClick}>
          {`${selectedYear}年 ${padLeft(selectedMonth)}月`}
        </button>
        { 
          isHidden && 
          <div className='dropdown-menu' style={{display: 'block'}}>
            <div className='row'>

              <div className='col border-radius years-range'>
                { yearRange.map((yearNumber, index) => (
                  <a href="#"
                    key={index}
                    onClick={(e) => { this.selectYear(e, yearNumber) }}
                    className={(yearNumber === selectedYear ? 'dropdown-item active' : 'dropdown-item')}
                  >
                    { yearNumber }年
                  </a>
                )) }
              </div>

              <div className='col border-radius month-range'>
                {
                  monthRange.map((monthNumber, index) => (
                    <a href="#" 
                      key={index}
                      onClick={(e) => { this.selectMonth(e, monthNumber) }}
                      className={monthNumber === selectedMonth ? 'dropdown-item active' : 'dropdown-item'}>
                      { padLeft(monthNumber) }月
                    </a>
                  ))
                }
              </div>

            </div>
          </div>
        }
      </div>
    )
  }
}

MothPicker.propTypes = {
  year: PropTypes.number.isRequired,
  moth: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}
export default MothPicker;
