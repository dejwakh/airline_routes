import React, { useState } from 'react';

import Selection from './Components/selection'
import Table from './Components/table'
import Button from './Components/button'
import Map from './Components/map'
import './App.css';

import data from './data'

const App = ({ perPage }) => {
  const routes = data.routes.map(r => {
    const airline = data.getAirlineById(r.airline)
    const source = data.getAirportByCode(r.src)
    const destination = data.getAirportByCode(r.dest)
    return {
      airline,
      source,
      destination,
      codes: [source.code, destination.code]
    }
  })

  const columns = [
    {name: 'Airline', property: 'airline'},
    {name: 'Source Airport', property: 'src'},
    {name: 'Destination Airport', property: 'dest'},
  ];

  const defaultNextActive = routes.length > perPage
  const defaultCurrent = {
    activeRoutes: routes,
    selectedAirlineId: '',
    selectedAirportCode: '',
    start: 0,
    end: perPage,
    perPage: perPage,
    previousActive: false,
    nextActive: defaultNextActive,
    airlines: data.airlines,
    airports: sortByName(data.airports),
  }

  const [current, setCurrent] = useState(defaultCurrent)

  const resetCurrent = () => setCurrent(defaultCurrent)

  const showRoutes = () => current.activeRoutes.slice(current.start, current.end)
  
  function setAirline(event){
    const newId = Number(event.target.value) || ''
    let activeRoutes = routes
    let airports = data.airports
    if (newId) {
      activeRoutes = activeRoutes.filter(r => r.airline.id === newId)
      airports = airports.filter(a => 
        activeRoutes.some(r => r.codes.includes(a.code))
      )
    }
    const curCode = current.selectedAirportCode
    if (curCode) {
      const withPreviousCode = activeRoutes.filter(r => r.codes.includes(curCode))
      if (withPreviousCode.length) activeRoutes = withPreviousCode
    }
    const nextActive = activeRoutes.length > current.perPage
    setCurrent(prevState => ({
      ...prevState,
      activeRoutes,
      selectedAirlineId: newId,
      start: 0,
      end: current.perPage,
      previousActive: false,
      nextActive,
      airports: sortByName(airports),
    }))
  }

  function setAirport(event){
    const newCode = event.target.value
    let activeRoutes = routes
    let airlines = data.airlines
    if (newCode.length) {
      activeRoutes = activeRoutes.filter(r => r.codes.includes(newCode))
      airlines = airlines.filter(a => 
        activeRoutes.some(r => r.airline.id === a.id)
      )
    }
    const curId = current.selectedAirlineId
    if (curId) {
      const withPreviousAirline = activeRoutes.filter(r => r.airline.id === curId)
      if (withPreviousAirline.length) activeRoutes = withPreviousAirline
    }
    const nextActive = activeRoutes.length > current.perPage
    setCurrent(prevState => ({
      ...prevState,
      activeRoutes,
      selectedAirportCode: newCode,
      start: 0,
      end: current.perPage,
      previousActive: false,
      nextActive,
      airlines
    }))
  }

  function setAirportFromSVG(event) {
    const newCode= event.target.getAttribute('code')
    const activeRoutes = routes.filter(r => r.codes.includes(newCode))
    const airlines = data.airlines.filter(a => 
      activeRoutes.some(r => r.airline.id === a.id)
    )
    const nextActive = activeRoutes.length > current.perPage
    setCurrent(prevState => ({
      ...prevState,
      activeRoutes,
      selectedAirportCode: newCode,
      start: 0,
      end: current.perPage,
      previousActive: false,
      nextActive,
      airlines
    }))
  }

   function previousPage(event) {
    let {start, end, previousActive, nextActive, perPage} = current
    let rowsToRemove = perPage
    if (start - rowsToRemove < 0) rowsToRemove = start
    start -= rowsToRemove
    end -= rowsToRemove
    if (start <= 0) previousActive = false
    nextActive = end < current.activeRoutes.length
    setCurrent(prevState => ({
      ...prevState,
      start,
      end,
      previousActive,
      nextActive
    }))
  }

  function nextPage(event) {
    let {start, end, previousActive, nextActive, perPage} = current
    let rowsToAdd = perPage
    if (end + rowsToAdd > current.activeRoutes.length) rowsToAdd = current.activeRoutes.length - end
    start += rowsToAdd
    end += rowsToAdd
    if (start > 0) previousActive = true
    if (end >= current.activeRoutes.length) nextActive = false
    setCurrent(prevState => ({
      ...prevState,
      start,
      end,
      previousActive,
      nextActive
    }))
  }

  function setPerPage(event) {
    const perPage = Number(event.target.value)
    setCurrent(prevState => ({
      ...prevState,
      end: current.start + perPage,
      perPage
    }))
  }

  function mapTitle() {
    let airline = data.getAirlineById(current.selectedAirlineId)
    let airport = data.getAirportByCode(current.selectedAirportCode)
    airline = airline ? airline.name : "All airlines"
    airport = airport ? airport.name : "All airports"
    return airline + ' at ' + airport
  }

  function sortByName(arr){
    return arr.sort((a,b) => a.name < b.name ? -1 : 1)
  }

  return (
  <div className="app">
    <header className="header">
      <h1 className="title">{mapTitle()}</h1>
    </header>
    <Map 
      routes={current.activeRoutes} 
      setAirport={setAirportFromSVG}
    />
    <section>
      <p>
      Show routes on 
      <Selection 
          defaultName = 'All Airlines'
          defaultVal = ''
          valKey = 'id'
          onChange={setAirline} 
          list={current.airlines} 
          selected = {current.selectedAirlineId}
        />
      flying in or out of 
      <Selection 
          defaultName = 'All Airports'
          defaultVal = ''
          valKey = 'code'
          onChange={setAirport} 
          list={current.airports} 
          selected = {current.selectedAirportCode}
      />
      <button onClick={resetCurrent}>Clear Filters</button>
      </p>
      <Table 
        className="routes-table" 
        rows={showRoutes()} 
        columns={columns} 
      />
    </section>
    <section className="pagination">
      <p>
        Showing {current.start+1}-{current.end < current.activeRoutes.length ? current.end : current.activeRoutes.length} of {current.activeRoutes.length} routes.
      </p>
      <p>
      <Selection 
        defaultName = '25 per Page'
        defaultVal = {25}
        valKey = 'rows'
        onChange={setPerPage} 
        list={[
          {name: '50 per Page', rows: 50},
          {name: '100 per Page', rows: 100}
        ]} 
        selected = {current.perPage}
      />
      </p>
      <div>
        <p>
          <Button 
            name="< Previous" 
            onClick={previousPage} 
            active={current.previousActive}
          /> 
          <Button 
            name=" Next >" 
            onClick={nextPage} 
            active={current.nextActive}
          />
        </p>
      </div>
      
    </section>
  </div>
  )
}

export default App;