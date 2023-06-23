import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeInput = event => {
    if (event.target.id === 'username') {
      this.setState({username: event.target.value})
    } else {
      this.setState({password: event.target.value})
    }
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      header: {
        'Content-Type': 'Application/json',
      },
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()

    if (response.ok === true) {
      const {history} = this.props
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg})
    }

    console.log(data)
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="mainLoginContainer">
        <div className="loginContainer">
          <img
            className="loginImgLogo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="loginForm" onSubmit={this.onFormSubmit}>
            <label htmlFor="username">USERNAME</label>
            <input
              className="loginInput"
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={this.onChangeInput}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              className="loginInput"
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={this.onChangeInput}
            />
            <button type="submit" className="loginBtn">
              Login
            </button>
          </form>
          {errorMsg !== '' && <p className="loginErrorMsg">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
