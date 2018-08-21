import React, { Component } from 'react';
import './App.css';
import Scroll,{api} from './sc'
import Mlog from './console'
import jsonp from './jsnp'
import axios from 'axios'


class App extends Component {
	constructor() {
		super();
		this.state = {
			msglist:[],
			inputMsgContent:'',
			wtf:false,
			loadingTop:0,
			hasRenderLoading:false,
			loadhack:false
		}
		this.timmerStack = [];
		this.topTimes = 0;
		this.bottomTime = 0;
		this.touchTopMove = 0;
		this.lastTouchYvalue = -1;
		this.sH = 0;
		this.nextItemCount = 0;
		this.prevItemCount = 0;

		this.preTop = 0;
	}
	

	getAnswer() {
		return Math.random()>0.5?'你真帅！skr,skr,skr':'辛苦你了！！'
	}

	cors = (url, params)=> {
        return new Promise((resolve) => {
            jsonp(url, params, (error, response) => {
                if(error) {
                    resolve({
                        code: -1,
                    });
                    return;
                }
                resolve(response);
            })
        })
    }

	sendMsgClick = async ()=>{

		let msgc = this.state.inputMsgContent
		if(msgc == 'debug') {
			Mlog.hackInstall()
		}
		if(!msgc.trim()) {
			msgc = '机器人'
		}
		let oneSendMsg = {content:msgc,float:'right'};
		let msglist = this.state.msglist;
		
		
		msglist.push(oneSendMsg);
		axios.get(`https://www.bing.com/socialagent/chat?q=${msgc}&anid=123456`).then((res)=>{
			let answerMsg = {content:decodeURI(res.data.InstantMessage.ReplyText),float:'left'}
			msglist.push(answerMsg)
			this.setState({
				msglist,
			})
			api.scrollToBottom()

		})
		this.setState({
			msglist,
			inputMsgContent:''
		})
		api.scrollToBottom()
	}

	inputMsgContentChange = (e)=>{
		let inputMsgContent = e.target.value
		this.setState({
			inputMsgContent
		})
	}

	renderMsgList = (arr)=>{
		return arr.map((item,i)=>{
			return <div key={item.id} id={`msg${i}`} className="msg-grandpa" className={item.float=='right'?'msg-right msg-grandpa':'msg-left msg-grandpa'}>
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

    guid = () => {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
	loadcb = () =>{
		setTimeout(()=>{
			let msglist = this.state.msglist;
			let i = 10
			while(i--) {
				msglist.unshift({content:'test msg'+Math.random(),float:'left',id:this.guid()})
			}
			this.setState({
				msglist,
				inputMsgContent:''
			})
		},2000)
	}
	render() {
		let {msglist,inputMsgContent} = this.state;
		return (
			<div onKeyDown={this.handleKeyDown} className="App">
				<div onClick={this.test} className="header">智能小冰为你服务</div>
				<div >
					<Scroll loadcb={this.loadcb} showBar={true} className="tx">
						{this.renderMsgList(msglist)}
					</Scroll>
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
