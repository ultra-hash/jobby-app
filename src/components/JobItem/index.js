import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    id,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="whiteColorLink">
      <li className="jobItemCard">
        <div className="jobItemCardHeader">
          <img src={companyLogoUrl} alt="company logo" />
          <div>
            <h1 className="jobTitle">{title}</h1>
            <AiFillStar className="jobStarColor" />
            <p className="jobRating">{rating}</p>
          </div>
        </div>
        <div className="jobDetailsContainer">
          <p>
            <HiLocationMarker />
            {location}
          </p>
          <BsFillBriefcaseFill />
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="heading">Description</h1>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
