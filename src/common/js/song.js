import {getVKey, getLyric} from 'api/song'
import {getUid} from './uid'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

let urlMap = {}
export default class Song {
	constructor({id, mid, singer, name, album, duration, image}) {
		this.id = id
	    this.mid = mid
	    this.singer = singer
	    this.name = name
	    this.album = album
	    this.duration = duration
	    this.image = image
	    this.filename = `C400${this.mid}.m4a`
	    // this.mine = `我的测试--${this.singer}`
	    // 确保一首歌曲的 id 只对应一个 url
	    if (urlMap[this.id]) {
	      this.url = urlMap[this.id]
	    } else {
	      this._genUrl()
	    }
	}
	
	getLyric() {
		if (this.lyric) {
			return Promise.resolve(this.lyric)
		}
		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
				if (res.retcode === ERR_OK) {
					this.lyric = Base64.decode(res.lyric)
					// this.haha = '888'
					resolve(this.lyric)
				} else {
					reject('no lyric')
				}
			})
		})
	}
	
	_genUrl() {
		if (this.url) {
			return
		}
		 getVKey(this.mid, this.filename).then((res) => {
		 	if (res.code === ERR_OK) {
		 		// console.log(res)
		 		const vkey = res.data.items[0].vkey
		 		this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`
		 		urlMap[this.id] = this.url
		 	}
		 })
	}
}
// http://dl.stream.qqmusic.qq.com/C4000037gTiG11n7oE.m4a?vkey=BC171A38E02CCF8F357E3A818A7FE2E791635B64ABFCF3F9A8C30262C66832F9E6B5CB3B6153EA0C3E040D3F0355B8303A1B7E5E4CFCFC05&guid=7807056253&uin=0&fromtag=66
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // url: `http://dl.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}