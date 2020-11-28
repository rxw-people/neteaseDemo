import React, {Component} from 'react';
import { Link,Route } from "react-router-dom"
import "./Singers.css";
class Singers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            hotSort:[{name: '华语男', id: 1001},{name: '华语女', id: 1002},{name: '华语组合', id: 1003},{name: '欧美男', id: 2001},{name: '欧美女', id: 2002},{name: '欧美组合', id: 2003},{name: '日本男', id: 6001},{name: '日本女', id: 6002},{name: '日本组合', id: 6003},{name: '韩国男', id: 7001},{name: '韩国女', id: 7002},{name: '韩国组合', id: 7003},{name: '其他男歌手', id: 4001},{name: '其他男歌手', id: 4002},{name: '其他组合', id: 4003}],
            // hotSort:["华语男","华语女","华语组合","欧美男","欧美女","欧美组合","日本男","日本女","日本组合","韩国男","韩国女","韩国组合","其他男歌手","其他女歌手","其他组合"],
            letterArr:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
            letters:"",
            sorts:""
        }
    }
    sort(v){
        this.setState({
            sorts:v.id
        },()=>{
            fetch(`http://127.0.0.1:9999/artist/list?cat=${this.state.sorts}&initial=${this.state.letters}&offset=0`).then(res=>res.json()).then(data=>{
                this.setState({
                    data:data.artists
                })
            })
        })
    }
    letter(v){
        this.setState({
            letters:v
        },()=>{
            fetch(`http://127.0.0.1:9999/artist/list?cat=${this.state.sorts}&initial=${this.state.letters}&offset=0`).then(res=>res.json()).then(data=>{
                this.setState({
                    data:data.artists
                })
            })
        })
    }

    render() {
        return <div className={"singers"}>
            <div className={"singers-sort"}>
                <span>分类(默认热门):</span>
                {
                    this.state.hotSort.map((v,i)=>{
                        return <span key={i} className={this.state.sorts==v.id?"bor":""} onClick={()=>this.sort(v)}>{v.name}</span>
                    })
                }
            </div>
            <div className={"singers-letter"}>
                <span>首字母:</span>
                {
                    this.state.letterArr.map((v,i)=>{
                        return <span key={i} className={this.state.letters==v?"der":""} onClick={()=>this.letter(v)}>{v}</span>
                    })
                }
            </div>
            <div className={"singers-list"}>
                {
                    this.state.data.map((v,i)=>{
                        return <div key={v.id}>
                            <Link to={`/singers/singersDetails/${v.id}`}>
                                <img src={v.img1v1Url} alt=""/>
                                <span>{v.name}</span>
                            </Link>
                        </div>
                    })
                }

            </div>
        </div>
    }
    componentDidMount(){
        fetch("http://127.0.0.1:9999/top/artists?offset=0",{method:"get"}).then(res=>res.json()).then(data=>{
            console.log(data);
            this.setState({
                data:data.artists
            })
        })
        window.addEventListener("scroll",this.handleSong);
    }
    handleSong = (event)=> {
        const scrollTop = (event.srcElement ? event.srcElement.documentElement.scrollTop : false)
            || window.pageYOffset
            || (event.srcElement ? event.srcElement.body.scrollTop : 0);
        // console.log(event.srcElement.documentElement.clientHeight,event.srcElement.documentElement.scrollHeight)
        // console.log(scrollTop);
        if (event.srcElement.documentElement.scrollHeight == event.srcElement.documentElement.clientHeight + scrollTop) {
            // let arr = this.state.data;
            fetch("http://127.0.0.1:9999/top/artists?offset="+this.state.data.length,{method:"get"}).then(res=>res.json()).then(data=>{
                console.log(data);
                this.setState({
                    data:[...this.state.data,...data.artists]
                },()=>{
                    console.log(this.state.data)
                })
            })
        }
    }
    //在componentWillUnmount，进行scroll事件的注销
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleSong);
    }
}

export default Singers;