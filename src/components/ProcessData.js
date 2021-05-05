import React from 'react';
import FetchData from './FetchData';

export default class ProcessData extends React.Component {
    constructor(props) {
      super(props);

      //Initial Date Data
      var date = new Date();
      date.setDate(date.getDate()-30);
      var dates = (date.toString()).split(" ");
      var mm = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(dates[1]) / 3 + 1);
      mm = mm>9 ? mm : "0"+mm;
      var yyyy = dates[3];
      var dd = dates[2];
      var sd = yyyy+"-"+mm+"-"+dd;

      date = new Date();
      dd = String(date.getDate()).padStart(2, '0');
      mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = date.getFullYear();
      var ed = yyyy + '-' + mm + '-' + dd;
      //Initial Date Data END

      this.state = {startDate: sd,endDate:ed,currency:'USD'};
      this.listOfCurrency = [
        "USD",
        "INR",
        "AUD",
        "EUR",
        "GBP",
        "CHF",
        "CAD",
        "SGD",
        "JPY",
        "CNY",
        "SAR",
        "QAR",
        "THB",
        "AED",
        "MYR",
        "KRW",
        "SEK",
        "DKK",
        "HKD",
        "KWD",
        "BHD"
      ];
      this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
      this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
      this.handleChangeCurrency = this.handleChangeCurrency.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChangeStartDate(event) {
        this.setState({startDate: event.target.value});
    }

    handleChangeEndDate(event) {
        this.setState({endDate: event.target.value});
    }

    handleChangeCurrency(event) {
        this.setState({currency: event.target.value});
    }

    handleSubmit(event) {
        this.handleChangeCurrency(event);
        <FetchData startDate={this.state.startDate} endDate={this.state.endDate} currency={this.state.currency} />

      event.preventDefault();
    }
    
  
    render() {
      var currencyOptions = [];
      this.listOfCurrency.forEach((currency,index)=>{
        currencyOptions.push(<option key={index} value={currency}>{currency}</option>)
        })
      return (
          <>
        <form className="form-inline" onSubmit={this.handleSubmit}>
        <div className="input-group mb-3">
            <div className="input-group-prepend">
          <span className="input-group-text">From:</span>
          </div>
            <input type="date" className="form-control" value={this.state.startDate} onChange={this.handleChangeStartDate} />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">To:</span>
            <input type="date" className="form-control" value={this.state.endDate} onChange={this.handleChangeEndDate} />
          </div>
          </div>
          <div className="input-group mb-3">
          <div className="input-group-prepend">
          <span className="input-group-text">Currency:</span>
            <select name="currency-code" className="form-control" value={this.state.currency} onChange={this.handleChangeCurrency}>
                {currencyOptions}
            </select>
          </div>
          </div>
        </form>
        <FetchData key="1" startDate={this.state.startDate} endDate={this.state.endDate} currency={this.state.currency} />
        </>
      );
    }
  }