import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

// const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function wangyi() {
	const url = 'http://music.163.com/weapi/personalized/newsong'
	const data = {
    params: 'y5Tp41Id2jdi2hChArZaLwWNeZ0spepEXKoPFWLkZQY=',
		encSecKey: '8e616bab5fb188e008f896def3ed68941cfe2a360f5063838c306194ba7f5c5d86c5573ec9e881fe405625c12ca8161087237e2951483d22b04e162b6c438273903e0b44b45d3dfadbaa4dc71379c1df5cbd05a084e754ff0841d47d89a6a12fde62301f3adad713df1800c65e4346183a68e359230c7867fde112cd30c4afe1'
  }
	return jsonp(url, data, options)
	// console.log(Date.now())
}

export function getDiscList() {
  // 线上环境地址，同学们根据自己的需要配置修改
  // const url = debug ? '/api/getDiscList' : 'http://ustbhuangyi.com/music/api/getDiscList'
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  // const url = debug ? '/api/getCdInfo' : 'http://ustbhuangyi.com/music/api/getCdInfo'
  const url = '/api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}