import React, {Component} from 'react';
import "./ListDetails.css";
import {
    ArrowLeftOutlined,
    MessageOutlined,
    HeartOutlined,
    PlusOutlined,
    MoreOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';
import {CSSTransition} from "react-transition-group";
import Store from ".././Redux/Stores";
import {addSong} from ".././Redux/Actions"

class ListDetails extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props)
        this.state = {
            id: this.props.match.params.id,
            data: [],
            userObj: {},
            dataList: [],
            isBool: true,
            inlines: "inline",
            nones: "0",
            backColor: "",
            isListDetail: false,
            scrollTop:""
        }
    }

    gotoUp() {
        setTimeout(() => {
            this.props.history.go(-1);
        }, 300)
        this.setState({
            isListDetail: !this.state.isListDetail
        })
    }

    render() {
        return <CSSTransition in={this.state.isListDetail} timeout={2000} classNames={"listDetail"}>
            <div className={"listDetails"}>
                <img className={"listDetails-img"} src={this.state.data.coverImgUrl} alt=""/>
                <header className={"listDetails-header"} style={{marginTop:this.state.scrollTop,backgroundColor: this.state.backColor}}>
                    <ArrowLeftOutlined onClick={() => this.gotoUp()} style={{backgroundColor: this.state.backColor}}/>
                    <span style={{display: this.state.inlines}}>歌单</span>
                    <marquee style={{opacity: this.state.nones}}>
                        <span>{this.state.data.name}</span>
                    </marquee>
                </header>
                <div className={"listDetails-details"}>
                    <div className={"listDetails-details-top"}>
                        <img src={this.state.data.coverImgUrl} alt=""/>
                        <span><i className={"el-icon-headset"}></i>{this.state.data.playCount}</span>
                        <p>{this.state.data.name}</p>
                        <p>
                            <img src={this.state.userObj.avatarUrl} alt=""/>
                            {this.state.userObj.nickname}</p>
                    </div>
                    <div className={"listDetails-details-bottom"}>
                        <div>
                            <MessageOutlined/>
                            <p>评论</p>
                        </div>
                        <div>
                            <HeartOutlined/>
                            <p>点赞</p>
                        </div>
                        <div>
                            <PlusOutlined/>
                            <p>收藏</p>
                        </div>
                        <div>
                            <MoreOutlined/>
                            <p>更多</p>
                        </div>
                    </div>
                </div>
                <ul className={"listDetails-list"}>
                    <div>
                        <div>
                            <PlayCircleOutlined/>
                            <span>播放全部</span>
                            <span>(共{this.state.dataList.length}首)</span>
                        </div>
                        <div>
                            <PlusOutlined/>
                            <span>收藏(0万)</span>
                        </div>
                    </div>
                    {
                        this.state.dataList.map((v, i) => {
                            return <li key={v.id} onClick={()=>this.addAudio(v.id,v.name,v.ar[0].name,v.al.picUrl)}>
                                <p>{i + 1}</p>
                                <div>
                                    <p>{v.name}</p>
                                    <p>{v.ar[0].name} - {v.al.name}</p>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
        </CSSTransition>
    }

    componentDidMount() {
        fetch("http://127.0.0.1:9999/playlist/detail?id=" + this.state.id).then(res => res.json()).then(data => {
            if (String(data.playlist.playCount).length > 4) {
                data.playlist.playCount = String(data.playlist.playCount).substr(0, String(data.playlist.playCount).length - 4) + "万";
            }
            this.setState({
                data: data.playlist,
                dataList: data.playlist.tracks,
                userObj: data.playlist.creator
            }, () => {
                console.log(this.state.dataList)
            })
        })
        window.addEventListener('scroll', this.bindHandleScroll, true);
        this.setState({
            isListDetail: true
        })

        this.listener1 = Store.subscribe(() => {
        })
    }
    addAudio(id,singerName,songerName,imgUrl){
        Store.dispatch(addSong(id,this.state.id,singerName,songerName,imgUrl))
    }

    bindHandleScroll = (event) => {
        // console.log(event)
        // 滚动的高度
        const scrollTop = (event.srcElement ? event.srcElement.scrollTop : false)
            || window.pageYOffset
        // || (event.srcElement ? event.srcElement.body.scrollTop : 0);
        console.log(scrollTop)
        event.preventDefault();
        event.stopPropagation();
        if (scrollTop >= 10) {
            this.setState({
                isBool: false,
                inlines: "none",
                nones: "1",
                backColor: "red"
            })
        } else {
            this.setState({
                isBool: true,
                inlines: "inline",
                nones: "0",
                backColor: ""
            })
        }
        this.setState({
            scrollTop:scrollTop/20+"rem"
        })
    }

    //在componentWillUnmount，进行scroll事件的注销
    componentWillUnmount() {
        window.removeEventListener('scroll', this.bindHandleScroll, true);
        this.listener1();
    }
}

export default ListDetails;