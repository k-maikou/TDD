import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isValidDate } from 'h:/前端资料/money-book/src/utility';

class PriceForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      validatePass: true,
      errorMessage: ''
    }
  }

  static propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    onCancelSubmit: PropTypes.func.isRequired,
    item: PropTypes.object
  }

  static defaultProps = {
    item: {}
  }

  submitForm = (e) => {
    const { item, onFormSubmit } = this.props;
    const editMode = !!item.id;
    const title = this.title.value.trim();  
    const price = this.priceInput.value.trim() * 1;
    const date = this.date.value.trim();
    if (price && title && date) {
      if (price < 0) {
        this.setState({
          validatePass: false,
          errorMessage: '价格数字必须大于0'
        })
      } else if (!isValidDate(date)) {
        this.setState({
          validatePass: false,
          errorMessage: '请填写正确的日期格式'
        })
      } else {
        this.setState({
          validatePass: true,
          errorMessage: ''
        })
        if (editMode) {
          onFormSubmit({...item, title, price, date}, editMode)
        } else {
          onFormSubmit({title, price, date}, editMode)
        }
      }
    } else {
      this.setState({
        validatePass: false,
        errorMessage: '请输入所有必选项'
      })
    }
    e.preventDefault()
  }

  render() {
    const { title, price, date } = this.props.item;
    
    return (
      <form className='w-50 p-4 m-auto border-aqua' onSubmit={(e) => this.submitForm(e)}>
        <div class="form-group row">
          <label for="title" class="col-sm-2 col-form-label">标题：</label>
          <div class="col-sm-10">
            <input 
              type="text"
              class="form-control"
              id="title"
              placeholder='请输入标题'
              defaultValue={title}
              ref={(title) => this.title = title}
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="price" class="col-sm-2 col-form-label">价格：</label>
          <div class="col-sm-10">
            <input 
              type="number"
              class="form-control"
              id="price"
              placeholder='请输入价格'
              defaultValue={price}
              ref={(price) => this.priceInput = price}
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="date" class="col-sm-2 col-form-label">日期：</label>
          <div class="col-sm-10">
            <input 
              type="date"
              class="form-control"
              id="date"
              defaultValue={date}
              ref={(date) => this.date = date}
            />
          </div>
        </div>
        <fieldset class="form-group">
        </fieldset>
        <div class="form-group row">
          <button type="submit" class="btn btn-primary mr-4">提交</button>
          <button type="submit" class="btn btn-secondary" onClick={this.props.onCancelSubmit}>取消</button>
        </div>
        {
          !this.state.validatePass &&
          <div className='alert alert-danger mt-5' role="alert">
            {this.state.errorMessage}
          </div>
        }
      </form>
    )
  }
}

export default PriceForm;
