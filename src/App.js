import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Scroll,{api} from './scroll'
import axios from 'axios'
// import Mlog from 'h5debug'
import Mlog from './console'
import { setTimeout } from 'timers';
import loading from './loading.gif'


class App extends Component {
	constructor() {
		super();
		this.state = {
			msglist:[],
			inputMsgContent:'',
			wtf:false,
			loadingTop:0,
			hasRenderLoading:false
		}
		this.timmerStack = [];
		this.topTimes = 0;
		this.bottomTime = 0;
		this.touchTopMove = 0;
		this.lastTouchYvalue = -1;
	}
	

	getAnswer() {
		return Math.random()>0.5?'你真帅！skr,skr,skr':'辛苦你了！！'
	}

	sto = (ele,px,ms)=>{
		let cur = ele.scrollHeight;
		for(let i=0;i<px/((px/ms)*0.16);i++) {
			setTimeout(()=>{
				ele.scrollTo(0,i*(px/ms)*0.16)
			},i*(px/ms)*0.160)
		}
	} 

	scrollToPx = (ele,px,ms=1)=>{
		this.clearAllScrollTimer();
		let currentScrollHeight= ele.scrollTop;
		let needScrollPx = px - currentScrollHeight-ele.clientHeight;
		let scrollTimes = Math.ceil(ms/20);
		let steps = needScrollPx/scrollTimes;
		for(let i=1;i<=scrollTimes;i++) {
			let timmeruuid = this.guid();
			timmeruuid = setTimeout(()=>{
				ele.scrollTo(0,currentScrollHeight+i*steps)
			},i*20)
			this.timmerStack.push(timmeruuid)
		}

	}
	clearAllScrollTimer = ()=>{
		this.timmerStack.map((t)=>{
			window.clearTimeout(t)
		})
	}
	guid = ()=> {
		function S4() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}
	sendMsgClick = async ()=>{
		setTimeout(()=>{
			this.scrollToPx(this.as,this.as.scrollHeight,100)
		},100)
		let msgc = this.state.inputMsgContent
		if(msgc == 'debug') {
			Mlog.hackInstall()
		}
		if(!msgc.trim()) {
			msgc = '机器人'
		}
		// console.log(msgc)
		let oneSendMsg = {content:msgc,float:'right'};
		let answerMsg = {content:this.getAnswer(),float:'left'}
		let msglist = this.state.msglist;
		msglist.push(oneSendMsg);
		msglist.push(answerMsg)
		this.setState({
			msglist,
			inputMsgContent:''
		})
	}
	getScrollAreaData = (ele)=>{
		return {
			sTop:ele.scrollTop,
			cHeight:ele.clientHeight,
			sHeight:ele.scrollHeight
		}
	}
	handleTouchEnd = ()=> {
		this.lastTouchYvalue = -1;
		console.log('end',this.tmer)
		window.clearTimeout(this.tmer)
		let {sTop,cHeight,sHeight} = this.getScrollAreaData(this.as);
		let {hasRenderLoading,loadingTop} = this.state;
		if(hasRenderLoading&&loadingTop>=40) {
			this.setState({
				loadingTop:40,
			})
		} else if(hasRenderLoading&&loadingTop<40){
			this.setState({
				loadingTop:0,
				hasRenderLoading:false
			})
		}
		this.tmer = window.setTimeout(()=>{
			console.log('set')
			this.setState({
				loadingTop:0,
				hasRenderLoading:false
			})
		},3000)
	}

	handleTouchStart = (e)=>{
		window.clearTimeout(this.tmer)
		this.touchTopMove = e.targetTouches[0].clientY;
		if(this.lastTouchYvalue === -1) {
			this.lastTouchYvalue = e.targetTouches[0].clientY
		}
	}

