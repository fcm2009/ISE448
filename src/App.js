import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import papa from 'papaparse'


const nst = seed => {
  let tardnes = []

  seed.forEach((job, i) => {
    let nh = [...seed]
    let current = nh[i]

    if (nh[i + 1]) {
      nh[i] = nh[i + 1]
      nh[i + 1] = current
    }

    tardnes.push({ nh, objective: objective(nh) })
  })

  const minTardnes = tardnes.reduce((minTardnes, tardnes) => tardnes.objective < minTardnes.objective ? tardnes : minTardnes, tardnes[0])

  if (minTardnes.objective === objective(seed)) {
    return minTardnes;
  } else {
    return nst(minTardnes.nh);
  }
}

const objective = nh => {
  let tardnes = 0
  let time = 0

  nh.forEach(job => {
    let x = job.p - job.d + time
    tardnes = x < 0 ? 0 : tardnes + x
    time = time + job.p
    console.log(tardnes, x, job.p, job.d)
  })

  return tardnes
}

class App extends Component {

  constructor() {
    super()
    this.handelFile = this.handelFile.bind(this)
    this.state = {
      nh: [],
      objective: 0
    }
  }

  handelFile(files) {
    console.log('aaaaaaaaaaaaaaaaaaa')
    papa.parse(files[0], {
      header: true,
      dynamicTyping: true,
      complete: results => {
        const soultion = nst(results.data)
        this.setState({ nh: soultion.nh })
        this.setState({ objective: soultion.objective })
      }
    })
  }


  render() {

    return (
      <div className="App">
        <input type="file" onChange={e => this.handelFile(e.target.files)}></input>
        <p className="App-intro">
          Sequence: {JSON.stringify(this.state.nh.map(job => job.job))}
        </p>

        <p className="App-intro">
          Total Tardens: {this.state.objective}
        </p>
      </div>
    );
  }
}

export default App;
