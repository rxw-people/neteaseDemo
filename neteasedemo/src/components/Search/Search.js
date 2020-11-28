import React, {Component} from 'react';
import "./Search.css";
import {ArrowLeftOutlined,CloseOutlined} from '@ant-design/icons';
import Store from ".././Redux/Stores";
import { addSong } from ".././Redux/Actions"
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            songArr:[],
            singersArr:[],
            songSheet:[],
            closeStyle:"none",
            listStyle:"none",
            inpValue:""
        }
    }
    searchs(event){
        console.log(event.target.value.length)
        if (!event.target.value.length) {
            this.setState({
                closeStyle:"none"
            })
        } else {
            this.setState({
                closeStyle:"inline"
            })
            fetch("http://127.0.0.1:9999/search/suggest?keywords=" + event.target.value,{method:"get"}).then(res=>res.json()).then(data=>{
                console.log(data);
                this.setState({
                    singersArr:data.result.artists || [],
                    songSheet:data.result.playlists || []
                })
            })
            fetch("http://127.0.0.1:9999/search?keywords=" + event.target.value,{method:"get"}).then(res=>res.json()).then(data=>{
                console.log(data);
                this.setState({
                    songArr:data.result.songs || [],
                })
            })
        }
        this.setState({
            inpValue:event.target.value
        })
    }
    // 叉号
    closeClick(){
        this.setState({
            closeStyle:"none",
            inpValue:""
        })
    }
    liClick(v){
        // console.log(v)
        this.setState({
            inpValue:v.first
        },()=>{
            if (this.state.inpValue != "") {
                this.setState({
                    closeStyle:"inline"
                })
            } else {
                this.setState({
                    closeStyle:"none"
                })
            }
        })
        fetch("http://127.0.0.1:9999/search/suggest?keywords=" + v.first,{method:"get"}).then(res=>res.json()).then(data=>{
            console.log(data);
            this.setState({
                songArr:data.result.songs || [],
            })
        })
    }
    goUp(){
        this.props.history.go(-1);
    }
    toSinger(v){
        this.props.history.push("/singers/singersDetails/" + v);
    }
    toSongSheet(v) {
        this.props.history.push("/rank/RankDetails/" + v)
    }
    playSong(id,singerName,songerName,songerImg){
        Store.dispatch(addSong(id,Store.getState().songSheetId,singerName,songerName,songerImg));
    }

    render() {
        return <div className={"search"}>
            <header className={"search-header"}>
                <ArrowLeftOutlined onClick={()=>this.goUp()} />
                <input type="text" value={this.state.inpValue} onChange={(event)=>this.searchs(event)} placeholder={"搜索歌曲、歌手、专辑"}/>
                <CloseOutlined style={{display:this.state.closeStyle}} onClick={()=>this.closeClick()} />
            </header>
            <div className={"search_main"} style={{display:this.state.inpValue==""?"block":"none"}}>
                <p>热门搜索</p>
                {
                    this.state.data.map((v,i)=>{
                        return <li onClick={()=>this.liClick(v)} key={i}>{v.first}</li>
                    })
                }
            </div>
            <div className={"search-singers"} style={{display:this.state.inpValue==""?"none":"block"}}>
                <ul className={"search-singers-singers"}>
                    <p style={{display:this.state.singersArr.length==0?"none":"block"}}>相关歌手</p>
                    {
                        this.state.singersArr.map((v,i)=>{
                            return <li key={v.id} onClick={()=>this.toSinger(v.id)}>
                                <img src={v.img1v1Url} alt=""/>
                                <span>歌手：{v.name}</span>
                            </li>
                        })
                    }
                </ul>
                <ul className={"search-singers-singers"}>
                    <p style={{display:this.state.singersArr.length==0?"none":"block"}}>相关歌单</p>
                    {
                        this.state.songSheet.map((v,i)=>{
                            return <li key={v.id} onClick={()=>this.toSongSheet(v.id)}>
                                <img src={v.coverImgUrl} alt=""/>
                                <span>歌单：{v.name}</span>
                            </li>
                        })
                    }
                </ul>
                <ul className={"search-singers-song"}>
                    {
                        this.state.songArr.map((v,i)=>{
                            return <li key={v.id} onClick={()=>this.playSong(v.id,v.album.artist.name,v.name,v.album.artist.img1v1Url)}>
                                <p>{v.name}</p>
                                <span>{v.artists[0].name} - </span>
                                <span>{v.name}</span>
                            </li>
                        })
                    }
                </ul>
            </div>
        </div>
    }
    componentDidMount(){
        fetch("http://127.0.0.1:9999/search/hot").then(res=>res.json()).then(data=>{
            // console.log(data.result.hots);
            this.setState({
                data:data.result.hots
            })
        })
    }
}

export default Search;