	handleTouchMove = (e)=>{
		let {sTop,cHeight,sHeight} = this.getScrollAreaData(this.as);
		let {hasRenderLoading,loadingTop} = this.state;

		if(this.shouldRenderLoading(e)) {
			// this.touchTopMove = e.targetTouches[0].clientY;
			this.setState({
				hasRenderLoading:true
			})
		}
		if(hasRenderLoading&&this.touchUpOrDown(e)) {
			this.setState({
				loadingTop:(e.targetTouches[0].clientY-this.touchTopMove)>80?80:(e.targetTouches[0].clientY-this.touchTopMove)
			})
		}
		// if(sTop===0) {
		// 	this.topTimes++
		// 	if(hasRenderLoading) {
		// 		this.setState({
		// 			loadingTop:(e.targetTouches[0].clientY-this.touchTopMove)>80?80:(e.targetTouches[0].clientY-this.touchTopMove)
		// 		})
		// 	}
		// } else {
		// 	// this.topTimes++
		// }
		// if(sTop===0&&this.topTimes==5&&!hasRenderLoading) {
		// 	this.topTimes = 0;
		// 	this.touchTopMove = e.targetTouches[0].clientY;
		// 	this.setState({
		// 		hasRenderLoading:true
		// 	})
		// 	console.log('wave');
		// }
		this.lastTouchYvalue = e.targetTouches[0].clientY
		console.log(e.targetTouches[0].clientY)
	}
	shouldRenderLoading = (e)=>{
		let {sTop} = this.getScrollAreaData(this.as);
		let {hasRenderLoading} = this.state;
		return (sTop===0)&&!hasRenderLoading&&!!this.touchUpOrDown(e)
	}

	// down:true
	touchUpOrDown = (e)=>{
		// this.topTimes++
		// if(this.topTimes ==5) {
		// 	this.topTimes = 0
			// return e.targetTouches[0].clientY-this.lastTouchYvalue>0
		// }
		// return false

		return this.touchTopMove - e.targetTouches[0].clientY
	}

	inputMsgContentChange = (e)=>{
		let inputMsgContent = e.target.value
		this.setState({
			inputMsgContent
		})
	}

	renderMsgList = (arr)=>{
		return arr.map((item,i)=>{
			return <div key={i} id={`msg${i}`} className="msg-grandpa" className={item.float=='right'?'msg-right msg-grandpa':'msg-left msg-grandpa'}>
					<div className="msg-wrap">
						<span>{item.content}</span>
					</div>
			</div>
		})
	}

	test = ()=>{
		document.querySelector('#msg15').scrollIntoView(false)
	}

	handleKeyDown = (e)=>{
		if(e.keyCode === 13) {
			this.sendMsgClick()
		}
	}	
	therror = (i)=>{
		switch(i) {
			case 1:
			throw new Error('抛出异常'); break;
			case 2:this.setState({wtf:'true'});break;
			default:break
		}
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown)
	}
	render() {
		let {msglist,inputMsgContent,wtf,loadingTop,hasRenderLoading,showLoading} = this.state;
		let contentStyle = {
			transform : `translateY(${loadingTop||0}px)`,
			transition:`all 0.5s`
		};
		return (
			<div onKeyDown={this.handleKeyDown} className="App">
				<div onClick={this.test} className="header">开放平台DEMO</div>
				<div className="mannul">
					<button onClick={this.therror.bind(null,1)}>抛出异常</button>
					<button onClick={this.therror.bind(null,2)}>挂掉页面</button>
				</div>
				<div >
					{/* <Scroll showBar={true} className="tx">
						<div className="as" ref= {(ref) => {this.as = ref}}></div>
					</Scroll> */}
					<div 
					onTouchMove={this.handleTouchMove}
					onScroll={this.clearAllScrollTimer} 
					className="wrap" 
					onTouchEnd= {this.handleTouchEnd}
					onTouchStart={this.handleTouchStart}
					ref= {(ref) => {this.as = ref}}>
					<div style={contentStyle}>
						{<div style={{marginTop:'-40px'}}><img style={{height:'40px'}} src={loading} alt=""/></div>}
						{this.renderMsgList(msglist)}
					</div>
					</div>
				</div>
				<div className="footer">
					<input value={inputMsgContent} onChange={this.inputMsgContentChange} type="text"/>
					<button onClick={this.sendMsgClick}>发送</button>
				</div>
			</div>
		);
	}
}

export default App;
