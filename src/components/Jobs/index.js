import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStateConstant = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: null,
    apiProfileState: apiStateConstant.initial,
    searchValue: '',
    jobs: [],
    jobsApiStatus: apiStateConstant.initial,
    employmentType: [],
    minimumPackage: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }

  getProfileDetails = async () => {
    this.setState({apiProfileState: apiStateConstant.pending})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
      'Content-Type': 'Application/json',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    const data = await response.json()
    // console.log(data)

    if (response.ok === true) {
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      //   console.log(profileDetails)
      this.setState({
        profileDetails,
        apiProfileState: apiStateConstant.success,
      })
    } else {
      this.setState({apiProfileState: apiStateConstant.failure})
    }
  }

  getJobsList = async () => {
    this.setState({jobsApiStatus: apiStateConstant.pending})
    const {employmentType, minimumPackage, searchValue} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
      'Content-Type': 'Application/json',
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
        ',',
      )}&minimum_package=${minimumPackage}&search=${searchValue}`,
      options,
    )
    const data = await response.json()
    // console.log(data)

    if (response.ok === true) {
      const jobsList = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      //   console.log(profileDetails)
      this.setState({jobs: jobsList, jobsApiStatus: apiStateConstant.success})
    } else {
      this.setState({jobsApiStatus: apiStateConstant.failure})
    }
  }

  renderProfileDetails = () => {
    const {profileDetails, apiProfileState} = this.state
    return (
      <>
        {apiProfileState === apiStateConstant.success && (
          <div className="profileSuccess">
            <img
              className="profileImg"
              src={profileDetails.profileImageUrl}
              alt="profile"
            />
            <h1 className="profileName">{profileDetails.name}</h1>
            <p className="shortBio">{profileDetails.shortBio}</p>
          </div>
        )}
        {apiProfileState === apiStateConstant.failure && (
          <div className="profileFailure">
            <button
              type="button"
              className="profileRetryBtn"
              onClick={this.getProfileDetails}
            >
              Retry
            </button>
          </div>
        )}
        {apiProfileState === apiStateConstant.pending && (
          <div className="profileLoading">
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          </div>
        )}
      </>
    )
  }

  renderSearchContainer = () => {
    const {searchValue} = this.state
    return (
      <div className="searchInputContainer">
        <input
          type="search"
          value={searchValue}
          onChange={this.onChangeSearchInput}
          placeholder="Search"
          onKeyDown={this.onClickEnter}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.getJobsList}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchValue: event.target.value})
  }

  onClickSalaryFilter = event => {
    this.setState({minimumPackage: event.target.value}, this.getJobsList)
  }

  onClickEmploymentTypeFilter = event => {
    this.setState(prevState => {
      const {employmentType} = prevState
      if (event.target.checked) {
        employmentType.push(event.target.value)
      } else {
        const index = employmentType.findIndex(
          item => item === event.target.value,
        )
        employmentType.splice(index, 1)
      }
      return {employmentType: [...employmentType]}
    }, this.getJobsList)
  }

  onClickEnter = event => {
    if (event.type === 'keydown' && event.key === 'Enter') {
      this.getJobsList()
    }
  }

  render() {
    const {jobsApiStatus, jobs} = this.state
    return (
      <div className="jobsMainContainer">
        <Header />
        <div className="jobsContainer">
          <div>
            {this.renderSearchContainer()}
            {this.renderProfileDetails()}
            <hr className="hrClass" />
            <div>
              <h1 className="heading">Type of Employment</h1>
              <ul className="checkboxListContainer">
                {employmentTypesList.map(eachItem => (
                  <li key={eachItem.employmentTypeId}>
                    <input
                      type="checkbox"
                      value={eachItem.employmentTypeId}
                      id={eachItem.employmentTypeId}
                      onClick={this.onClickEmploymentTypeFilter}
                    />
                    <label htmlFor={eachItem.employmentTypeId}>
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="hrClass" />
            <div>
              <h1 className="heading">Salary Range</h1>
              <ul className="radioListContainer">
                {salaryRangesList.map(eachItem => (
                  <li key={eachItem.salaryRangeId}>
                    <input
                      type="radio"
                      name="salaryRange"
                      value={eachItem.salaryRangeId}
                      id={eachItem.salaryRangeId}
                      onClick={this.onClickSalaryFilter}
                    />
                    <label htmlFor={eachItem.salaryRangeId}>
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            {this.renderSearchContainer()}
            <div className="jobListContainer">
              {jobsApiStatus === apiStateConstant.pending && (
                <div className="jobListLoading">
                  <div className="loader-container" data-testid="loader">
                    <Loader
                      type="ThreeDots"
                      color="#ffffff"
                      height="50"
                      width="50"
                    />
                  </div>
                </div>
              )}

              {jobsApiStatus === apiStateConstant.success && jobs.length !== 0 && (
                <ul className="jobItemsContainer">
                  {jobs.map(job => (
                    <JobItem key={job.id} jobDetails={job} />
                  ))}
                </ul>
              )}

              {jobsApiStatus === apiStateConstant.success && jobs.length === 0 && (
                <div className="noJobsItemsFound">
                  <img
                    className="noJobsImg"
                    src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                    alt="no jobs"
                  />
                  <h1>No Jobs Found</h1>
                  <p>We could not find any jobs. Try other filters.</p>
                </div>
              )}

              {jobsApiStatus === apiStateConstant.failure && (
                <div className="noJobsItemsFound">
                  <img
                    className="noJobsImg"
                    src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                    alt="failure view"
                  />
                  <h1>Oops! Something Went Wrong</h1>
                  <p>We cannot seem to find the page you are looking for.</p>
                  <button
                    type="button"
                    className="profileRetryBtn"
                    onClick={this.getJobsList}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
