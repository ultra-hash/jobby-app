import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="homeMainContainer">
    <Header />
    <div className="homeContainer">
      <div className="centeredContainer">
        <h1 className="max-50w">Find The Job That Fits Your Life</h1>
        <p className="max-50w">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs" className="LinkStyle">
          <button type="button" className="findJobsBtn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
