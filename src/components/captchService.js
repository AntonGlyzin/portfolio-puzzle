import axios from 'axios'
import Cookies from 'js-cookie'
export function getCaptchAndCSRF (host, context) {
  axios.get(host + '/captcha/refresh/', {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }).then(res => {
    context.keyCaptch = res.data.key
    context.imgCaptch = res.data.image_url
    context.isCaptch = true
    if (!Cookies.get('csrftoken')) {
      axios.get(host + '/getprotect/').then(res => {
        Cookies.set('csrftoken', res.data.token, { expires: 365 })
      })
    }
  })
}
