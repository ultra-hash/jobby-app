import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker, HiExternalLink} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

const apiStateConstant = {
  initial: 'INITIAL',
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    jobItemDetails: null,
    similarJobsList: null,
    apiStatus: apiStateConstant.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    this.setState({apiStatus: apiStateConstant.pending})
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
      'Content-Type': 'Application/json',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    const data = await response.json()

    if (response.ok === true) {
      const jobItemDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const similarJobsList = data.similar_jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobItemDetails,
        similarJobsList,
        apiStatus: apiStateConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStateConstant.failure})
    }
  }

  render() {
    const {jobItemDetails, similarJobsList, apiStatus} = this.state
    return (
      <div className="mainJobDetailsContainer">
        <Header />
        <div className="jobDetailsCardContainer">
          {apiStatus === apiStateConstant.success && (
            <>
              <div className="jobDetailsCard">
                <div className="jobDetailsCardHeader">
                  <img
                    src={jobItemDetails.companyLogoUrl}
                    alt="job details company logo"
                  />
                  <div>
                    <h1 className="jobTitle">{jobItemDetails.title}</h1>
                    <p className="jobRating">
                      <AiFillStar className="jobStarColor" />
                      {jobItemDetails.rating}
                    </p>
                  </div>
                </div>
                <div className="jobDetailsPerksContainer">
                  <div>
                    <HiLocationMarker />
                    <p>{jobItemDetails.location}</p>
                  </div>
                  <div>
                    <BsFillBriefcaseFill />
                    <p>{jobItemDetails.employmentType}</p>
                  </div>
                  <p>{jobItemDetails.packagePerAnnum}</p>
                </div>
                <hr className="hrClass" />
                <div className="d-flex justify-content-between">
                  <h1 className="heading">Description</h1>
                  <a
                    href={jobItemDetails.companyWebsiteUrl}
                    target="__blank"
                    className="externalLink"
                  >
                    Visit <HiExternalLink />
                  </a>
                </div>

                <p>{jobItemDetails.jobDescription}</p>

                <h1 className="heading">SKILLS</h1>
                <ul className="skillsContainer">
                  {jobItemDetails.skills.map(skill => (
                    <li key={skill.name}>
                      <img
                        className="skillImg"
                        src={skill.image_url}
                        alt={skill.name}
                      />
                      <p>{skill.name}</p>
                    </li>
                  ))}
                </ul>

                <h1 className="heading">Life at Company</h1>
                <div className="lifeAtCompanyContainer">
                  <p>{jobItemDetails.lifeAtCompany.description}</p>
                  <img
                    className="lifeAtCompanyImg"
                    src={jobItemDetails.lifeAtCompany.image_url}
                    alt="life at company"
                  />
                </div>
              </div>

              <h1 className="heading">Similar Jobs</h1>
              <ul className="similarJobItemDetailsContainer">
                {similarJobsList.map(job => (
                  <li className="similarJobItemDetails" key={job.id}>
                    <Link to={`/jobs/${job.id}`} className="whiteColorLink">
                      <div className="jobDetailsCardHeader">
                        <img
                          src={job.companyLogoUrl}
                          alt="similar job company logo"
                        />
                        <div>
                          <h1 className="jobTitle">{job.title}</h1>
                          <p className="jobRating">
                            <AiFillStar className="jobStarColor" />
                            {job.rating}
                          </p>
                        </div>
                      </div>

                      <h1 className="heading">Description</h1>

                      <p>{job.jobDescription}</p>

                      <div className="jobDetailsPerksContainer">
                        <p>
                          <HiLocationMarker />
                          {job.location}
                        </p>
                        <p>
                          <BsFillBriefcaseFill />
                          {job.employmentType}
                        </p>
                        <p> </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {apiStatus === apiStateConstant.pending && (
            <div className="loader-container" data-testid="loader">
              <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
            </div>
          )}

          {apiStatus === apiStateConstant.failure && (
            <div className="loader-container">
              <img
                className="noJobsImg"
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
              />
              <h1>Oops! Something Went Wrong</h1>
              <p>We cannot seem to find the page you are looking for</p>
              <button
                type="button"
                className="profileRetryBtn"
                onClick={this.getJobDetails}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default JobDetails
