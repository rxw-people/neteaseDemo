import React, {Component} from 'react';
import { Link,Route,Redirect,withRouter } from "react-router-dom"
import {
    MenuOutlined,
    SearchOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    HeartOutlined,
    DeleteFilled,
    SyncOutlined,
    MinusOutlined,
    DragOutlined,
    DownOutlined,
    StepBackwardOutlined,
    StepForwardOutlined
} from '@ant-design/icons';
import "./Home.css";
import Recommend from "../recommend/Recommend";
import Singers from "../Singers/Singers";
import Rank from "../Rank/Rank";
import Search from ".././Search/Search"
import ListDetails from "../ListDetails/ListDetails";
import SingersDetails from ".././SingersDetails/SingersDetails";
import RankDetails from ".././RankDetails/RankDetails";
import Store from ".././Redux/Stores";
import img1 from "../../1.png"
import img2 from "../../2.png"
import {CSSTransition} from "react-transition-group";
import {addSong} from ".././Redux/Actions";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id:{},
            Bool:true,
            titles:"推荐",
            dataList:[],
            dataListArr:[],
            shows:"inline",
            hiddens:"none",
            animations:"shows 7s linear infinite forwards",
            songData:[],
            // 获取歌词播放时间
            songTimes:[],
            // 获取歌词
            songLyric:[],
            // 获取歌词加时间
            lyricTimeArr:[],
            // 是否单曲循环
            loopBool:false,
            // 音乐播放列表显示隐藏
            showHidden:true,
            // 判断底部播放器显示隐藏
            audioBool:true,
            // 音频播放模式
            playsNum:"0",
            plays:[
                {a:<SyncOutlined />,b:"顺序播放"},
                {a:<MinusOutlined />,b:"单曲循环"},
                {a:<DragOutlined />,b:"随机播放"},
            ],
            // 歌词页显示隐藏
            lyricShow:"none",
            // 歌词页进出动画
            lyricBool:false,
            transfroms:"rotateZ(0)",
            // 实时音频播放时长
            lyricStartTimer:"",
            // 音频总时长
            lyricOverTimer:"",
            songNum:0,
            lyricShowHidden:"none",
            lyricImgShowHidden:"block",
            lyricOne:"",
            lyricIndex:0,
            tops:"0rem",
            totalDistanced:"0rem",
            startClient:0,
            endClient:0,
            moveClient:"",
            broadcast:[0.75, 1, 1.25, 1.5, 2],
            broadCastOne:"1"
        }
    }
    componentDidMount(){
        this.listeren2 = Store.subscribe(()=>{
            console.log(this.state.id.id, Store.getState().songerSing.id)
            let isBool = true;// 判断点击的歌曲是否相同
            if (this.state.id.id == Store.getState().songerSing.id) {
                isBool = true;
            } else {
                isBool = false;
            }
            this.setState({
                id:Store.getState().songerSing
            },()=>{
                if (this.state.id.id == undefined) {
                    this.setState({
                        audioBool:true
                    })
                } else {
                    this.setState({
                        audioBool:false
                    })
                }

                this.setState({
                    transfroms:"rotateZ(0)",
                    animations:"shows 7s linear infinite forwards",
                    shows:"inline",
                    hiddens:"none",
                })
                console.log(1213123131241421)
                // 歌词
                fetch("http://127.0.0.1:9999/Lyric?id="+this.state.id.id).then(res=>res.json()).then(data=>{
                    console.log(data)
                    // 歌词时间处理
                    let lyric_time_arr = data.lrc.lyric.match(/\[[^\[\]]*\]/g);
                    let new_time_arr = []
                    lyric_time_arr.forEach(v=>{
                        new_time_arr.push(v.substring(1,6));
                    })
                    // 歌词处理
                    let lyric_arr = data.lrc.lyric.match(/\][^\]\[]*\[/g);
                    let new_lyric_arr = []
                    lyric_arr.forEach(v=>{
                        new_lyric_arr.push(v.substring(v.indexOf("]") + 1, v.indexOf("\n")));
                    })
                    // 合并歌词和时间
                    let lyricTime_arr = []
                    new_time_arr.forEach((v,i)=>{
                        lyricTime_arr.push({timer:v,lyric:new_lyric_arr[i] || ""})
                    })
                    // 去除歌词数组中为空的歌词
                    lyricTime_arr.forEach((v,i)=>{
                        if (v.lyric == "") {
                            lyricTime_arr.splice(i,1);
                            i--;
                        }
                    })
                    console.log(lyricTime_arr);
                    this.setState({
                        songTimes:new_time_arr,
                        songLyric:new_lyric_arr,
                        lyricTimeArr:lyricTime_arr
                    },()=>{
                        console.log(this.state.songTimes,this.state.songLyric)
                    })
                });
                // 歌曲url
                fetch("http://127.0.0.1:9999/song/url?id="+this.state.id.id).then(res=>res.json()).then(data=>{
                    // console.log(data);
                    this.setState({
                        songData:data.data[0]
                    },()=>{
                        // console.log(this.state.songData.url)
                    })
                });
                // 歌手歌单
                fetch("http://127.0.0.1:9999/artists?id=" + this.state.id.songSheetId, {method: "get"}).then(res => res.json()).then(data => {
                    console.log(data);
                    this.setState({
                        dataListArr:data.hotSongs || []
                    },()=>{
                        console.log(this.state.dataList);
                    })
                })
                // 歌单列表
                fetch("http://127.0.0.1:9999/playlist/detail?id=" + this.state.id.songSheetId).then(res => res.json()).then(data => {
                    console.log(data)
                    if (!data.msg) {
                        if (String(data.playlist.playCount).length > 4) {
                            data.playlist.playCount = String(data.playlist.playCount).substr(0, String(data.playlist.playCount).length - 4) + "万";
                        }
                        console.log(data.playlist.tracks);
                        this.setState({
                            dataList:data.playlist.tracks || []
                        })
                    }

                })
                // 获取歌曲时长/自动切换下一首
                let _audio = document.querySelector("audio");
                _audio.load();
                _audio.oncanplay = ()=> {
                    setTimeout(()=>{
                        // 歌曲时长(秒数)
                        console.log(Math.floor(_audio.duration))
                        let overTimer = Math.floor(_audio.duration);
                        let timeDisplay;
                        let c = 0;
                        let d = 0;
                        _audio.addEventListener("timeupdate",()=> {//监听音频播放的实时时间事件
                            //用秒数来显示当前播放进度
                            timeDisplay = Math.floor(_audio.currentTime);//获取实时时间(取整)
                            // console.log(timeDisplay);
                            // 音乐播放进度条
                            let totalDistance = timeDisplay / overTimer * 12 + "rem";
                            // 音频实时时间/分
                            c = Math.floor(timeDisplay/60);
                            if (c < 10) {
                                c = "0" + String(c)
                            }
                            // 音频实时时间/秒
                            d = Math.floor(timeDisplay%60);
                            if (d < 10) {
                                d = "0" + String(d)
                            }
                            // 完整播放时间(分加秒)
                            this.setState({
                                lyricStartTimer:c  + ":" + d,
                                totalDistanced:totalDistance
                            },()=>{
                                // 通过当前时间，与数组时间对比，返回一句歌词
                                this.state.lyricTimeArr.forEach((v,i)=>{
                                    if (v.timer == this.state.lyricStartTimer) {
                                        this.setState({
                                            lyricOne:v.lyric,
                                            lyricIndex:i
                                        })
                                    }
                                })
                            })
                        })
                        console.log(c,d)
                        let a = Math.floor(Math.floor(_audio.duration)/60);
                        let b = Math.floor(_audio.duration) % 60;
                        if (b < 10) {
                            b = "0" + String(b)
                        }
                        this.setState({
                            lyricOverTimer: a + ":" + b,
                        })
                    })
                }
            })
        })
    }
    componentWillUnmount(){
        this.listeren2();
    }
    clicks(){
        alert("用户中心正在开发中，敬请期待:)");
    }
    // 开始
    playOut(event){
        event.stopPropagation()
        this.setState({
            shows:"inline",
            hiddens:"none",
            animations:"shows 7s linear infinite forwards",
            transfroms:"rotateZ(0)",
            Bool:true
        })
        document.querySelector("audio").play()
    }
    // 暂停
    pauseOut(event){
        event.stopPropagation()
        this.setState({
            shows:"none",
            hiddens:"inline",
            animations:"shows 7s linear infinite forwards paused",
            transfroms:"rotateZ(-30deg)",
            Bool:false
        })
        document.querySelector("audio").pause()
    }
    // 歌曲播放模式
    playNum(i){
        i++;
        if (i > 2) {
            i = 0;
        }
        switch (i) {
            case 0:
                this.setState({
                    songNum:0,
                    loopBool:false
                })
                break;
            case 1:
                this.setState({
                    songNum:1,
                    loopBool:true
                })
                break;
            case 2:
                this.setState({
                    songNum:2,
                    loopBool:false
                })
                break;
            default:
                alert("歌曲播放模式错误");
                i = 0;
                break;

        }
        this.setState({
            playsNum:i
        },()=>{
            console.log(this.state.songNum,this.state.loopBool)
        })
    }
    // 播放随机歌曲
    randomNum() {
        this.setState({
            loopBool:false,
            lyricTimeTransition:"",
            lyricTimeTransform:"translateX(0)"
        })
        let ranNum = Math.floor(Math.random() * this.state.dataList.length);
        console.log(ranNum);
        this.state.dataList.forEach((v,i)=>{
            if (ranNum == i) {
                console.log(v);
                Store.dispatch(addSong(v.id,this.state.id.songSheetId,v.name,v.ar[0].name,v.al.picUrl))
            }
        })
    }
    // 显示隐藏底部播放列表
    menuOutLine(event){
        event.stopPropagation()
        this.setState({
            showHidden:false
        })
    }
    masked(){
        this.setState({
            showHidden:true
        })
    }
    delSong(i){
        this.state.dataList.splice(i,1)
        // console.log(this.state.dataList);
        this.setState({
            dataList:this.state.dataList
        })

    }
    // 显示歌词页
    toLyric(){
        this.setState({
            lyricShow:"block",
            lyricBool:true,
        })
    }
    // 隐藏歌词页
    gotoUp(){
        this.setState({
            lyricBool:false
        })
    }
    // 上一首
    prevSong(){
        console.log(this.state.dataList)
        let a = 0;
        this.state.dataList.forEach((v,i)=>{
            if (v.id == this.state.id.id) {
                // i--;
                console.log(i)
                a = i-1;
            }
        })
        console.log(a)
        this.state.dataList.forEach((v,i)=>{
            if (i == a) {
                Store.dispatch(addSong(v.id,this.state.id.songSheetId,v.name,v.ar[0].name,v.al.picUrl));
            }
        })
        this.setState({
            transfroms:"rotateZ(0)",
            shows:"inline",
            hiddens:"none",
            loopBool:false,
        })
    }
    // 下一首
    nextSong(){
        let a = 0;
        this.state.dataList.forEach((v,i)=>{
            if (v.id == this.state.id.id) {
                // i--;
                console.log(i)
                a = i + 1;
            }
        })
        console.log(a)
        this.state.dataList.forEach((v,i)=>{
            if (i == a) {
                Store.dispatch(addSong(v.id,this.state.id.songSheetId,v.name,v.ar[0].name,v.al.picUrl));
            }
        })
        this.setState({
            transfroms:"rotateZ(0)",
            shows:"inline",
            hiddens:"none",
            loopBool:false,
        })
    }
    lyricImgHidden(){
        this.setState({
            lyricImgShowHidden:"none",
            lyricShowHidden:"block"
        })
    }
    lyricHidden(){
        this.setState({
            lyricImgShowHidden:"block",
            lyricShowHidden:"none"
        })
    }
    // 左右拖拽进度条
    handleTouchStart(e){
        this.setState({
            startClient:e.touches[0].clientX,
        })
    }
    handleTouchMove(e){
        this.setState({
            endClient:e.touches[0].clientX
        },()=>{
            let a = (this.state.endClient - this.state.startClient) / 20;
            let _audio = document.querySelector("audio");
            let abc = a * _audio.duration / 12;
            _audio.currentTime = abc
        })

    }
    // 点击进度条
    handleClick(e){
        console.log(e);
    }
    // 倍速听歌
    boradCast(v){
        let _audio = document.querySelector("audio");
        _audio.playbackRate = v;
        this.setState({
            broadCastOne:v
        })
    }
    // 歌词
    touchStartLyric(e){
        console.log(e.touches[0].clientY)
    }
    touchMoveLyric(e){
        console.log(e.touches[0].clientY)
    }
    titleA(v){
        this.setState({
            titles:v
        })
    }
    render() {
        return <div className={"home"}>
            <header className={"header"}>
                <MenuOutlined onClick={()=>this.clicks()} />
                <span>云音悦</span>
                <Link to={"/search"}>
                    <SearchOutlined />
                </Link>
            </header>
            <div className={"main"}>
                <Link to={"/recommend"} className={this.state.titles=="推荐"?"titleName":""} onClick={()=>this.titleA("推荐")}>推荐</Link>
                <Link to={"/singers"} className={this.state.titles=="歌手"?"titleName":""} onClick={()=>this.titleA("歌手")}>歌手</Link>
                <Link to={"/rank"} className={this.state.titles=="排行榜"?"titleName":""} onClick={()=>this.titleA("排行榜")}>排行榜</Link>
            </div>
            <section className={"botton"} style={{marginBottom:this.state.audioBool?"0rem":"3rem"}}>
                <Route path={"/"} exact render={()=>
                    <Redirect to={"/recommend"}/>
                }/>
                <Route path={"/recommend"} component={Recommend}/>
                <Route path={"/singers"} component={Singers}/>
                <Route path={"/rank"} component={Rank}/>
                <Route path={"/search"} component={Search}/>
                <Route path={"/recommend/listDetails/:id"} component={ListDetails}/>
                <Route path={"/singers/singersDetails/:id"} component={SingersDetails}/>
                <Route path={"/rank/RankDetails/:id"} component={RankDetails}/>
            </section>
            <div className={"home-audio"} style={{display:this.state.audioBool?"none":"block"}} onClick={()=>this.toLyric()}>
                <img src={this.state.id.songImg} alt="" style={{animation:this.state.animations}}/>
                <div>
                    <p>{this.state.id.singerName}</p>
                    <p>{this.state.id.songerName}</p>
                </div>
                <div>
                    <PlayCircleOutlined onClick={(event)=>this.playOut(event)} style={{display:this.state.hiddens}}/>
                    <PauseCircleOutlined onClick={(event)=>this.pauseOut(event)} style={{display:this.state.shows}}/>
                    <MenuOutlined onClick={(event)=>this.menuOutLine(event)} />
                </div>
            </div>
{/*--------------------音乐列表---------------------------------*/}
            {/*遮罩层*/}
            <div className={"songList-song"} style={{height:this.state.showHidden?"0":"100%"}} onClick={()=>this.masked()}></div>
            <ul className={"songList"} style={{height:this.state.showHidden?"0":"25rem"}}>
                {/*音乐播放顺序*/}
                <div>
                    {
                        this.state.plays.map((v,i)=>{
                            return <span style={{display:this.state.playsNum==i?"inline":"none"}} onClick={()=>this.playNum(i)} key={i}><span>{v.a}</span>{v.b}</span>
                        })
                    }
                    <DeleteFilled />
                </div>
                {/*音乐列表*/}
                {
                    this.state.dataList.map((v,i)=>{
                        return <li key={v.id}>
                            <span>{v.al.name} - {v.ar[0].name}</span>
                            <DeleteFilled onClick={()=>this.delSong(i)} />
                            <HeartOutlined />
                        </li>
                    })
                }
                {
                    this.state.dataListArr.map((v,i)=>{
                        return <li key={v.id}>
                            <span>{v.al.name} - {v.ar[0].name}</span>
                            <DeleteFilled onClick={()=>this.delSong(i)} />
                            <HeartOutlined />
                        </li>
                    })
                }
            </ul>
            {/* 歌词 */}
            <CSSTransition in={this.state.lyricBool} timeout={400} classNames={"lyricShows"}>
            <div className={"lyric"} style={{display:this.state.lyricShow}}>
                <img className={"lyric-background"} src={this.state.id.songImg} alt=""/>
                <header className={"lyric-header"}>
                    <DownOutlined onClick={()=>this.gotoUp()} />
                    <div>
                        <p>{this.state.id.singerName}</p>
                        <p>{this.state.id.songerName}</p>
                    </div>
                </header>
                <div className={"lyric-img"} style={{display:this.state.lyricImgShowHidden}} onClick={()=>this.lyricImgHidden()}>
                    <img src={img1} alt="" style={{animation:this.state.animations}}/>
                    <img src={img2} style={{transform:this.state.transfroms}}/>
                    <img src={this.state.id.songImg} style={{animation:this.state.animations}}/>
                    <p>{this.state.lyricOne}</p>
                </div>
                {/* 显示全部歌词 */}
                <div className={"lyric-lyric"} style={{display:this.state.lyricShowHidden}} onClick={()=>this.lyricHidden()}>
                    <ul onTouchStart={(e)=>this.touchStartLyric(e)} onTouchMove={(e)=>this.touchMoveLyric(e)} style={{top:this.state.lyricIndex>7?-(this.state.lyricIndex-7)*1.5+"rem":"0rem"}}>
                        {
                            this.state.lyricTimeArr.map((v,i)=>{
                                return <li key={i} className={this.state.lyricIndex==i?"lyricOnce":""}>{v.lyric}</li>
                            })
                        }
                    </ul>
                </div>
                <div className={"lyric-speed"}>
                    <span>倍速听歌</span>
                    {
                        this.state.broadcast.map((v,i)=>{
                            return <span className={this.state.broadCastOne==v?"borad-cast":""} onClick={()=>this.boradCast(v)} key={v}>x{v}</span>
                        })
                    }
                </div>
                <div className={"lyric-time"}>
                    <span>{this.state.lyricStartTimer}</span>
                    <span onClick={(e)=>this.handleClick(e)}>
                        <i style={{width:this.state.totalDistanced}}></i>
                        <i onTouchStart={(e)=>this.handleTouchStart(e)} onTouchMove={(e)=>this.handleTouchMove(e)} style={{left:this.state.totalDistanced}}></i>
                    </span>
                    <span>{this.state.lyricOverTimer}</span>
                </div>
                <div className={"lyric-handle"}>
                    {/*音乐播放顺序*/}
                    <div>
                        {
                            this.state.plays.map((v,i)=>{
                                return <span style={{display:this.state.playsNum==i?"inline":"none"}} onClick={()=>this.playNum(i)} key={i}><span>{v.a}</span></span>
                            })
                        }
                    </div>
                    <StepBackwardOutlined onClick={()=>this.prevSong()} />
                    <span>
                        <PlayCircleOutlined onClick={(event)=>this.playOut(event)} style={{display:this.state.hiddens}}/>
                    <PauseCircleOutlined onClick={(event)=>this.pauseOut(event)} style={{display:this.state.shows}}/>
                    </span>
                    <StepForwardOutlined onClick={()=>this.nextSong()} />
                    <MenuOutlined onClick={(event)=>this.menuOutLine(event)} />
                </div>
                <p></p>
            </div>
            </CSSTransition>
            <audio src={this.state.songData.url} onEnded={this.state.songNum==0?()=>this.nextSong():()=>this.randomNum()} autoPlay={true} loop={this.state.loopBool}>您的浏览器不支持 audio 标签。</audio>
        </div>
    }
}

export default withRouter(Home);