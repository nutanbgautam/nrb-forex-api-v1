import React from 'react';
import DataRow from './DataRow';

export default class FetchData extends React.Component{
    state = {
        loading:true,
        data:null
    };

    async loadDataFromAPI(){
        const all_datas   =[];
        this.start_date    = this.props.startDate ? this.props.startDate : "2021-01-01";
        this.end_date      = this.props.endDate ? this.props.endDate : "2021-01-20";
        var current_page    = 1;
        var url = new URL("https://www.nrb.org.np/api/forex/v1/rates");
        const params = {from:this.start_date,to:this.end_date,per_page:100,page:current_page};
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        const response  = await fetch(url);
        const responseData  = await response.json();
        all_datas.push(responseData.data.payload);
        const total_pages   = responseData.pagination.pages;
        for(var i=2;i<total_pages+1;i++)
        {
            const params = {from:this.start_date,to:this.end_date,per_page:100,page:i};
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
            const response  = await fetch(url);
            const responseData  = await response.json();
            all_datas.push(responseData.data.payload);
        }
        this.setState({loading: false, data:all_datas})
    }

    componentDidMount(){
        this.loadDataFromAPI();
    }

    componentDidUpdate(){
        if (!this.props.startDate||!this.props.endDate||!this.props.currency){
            var b=69;
            console.log(b);
        }
        else if(!(this.props.startDate===this.start_date)||!(this.props.endDate===this.end_date))
        {
            this.loadDataFromAPI();
        }
        
    }

    componentWillUnmount(){
        console.log("Unmounted");
    }

    render(){
        var currency=this.props.currency ? this.props.currency:"USD";
        if(this.state.loading){
            return <div className="message">Loading ... </div>
        }
        if (!this.state.data){
            return <div className="message">No Data Fetched</div>
        }
        if (!this.props.startDate||!this.props.endDate||!this.props.currency){
            return <div className="message">No Data Received From User</div>
        }

        const listOfDataRows=[];
        var rateValues = {
            totalBuyRate:0,
            totalSellRate:0,
            maxBuyRate:0,
            maxSellRate:0,
            maxBuyRateDate:null,
            maxSellRateDate:null,
            averageBuyRate:0,
            averageSellRate:0,
        };
        var totalBuyRate=0;
        var totalSellRate=0;
        var totalNumberOfData=0;

        try{
            console.log(this.state.data);
        this.state.data.forEach((responseData)=>{
            responseData.forEach((data,index)=>{
                data.rates.forEach((rate)=>{
                   if(rate.currency.iso3===currency)
                    {
                        if(rate.buy>rateValues["maxBuyRate"]){
                            rateValues["maxBuyRate"]=rate.buy;
                            rateValues["maxBuyRateDate"]=data.date;
                        }
                        if(rate.sell>rateValues["maxSellRate"]){
                            rateValues["maxSellRate"]=rate.sell;
                            rateValues["maxSellRateDate"]=data.date;
                        }
                        totalBuyRate += +(rate.buy);
                        totalSellRate += +(rate.sell);
                        totalNumberOfData++;
                        listOfDataRows.push(
                            <DataRow key={index} index={index+1} date={data.date} currency={rate.currency.iso3} buyRate={rate.buy} sellRate={rate.sell}/>
                        )
                    }
                })
            })
        });
        rateValues["averageBuyRate"] = totalBuyRate/totalNumberOfData;
        rateValues["averageSellRate"] = totalSellRate/totalNumberOfData;
        listOfDataRows.push(
            <>
            <tr className="table-success">
                <th scope="row" className="sticky-bottom"><b>Max Rate</b></th>
                <td className="sticky-bottom"><b>{this.props.currency}</b></td>
                <td className="sticky-bottom"><b>{rateValues["maxSellRateDate"]}</b></td>
                <td className="sticky-bottom"><b>{rateValues["maxBuyRate"]}</b></td>
                <td className="sticky-bottom"><b>{rateValues["maxSellRate"]}</b></td>
            </tr>
            <tr className="table-secondary">
                <th scope="row" className="sticky-bottom"><b>Average Rate</b></th>
                <td className="sticky-bottom"><b>{this.props.currency}</b></td>
                <td className="sticky-bottom"><b>----</b></td>
                <td className="sticky-bottom"><b>{rateValues["averageBuyRate"].toFixed(2)}</b></td>
                <td className="sticky-bottom"><b>{rateValues["averageSellRate"].toFixed(2)}</b></td>
            </tr>
            </>
        )
    }
        catch(error)
        {
            console.log(error);
        }

        return (
            <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Currency</th>
                        <th scope="col">Date</th>
                        <th scope="col">Buy Rate</th>
                        <th scope="col">Sell Rate</th>
                    </tr>
                </thead>
                <tbody>
                {listOfDataRows}
                </tbody>
            </table>
        )
    }

}