import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Scroll,{api} from './scroll'
import axios from 'axios'
// import Mlog from 'h5debug'
import Mlog from './console'


class App extends Component {
	constructor() {
		super();
		this.state = {
			msglist:[],
			inputMsgContent:'',
			wtf:false
		}
	}
	
	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown)
		// console.log('null','undefined',null,undefined)
		// console.log({a:1,b:'asdad',c:'qweqweqewq',v:{
		// 	d:'1asdad',
		// 	l:'asdasdsa',
		// 	f:{
		// 		r:'1222222222222312',
		// 	}
		// }})
		console.log([1,2,3,4,5])
		axios.get('http://client-ds.jd.com/http/api.action?callback=__jp9&route=get_card&ptype=get_component_list&card=39&pin=open_im_44&appId=yhd.customer&venderId=176348&entry=open_m&clientType=m&aid=OzEQl02H&page=1')
			.then(function (response) {
		})

		axios.post('http://client-ds.jd.com/http/api.action?callback=__jp9', {
			firstName: 'Fred',
			lastName: 'Flintstone'
		  })
		  .then(function (response) {
			// console.log(response);
		  })
		setTimeout(()=>{
			axios.get('http://client-ds.jd.com/http/api.action?callback=__jp9&route=get_card&ptype=get_component_list&card=39&pin=open_im_44&appId=yhd.customer&venderId=176348&entry=open_m&clientType=m&aid=OzEQl02H&page=1')
			.then(function (response) {
				// console.log(response);
			})
		},10000);
		// console.log('test','asdasda',[1,23,{a:1}],'opdas','asdasxzc');
		try {
			var sendSuccess = 'asd'
			// console.log(sendSuccess.a.b)
		} catch (error) {
			// console.log('catch',error)
		}
	}
	getAnswer() {
		return Math.random()>0.5?'你真帅！skr,skr,skr':'辛苦你了！！'
	}
	sendMsgClick = async ()=>{
		api.stb()
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

	inputMsgContentChange = (e)=>{
		let inputMsgContent = e.target.value
		this.setState({
			inputMsgContent
		})
	}

	renderMsgList = (arr)=>{
		return arr.map((item,i)=>{
			return <div key={i} className="msg-grandpa" className={item.float=='right'?'msg-right msg-grandpa':'msg-left msg-grandpa'}>
					<div className="msg-wrap">
						<span>{item.content}</span>
					</div>
			</div>
		})
	}

	test = ()=>{
		var sendSuccess = 'asd'
		new Promise(()=>{
			sendSuccess.a.x.c.x.f
		}).catch(()=>{})
	}

	handleKeyDown = (e)=>{
		// console.log(e.keyCode)
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
	render() {
		let {msglist,inputMsgContent,wtf} = this.state
		if(wtf == 'true') {
			let a = '1';
			console.log(a.lik.length)
		}
		return (
			<div onKeyDown={this.handleKeyDown} className="App">
				<div onClick={this.test} className="header">开放平台DEMO</div>
				<div className="mannul">
					<button onClick={this.therror.bind(null,1)}>抛出异常</button>
					<button onClick={this.therror.bind(null,2)}>挂掉页面</button>
				</div>
				<Scroll className="tx">
					{this.renderMsgList(msglist)}
				</Scroll>
				<div className="footer">
					<input value={inputMsgContent} onChange={this.inputMsgContentChange} type="text"/>
					<button onClick={this.sendMsgClick}>发送</button>
				</div>
			</div>
		);
	}
}

export default App;
