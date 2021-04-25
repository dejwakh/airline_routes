import React from 'react';

const Route = ({ airline, src, dest }) => (
<tr className="route">
  <td>{airline}</td>
  <td>{src}</td>
  <td>{dest}</td>
</tr>
)

export default Route;