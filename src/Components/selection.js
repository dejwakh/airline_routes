import React from 'react';

const Selection = ({ defaultName, defaultVal, onChange, list, valKey, selected }) => {
  if (!selected) selected = defaultVal
  return (
    <select onChange={onChange} value ={selected}>
      <option value={defaultVal}>{defaultName}</option>
      {list.map((opt, idx) => (
        <option key={'opt' + defaultName + idx} value={opt[valKey]} >
          {opt.name}
        </option>
        )
      )}
    </select>
  )
}


export default Selection;