<template>
  <div class="search">
		
  	<div class="search-box-wrapper">
  		<search-box ref="searchBox" @query="onQueryChange" placeholder="搜索哈哈..."></search-box>
  	</div>
		
  	<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
  		<scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
  			<div>
	  			<div class="hot-key">
	  				<h1 class="title">热门搜索</h1>
	  				<ul>
	  					<li @click="addQuery(item.k)" v-for="item in hotKey" class="item">
	  						<span>{{item.k}}</span>
	  					</li>
	  				</ul>
	  			</div>
	  			<div class="search-history" v-show="searchHistory.length">
	  				<h1 class="title">
	  					<span style="color: pink;" class="text">搜索历史</span>
	  					<span class="clear" @click="showConfirm">
	  						<i class="icon-clear"></i>
	  					</span>
	  				</h1>
	  				<search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
	  			</div>
					
  		  </div>
  		</scroll>   
  	</div>
		
  	<div class="search-result" v-show="query" ref="searchResult">
  		<suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
  	</div>
		
  	<confirm ref="confirm" @confirm="clearSearchHistory" confirmBtnText="清空" text="是否清空所有搜索历史"></confirm>
		
  	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	import SearchBox from 'base/search-box/search-box'
	import SearchList from 'base/search-list/search-list'
	import Suggest from 'components/suggest/suggest'
	import Confirm from 'base/confirm/confirm'
	import Scroll from 'base/scroll/scroll'
	import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions} from 'vuex'
  import {playlistMixin, searchMixin} from 'common/js/mixin'
	
	export default {
		mixins: [playlistMixin, searchMixin],
		data() {
			return {
				hotKey: []
			}
		},
		computed: {
			shortcut() {
				// console.log(this.searchHistory)
				return this.hotKey.concat(this.searchHistory)
				// return [...this.hotKey, ...this.searchHistory]
			}
		},
		created() {
			this._getHotKey()
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
			},
			_getHotKey() {
				getHotKey().then((res) => {
					// console.log(res)
					if (res.code === ERR_OK) {
						this.hotKey = res.data.hotkey.slice(0, 10)
					}
				})
			},
			showConfirm() {
				this.$refs.confirm.show()
			},
			deleteOne(item) {
				this.deleteSearchHistory(item)
			},
			deleteAll() {
				this.clearSearchHistory()
			},
			...mapActions(['clearSearchHistory'])
		},
		watch: {
			query(newQuery) {
				// console.log(newQuery)
				if (!newQuery) {
					setTimeout(() => {
						this.$refs.shortcut.refresh()
					}, 20)
				}
			}
		},
		components: {
			SearchBox, Suggest, SearchList, Confirm, Scroll
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>