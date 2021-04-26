import React from 'react';
import Route from './route'

const Table = ({ className, columns, rows }) => {

  return (
    <table className={className}>
      <tbody>
        <tr>{columns.map(c=> 
          <th key={c.property} >{c.name}
          </th>)}</tr>
        {rows.map((r, idx) => 
          <Route 
            key={'route' + idx} 
            airline={r.airline.name} 
            src={r.source.name} 
            dest={r.destination.name} 
          />)}
      </tbody>
    </table>
    )
} 

export default Table;