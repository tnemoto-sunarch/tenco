import axios from 'axios'

const BASE_URL = process.env.apiBaseUrl

export default ({ app }, inject) => {
  inject('tecoReqApi', (uri, reqData, callback) => {
    const crypto = require('crypto')
    const N = 32
    const reqId = crypto
      .randomBytes(N)
      .toString('base64')
      .substring(0, N)

    reqData.request_id = reqId
    // console.log(BASE_URL + uri)
    // console.log(reqData)
    axios
      .post(BASE_URL + uri, reqData)
      .then((res) => {
        callback(res.data)
      })
      .catch((e) => {
        // console.log('request error : ' + e)
      })
  })
}
