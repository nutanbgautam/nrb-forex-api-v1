import React from 'react';

export default class DataRow extends React.Component{
    render(){
        return(
            <tr>
                <th scope="row">{this.props.index}</th>
                <td>{this.props.currency}</td>
                <td>{this.props.date}</td>
                <td>{this.props.buyRate}</td>
                <td>{this.props.sellRate}</td>
            </tr>
        )
    };
}